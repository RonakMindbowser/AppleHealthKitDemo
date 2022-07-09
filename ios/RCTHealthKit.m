//
//  RCTHealthKit.m
//  AppleHealthKitDemo
//
//  Created by Urvesh Mishra on 26/05/22.
//

#import "RCTHealthKit.h"

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>

@implementation RCTHealthKit

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(isAvailable:(RCTResponseSenderBlock)callback)
{
    [self isHealthKitAvailable:callback];
}

RCT_EXPORT_METHOD(initAppleHealthKit:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback){
  [self intitalizeHealthKit:input callback:callback];
}

RCT_EXPORT_METHOD(getDailyStepCountSamples:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback){
  [self _initializeHealthStore];
  [self rn_getDailyStepCountSamples:input callback:callback];

}

RCT_EXPORT_METHOD(getBloodPressureSamples:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback){
  [self _initializeHealthStore];
  [self fetchBloodPressureSamples:input callback:callback];
}

- (HKHealthStore *)_initializeHealthStore {
  if(![self healthStore]) {
    self.healthStore = [[HKHealthStore alloc] init];
  }
  return [self healthStore];
}


- (void)isHealthKitAvailable:(RCTResponseSenderBlock)callback
{
    BOOL isAvailable = NO;

    if ([HKHealthStore isHealthDataAvailable]) {
        isAvailable = YES;
    }
 
    callback(@[[NSNull null], @(isAvailable)]);
}

- (void) intitalizeHealthKit:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback{
  [self _initializeHealthStore];
  
  // Share body mass, height and body mass index
  NSSet *shareObjectTypes = [NSSet setWithObjects:
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyMass],
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierHeight],
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyMassIndex],
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount],
                             nil];

  // Read date of birth, biological sex and step count
  NSSet *readObjectTypes  = [NSSet setWithObjects:
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyMass],
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierHeight],
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierBodyMassIndex],
                             [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount],
                             nil];
  
  
  if ([HKHealthStore isHealthDataAvailable]) {
    [self.healthStore requestAuthorizationToShareTypes:shareObjectTypes readTypes:readObjectTypes completion:^(BOOL success, NSError *error) {
      NSLog(@"Error while init request%@", error);
      NSLog(@"success while init request%d", success);
    
               if (!success) {
                   NSString *errMsg = [NSString stringWithFormat:@"Error with HealthKit authorization: %@", error];
                   
                   callback(@[RCTMakeError(errMsg, nil, nil)]);
                   return;
               } else {
                   dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                       callback(@[[NSNull null], @true]);
                   });
               }
           }];
  }

}

- (void) rn_getDailyStepCountSamples:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback {

  NSLog(@"iinput%@", input);
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDateComponents *interval = [[NSDateComponents alloc] init];
  
  NSUInteger period = [self uintFromOptions:input key:@"period" withDefault:60];

  interval.minute = period;
  
//  NSDate *endDate = [NSDate date];
  NSDate *endDate = [self dateFromOptions:input key:@"endDate" withDefault:[NSDate date]];
//  NSDate *startDateForStep = [input objectForKey:@"startDate"];
//  NSLog(@"startDateForStep%@", startDateForStep);
  NSDate *startDate =  [self dateFromOptions:input key:@"startDate" withDefault:nil];
  NSLog(@"FormattedStartDate%@", startDate);
  NSLog(@"FormattedendDate%@", endDate);
  
  NSDateComponents *anchorComponents = [calendar components:NSCalendarUnitDay | NSCalendarUnitMonth | NSCalendarUnitYear
                                                   fromDate:startDate];
  anchorComponents.hour = 0;
  
  NSDate *anchorDate = [calendar dateFromComponents:anchorComponents];
  HKQuantityType *quantityType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierStepCount];

  // Create the query
  HKStatisticsCollectionQuery *query = [[HKStatisticsCollectionQuery alloc] initWithQuantityType:quantityType
                                                                         quantitySamplePredicate:nil
                                                                                         options:HKStatisticsOptionCumulativeSum
                                                                                      anchorDate:anchorDate
                                                                              intervalComponents:interval];

  // Set the results handler
  query.initialResultsHandler = ^(HKStatisticsCollectionQuery *query, HKStatisticsCollection *results, NSError *error) {
      if (error) {
                 // Perform proper error handling here
                 NSLog(@"*** An error occurred while calculating the statistics: %@ ***",error.localizedDescription);
                 NSString *errMsg = [NSString stringWithFormat:@"Error with getting step data: %@", error];
                 NSLog(@"%@", errMsg);
                 callback(@[RCTMakeError(errMsg, nil, nil)]);
      }
      NSLog(@"Results of Query%@c",results);
    
    NSMutableArray *data = [NSMutableArray arrayWithCapacity:1];

      
      [results enumerateStatisticsFromDate:startDate
                                    toDate:endDate
      withBlock:^(HKStatistics *result, BOOL *stop) {
                                
                                     HKQuantity *quantity = result.sumQuantity;
                                     if (quantity) {
                                       NSLog(@"Response Each%@c",result);
                                         NSDate *startDate = result.startDate;
                                         NSDate *endDate = result.endDate;
                                         HKQuantityType *type = result.quantityType;
                                        
                                         double value = [quantity doubleValueForUnit:[HKUnit countUnit]];
//                                       NSArray<HKSource *> *sources= result.sources; //Null value is there
                                         NSString *startDateString = [self buildISO8601StringFromDate:startDate];
                                         NSString *endDateString = [self buildISO8601StringFromDate:endDate];
//                                       NSLog(@"%@",sources); //Null value is there
                                         
                                         NSDictionary *elem = @{
                                                 @"steps" : @(value),
                                                 @"startDate" : startDateString,
                                                 @"endDate":endDateString,
                                                 @"type":type,
                                         };
                                         [data addObject:elem];
                                     };

                                 }];
    callback(@[[NSNull null], data]);
  };

  [self.healthStore executeQuery:query];

}

