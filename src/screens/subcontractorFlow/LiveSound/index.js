import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet,  TouchableOpacity, SafeAreaView, FlatList, ScrollView, Animated, Platform, PermissionsAndroid, Alert, Linking } from "react-native";
 import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
 import Sound from 'react-native-nitro-sound';


const LiveSound = ({ navigation }) => {
    const [soundLevel, setSoundLevel] = useState(0);
    const [db, setDb] = useState(0);
    const [soundStatus, setSoundStatus] = useState('Normal');
    const [frequency, setFrequency] = useState(0);
    const [radialBars, setRadialBars] = useState([]);
    const [horizontalBarsTop, setHorizontalBarsTop] = useState([]);
    const [horizontalBarsBottom, setHorizontalBarsBottom] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);

    // Function to determine sound level status based on DB value
    const getSoundStatus = (dbValue) => {
        // DB typically ranges from -160 to 0
        // -60 to -40: Slow/Quiet
        // -40 to -20: Normal
        // -20 to 0: Loud
        if (dbValue >= -20) {
            return 'Loud';
        } else if (dbValue >= -40) {
            return 'Normal';
        } else {
            return 'Slow';
        }
    };

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Loud':
                return { bg: '#FFE5E5', text: '#D32F2F' };
            case 'Normal':
                return { bg: '#D6F7DD', text: '#029820' };
            case 'Slow':
                return { bg: '#E3F2FD', text: '#1976D2' };
            default:
                return { bg: '#D6F7DD', text: '#029820' };
        }
    };

    // Function to calculate frequency (0-1000) based on DB
    const calculateFrequency = (dbValue) => {
        // Map DB range (-160 to 0) to frequency range (0 to 1000)
        // Normalize: (dbValue + 160) / 160 * 1000
        const normalized = Math.max(0, Math.min(1000, ((dbValue + 160) / 160) * 1000));
        return Math.round(normalized);
    };

    // Function to generate bar heights based on sound status
    const generateBarHeights = (status, count, isRadial = false) => {
        let minHeight, maxHeight;
        
        switch (status) {
            case 'Loud':
                minHeight = isRadial ? 15 : 40;
                maxHeight = isRadial ? 35 : 80;
                break;
            case 'Normal':
                minHeight = isRadial ? 8 : 20;
                maxHeight = isRadial ? 25 : 50;
                break;
            case 'Slow':
                minHeight = isRadial ? 3 : 10;
                maxHeight = isRadial ? 15 : 30;
                break;
            default:
                minHeight = isRadial ? 8 : 20;
                maxHeight = isRadial ? 25 : 50;
        }
        
        return Array.from({ length: count }, () => 
            Math.random() * (maxHeight - minHeight) + minHeight
        );
    };

    // Update bar heights based on sound status
    useEffect(() => {
        // Generate radial bars (48 bars for full circle)
        setRadialBars(generateBarHeights(soundStatus, 48, true));
        
        // Generate horizontal bars (20 bars for top row, 20 for bottom row)
        setHorizontalBarsTop(generateBarHeights(soundStatus, 20, false));
        setHorizontalBarsBottom(generateBarHeights(soundStatus, 20, false));
        
        // Update bars periodically for animation effect
        const interval = setInterval(() => {
            setRadialBars(generateBarHeights(soundStatus, 48, true));
            setHorizontalBarsTop(generateBarHeights(soundStatus, 20, false));
            setHorizontalBarsBottom(generateBarHeights(soundStatus, 20, false));
        }, 200); // Update every 200ms for smooth animation
        
        return () => clearInterval(interval);
    }, [soundStatus]);

    // Request audio recording permission
    const requestAudioPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const audioPermission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
                const hasPermission = await PermissionsAndroid.check(audioPermission);
                
                if (!hasPermission) {
                    const granted = await PermissionsAndroid.request(
                        audioPermission,
                        {
                            title: "Microphone Permission",
                            message: "ProjectRunner needs access to your microphone to monitor sound levels",
                            buttonNeutral: "Ask Me Later",
                            buttonNegative: "Cancel",
                            buttonPositive: "OK"
                        }
                    );
                    
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        setHasPermission(true);
                        return true;
                    } else {
                        Alert.alert(
                            "Permission Required",
                            "Microphone permission is required to monitor sound levels. Please grant permission in app settings.",
                            [
                                { text: "Cancel", style: "cancel" },
                                { 
                                    text: "Open Settings", 
                                    onPress: () => {
                                        Linking.openSettings();
                                    }
                                }
                            ]
                        );
                        setHasPermission(false);
                        return false;
                    }
                } else {
                    setHasPermission(true);
                    return true;
                }
            } catch (error) {
                console.error('Permission error:', error);
                setHasPermission(false);
                return false;
            }
        } else {
            // iOS permissions are handled automatically by the native module
            setHasPermission(true);
            return true;
        }
    };

    // Function to start sound monitoring
    const startSoundMonitoring = async () => {
        try {
            // Start recorder with metering enabled for sound level monitoring
            await Sound.startRecorder(undefined, undefined, true); // meteringEnabled = true
            
            // Listen for recording updates which include metering data
            Sound.addRecordBackListener((e) => {
                // currentMetering is in dB, typically ranges from -160 to 0
                if (e.currentMetering !== undefined) {
                    const meteringDb = e.currentMetering;
                    console.log("meteringDb===>>>", e);
                    setDb(meteringDb);
                    
                    // Update sound status
                    const status = getSoundStatus(meteringDb);
                    setSoundStatus(status);
                    
                    // Calculate and update frequency
                    const freq = calculateFrequency(meteringDb);
                    setFrequency(freq);
                    
                    // Convert to a 0-100 scale for display (optional)
                    const normalizedLevel = Math.max(0, Math.min(100, ((meteringDb + 160) / 160) * 100));
                    setSoundLevel(normalizedLevel);
                }
            });
        } catch (error) {
            console.error('Failed to start sound monitoring:', error);
            Alert.alert(
                "Error",
                "Failed to start sound monitoring. Please try again or check your device settings.",
                [{ text: "OK" }]
            );
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initializeMonitoring = async () => {
            // Request permission first
            const permissionGranted = await requestAudioPermission();
            
            if (!permissionGranted) {
                console.warn('Audio permission not granted, cannot start monitoring');
                return;
            }

            await startSoundMonitoring();
        };

        initializeMonitoring();
        
        return () => {
            isMounted = false;
            Sound.removeRecordBackListener();
            Sound.stopRecorder().catch((error) => {
                console.error('Error stopping recorder:', error);
            });
        };
    }, []);
      



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="Live Sound Level Monitoring"
                />

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Description Text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.descriptionText}>
                            Real-time decibel levels are measured to ensure noise stays within safety limits. Stay informed and protect your hearing on-site.
                        </Text>
                    </View>

                    {/* Permission Warning */}
                    {!hasPermission && Platform.OS === 'android' && (
                        <View style={styles.permissionWarning}>
                            <Text style={styles.permissionWarningText}>
                                Microphone permission is required to monitor sound levels.
                            </Text>
                            <TouchableOpacity
                                style={styles.permissionButton}
                                onPress={async () => {
                                    const granted = await requestAudioPermission();
                                    if (granted) {
                                        // Restart monitoring
                                        await startSoundMonitoring();
                                    }
                                }}
                            >
                                <Text style={styles.permissionButtonText}>Grant Permission</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: heightPixel(20),
                    }}>
                        <Text style={[styles.descriptionText, { fontFamily: fonts.NunitoSemiBold, marginBottom: heightPixel(10) }]}>
                            Sound Level
                        </Text>
                        <View style={{
                            backgroundColor: getStatusColor(soundStatus).bg,
                            paddingHorizontal: widthPixel(10),
                            paddingVertical: heightPixel(5),
                            borderRadius: widthPixel(5),
                        }}>
                            <Text style={{
                                color: getStatusColor(soundStatus).text,
                                fontFamily: fonts.NunitoSemiBold,
                                fontSize: fontPixel(14),
                            }}>
                                {soundStatus}
                            </Text>
                        </View>
                    </View>

                    {/* DB and Frequency Display */}
                    {/* <View style={styles.metricsContainer}>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Decibel (dB)</Text>
                            <Text style={styles.metricValue}>{db.toFixed(1)} dB</Text>
                        </View>
                        <View style={styles.metricItem}>
                            <Text style={styles.metricLabel}>Frequency</Text>
                            <Text style={styles.metricValue}>{frequency} / 1000</Text>
                        </View>
                    </View> */}

                    {/* Dynamic Sound Monitoring Visualization */}
                    <View style={styles.visualizationContainer}>
                        {/* Circular Gauge with Radial Bars */}
                        <View style={styles.circularGaugeContainer}>
                            {/* Radial Bars */}
                            <View style={styles.radialBarsContainer}>
                                {radialBars.map((height, index) => {
                                    const angle = (index * 360) / radialBars.length;
                                    const barColor = soundStatus === 'Loud' ? '#FF6B6B' : 
                                                    soundStatus === 'Normal' ? '#4ECDC4' : '#95E1D3';
                                    
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.radialBarWrapper,
                                                {
                                                    transform: [{ rotate: `${angle}deg` }],
                                                }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.radialBar,
                                                    {
                                                        height: heightPixel(height),
                                                        backgroundColor: barColor,
                                                    }
                                                ]}
                                            />
                                        </View>
                                    );
                                })}
                            </View>
                            
                            {/* Inner Circular Gauge */}
                            <View style={styles.innerGaugeContainer}>
                                <View style={[
                                    styles.innerGauge,
                                    {
                                        borderColor: soundStatus === 'Loud' ? '#D32F2F' : 
                                                    soundStatus === 'Normal' ? '#029820' : '#1976D2',
                                        backgroundColor: soundStatus === 'Loud' ? 'rgba(255, 107, 107, 0.1)' : 
                                                        soundStatus === 'Normal' ? 'rgba(78, 205, 196, 0.1)' : 
                                                        'rgba(149, 225, 211, 0.1)',
                                    }
                                ]}>
                                    {/* Progress Fill from Bottom */}
                                    <View style={[
                                        styles.gaugeFill,
                                        {
                                            height: `${(frequency / 1000) * 100}%`,
                                            backgroundColor: soundStatus === 'Loud' ? 'rgba(255, 107, 107, 0.3)' : 
                                                           soundStatus === 'Normal' ? 'rgba(78, 205, 196, 0.3)' : 
                                                           'rgba(149, 225, 211, 0.3)',
                                        }
                                    ]} />
                                </View>
                                
                                {/* Center Text */}
                                <View style={styles.centerTextContainer}>
                                    <Text style={[
                                        styles.centerValue,
                                        {
                                            color: soundStatus === 'Loud' ? '#D32F2F' : 
                                                  soundStatus === 'Normal' ? '#029820' : '#1976D2',
                                        }
                                    ]}>
                                        {frequency}
                                    </Text>
                                    <Text style={[
                                        styles.centerLabel,
                                        {
                                            color: soundStatus === 'Loud' ? '#D32F2F' : 
                                                  soundStatus === 'Normal' ? '#029820' : '#1976D2',
                                        }
                                    ]}>
                                        /1000
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Horizontal Bar Charts */}
                      
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white || "#F4F4F4",
    },
    content: {
        flex: 1,
        paddingHorizontal: widthPixel(10),
        backgroundColor: colors.white,
        marginTop: heightPixel(16),
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: widthPixel(10),
    },
    textContainer: {
        marginTop: heightPixel(20),
        marginBottom: heightPixel(30),
    },
    descriptionText: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoRegular,
        color: colors.black,
        lineHeight: heightPixel(24),
        // textAlign: "center",
    },
    visualizationContainer: {
        alignItems: "center",
        marginBottom: heightPixel(30),
        paddingVertical: heightPixel(20),
    },
    circularGaugeContainer: {
        width: widthPixel(280),
        height: heightPixel(280),
        alignItems: "center",
        justifyContent: "center",
        marginBottom: heightPixel(30),
        position: "relative",
    },
    radialBarsContainer: {
        position: "absolute",
        width: widthPixel(280),
        height: heightPixel(280),
        alignItems: "center",
        justifyContent: "center",
    },
    radialBarWrapper: {
        position: "absolute",
        width: widthPixel(3),
        height: heightPixel(140),
        alignItems: "center",
        justifyContent: "flex-end",
    },
    radialBar: {
        width: widthPixel(3),
        borderRadius: widthPixel(1.5),
        minHeight: heightPixel(3),
    },
    innerGaugeContainer: {
        width: widthPixel(180),
        height: heightPixel(180),
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    innerGauge: {
        width: widthPixel(180),
        height: heightPixel(180),
        borderRadius: widthPixel(90),
        borderWidth: widthPixel(8),
        overflow: "hidden",
        position: "relative",
    },
    gaugeFill: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        borderBottomLeftRadius: widthPixel(90),
        borderBottomRightRadius: widthPixel(90),
    },
    centerTextContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    centerValue: {
        fontSize: fontPixel(36),
        fontFamily: fonts.NunitoSemiBold,
        fontWeight: "bold",
    },
    centerLabel: {
        fontSize: fontPixel(16),
        fontFamily: fonts.NunitoRegular,
        marginTop: heightPixel(-5),
    },
    barChartContainer: {
        width: "100%",
        paddingHorizontal: widthPixel(20),
        marginTop: heightPixel(20),
    },
    barRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: heightPixel(15),
        paddingRight: widthPixel(30),
    },
    horizontalBar: {
        flex: 1,
        marginHorizontal: widthPixel(2),
        borderRadius: widthPixel(2),
        minHeight: heightPixel(5),
    },
    barLabel: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoSemiBold,
        color: '#4ECDC4',
        marginLeft: widthPixel(10),
    },
    metricsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: heightPixel(20),
        paddingVertical: heightPixel(15),
        backgroundColor: colors.white || "#FFFFFF",
        borderRadius: widthPixel(10),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    metricItem: {
        alignItems: "center",
        flex: 1,
    },
    metricLabel: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.black || "#666",
        marginBottom: heightPixel(5),
    },
    metricValue: {
        fontSize: fontPixel(20),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black || "#000",
    },
    permissionWarning: {
        backgroundColor: '#FFF3CD',
        padding: widthPixel(15),
        borderRadius: widthPixel(8),
        marginBottom: heightPixel(20),
        borderWidth: 1,
        borderColor: '#FFC107',
    },
    permissionWarningText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: '#856404',
        marginBottom: heightPixel(10),
    },
    permissionButton: {
        backgroundColor: '#FFC107',
        paddingVertical: heightPixel(10),
        paddingHorizontal: widthPixel(20),
        borderRadius: widthPixel(5),
        alignSelf: 'flex-start',
    },
    permissionButtonText: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoSemiBold,
        color: '#000',
    },
});

export default LiveSound;
