#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSFontManager *fontManager = [NSFontManager sharedFontManager];
        NSArray *fontFamilyNames = [[fontManager availableFontFamilies] sortedArrayUsingSelector:@selector(compare:)];
        
        NSMutableArray *fontInfoArray = [[NSMutableArray alloc] init];
        
        for (NSString *familyName in fontFamilyNames) {
            // Get all fonts in this font family
            NSArray *fontNames = [fontManager availableMembersOfFontFamily:familyName];
            
            if (fontNames && fontNames.count > 0) {
                // Use the first font as representative
                NSArray *fontInfo = [fontNames objectAtIndex:0];
                NSString *postScriptName = [fontInfo objectAtIndex:0];
                
                // Create font info dictionary
                NSDictionary *fontDict = @{
                    @"familyName": familyName,
                    @"postScriptName": postScriptName
                };
                
                [fontInfoArray addObject:fontDict];
            } else {
                // If no specific font found, try to create a default font
                NSFont *font = [NSFont fontWithName:familyName size:12.0];
                if (font) {
                    NSDictionary *fontDict = @{
                        @"familyName": familyName,
                        @"postScriptName": font.fontName
                    };
                    [fontInfoArray addObject:fontDict];
                } else {
                    // If all fails, return only familyName
                    NSDictionary *fontDict = @{
                        @"familyName": familyName,
                        @"postScriptName": familyName
                    };
                    [fontInfoArray addObject:fontDict];
                }
            }
        }
        
        // Output JSON format
        NSError *error;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:fontInfoArray
                                                           options:NSJSONWritingPrettyPrinted
                                                             error:&error];
        
        if (jsonData && !error) {
            NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
            printf("%s\n", [jsonString UTF8String]);
        } else {
            fprintf(stderr, "Error creating JSON: %s\n", [[error localizedDescription] UTF8String]);
            return 1;
        }
    }
    return 0;
}