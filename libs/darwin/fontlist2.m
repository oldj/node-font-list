#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSFontManager *fontManager = [NSFontManager sharedFontManager];
        NSArray *fontFamilyNames = [[fontManager availableFontFamilies] sortedArrayUsingSelector:@selector(compare:)];
        
        NSMutableArray *fontInfoArray = [[NSMutableArray alloc] init];
        
        for (NSString *familyName in fontFamilyNames) {
            // 获取该字体族的所有字体
            NSArray *fontNames = [fontManager availableMembersOfFontFamily:familyName];
            
            if (fontNames && fontNames.count > 0) {
                // 取第一个字体作为代表
                NSArray *fontInfo = [fontNames objectAtIndex:0];
                NSString *postScriptName = [fontInfo objectAtIndex:0];
                
                // 创建字体信息字典
                NSDictionary *fontDict = @{
                    @"familyName": familyName,
                    @"postScriptName": postScriptName
                };
                
                [fontInfoArray addObject:fontDict];
            } else {
                // 如果没有找到具体字体，尝试创建一个默认字体
                NSFont *font = [NSFont fontWithName:familyName size:12.0];
                if (font) {
                    NSDictionary *fontDict = @{
                        @"familyName": familyName,
                        @"postScriptName": font.fontName
                    };
                    [fontInfoArray addObject:fontDict];
                } else {
                    // 如果都失败了，只返回 familyName
                    NSDictionary *fontDict = @{
                        @"familyName": familyName,
                        @"postScriptName": familyName
                    };
                    [fontInfoArray addObject:fontDict];
                }
            }
        }
        
        // 输出 JSON 格式
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