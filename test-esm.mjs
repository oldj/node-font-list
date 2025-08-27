/**
 * Test ES module import method
 */

import { getFonts, getFonts2 } from './index.mjs';

async function testESM() {
  console.log('=== ES Module Test ===');
  
  try {
    console.log('Testing getFonts...');
    const fonts = await getFonts();
    console.log(`✓ getFonts succeeded, got ${fonts.length} fonts`);
    console.log('First 5 fonts:', fonts.slice(0, 5));
  } catch (error) {
    console.error('✗ getFonts failed:', error.message);
  }
  
  try {
    console.log('\nTesting getFonts2...');
    const detailedFonts = await getFonts2();
    console.log(`✓ getFonts2 succeeded, got ${detailedFonts.length} detailed font info`);
    console.log('First 3 detailed fonts:', detailedFonts.slice(0, 3));
  } catch (error) {
    console.error('✗ getFonts2 failed:', error.message);
  }
}

testESM().catch(console.error);