- (NSString *)buildISO8601StringFromDate:(NSDate *)date
{
    @try {
        NSDateFormatter *dateFormatter = [NSDateFormatter new];
        NSLocale *posix = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
        dateFormatter.locale = posix;
        dateFormatter.dateFormat = @"yyyy'-'MM'-'dd'T'HH':'mm':'ss.SSSZ";
        return [dateFormatter stringFromDate:date];
    } @catch (NSException *exception) {
        NSLog(@"RNHealth: An error occured while trying parse ISO8601 string from date");
        return nil;
    }
}

- (NSDate *)dateFromOptions:(NSDictionary *)options key:(NSString *)key withDefault:(NSDate *)defaultValue {
  NSLog(@"dateFromOptions%@",options);
  NSString *dateString = [options objectForKey:key];
  
  NSDate *date;
  if(dateString != nil){
      date = [self parseISO8601DateFromString:dateString];
  }
  else {
      date = defaultValue;
  }
  return date;
}

- (NSDate *)parseISO8601DateFromString:(NSString *)date
{
    @try {
        NSDateFormatter *dateFormatter = [NSDateFormatter new];
        NSLocale *posix = [NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"];
        dateFormatter.locale = posix;
        dateFormatter.dateFormat = @"yyyy'-'MM'-'dd'T'HH':'mm':'ss.SSSZ";
        return [dateFormatter dateFromString:date];
    } @catch (NSException *exception) {
        NSLog(@"RNHealth: An error occured while trying parse ISO8601 date from string");
        return nil;
    }
}

-  (NSUInteger)uintFromOptions:(NSDictionary *)options key:(NSString *)key withDefault:(NSUInteger)defaultValue {
  NSUInteger val;
  NSNumber *num = [options objectForKey:key];
  if(num != nil){
      val = [num unsignedIntValue];
  } else {
      val = defaultValue;
  }
  return val;
}


- (void)fetchBloodPressureSamples:(NSDictionary *)input callback:(RCTResponseSenderBlock)callback{
  HKCorrelationType *bloodPressureCorrelationType = [HKCorrelationType correlationTypeForIdentifier:HKCorrelationTypeIdentifierBloodPressure];
     HKQuantityType *systolicType = [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierBloodPressureSystolic];
     HKQuantityType *diastolicType = [HKQuantityType quantityTypeForIdentifier:HKQuantityTypeIdentifierBloodPressureDiastolic];
  
}

- (void)fetchSleepCategorySamplesForPredicate:(NSPredicate *)predicate
                                        limit:(NSUInteger)lim
                                    ascending:(BOOL)asc
                                   completion:(void (^)(NSArray *, NSError *))completion {

    NSSortDescriptor *timeSortDescriptor = [[NSSortDescriptor alloc] initWithKey:HKSampleSortIdentifierEndDate
                                                                       ascending:asc];


    // declare the block
    void (^handlerBlock)(HKSampleQuery *query, NSArray *results, NSError *error);
    // create and assign the block
    handlerBlock = ^(HKSampleQuery *query, NSArray *results, NSError *error) {
        if (!results) {
            if (completion) {
                completion(nil, error);
            }
            return;
        }

        if (completion) {
            NSMutableArray *data = [NSMutableArray arrayWithCapacity:1];

            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{

                for (HKCategorySample *sample in results) {
                    NSInteger val = sample.value;

                    NSString *startDateString = [self buildISO8601StringFromDate:sample.startDate];
                    NSString *endDateString = [self buildISO8601StringFromDate:sample.endDate];

                    NSString *valueString;

                    switch (val) {
                      case HKCategoryValueSleepAnalysisInBed:
                        valueString = @"INBED";
                      break;
                      case HKCategoryValueSleepAnalysisAsleep:
                        valueString = @"ASLEEP";
                      break;
                     default:
                        valueString = @"UNKNOWN";
                     break;
                  }

                    NSDictionary *elem = @{
                            @"id" : [[sample UUID] UUIDString],
                            @"value" : valueString,
                            @"startDate" : startDateString,
                            @"endDate" : endDateString,
                            @"sourceName" : [[[sample sourceRevision] source] name],
                            @"sourceId" : [[[sample sourceRevision] source] bundleIdentifier],
                    };

                    [data addObject:elem];
                }

                completion(data, error);
            });
        }
    };

    HKCategoryType *categoryType =
    [HKObjectType categoryTypeForIdentifier:HKCategoryTypeIdentifierSleepAnalysis];

    HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType:categoryType
                                                          predicate:predicate
                                                              limit:lim
                                                    sortDescriptors:@[timeSortDescriptor]
                                                     resultsHandler:handlerBlock];

    [self.healthStore executeQuery:query];
}

@end
