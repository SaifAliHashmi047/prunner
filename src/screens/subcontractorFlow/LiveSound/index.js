import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList, ScrollView } from "react-native";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";


const LiveSound = ({ navigation }) => {
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
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <Text style={[styles.descriptionText, { fontFamily: fonts.NunitoSemiBold, marginBottom: heightPixel(10) }]}>
                            Sound Level
                        </Text>
                        <View style={{
                            backgroundColor: '#D6F7DD',
                            paddingHorizontal: widthPixel(10),
                            paddingVertical: heightPixel(5),
                            borderRadius: widthPixel(5),
                        }}>
                            <Text style={{
                                color: '#029820',
                                fontFamily: fonts.NunitoSemiBold,
                                fontSize: fontPixel(14),
                            }}>
                                Normal
                            </Text>
                        </View>
                    </View>

                    {/* Live Sound Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={appIcons.liveSound}
                            style={styles.liveSoundImage}
                        // resizeMode="contain"
                        />
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
    imageContainer: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        marginBottom: heightPixel(30),
        // backgroundColor: colors.lightGray,
    },
    liveSoundImage: {
        width: widthPixel(480),
        height: heightPixel(300),
        resizeMode: "contain",
        alignSelf: "center",
    },
});

export default LiveSound;