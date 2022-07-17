import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image, FlatList, Dimensions
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { CustomHeader, CustomLoader, } from "react-native-reusable-custom-components";
import { getFormatDate, getReadbleDate, getSumOfValues } from './Utils';
import * as RNHealthKit from './AppleHealthKitUtils';

const GetStepCountScreen = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date(new Date().getTime() + 2 * 60000))
    const [startDate, setstartDate] = useState(date)
    const [endDate, setendDate] = useState(date)
    const [selectedIndex, setselectedIndex] = useState(0)
    const [modalVisible, setModalVisible] = useState(false);
    const [period, setPeriod] = useState(60);
    const [periodList, setPeriodList] = useState([
        { title: "15", }, { title: "30", }, { title: "45", }, { title: "60", },
    ])
    const [loading, setLoading] = useState(false)
    const [stepData, setStepData] = useState([])

    const onSelectClick = () => {
        setModalVisible(false)
    }

    const onClickSubmit = () => {
        const params = {
            startDate: getFormatDate(startDate),
            endDate: getFormatDate(endDate),
            period: Number(period)
        }
        setLoading(true)
        RNHealthKit.getDailyStepCountSamples(params).then((res) => {
            console.log('Results', res);
            setLoading(false)
            setStepData(res)
        }).catch((error) => {
            console.log('Error', error);
            setLoading(false)
        })
    }

    const renderStepData = ({ item, index }) => {
        return (
            <View style={{ marginVertical: 10 }}>
                <Text>{"Start Date: " + getReadbleDate(item?.startDate)}</Text>
                <Text>{"End Date: " + getReadbleDate(item?.endDate)}</Text>
                <Text>{"Steps: " + item?.steps}</Text>
            </View>
        )
    }

    const renderListFooter = () => {
        if (stepData.length) {
            let value = getSumOfValues(stepData, "steps")
            console.log("value", value);
            return (
                <Text style={{ fontSize: 14, fontWeight: "bold" }}>{"Total Steps: " + value}</Text>
            )
        }
        else {
            return null;
        }
    }

    const renderPeriodIten = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.dropdownView} onPress={() => {
                setPeriod(Number(item.title))
                setModalVisible(false)
            }}>
                <Text style={styles.dateText}>{item?.title}</Text>
            </TouchableOpacity>
        )
    }

    const renderDateView = (date, id, text) => {
        return (
            <View style={styles.dateWrap}>
                <Text style={styles.dateText}>{`${text} : ` + date.toDateString()}</Text>
                <TouchableOpacity
                    onPress={() => {
                        setselectedIndex(id)
                        setModalVisible(true)
                    }}>
                    <Image style={styles.calender}
                        resizeMode='contain'
                        source={require("../assets/calender.png")} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CustomHeader
                backButton
                middleText={'Step Count'}
                onBackButtonPress={() => navigation.goBack()}
            />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {renderDateView(startDate, 0, "Start Date")}
                {renderDateView(endDate, 1, "End Date")}
                <View style={styles.dateWrap}>
                    <Text style={styles.dateText}>{"Period: " + period}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setselectedIndex(2)
                            setModalVisible(true)
                        }}>
                        <Image style={styles.calender}
                            resizeMode='contain'
                            source={require("../assets/down.png")} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.titleView}
                    onPress={onClickSubmit}
                >
                    <Text style={styles.title}>{"Submit"}</Text>
                </TouchableOpacity>

                <FlatList
                    data={stepData}
                    extraData={stepData}
                    ListFooterComponent={renderListFooter}
                    renderItem={renderStepData}
                    contentContainerStyle={{ paddingVertical: 20 }}
                    keyExtractor={(i, j) => j.toString()}
                    ListEmptyComponent={() => <Text style={styles.dateText}>{"No record found."}</Text>}
                />
            </ScrollView>
            <View>
                <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                    style={styles.modalStyle}
                >
                    <View style={styles.mainContainer}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.transparentArea}
                        />
                        <View style={styles.subContainer}>
                            <Text style={{ alignSelf: "center" }}>{`Select ${selectedIndex == 0 ? 'Start' : 'End'} Date`}</Text>
                            {selectedIndex !== 2 && <DatePicker
                                date={selectedIndex == 0 ? startDate : endDate}
                                onDateChange={(dt) => {
                                    if (selectedIndex == 0) setstartDate(dt)
                                    else setendDate(dt)
                                }}
                                minimumDate={selectedIndex == 1 && startDate}
                                maximumDate={new Date()}
                                is24hourSource="locale"
                                mode='date'
                            />}
                            {
                                selectedIndex == 2 &&
                                <FlatList
                                    data={periodList}
                                    extraData={periodList}
                                    keyExtractor={(i, j) => j.toString()}
                                    renderItem={renderPeriodIten}
                                    ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "gray" }} />}
                                />
                            }
                            <TouchableOpacity style={styles.titleView}
                                onPress={onSelectClick}
                            >
                                <Text style={styles.title}>{"Select"}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.transparentArea}
                        />
                    </View>
                </Modal>
            </View>
            <CustomLoader loading={loading} />
        </View>
    )
}

export default GetStepCountScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalStyle: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#26323870',
        justifyContent: 'center',
        alignItems: 'center',
    },
    transparentArea: {
        flex: 1,
        width: '100%',
    },
    subContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'space-around',
        flex: 1
    },
    listWrapView: {
        flexDirection: "row",
        paddingVertical: 10
    },
    listObjView: {
        flexDirection: "row",
        margin: 10,
        alignItems: "center"
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
        marginVertical: 10,
        alignItems: "center"
    },
    titleView: {
        borderWidth: 1,
        backgroundColor: "blue",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 10
    },
    title: {
        color: "white",
        fontSize: 14,
    },
    colorName: {
        color: "black",
    },
    dateWrap: {
        flexDirection: "row",
        justifyContent: "space-between", paddingHorizontal: 10,
        paddingVertical: 10
    },
    dateText: {
        fontSize: 16,
        color: "black"
    },
    calender: {
        height: 20, width: 20
    },
    dropdownView: {
        alignItems: "center",
        paddingVertical: 10,
        width: Dimensions.get("screen").width - 100
    }
})
