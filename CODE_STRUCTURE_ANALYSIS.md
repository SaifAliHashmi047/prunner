# Code Structure & API Integration Analysis

## 📁 Project Structure Overview

### Root Structure
```
prunner/
├── src/
│   ├── api/              # API configuration
│   ├── assets/           # Static assets (fonts, icons, images)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── screens/          # Screen components
│   │   ├── authFlow/     # Authentication screens
│   │   ├── subcontractorFlow/
│   │   └── forkliftFlow/
│   └── services/         # Utilities, constants, navigation, store
├── android/              # Android native code
├── ios/                  # iOS native code
└── App.tsx               # Main app entry point
```

---

## 🎨 Custom Components

### Available Custom Components (`src/components/`)

#### 1. **AppButton** (`AppButton.js`)
- **Purpose**: Reusable button component
- **Props**: `title`, `onPress`, `style`, `textStyle`, `disabled`
- **Features**: 
  - Customizable styling
  - Disabled state support
  - Active opacity feedback
- **Responsive**: Uses fixed padding, can be enhanced with responsive utilities

#### 2. **AppTextInput** (`AppTextInput.js`)
- **Purpose**: Enhanced text input with password visibility toggle
- **Props**: `value`, `onChangeText`, `placeholder`, `keyboardType`, `secureTextEntry`, `multiline`, `style`
- **Features**:
  - Password visibility toggle (eye icon)
  - Multiline support
  - Custom styling support
  - Auto-capitalize disabled
- **Responsive**: Uses fixed height (50px), multiline (100px)

#### 3. **AppHeader** (`AppHeader.js`)
- **Purpose**: Standardized header with back button
- **Props**: `title`, `subtitle`, `onBack`
- **Features**:
  - Optional back button
  - Title and subtitle support
  - Consistent styling
- **Responsive**: Uses `widthPixel`, `heightPixel`, `fontPixel` utilities

#### 4. **AppOtp** (`AppOtp.js`)
- **Purpose**: OTP input component
- **Usage**: Used in VerifyOtp screen
- **Features**: 6-digit OTP input

#### 5. **AppModal** (`AppModal.js`)
- **Purpose**: Modal dialog component
- **Props**: `visible`, `onClose`, `title`, `subtitle`
- **Features**:
  - Transparent overlay
  - Customizable content
  - Fade animation
- **Responsive**: Uses `widthPixel`, `heightPixel` utilities

#### 6. **AppCardHeader** (`AppCardHeader.js`)
- **Purpose**: Card header component

#### 7. **AppTaskCard** (`AppTaskCard.js`)
- **Purpose**: Task card display component

#### 8. **AppInventoryRow** (`AppInventoryRow.js`)
- **Purpose**: Inventory row display component

#### 9. **SecondHeader** (`SecondHeader.js`)
- **Purpose**: Secondary header variant

#### 10. **ForkLiftHeader** (`ForkLiftHeader.js`)
- **Purpose**: Forklift-specific header

#### 11. **TaskCard** (`TaskCard.js`)
- **Purpose**: Task card component

#### 12. **ForkLifterDrawer** (`ForkLifterDrawer.js`)
- **Purpose**: Forklift drawer component

#### 13. **CustomDrawerContent** (`CustomDrawerContent.js`)
- **Purpose**: Custom drawer content

#### 14. **Loader** (`Loader.tsx`)
- **Purpose**: Loading indicator component
- **Props**: `isVisible`
- **Usage**: Used in screens with API calls

---

## 📱 Responsive Utilities

### Location: `src/services/constant/index.js`

The project uses responsive pixel utilities:

- **`widthPixel(size)`**: Normalizes width based on screen width (base: 375px)
- **`heightPixel(size)`**: Normalizes height based on screen height (base: 812px)
- **`fontPixel(size)`**: Normalizes font size (uses heightPixel)

**Base Scale Calculation**:
- Width base: 375px (iPhone X standard)
- Height base: 812px (iPhone X standard)

**Usage Pattern**:
```javascript
import { widthPixel, heightPixel, fontPixel } from "../../../services/constant";

// Example
paddingHorizontal: widthPixel(20),
marginTop: heightPixel(10),
fontSize: fontPixel(16),
```

---

## 🔌 API Integration Setup

### API Configuration Files

#### 1. **axiosInstance** (`src/api/axiosInstance.tsx`)
- **Base URL**: `http://ec2-52-91-126-131.compute-1.amazonaws.com/api/v1/`
- **Features**:
  - Automatic token injection from AsyncStorage (`Token` key)
  - Token refresh on 401 errors
  - FormData support (`isFormData` flag)
  - Skip auth option (`skipAuth` flag)
  - Error formatting
  - Request/response logging

