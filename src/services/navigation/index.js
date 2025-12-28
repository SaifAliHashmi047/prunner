import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthNavigation } from "./authFlow";
import { SubcontractorNavigation } from "./subcontractorFlow";
import { ForkliftNavigation } from "./forkliftFlow";
import { routes } from "../constant";


const MyStack = createStackNavigator();

export const MainNavigator = () => {
    return (
        <NavigationContainer>
            <MyStack.Navigator
                initialRouteName={routes.auth}
                screenOptions={{ headerShown: false }}
            >
                <MyStack.Screen name={routes.auth} component={AuthNavigation} />
                <MyStack.Screen name={routes.subcontractorFlow} component={SubcontractorNavigation} />
                <MyStack.Screen name={routes.forkliftFlow} component={ForkliftNavigation} />
            </MyStack.Navigator>
        </NavigationContainer>
    )
}