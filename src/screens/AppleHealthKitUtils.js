import { NativeModules } from "react-native";
import { showSimpleAlert } from "./Utils";

const { HealthKit } = NativeModules;

const isHealthKitAvailable = () => {
    return new Promise((resolve, reject) => {
        HealthKit.isAvailable((err, available) => {
            if (available) {
                resolve(available)
            }
            else {
                showSimpleAlert("Apple HealthKit is not available for this device.")
                reject(err)
            }
        })
    })
}

const initAppleHealthKit = () => {
    return new Promise((resolve, reject) => {
        HealthKit.initAppleHealthKit(({}), (err, results) => {
            if (results) {
                resolve(results)
            }
            else {
                showSimpleAlert("Permission Denied For Apple healthkit,Please enable permission and restart app again.")
                reject(err)
            }
        })
    })
}

const getDailyStepCountSamples = (params) => {
    return new Promise((resolve, reject) => {
        HealthKit.getDailyStepCountSamples((params), (err, results) => {
            console.log("available getDailyStepCountSamples--->", results);
            console.log("err ---getDailyStepCountSamples>", err);
            if (results) {
                resolve(results)
            }
            else {
                reject(err)
            }
        })
    })
}

export {
    HealthKit,
    isHealthKitAvailable,
    initAppleHealthKit,
    getDailyStepCountSamples,
}