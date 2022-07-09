import React, { } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LaunchScreen from "../screens/LaunchScreen";
import GetStepCountScreen from "../screens/GetStepCountScreen";
import AppleHealthKitLaunchScreen from "../screens/AppleHealthKitLaunchScreen";

const Stack = createStackNavigator();

function AppContainer() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="LaunchScreen" component={LaunchScreen} />
                <Stack.Screen name="AppleHealthKitLaunchScreen" component={AppleHealthKitLaunchScreen} />
                <Stack.Screen name="GetStepCountScreen" component={GetStepCountScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppContainer;