import React from "react";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import * as Auth from "../../../screens/authFlow";
import { routes } from "../../constant";



const AuthStack = createStackNavigator();

export const AuthNavigation = () => {
    return (
        <AuthStack.Navigator
            initialRouteName={routes.splash}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <AuthStack.Screen name={routes.splash} component={Auth.Splash} />
            <AuthStack.Screen name={routes.onBoard} component={Auth.onBoard} />
            <AuthStack.Screen name={routes.login} component={Auth.Login} />
            <AuthStack.Screen name={routes.signUp} component={Auth.SignUp} />
            <AuthStack.Screen name={routes.forgot} component={Auth.Forgot} />
            <AuthStack.Screen name={routes.verifyEmail} component={Auth.VerifyEmail} />
            <AuthStack.Screen name={routes.changePassword} component={Auth.ChangePassword} />
            <AuthStack.Screen name={routes.verifyOtp} component={Auth.VerifyOTP} />
            <AuthStack.Screen name={routes.accountType} component={Auth.AccountType} />
            <AuthStack.Screen name={routes.createProfile} component={Auth.CreateProfile} />
            <AuthStack.Screen name={routes.profileCreated} component={Auth.ProfileCreated} />
            <AuthStack.Screen name={routes.scanQr} component={Auth.ScanQr} />
            <AuthStack.Screen name={routes.scanPage} component={Auth.ScanPage} />
            <AuthStack.Screen name={routes.provideInfo} component={Auth.ProvideInfo} />
            <AuthStack.Screen name={routes.verificationProcess} component={Auth.VerificationProcess} />
            <AuthStack.Screen name={routes.profileVerified} component={Auth.ProfileVerified} />
            <AuthStack.Screen name={routes.uploadLicense} component={Auth.UploadLicense} />
            <AuthStack.Screen name={routes.scanLicense} component={Auth.ScanLicense} />
            <AuthStack.Screen name={routes.tellAboutVehicle} component={Auth.TellAboutVehicle} />
            <AuthStack.Screen name={routes.uploadVehicleRegistration} component={Auth.UploadVehicleRegistration} />
            <AuthStack.Screen name={routes.scanVehicleRegistration} component={Auth.ScanVehicleRegistration} />
        </AuthStack.Navigator>
    )
}