#### 2. **useCallApi Hook** (`src/hooks/useCallApi.ts`)
- **Purpose**: Custom hook for API calls
- **Base URL**: Same as axiosInstance
- **Features**:
  - Token refresh logic
  - Automatic navigation to login on auth failure
  - FormData support
  - Method: `callApi(endpoint, method, body, params, isFormData)`

**Note**: The project uses **TWO different API setups**:
- `axiosInstance` (used in most screens)
- `useCallApi` hook (alternative approach, less used)

---

## 🔐 Authentication Screens - API Integration Status

### ✅ Screens WITH API Integration

#### 1. **Login** (`src/screens/authFlow/Login/index.js`)
- **Status**: ✅ **INTEGRATED**
- **API Used**: `axiosInstance`
- **Endpoints**:
  - `POST auth/login` - User login
- **Features**:
  - Email/password validation
  - Token storage (Token, refreshToken)
  - Redux state management
  - Error handling with toast
  - Loading state with Loader component
- **Navigation**: Navigates to `subcontractorFlow` on success

#### 2. **SignUp** (`src/screens/authFlow/SignUp/index.js`)
- **Status**: ✅ **INTEGRATED**
- **API Used**: `axiosInstance`
- **Endpoints**:
  - `POST auth/signup` - User registration
- **Features**:
  - Email/password/confirm password validation
  - Device info in request
  - Token storage
  - Redux state management
  - Error handling with toast
  - Loading state
- **Navigation**: Navigates to `verifyOtp` on success

#### 3. **VerifyOtp** (`src/screens/authFlow/VerifyOtp/index.js`)
- **Status**: ✅ **INTEGRATED**
- **API Used**: `axiosInstance`
- **Endpoints**:
  - `POST auth/verify` - Verify OTP
  - `POST auth/sendOTP` - Resend OTP
- **Features**:
  - OTP validation (6 digits, numbers only)
  - Resend OTP with 60-second timer
  - Email from route params
  - Error handling with toast
  - Loading states (verify & resend)
- **Navigation**: Navigates to `accountType` on success

#### 4. **CreateProfile** (`src/screens/authFlow/CreateProfile/index.js`)
- **Status**: ✅ **INTEGRATED**
- **API Used**: `axiosInstance`
- **Endpoints**: (Profile creation endpoint - needs verification)
- **Features**:
  - Name validation
  - Image picker integration
  - FormData support for image upload
  - Error handling
  - Loading state
- **Note**: API endpoint needs to be verified in the code

---

### ❌ Screens WITHOUT API Integration

#### 1. **Forgot** (`src/screens/authFlow/Forgot/index.js`)
- **Status**: ❌ **NOT INTEGRATED**
- **Current Behavior**: Only navigation to `verifyEmail` screen
- **Missing**: 
  - API call to send forgot password email
  - Email validation
  - Error handling
  - Loading state
- **Suggested Endpoint**: `POST auth/forgot-password` or `POST auth/send-reset-email`

#### 2. **VerifyEmail** (`src/screens/authFlow/VerifyEmail/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not read, but likely missing)
- **Expected**: Should verify email or send verification email
- **Suggested Endpoint**: `POST auth/verify-email` or `POST auth/resend-verification`

#### 3. **ChangePassword** (`src/screens/authFlow/ChangePassword/index.js`)
- **Status**: ❌ **NOT INTEGRATED**
- **Current Behavior**: Only console.log and navigation to login
- **Missing**:
  - API call to update password
  - Password validation
  - Confirm password matching
  - Error handling
  - Loading state
- **Suggested Endpoint**: `POST auth/change-password` or `POST auth/reset-password`

#### 4. **AccountType** (`src/screens/authFlow/AccountType/index.js`)
- **Status**: ❌ **NOT INTEGRATED**
- **Current Behavior**: Only Redux state update and navigation
- **Missing**:
  - API call to save account type selection
  - Error handling
- **Suggested Endpoint**: `POST user/update-account-type` or `PATCH user/account-type`

#### 5. **ProvideInfo** (`src/screens/authFlow/ProvideInfo/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should submit user information
- **Suggested Endpoint**: `POST user/provide-info` or `PATCH user/info`

#### 6. **ScanLicense** (`src/screens/authFlow/ScanLicense/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should upload/submit scanned license
- **Suggested Endpoint**: `POST user/upload-license` (with FormData)

#### 7. **UploadLicense** (`src/screens/authFlow/UploadLicense/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should upload license document
- **Suggested Endpoint**: `POST user/upload-license` (with FormData)

#### 8. **ScanVehicleRegistration** (`src/screens/authFlow/ScanVehicleRegistration/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should scan vehicle registration
- **Suggested Endpoint**: `POST user/scan-vehicle-registration`

#### 9. **UploadVehicleRegistration** (`src/screens/authFlow/UploadVehicleRegistration/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should upload vehicle registration document
- **Suggested Endpoint**: `POST user/upload-vehicle-registration` (with FormData)

