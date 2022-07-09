import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity
} from 'react-native';
import * as RNHealthKit from './AppleHealthKitUtils';

const AppleHealthKitLaunchScreen = () => {
    const navigation = useNavigation();

    const initAppleHealthKit = (routeName) => {
        RNHealthKit.initAppleHealthKit().then((res) => {
            console.log("initAppleHealthKit isAvailable --->", res);
            navigation.navigate(routeName)
        }).catch((err) => {
            console.log("err -isAvailable-->", err);
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => initAppleHealthKit("GetStepCountScreen")}
            >
                <Text style={styles.textInput}>
                    {"Get StepCount Data"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default AppleHealthKitLaunchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    textInput: {
        color: "white",
        fontSize: 14
    },
    button: {
        backgroundColor: "blue",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10
    }
})
