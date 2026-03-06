const decodeBase64 = (str) => Buffer.from(str, 'base64').toString('utf8');

const problematicString = "U2NyZWVuc2hvdCAyMDI2LTAxLTE1IDA5MTA1Ny5wbmc=";
const decoded = decodeBase64(problematicString);

console.log("Original:", problematicString);
console.log("Decoded:", decoded);

if (decoded === "Screenshot 2026-01-15 091057.png") {
    console.log("SUCCESS: Decoding works as expected.");
} else {
    console.log("FAILURE: Decoding produced unexpected result.");
}