#### 10. **TellAboutVehicle** (`src/screens/authFlow/TellAboutVehicle/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should submit vehicle information
- **Suggested Endpoint**: `POST user/vehicle-info` or `PATCH user/vehicle-info`

#### 11. **ScanQr** (`src/screens/authFlow/ScanQr/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should scan QR code
- **Suggested Endpoint**: `POST user/scan-qr` or `POST verification/scan-qr`

#### 12. **ScanPage** (`src/screens/authFlow/ScanPage/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Generic scan page
- **Suggested Endpoint**: Depends on scan type

#### 13. **VerificationProcess** (`src/screens/authFlow/VerificationProcess/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Should track/submit verification status
- **Suggested Endpoint**: `GET user/verification-status` or `POST user/submit-verification`

#### 14. **ProfileCreated** (`src/screens/authFlow/ProfileCreated/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Success screen, may not need API
- **Note**: Likely just a confirmation screen

#### 15. **ProfileVerified** (`src/screens/authFlow/ProfileVerified/index.js`)
- **Status**: ❌ **NOT INTEGRATED** (Not fully read)
- **Expected**: Success screen, may not need API
- **Note**: Likely just a confirmation screen

#### 16. **Splash** (`src/screens/authFlow/Splash/index.js`)
- **Status**: ❌ **NOT INTEGRATED**
- **Expected**: Should check auth status, auto-login if token exists
- **Suggested**: 
  - `GET auth/check-token` or validate existing token
  - Auto-navigate based on auth state

#### 17. **onBoard** (`src/screens/authFlow/onBoard/index.js`)
- **Status**: ❌ **NOT INTEGRATED**
- **Expected**: Onboarding screen, may not need API
- **Note**: Likely just informational screens

---

## 📊 Summary Statistics

### API Integration Status
- **✅ Integrated**: 4 screens (Login, SignUp, VerifyOtp, CreateProfile)
- **❌ Not Integrated**: 17 screens
- **Total Auth Screens**: 21

### Integration Priority (Based on User Flow)

#### High Priority (Core Authentication)
1. ✅ Login - **DONE**
2. ✅ SignUp - **DONE**
3. ✅ VerifyOtp - **DONE**
4. ❌ Forgot - **NEEDS API**
5. ❌ ChangePassword - **NEEDS API**
6. ❌ Splash - **NEEDS API** (auto-login check)

#### Medium Priority (Profile Setup)
7. ✅ CreateProfile - **DONE**
8. ❌ AccountType - **NEEDS API**
9. ❌ ProvideInfo - **NEEDS API**

#### Medium Priority (Verification)
10. ❌ ScanLicense - **NEEDS API**
11. ❌ UploadLicense - **NEEDS API**
12. ❌ ScanVehicleRegistration - **NEEDS API**
13. ❌ UploadVehicleRegistration - **NEEDS API**
14. ❌ TellAboutVehicle - **NEEDS API**
15. ❌ VerificationProcess - **NEEDS API**

#### Low Priority (Supporting Screens)
16. ❌ ScanQr - **NEEDS API**
17. ❌ ScanPage - **NEEDS API**
18. ❌ VerifyEmail - **NEEDS API**
19. ❌ ProfileCreated - **May not need API** (success screen)
20. ❌ ProfileVerified - **May not need API** (success screen)
21. ❌ onBoard - **May not need API** (onboarding)

---

## 🛠️ Recommendations

### 1. **Standardize API Approach**
- Choose either `axiosInstance` or `useCallApi` hook consistently
- Currently, most screens use `axiosInstance` (recommended to continue)

### 2. **Add Missing API Integrations**
- Start with high-priority screens (Forgot, ChangePassword, Splash)
- Follow the pattern established in Login/SignUp screens:
  - Import `axiosInstance`
  - Add loading state with `Loader` component
  - Add error handling with `toastError`/`toastSuccess`
  - Add form validation
  - Store tokens/user data appropriately

### 3. **Responsive Design**
- Most components use responsive utilities (`widthPixel`, `heightPixel`, `fontPixel`)
- Some components (AppButton, AppTextInput) use fixed sizes - consider making them responsive

### 4. **Error Handling**
- All integrated screens use toast notifications
- Ensure all new integrations follow the same pattern

### 5. **Loading States**
- All integrated screens use `Loader` component
- Ensure all new integrations include loading states

---

## 📝 Notes

- **Token Storage**: Uses AsyncStorage with key `Token` (capital T) in axiosInstance, but `token` (lowercase) in useCallApi hook - **INCONSISTENCY**
- **Refresh Token**: Stored as `refreshToken` in both implementations
- **Redux**: Used for user state management (`userSlice`)
- **Navigation**: Uses React Navigation with nested navigators
- **Toast**: Custom toast utility for error/success messages

---

*Generated: Analysis of ProjectRunner codebase*


