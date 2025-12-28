import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, FlatList } from "react-native";
import { appIcons, appImages } from "../../../services/utilities/assets";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { SecondHeader } from "../../../components";
import { fonts } from "../../../services/utilities/fonts";
import { routes } from "../../../services/constant";
import useCallApi from "../../../hooks/useCallApi";
import { Loader } from "../../../components/Loader";

const SiteMap = ({ navigation, route }) => {
    const { callApi } = useCallApi();
    const [loading, setLoading] = useState(false);
    const [siteMapUrl, setSiteMapUrl] = useState(null);
    const siteId = route?.params?.siteId;

    useEffect(() => {
        if (siteId) {
            getSiteDetails();
        }
    }, [siteId]);

    const getSiteDetails = async () => {
        try {
            setLoading(true);
            const response = await callApi(`site/${siteId}`, "GET");
            if (response?.success && response?.data) {
                // Assuming the key is siteMap or image. 
                // We'll prioritize siteMap, then image, then null.
                const url = response.data.siteMap || response.data.image;
                if (url) {
                    setSiteMapUrl(url);
                }
            }
        } catch (error) {
            console.log("Error fetching site details", error);
        } finally {
            setLoading(false);
        }
    };

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
                source={siteMapUrl ? { uri: siteMapUrl } : appImages.siteImage}
                style={styles.image}
                resizeMode="contain"
            />
            <Loader isVisible={loading} />
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
