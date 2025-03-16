const bcrypt = require('bcrypt');

const storedHash = "$2b$10$PH2TNoI6k6s1.g8mUtco5On7bJQucxfuoK/ycmDqkIRJZTrN6v93K"; 
async function hashPassword(password) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
const password = "Drake081069!";

(async () => {
    const enteredPassword = await hashPassword(password);

    bcrypt.compare(enteredPassword, storedHash, (err, isMatch) => {
        if (isMatch) {
            console.log("✅ Password is correct! User can log in.");
        } else {
            console.log("❌ Incorrect password.");
        }
    });
})();
