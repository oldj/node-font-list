#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <string.h>

static void printSimpleList(NSArray *fontFamilyNames) {
    for (NSString *familyName in fontFamilyNames) {
        printf("%s\n", [familyName UTF8String]);
    }
}

static void printDetailedJSON(NSArray *fontFamilyNames, NSFontManager *fontManager) {
    NSMutableArray *result = [NSMutableArray arrayWithCapacity:[fontFamilyNames count]];

    for (NSString *familyName in fontFamilyNames) {
        NSArray *fontMembers = [fontManager availableMembersOfFontFamily:familyName];
        NSString *postScriptName = familyName;
        NSString *memberStyleName = @"";
        unsigned int memberTraitMask = 0;
        if (fontMembers && fontMembers.count > 0) {
            NSArray *fontInfo = [fontMembers objectAtIndex:0];
            postScriptName = [fontInfo objectAtIndex:0];
            if ([fontInfo count] > 1) {
                memberStyleName = [fontInfo objectAtIndex:1];
            }
            if ([fontInfo count] > 3) {
                memberTraitMask = [[fontInfo objectAtIndex:3] unsignedIntValue];
            }
        }

        NSString *weight = @"regular";
        NSString *style = @"normal";
        NSString *width = @"normal";
        BOOL monospace = NO;

        NSFont *font = [NSFont fontWithName:postScriptName size:12.0];
        if (font) {
            NSFontDescriptor *descriptor = [font fontDescriptor];
            NSFontSymbolicTraits traits = [descriptor symbolicTraits];

            if (traits & NSFontMonoSpaceTrait) {
                monospace = YES;
            }
            if (traits & NSFontItalicTrait) {
                style = @"italic";
            }
            if (traits & NSFontCondensedTrait) {
                width = @"condensed";
            } else if (traits & NSFontExpandedTrait) {
                width = @"expanded";
            }

            NSDictionary *traitsDict = [descriptor objectForKey:NSFontTraitsAttribute];
            NSNumber *weightNum = traitsDict[NSFontWeightTrait];
            if (weightNum) {
                CGFloat w = [weightNum doubleValue];
                if (w <= -0.6)      weight = @"ultralight";
                else if (w <= -0.3) weight = @"light";
                else if (w <= 0.1)  weight = @"regular";
                else if (w <= 0.25) weight = @"medium";
                else if (w <= 0.35) weight = @"semibold";
                else if (w <= 0.5)  weight = @"bold";
                else                weight = @"heavy";
            }
        }

        NSString *fallbackName = [[NSString stringWithFormat:@"%@ %@ %@", familyName, postScriptName, memberStyleName] lowercaseString];
        if ([weight isEqualToString:@"regular"]) {
            if ([fallbackName containsString:@"ultralight"] || [fallbackName containsString:@"ultra light"] ||
                [fallbackName containsString:@"thin"]) {
                weight = @"ultralight";
            } else if ([fallbackName containsString:@"light"]) {
                weight = @"light";
            } else if ([fallbackName containsString:@"medium"]) {
                weight = @"medium";
            } else if ([fallbackName containsString:@"semibold"] || [fallbackName containsString:@"semi bold"] ||
                       [fallbackName containsString:@"demibold"] || [fallbackName containsString:@"demi bold"]) {
                weight = @"semibold";
            } else if ([fallbackName containsString:@"bold"] || (memberTraitMask & NSBoldFontMask)) {
                weight = @"bold";
            } else if ([fallbackName containsString:@"heavy"] || [fallbackName containsString:@"black"]) {
                weight = @"heavy";
            }
        }
        if ([style isEqualToString:@"normal"] &&
            ([fallbackName containsString:@"italic"] || [fallbackName containsString:@"oblique"] ||
             (memberTraitMask & NSItalicFontMask))) {
            style = @"italic";
        }
        if ([width isEqualToString:@"normal"]) {
            if ([fallbackName containsString:@"condensed"] || [fallbackName containsString:@"narrow"] ||
                (memberTraitMask & NSCondensedFontMask) || (memberTraitMask & NSNarrowFontMask)) {
                width = @"condensed";
            } else if ([fallbackName containsString:@"expanded"] || [fallbackName containsString:@"extended"] ||
                       (memberTraitMask & NSExpandedFontMask)) {
                width = @"expanded";
            }
        }

        [result addObject:@{
            @"familyName": familyName,
            @"postScriptName": postScriptName,
            @"weight": weight,
            @"style": style,
            @"width": width,
            @"monospace": @(monospace),
        }];
    }

    NSError *error = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:result
                                                   options:NSJSONWritingPrettyPrinted
                                                     error:&error];
    if (!data) {
        fprintf(stderr, "fontlist: failed to serialize JSON: %s\n",
                error ? [[error localizedDescription] UTF8String] : "unknown error");
        return;
    }
    fwrite([data bytes], 1, [data length], stdout);
    fputc('\n', stdout);
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        BOOL detailed = NO;
        for (int i = 1; i < argc; i++) {
            if (strcmp(argv[i], "--detail") == 0 || strcmp(argv[i], "-d") == 0) {
                detailed = YES;
            }
        }

        NSFontManager *fontManager = [NSFontManager sharedFontManager];
        NSArray *fontFamilyNames = [[fontManager availableFontFamilies] sortedArrayUsingSelector:@selector(compare:)];

        if (detailed) {
            printDetailedJSON(fontFamilyNames, fontManager);
        } else {
            printSimpleList(fontFamilyNames);
        }
    }
    return 0;
}
