import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
} from "react-native";
import { SecondHeader, AppButton, AppModal } from "../../../components";
import { colors } from "../../../services/utilities/colors";
import { heightPixel, fontPixel, widthPixel } from "../../../services/constant";
import { fonts } from "../../../services/utilities/fonts";

const users = [
    { id: "1", name: "Alex Rivers", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: "2", name: "Jordan Blake", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: "3", name: "Morgan Lee", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: "4", name: "Taylor Quinn", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: "5", name: "Alex Rivers", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
];

const TaskUser = ({ navigation }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: widthPixel(20), flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <SecondHeader onPress={() => navigation.goBack()} title="Create Task" />

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porttitor lectus augue
                </Text>

                {/* Users List */}
                {users.map((user) => (
                    <TouchableOpacity
                        key={user.id}
                        style={[
                            styles.userCard,
                            selectedUser === user.id && styles.activeCard,
                        ]}
                        onPress={() => setSelectedUser(user.id)}
                    >
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        <Text style={styles.userName}>{user.name}</Text>
                    </TouchableOpacity>
                ))}

                {/* Bottom Button */}
                <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: heightPixel(20) }}>
                    <AppButton
                        title="CREATE TASK"
                        style={{ backgroundColor: colors.themeColor }}
                        textStyle={{ color: colors.white }}
                        onPress={() => {
                            setModalVisible(true);
                            setTimeout(() => {
                                setModalVisible(false);
                                navigation.popToTop();
                            }, 2000);
                        }}
                    />
                </View>
            </ScrollView>
            <AppModal
                title="Task Created"
                subtitle="Sed dignissim nisl a vehicula fringilla. Nulla faucibus dui tellus, ut dignissim"
                visible={modalVisible}
            // onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};

export default TaskUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subtitle: {
        fontSize: fontPixel(14),
        color: "#777",
        fontFamily: fonts.NunitoRegular,
        marginVertical: heightPixel(10),
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        borderRadius: widthPixel(10),
        paddingVertical: heightPixel(14),
        paddingHorizontal: widthPixel(14),
        marginBottom: heightPixel(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    activeCard: {
        borderColor: colors.themeColor,
        backgroundColor: "#F7F1FF",
    },
    avatar: {
        width: widthPixel(40),
        height: widthPixel(40),
        borderRadius: widthPixel(20),
        marginRight: widthPixel(12),
    },
    userName: {
        fontSize: fontPixel(15),
        fontFamily: fonts.NunitoSemiBold,
        color: colors.black,
    },
});
