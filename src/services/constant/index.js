import { Dimensions, PixelRatio } from "react-native";
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

export const routes = {
    auth: 'auth',
    splash: 'splash',
    login: 'login',
    onBoard: 'onBoard',
    signUp: 'signUp',
    forgot: 'forgot',
    verifyEmail: 'verifyEmail',
    changePassword: 'changePassword',
    verifyOtp: 'verifyOtp',
    accountType: 'accountType',
    createProfile: 'createProfile',
    profileCreated: 'profileCreated',
    scanQr: 'scanQr',
    scanPage: 'scanPage',
    provideInfo: 'provideInfo',
    verificationProcess: 'verificationProcess',
    profileVerified: 'profileVerified',
    uploadLicense: 'uploadLicense',
    scanLicense: 'scanLicense',
    tellAboutVehicle: 'tellAboutVehicle',
    uploadVehicleRegistration: 'uploadVehicleRegistration',
    scanVehicleRegistration: 'scanVehicleRegistration',

    // subcontractor flow
    subcontractorFlow: 'subcontractorFlow',

    // forklift flow


    home: 'home',
    chat: 'chat',
    siteMap: 'siteMap',
    inventory: 'inventory',
    workPack: 'workPack',
    createWorkPack: 'createWorkPack',
    siteFeedback: 'siteFeedback',
    myComplaint: 'myComplaint',
    chatDetail: 'chatDetail',
    addFeedback: 'addFeedback',
    submitComplaint: 'submitComplaint',
    hsLog: 'hsLog',
    jobDetails: 'jobDetails',
    cancelJob: 'cancelJob',
    cancelJobOther: 'cancelJobOther',
    homeDetail: 'homeDetail',
    createTask: 'createTask',
    locationOnMap: 'locationOnMap',
    selectTask: 'selectTask',
    createInventory: 'createInventory',
    selectInventoryForTask: 'selectInventoryForTask',
    taskUser: 'taskUser',
    settings: 'settings',
    editProfile: 'editProfile',
    feedback: 'feedback',
    updatePassword: 'updatePassword',
    contactUs: 'contactUs',
    privacyPolicy: 'privacyPolicy',
    aboutUs: 'aboutUs',
    termsOfUse: 'termsOfUse',
    deleteAccount: 'deleteAccount',
    accountDeleted: 'accountDeleted',
    liveSound: 'liveSound',

    forkliftFlow: 'forkliftFlow',
    tasks: 'tasks',
    forkJobDetail: 'forkJobDetail',
    forkHomeDetail: 'forkHomeDetail',
    materialPicked: 'materialPicked'
}


export const wp = (p) => WINDOW_WIDTH * (p / 100);
export const hp = (p) => WINDOW_HEIGHT * (p / 100);

const widthBaseScale = SCREEN_WIDTH / 375;
const heightBaseScale = SCREEN_HEIGHT / 812;



function normalize(size, based = "width") {
    const newSize =
        based === "height" ? size * heightBaseScale : size * widthBaseScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}


const widthPixel = (size) => {
    return normalize(size, "width");
};
const heightPixel = (size) => {
    return normalize(size, "height");
};
const fontPixel = (size) => {
    return heightPixel(size);
};


export const emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordFormat =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{7,24}$/; // just one upper case alphabet/one lower case alpjhabet/number/special chars


export { widthPixel, heightPixel, fontPixel };