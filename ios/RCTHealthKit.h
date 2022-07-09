//
//  RCTHealthKit.h
//  AppleHealthKitDemo
//
//  Created by Urvesh Mishra on 26/05/22.
//

#ifndef RCTHealthKit_h
#define RCTHealthKit_h

#import <Foundation/Foundation.h>
#import <HealthKit/HealthKit.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTUtils.h>
#import <React/RCTLog.h>
#import <React/RCTEventDispatcher.h>

@interface RCTHealthKit : NSObject <RCTBridgeModule>


@property (nonatomic) HKHealthStore *healthStore;
//@property (nonatomic, assign) BOOL hasListeners;

//- (HKHealthStore *)_initializeHealthStore;
//- (void)isHealthKitAvailable:(RCTResponseSenderBlock)callback;
//
//- (void)intitalizeHealthKit:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback;


@end


#endif /* RCTHealthKit_h */
