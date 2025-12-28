import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";

const SiteMap = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <SecondHeader
                    onPress={() => navigation.goBack()}
                    title="Site Map"
                />
            </View>

            {/* Image shown on full width */}
            <Image
                source={appImages.siteImage}
                style={styles.image}
                resizeMode="contain"
            />
        </SafeAreaView>
    )
}

export default SiteMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white || "#F4F4F4",
        paddingTop: Platform.OS === 'android' ? heightPixel(10) : 0,
    },
    content: {
        paddingHorizontal: widthPixel(10),
    },
    image: {
        flex: 1,
        width: "100%",
        height: heightPixel(500),
        marginTop: heightPixel(20),
    },
});
