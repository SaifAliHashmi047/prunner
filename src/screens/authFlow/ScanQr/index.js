import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    PermissionsAndroid,
    Platform,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
} from "react-native";
// Optional: react-native-camera-kit - install with: npm install react-native-camera-kit
let Camera = null;
let CameraType = null;
try {
    const cameraKit = require("react-native-camera-kit");
    Camera = cameraKit.Camera;
    CameraType = cameraKit.CameraType;
} catch (e) {
    console.log("react-native-camera-kit not available. Please install: npm install react-native-camera-kit");
}
import { AppHeader, AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { routes } from "../../../services/constant";
import { Loader } from "../../../components/Loader";
import { toastError } from "../../../services/utilities/toast/toast";

const { width, height } = Dimensions.get("window");
const SCAN_AREA_SIZE = widthPixel(width * 0.7);

const ScanQr = ({ navigation, route }) => {
    const goBack = route?.params?.goBack || false;
    const [hasPermission, setHasPermission] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualCode, setManualCode] = useState("");

    useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "App needs permission to access your camera to scan QR codes",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );
                setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
            } catch (err) {
                console.warn("Camera permission error", err);
                setHasPermission(false);
            }
        } else {
            // iOS - Camera permission is handled automatically by react-native-camera-kit
            setHasPermission(true);
        }
    };

    const handleScan = () => {
        if (!hasPermission) {
            Alert.alert(
                "Permission Required",
                "Camera permission is required to scan QR codes. Please grant permission in app settings.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => requestCameraPermission() },
                ]
            );
            return;
        }
        setIsScanning(true);
        setScannedCode(null);
    };

    const handleQRCodeRead = async (event) => {
        try {
            const code = event.nativeEvent.codeStringValue;
            if (!code) {
                toastError({ text: "Invalid QR code" });
                return;
            }

            console.log("Scanned QR code:", code);
            setScannedCode(code);
            setIsScanning(false);
            
            // Navigate to ProvideInfo with the scanned code
            navigation.navigate(routes.auth, {
                screen: routes.provideInfo,
                params: { inductionNumber: code,
                    goBack: goBack,
                 },
            });
        } catch (error) {
            console.error("Error reading QR code:", error);
            toastError({ text: "Failed to scan QR code" });
        }
    };

    const handleManualSubmit = () => {
        if (!manualCode.trim()) {
            toastError({ text: "Please enter a code" });
            return;
        }
        setShowManualInput(false);
        navigation.navigate(routes.auth, {
            screen: routes.provideInfo,
            params: { inductionNumber: manualCode.trim(),
                goBack: goBack,
            },
        });
    };

    if (isScanning) {
        if (!Camera || !CameraType) {
            return (
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.scanContainer}>
                        <AppHeader
                            title="Scan QR Code"
                            onBack={() => setIsScanning(false)}
                        />
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>
                                Camera kit not installed.{"\n"}
                                Please install: npm install react-native-camera-kit
                            </Text>
                            <AppButton
                                title="Enter Code Manually"
                                onPress={() => {
                                    setIsScanning(false);
                                    setShowManualInput(true);
                                }}
                                style={{ backgroundColor: colors.themeColor, marginTop: heightPixel(20) }}
                                textStyle={{ color: colors.white }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            );
        }

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.scanContainer}>
                    <AppHeader
                        title="Scan QR Code"
                        onBack={() => {
                            setIsScanning(false);
                            setScannedCode(null);
                        }}
                    />

                    <View style={styles.cameraContainer}>
                        <Camera
                            cameraType={CameraType.Back}
                            style={styles.camera}
                            scanBarcode={true}
                            onReadCode={handleQRCodeRead}
                            laserColor={colors.themeColor}
                            frameColor={colors.white}
                            barcodeFrameSize={{
                                width: SCAN_AREA_SIZE,
                                height: SCAN_AREA_SIZE,
                            }}
                        />

                        {/* Scanning overlay */}
                        <View style={styles.overlay}>
                            <View style={styles.scanFrame}>
                                {/* Corner brackets */}
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />
                            </View>
                        </View>

                        {/* Instructions */}
                        <View style={styles.instructionContainer}>
                            <Text style={styles.instructionText}>
                                Position the QR code within the frame
                            </Text>
                            <Text style={styles.instructionSubtext}>
                                Make sure the code is clearly visible & well-lit
                            </Text>
                        </View>
                    </View>

                    {/* Manual entry button */}
                    <View style={styles.manualButtonContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsScanning(false);
                                setShowManualInput(true);
                            }}
                            style={styles.manualButton}
                        >
                            <Text style={styles.manualButtonText}>
                                Enter Code Manually
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <AppHeader
                    title="Scan QR Code"
                    onBack={() => navigation.goBack()}
                />

                <View style={styles.content}>
                    <Text style={styles.contentSubtitle}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at maximus nisi. Proin in orci ligula. Morbi tincidunt, leo nec aliquam gravida, felis enim auctor sapien, a dictum velit ipsum ut leo.
                    </Text>
                    <Text style={styles.contentSubtitle}>
                        Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus scelerisque consectetur ligula, quis varius felis molestie in. Pellentesque quis maximus dolor. Vestibulum a luctus nisl. Phasellus vitae consequat tellus, quis pharetra tortor.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <AppButton
                        title="SCAN"
                        onPress={handleScan}
                        style={{ borderColor: colors.themeColor, borderWidth: 1 }}
                        textStyle={{ color: colors.themeColor }}
                    />
                    <TouchableOpacity
                        onPress={() => setShowManualInput(true)}
                        style={styles.manualEntryButton}
                    >
                        <Text style={styles.manualEntryText}>
                            Enter Code Manually
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Manual Code Input Modal */}
            <Modal
                visible={showManualInput}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowManualInput(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Induction Number</Text>
                        <AppTextInput
                            placeholder="Enter induction number"
                            value={manualCode}
                            onChangeText={setManualCode}
                            style={{ marginTop: heightPixel(20) }}
                        />
                        <View style={styles.modalButtons}>
                            <AppButton
                                title="CANCEL"
                                onPress={() => {
                                    setShowManualInput(false);
                                    setManualCode("");
                                }}
                                style={{
                                    backgroundColor: colors.white,
                                    borderWidth: 1,
                                    borderColor: colors.greyBg,
                                    marginRight: widthPixel(10),
                                }}
                                textStyle={{ color: colors.black }}
                            />
                            <AppButton
                                title="SUBMIT"
                                onPress={handleManualSubmit}
                                style={{ backgroundColor: colors.themeColor }}
                                textStyle={{ color: colors.white }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default ScanQr;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.white,
    },
    container: {
        flex: 1,
        paddingHorizontal: heightPixel(20),
        paddingTop: heightPixel(20),
    },
    content: {
        flex: 1,
        paddingTop: heightPixel(10),
    },
    contentSubtitle: {
        fontSize: fontPixel(14),
        color: colors.black,
        marginBottom: heightPixel(15),
        lineHeight: 22,
    },
    footer: {
        paddingBottom: heightPixel(20),
    },
    scanContainer: {
        flex: 1,
        backgroundColor: colors.black,
    },
    cameraContainer: {
        flex: 1,
        position: "relative",
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    scanFrame: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        position: "relative",
    },
    corner: {
        position: "absolute",
        width: widthPixel(30),
        height: widthPixel(30),
        borderColor: colors.themeColor,
        borderWidth: heightPixel(4),
    },
    topLeft: {
        top: widthPixel(-2),
        left: widthPixel(-2),
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: widthPixel(8),
    },
    topRight: {
        top: widthPixel(-2),
        right: widthPixel(-2),
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: widthPixel(8),
    },
    bottomLeft: {
        bottom: widthPixel(-2),
        left: widthPixel(-2),
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: widthPixel(8),
    },
    bottomRight: {
        bottom: widthPixel(-2),
        right: widthPixel(-2),
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: widthPixel(8),
    },
    instructionContainer: {
        position: "absolute",
        bottom: heightPixel(100),
        left: 0,
        right: 0,
        alignItems: "center",
        paddingHorizontal: widthPixel(20),
    },
    instructionText: {
        fontSize: fontPixel(18),
        color: colors.white,
        fontWeight: "600",
        marginBottom: heightPixel(8),
        textAlign: "center",
    },
    instructionSubtext: {
        fontSize: fontPixel(14),
        color: colors.white,
        textAlign: "center",
        opacity: 0.8,
    },
    manualButtonContainer: {
        position: "absolute",
        bottom: heightPixel(40),
        left: 0,
        right: 0,
        alignItems: "center",
    },
    manualButton: {
        paddingVertical: heightPixel(12),
        paddingHorizontal: widthPixel(24),
    },
    manualButtonText: {
        fontSize: fontPixel(16),
        color: colors.white,
        textDecorationLine: "underline",
    },
    manualEntryButton: {
        marginTop: heightPixel(15),
        alignItems: "center",
    },
    manualEntryText: {
        fontSize: fontPixel(14),
        color: colors.themeColor,
        textDecorationLine: "underline",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: widthPixel(20),
        width: "90%",
        maxWidth: widthPixel(400),
        padding: widthPixel(20),
    },
    modalTitle: {
        fontSize: fontPixel(18),
        fontWeight: "600",
        color: colors.black,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        marginTop: heightPixel(20),
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: widthPixel(20),
    },
    errorText: {
        fontSize: fontPixel(16),
        color: colors.white,
        textAlign: "center",
        lineHeight: heightPixel(24),
    },
});