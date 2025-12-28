import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { appIcons } from "../services/utilities/assets";
import { colors } from "../services/utilities/colors";
import { heightPixel, widthPixel, fontPixel } from "../services/constant";

const AppHeader = ({ title, subtitle, onBack }) => {
    return (
        <View style={styles.container}>
           {onBack &&
            <TouchableOpacity style={styles.backButton} onPress={onBack} >
                <Image 
                    source={appIcons.backArrow}
                     style={{ width: widthPixel(20), height: heightPixel(20), resizeMode: 'contain' , tintColor : 'white' }} />
            </TouchableOpacity>
              }
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </View>
    )
}

export default AppHeader




const styles = StyleSheet.create({
    container: {
        // backgroundColor: colors.white,
        // paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    backButton: {
        marginBottom: 15,
    },
    textContainer: {
        marginLeft: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.black,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: "#888",
    },
});