//#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSFontManager *fontManager = [NSFontManager sharedFontManager];
        NSArray *fontFamilyNames = [[fontManager availableFontFamilies] sortedArrayUsingSelector:@selector(compare:)];

        for (NSString *familyName in fontFamilyNames) {
            printf("%s\n", [familyName UTF8String]);
        }
    }
    return 0;
}
