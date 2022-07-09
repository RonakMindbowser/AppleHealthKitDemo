import moment from "moment"
import { Alert } from "react-native"

export const showSimpleAlert = (message) => {
    Alert.alert("AppleHealthKitDemo", message)
}

export const getFormatDate = (date) => {
    return new Date(date).toISOString()
}

export const getReadbleDate = (date) => {
    return moment(date).format("DD-MMM-YYYY, hh:mm A")
}

export const getSumOfValues = (list, key) => {
    let temp = [...list]
    var sum = 0;
    temp.forEach(x => { sum += Number(x[key]) });
    return sum
}