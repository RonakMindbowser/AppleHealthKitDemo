import React from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, NativeModules, Platform, Image } from 'react-native';
import IOSHealthInformation from './src/IOSHealthInformation';
// import HealthkitController from './src/HealthKitHeader';
import { createThumbnail } from "react-native-create-thumbnail";

export default function App() {
    // const [image, setImage] = React.useState(null);
    // React.useEffect(() => {
    //   let source = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+1/CORE+-++dbs+-+advance+-+fix.mp4"
    //   // let source2 = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4";

    //   let source3 = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+2/CORE+-+adv+-+bands.mp4";
    //   let source4 = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+3/core+-+db+-+adv.mp4"
    //   let source5 = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+4/Core+-+dbs+-+adv.mp4";

    //   createThumbnail({
    //     url: source5,
    //     timeStamp: 20000,
    //   })
    //     .then(response => {
    //       console.log({ response })
    //       setImage(response?.path);
    //     })
    //     .catch(err => console.log({ err }));
    // }, [])

    let list = [
        "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+1/CORE+-++dbs+-+advance+-+fix.mp4",
        "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+2/CORE+-+adv+-+bands.mp4",
        "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+3/core+-+db+-+adv.mp4",
        "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+4/Core+-+dbs+-+adv.mp4",
    ]

    // if (Platform.OS == 'android') {
    //   return (
    //     <View style={styles.container}>
    //       <StatusBar />
    //       <TouchableOpacity >
    //         {/* <Text style={{ color: "black" }}>Request Healthkit Permissions</Text> */}
    //         {
    //           image ?
    //             <Image source={{ uri: image }} style={{ height: 200, width: 200 }} />
    //             : null
    //         }
    //       </TouchableOpacity>
    //     </View>
    //   )
    // }
    // else {
    //   return (
    //     <View style={styles.container}>
    //       {/* <IOSHealthInformation /> */}
    //       {
    //         image ?
    //           <Image source={{ uri: image }} style={{ height: 200, width: 200 }} />
    //           : null
    //       }
    //     </View>
    //   );
    // }
    return (
        <View style={{ flex: 1 }}>
            {
                list.map((obj1) => {
                    return (
                        <View>
                            <App2 finalSource={obj1} />
                        </View>
                    )
                })
            }
        </View>
    )
}

const App2 = ({ finalSource }) => {
    const [image, setImage] = React.useState(null);
    React.useEffect(() => {
        // let source = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+1/CORE+-++dbs+-+advance+-+fix.mp4"
        // let source2 = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4";

        // let source3 = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+2/CORE+-+adv+-+bands.mp4";
        // let source4 = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+3/core+-+db+-+adv.mp4"
        // let source5 = "https://phalanx-staging.s3.us-east-2.amazonaws.com/workoutvideo/advanced/Dumbbells+Bands/Core+training/Workout+4/Core+-+dbs+-+adv.mp4";
        var filename = finalSource.substring(finalSource.lastIndexOf('/') + 1);
        console.log("filename---->", filename);
        createThumbnail({
            url: finalSource,
            timeStamp: 20000,
            cacheName: filename
        })
            .then(response => {
                console.log({ response })
                setImage(response?.path);
            })
            .catch(err => console.log({ err }));
    }, [])

    if (image) {
        return (
            <Image source={{ uri: image }} style={{ height: 200, width: 200, marginVertical: 20 }} />
        )
    }
    else {
        return (
            <Text style={{ color: "black", marginVertical: 20 }}>waiting ....</Text>
        )
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