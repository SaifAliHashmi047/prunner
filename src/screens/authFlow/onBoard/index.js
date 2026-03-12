import React, { useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { AppButton } from '../../../components';
import { appImages } from '../../../services/utilities/assets';
import styles from './styles';
import { routes } from '../../../services/constant';

const OnBoard = ({ navigation }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else {
            navigation.navigate(routes.auth, { screen: routes.login });
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={step === 0 ? appImages.image : appImages.image1}
                style={styles.backgroundImage}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.mainTitle}>
                        {step === 0
                            ? "Welcome to Project Runner"
                            : "Manage Tasks & Collaborate"}
                    </Text>

                    <Text style={styles.description}>
                        {step === 0
                            ? "Create and assign tasks, track progress, and work together with your team on construction and delivery projects."
                            : "Sign in as a subcontractor or forklift operator and start managing your jobs today."}
                    </Text>

                    <AppButton
                        title={step === 0 ? "Next" : "Get Started"}
                        onPress={handleNext}
                    />
                </View>
            </ImageBackground>
        </View>
    );
};

export default OnBoard;