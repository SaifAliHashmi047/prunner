import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ImageBackground,
} from "react-native";
import { SecondHeader, AppButton, ForkLiftHeader } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { routes } from "../../../services/constant";

const ScanLicense = ({ navigation }) => {
    const [file, setFile] = useState({
        name: "User Name Driving License",
        size: "867 Kb",
        type: "pdf",
    });

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleScan = () => {
        // TODO: open document picker / scanner
        console.log("Scan button pressed");
    };

    useEffect(() => {
        // Navigate to TellAboutVehicle after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace(routes.auth, {
                screen: routes.tellAboutVehicle,
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ImageBackground
            source={appImages.lic}
            style={{
                flex: 1,
                paddingHorizontal: widthPixel(20),
                paddingTop: heightPixel(20),
            }}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}

                {/* Title & Subtitle */}
                <ForkLiftHeader
                    title="Scan your Driving License"
                    subtitle="Place front side of your driving license on the blue box"
                    onPress={() => navigation.goBack()}
                    titleStyle={{ color: colors.white }}
                    subtitleStyle={{ color: colors.white }}
                    iconStyle={{ tintColor: colors.white }}
                />


            </SafeAreaView>
        </ImageBackground>


    );
};

export default ScanLicense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingHorizontal: widthPixel(20),
    },
});
