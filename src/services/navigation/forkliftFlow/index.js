import React from "react";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import * as Forklift from "../../../screens/forkliftFlow";
import * as Subcontractor from "../../../screens/subcontractorFlow";
import { routes } from "../../constant";
import DrawerNavigator from "./DrawerNavigator";

const ForkliftStack = createStackNavigator();

export const ForkliftNavigation = () => {
    return (
        <ForkliftStack.Navigator
            initialRouteName={routes.home}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <ForkliftStack.Screen name={routes.home} component={DrawerNavigator} />
            <ForkliftStack.Screen name={routes.forkJobDetail} component={Forklift.ForkJobDetail} />
            <ForkliftStack.Screen name={routes.chat} component={Forklift.Chat} />
            <ForkliftStack.Screen name={routes.chatDetail} component={Subcontractor.ChatDetail} />
            <ForkliftStack.Screen name={routes.cancelJob} component={Subcontractor.CancelJob} />
            <ForkliftStack.Screen name={routes.cancelJobOther} component={Subcontractor.CancelJobOther} />
            <ForkliftStack.Screen name={routes.siteMap} component={Subcontractor.SiteMap} />
            <ForkliftStack.Screen name={routes.siteFeedback} component={Subcontractor.SiteFeedback} />
            <ForkliftStack.Screen name={routes.siteFeedbackDetail} component={Subcontractor.SiteFeedbackDetail} />
            <ForkliftStack.Screen name={routes.addFeedback} component={Subcontractor.AddFeedback} />
            <ForkliftStack.Screen name={routes.hsLog} component={Subcontractor.HsLog} />
            <ForkliftStack.Screen name={routes.hsLogDetail} component={Subcontractor.HsLogDetail} />
            <ForkliftStack.Screen name={routes.myComplaint} component={Subcontractor.MyComplaint} />
            <ForkliftStack.Screen name={routes.submitComplaint} component={Subcontractor.SubmitComplaint} />
            <ForkliftStack.Screen name={routes.homeDetail} component={Subcontractor.HomeDetail} />
            <ForkliftStack.Screen name={routes.forkHomeDetail} component={Forklift.ForkHomeDetail} />
            <ForkliftStack.Screen name={routes.settings} component={Subcontractor.Settings} />
            <ForkliftStack.Screen name={routes.editProfile} component={Subcontractor.EditProfile} />
            <ForkliftStack.Screen name={routes.feedback} component={Subcontractor.FeedBack} />
            <ForkliftStack.Screen name={routes.updatePassword} component={Subcontractor.UpdatePassword} />
            <ForkliftStack.Screen name={routes.contactUs} component={Subcontractor.ContactUs} />
            <ForkliftStack.Screen name={routes.privacyPolicy} component={Subcontractor.PrivacyPolicy} />
            <ForkliftStack.Screen name={routes.aboutUs} component={Subcontractor.AboutUs} />
            <ForkliftStack.Screen name={routes.termsOfUse} component={Subcontractor.TermsOfUse} />
            <ForkliftStack.Screen name={routes.deleteAccount} component={Subcontractor.DeleteAccount} />
            <ForkliftStack.Screen name={routes.accountDeleted} component={Subcontractor.AccountDeleted} />
            <ForkliftStack.Screen name={routes.materialPicked} component={Forklift.MaterialPicked} />
            <ForkliftStack.Screen name={routes.liveSound} component={Subcontractor.LiveSound} />

        </ForkliftStack.Navigator>
    )
}
