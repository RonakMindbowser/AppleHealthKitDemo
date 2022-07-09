import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
} from 'react-native';
import { showSimpleAlert } from './Utils';
import * as RNHealthKit from './AppleHealthKitUtils';

const LaunchScreen = () => {
    const navigation = useNavigation();

    const checkHealthkitAvaibility = () => {
        RNHealthKit.isHealthKitAvailable().then((res) => {
            console.log("isAvailable --->", res);
            navigation.navigate("AppleHealthKitLaunchScreen")
        }).catch((error) => {
            console.log("err -isAvailable-->", error);
        })
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={checkHealthkitAvaibility}
            >
                <Text style={styles.textInput}>
                    {"Let's Go to Apple HealthKit Demo"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default LaunchScreen;

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
