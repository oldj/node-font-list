#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSFontManager *fontManager = [NSFontManager sharedFontManager];
        NSArray *fontFamilyNames = [[fontManager availableFontFamilies] sortedArrayUsingSelector:@selector(compare:)];
        
        printf("[\n");
        
        for (NSUInteger i = 0; i < [fontFamilyNames count]; i++) {
            NSString *familyName = [fontFamilyNames objectAtIndex:i];
            
            // Get all fonts in this font family
            NSArray *fontNames = [fontManager availableMembersOfFontFamily:familyName];
            
            NSString *postScriptName = familyName;
            if (fontNames && fontNames.count > 0) {
                NSArray *fontInfo = [fontNames objectAtIndex:0];
                postScriptName = [fontInfo objectAtIndex:0];
            }
            
            // Simple attribute detection based on font name
            NSString *weight = @"regular";
            NSString *style = @"normal";
            NSString *width = @"normal";
            NSString *monospace = @"false";
            
            // Basic weight detection from font name
            NSString *lowerName = [postScriptName lowercaseString];
            if ([lowerName containsString:@"ultralight"] || [lowerName containsString:@"thin"]) {
                weight = @"ultralight";
            } else if ([lowerName containsString:@"light"]) {
                weight = @"light";
            } else if ([lowerName containsString:@"medium"]) {
                weight = @"medium";
            } else if ([lowerName containsString:@"semibold"] || [lowerName containsString:@"demibold"]) {
                weight = @"semibold";
            } else if ([lowerName containsString:@"bold"]) {
                weight = @"bold";
            } else if ([lowerName containsString:@"heavy"] || [lowerName containsString:@"black"]) {
                weight = @"heavy";
            }
            
            // Basic style detection
            if ([lowerName containsString:@"italic"] || [lowerName containsString:@"oblique"]) {
                style = @"italic";
            }
            
            // Basic width detection
            if ([lowerName containsString:@"condensed"] || [lowerName containsString:@"narrow"]) {
                width = @"condensed";
            } else if ([lowerName containsString:@"expanded"] || [lowerName containsString:@"extended"]) {
                width = @"expanded";
            }
            
            // Basic monospace detection
            if ([lowerName containsString:@"mono"] || [lowerName containsString:@"courier"] || 
                [lowerName containsString:@"console"] || [lowerName containsString:@"terminal"] ||
                [lowerName containsString:@"fixed"] || [lowerName containsString:@"typewriter"] ||
                [lowerName containsString:@"source"] || [lowerName containsString:@"code"] ||
                [lowerName containsString:@"fira"] || [lowerName containsString:@"jetbrains"] ||
                [lowerName containsString:@"menlo"] || [lowerName containsString:@"monaco"]) {
                monospace = @"true";
            }
            
            // Output JSON manually
            printf("  {\n");
            printf("    \"familyName\": \"%s\",\n", [familyName UTF8String]);
            printf("    \"postScriptName\": \"%s\",\n", [postScriptName UTF8String]);
            printf("    \"weight\": \"%s\",\n", [weight UTF8String]);
            printf("    \"style\": \"%s\",\n", [style UTF8String]);
            printf("    \"width\": \"%s\",\n", [width UTF8String]);
            printf("    \"monospace\": %s\n", [monospace UTF8String]);
            
            if (i < [fontFamilyNames count] - 1) {
                printf("  },\n");
            } else {
                printf("  }\n");
            }
        }
        
        printf("]\n");
    }
    return 0;
}