#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSFontManager *fontManager = [NSFontManager sharedFontManager];
        NSArray *fontFamilyNames = [[fontManager availableFontFamilies] sortedArrayUsingSelector:@selector(compare:)];

        printf("[\n");

        for (NSUInteger i = 0; i < [fontFamilyNames count]; i++) {
            NSString *familyName = [fontFamilyNames objectAtIndex:i];

            NSArray *fontMembers = [fontManager availableMembersOfFontFamily:familyName];
            NSString *postScriptName = familyName;
            if (fontMembers && fontMembers.count > 0) {
                postScriptName = [[fontMembers objectAtIndex:0] objectAtIndex:0];
            }

            NSString *weight = @"regular";
            NSString *style = @"normal";
            NSString *width = @"normal";
            NSString *monospace = @"false";

            NSFont *font = [NSFont fontWithName:postScriptName size:12.0];
            if (font) {
                NSFontDescriptor *descriptor = [font fontDescriptor];
                NSFontSymbolicTraits traits = [descriptor symbolicTraits];

                if (traits & NSFontMonoSpaceTrait) {
                    monospace = @"true";
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

            printf("  {\n");
            printf("    \"familyName\": \"%s\",\n", [familyName UTF8String]);
            printf("    \"postScriptName\": \"%s\",\n", [postScriptName UTF8String]);
            printf("    \"weight\": \"%s\",\n", [weight UTF8String]);
            printf("    \"style\": \"%s\",\n", [style UTF8String]);
            printf("    \"width\": \"%s\",\n", [width UTF8String]);
            printf("    \"monospace\": %s\n", [monospace UTF8String]);
            printf(i < [fontFamilyNames count] - 1 ? "  },\n" : "  }\n");
        }

        printf("]\n");
    }
    return 0;
}
