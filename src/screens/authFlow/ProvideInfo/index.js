import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppButton, AppTextInput } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { routes } from "../../../services/constant";
import styles from "./styles";

const ProvideInfo = ({ navigation }) => {
    const [inductionNumber, setInductionNumber] = useState("");

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#fff" }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid
            extraScrollHeight={20}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Please Provide Info</Text>
                <Text style={styles.subtitle}>
                    Lorem ipsum dolor scelerisque sem amet, consectetur adipiscing elit.
                </Text>
                <AppTextInput
                    placeholder="Enter your induction number"
                    value={inductionNumber}
                    onChangeText={setInductionNumber}
                    keyboardType="default"
                />


                <View style={styles.footer}>
                    <AppButton
                        title="NEXT"
                        onPress={() => navigation.navigate(routes.auth, { screen: routes.verificationProcess })}
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default ProvideInfo;