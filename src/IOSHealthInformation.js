import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, NativeModules, Platform } from 'react-native';
const { HealthKit } = NativeModules;

export default function IOSHealthInformation() {
    console.log("HealthKit--->", HealthKit);
    function formatDate(date) {
        moment(date).format("DD-MM-YYYY,hh:mm")
        return moment(date).format("DD-MM-YYYY, hh:mm")
    }

    const getDateFromGivenDays = (value) => {
        var todayDate = new Date();
        var numberOfDaysToRemove = value
        todayDate.setDate(todayDate.getDate() - numberOfDaysToRemove);
        return todayDate.toISOString();
    }

    let yesterdayDate = getDateFromGivenDays(30);
    let todayDate = new Date().toISOString();

    if (Platform.OS == "ios") {
        return (
            <View style={styles.container}>
                <StatusBar />
                <TouchableOpacity onPress={() => {
                    HealthKit.isAvailable((err, available) => {
                        console.log("isAvailable --->", available);
                        console.log("err -isAvailable-->", err);

                        if (available) {
                            //Healthkit is available , so we need to authorize it first.

                            try {
                                HealthKit.initAppleHealthKit(({}), (err, results) => {
                                    console.log("available initHealthKit--->", results);
                                    console.log("err ---initHealthKit>", err);

                                    if (results) {
                                        let options = {
                                            startDate: yesterdayDate, // required
                                            endDate: todayDate, // optional; default now
                                            period: 60
                                        };
                                        try {
                                            HealthKit.getDailyStepCountSamples((options), (err, results) => {
                                                console.log("available getDailyStepCountSamples--->", results);
                                                console.log("err ---getDailyStepCountSamples>", err);
                                                if (results) {
                                                    results.map((obj) => {

                                                        console.log("Obj startDate--->", formatDate(obj.startDate))
                                                        console.log("Obj endDate--->", formatDate(obj.endDate))
                                                        console.log("Obj steps--->", (obj.steps))
                                                    })
                                                }
                                            })
                                        }
                                        catch (err) {
                                            console.log("err ---getDailyStepCountSamples ccathh--->>", err);
                                        }
                                    }
                                })
                            }
                            catch (err) {
                                console.log("err ---initHealthKit ccathh--->>", err);
                            }
                        }
                        else {
                            alert("Apple HelathKit is not available")
                        }
                    })

                    // HealthKit.isAvailable()
                }}>
                    <Text style={{ color: "black" }}>Request Healthkit Permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }
    else {
        return null
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});