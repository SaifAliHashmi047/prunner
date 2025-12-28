import React from "react";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import * as Subcontractor from "../../../screens/subcontractorFlow";
import { routes } from "../../constant";
import DrawerNavigator from "./DrawerNavigator";


const SubcontractorStack = createStackNavigator();


export const SubcontractorNavigation = () => {
    return (
        <SubcontractorStack.Navigator
            initialRouteName={routes.home}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <SubcontractorStack.Screen name={routes.home} component={DrawerNavigator} />
            <SubcontractorStack.Screen name={routes.workPack} component={Subcontractor.WorkPack} />
            <SubcontractorStack.Screen name={routes.createWorkPack} component={Subcontractor.CreateWorkPack} />
            <SubcontractorStack.Screen name={routes.siteMap} component={Subcontractor.SiteMap} />
            <SubcontractorStack.Screen name={routes.siteFeedback} component={Subcontractor.SiteFeedback} />
            <SubcontractorStack.Screen name={routes.myComplaint} component={Subcontractor.MyComplaint} />
            <SubcontractorStack.Screen name={routes.chatDetail} component={Subcontractor.ChatDetail} />
            <SubcontractorStack.Screen name={routes.addFeedback} component={Subcontractor.AddFeedback} />
            <SubcontractorStack.Screen name={routes.submitComplaint} component={Subcontractor.SubmitComplaint} />
            <SubcontractorStack.Screen name={routes.hsLog} component={Subcontractor.HsLog} />
            <SubcontractorStack.Screen name={routes.jobDetails} component={Subcontractor.JobDetails} />
            <SubcontractorStack.Screen name={routes.cancelJob} component={Subcontractor.CancelJob} />
            <SubcontractorStack.Screen name={routes.cancelJobOther} component={Subcontractor.CancelJobOther} />
            <SubcontractorStack.Screen name={routes.homeDetail} component={Subcontractor.HomeDetail} />
            <SubcontractorStack.Screen name={routes.createTask} component={Subcontractor.CreateTask} />
            <SubcontractorStack.Screen name={routes.locationOnMap} component={Subcontractor.LocationOnMap} />
            <SubcontractorStack.Screen name={routes.selectTask} component={Subcontractor.SelectTask} />
            <SubcontractorStack.Screen name={routes.createInventory} component={Subcontractor.CreateInventory} />
            <SubcontractorStack.Screen name={routes.taskUser} component={Subcontractor.TaskUser} />
            <SubcontractorStack.Screen name={routes.settings} component={Subcontractor.Settings} />
            <SubcontractorStack.Screen name={routes.editProfile} component={Subcontractor.EditProfile} />
            <SubcontractorStack.Screen name={routes.feedback} component={Subcontractor.FeedBack} />
            <SubcontractorStack.Screen name={routes.updatePassword} component={Subcontractor.UpdatePassword} />
            <SubcontractorStack.Screen name={routes.contactUs} component={Subcontractor.ContactUs} />
            <SubcontractorStack.Screen name={routes.privacyPolicy} component={Subcontractor.PrivacyPolicy} />
            <SubcontractorStack.Screen name={routes.aboutUs} component={Subcontractor.AboutUs} />
            <SubcontractorStack.Screen name={routes.termsOfUse} component={Subcontractor.TermsOfUse} />
            <SubcontractorStack.Screen name={routes.deleteAccount} component={Subcontractor.DeleteAccount} />
            <SubcontractorStack.Screen name={routes.accountDeleted} component={Subcontractor.AccountDeleted} />
            <SubcontractorStack.Screen name={routes.liveSound} component={Subcontractor.LiveSound} />
        </SubcontractorStack.Navigator>
    )
}