import { NativeModules, NativeEventEmitter } from 'react-native'

class Controller extends NativeEventEmitter {
    constructor(nativeModule) {
        super(nativeModule);
        console.log("nativeModule---->", nativeModule);
        this.requestAuthorization = nativeModule?.requestAuthorization;
        this.isHealthKitAvailable = nativeModule?.isHealthKitAvailable;
        this.getStepsCount = nativeModule?.getStepsCount;
    }
}

export default new Controller(NativeModules.Controller)