import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, NativeModules, Platform, Image } from 'react-native';
import IOSHealthInformation from './src/IOSHealthInformation';
import AppContainer from './src/navigator/AppContainer';
// import HealthkitController from './src/HealthKitHeader';

export default function App() {

  // if (Platform.OS == 'android') {
  //   return (
  //     <View style={styles.container}>
  //       <StatusBar />
  //       <TouchableOpacity >
  //         <Text style={{ color: "black" }}>Request Healthkit Permissions</Text>
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }
  // else {
  //   return (
  //     <View style={styles.container}>
  //       <IOSHealthInformation />
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#f7fbfc"} barStyle='dark-content' />
      <AppContainer />
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});