import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { SecondHeader, AppButton, AppTextInput, AppModal } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";
import useTasks from "../../../hooks/useTasks";
import { toastError, toastSuccess } from "../../../services/utilities/toast/toast";
import { useSelector } from "react-redux";
import { Loader } from "../../../components/Loader";

const CancelJobOther = ({ navigation }) => {
    const [reason, setReason] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const { updateTaskStatus, loading } = useTasks();
    const userRole = useSelector((state) => state.user.userRole);
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={{
                flex: 1,
                paddingHorizontal: widthPixel(20),

            }}>
                <SecondHeader onPress={() => navigation.goBack()} title="Cancel Job" />

                {/* Description */}
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor
                    lectus augue
                </Text>

                {/* Reason Input */}
                <AppTextInput
                    placeholder="Write your reason"
                    value={reason}
                    onChangeText={setReason}
                    multiline
                    style={styles.textArea}
                />

                {/* Footer */}
                <View style={styles.footer}>
                    <AppButton
                        title="CANCEL JOB"
                        style={{
                            backgroundColor: reason ? colors.themeColor : '#8D8D8D',
                        }}
                        textStyle={{
                            color: colors.white,
                        }}
                        disabled={!reason || loading}
                        onPress={async () => {
                            // console.log("Job cancelled with reason:", reason);
                            // navigation.goBack();
                            try {
                                const response = await updateTaskStatus(taskId, "cancelled", reason);
                                if (response?.success) {
                                    setModalVisible(true);
                                    setReason("");
                                    setTimeout(() => {
                                        setModalVisible(false);
                                        if (userRole === 'forklift') {
                                            navigation.navigate(routes.forkliftFlow);
                                        } else {
                                            navigation.navigate(routes.subcontractorFlow);
                                        }
                                    }, 2000);
                                }
                            } catch (error) {
                                console.log("Cancel job error", error);
                                toastError({ message: "Failed to cancel task" })
                            } finally {
                                navigation.goBack();
                            }

                        }}
                    />
                </View>
            </View>
            <AppModal
                title="Job Cancelled"
                subtitle="Sed dignissim nisl a vehicula fringilla. Nulla faucibus dui tellus, ut dignissim"
                visible={modalVisible}
            // onClose={() => setModalVisible(false)}
            />
            <Loader isVisible={loading} />
        </SafeAreaView>
    );
};

export default CancelJobOther;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal: widthPixel(20),
        paddingTop: heightPixel(10),
    },
    description: {
        fontSize: fontPixel(14),
        fontFamily: fonts.NunitoRegular,
        color: colors.grey300,
        marginTop: heightPixel(14),
        marginBottom: heightPixel(10),
    },
    textArea: {
        minHeight: heightPixel(120),
        textAlignVertical: "top",
        marginTop: heightPixel(10),
    },
    footer: {
        marginTop: "auto",
        marginBottom: heightPixel(20),
    },
});
