// Generate a random AES key for the actual data
// Encrypt the data with AES
// Encrypt the AES key with RSA public key
// stor bothe the encrypted AES key and the encrypted data
// Decrypt AEs key with RSA private key then decrypt the data  with the key
// Generate RSA key pair for your app
async function generateRSAKeys() {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );
    return keyPair;
}

// Export / Import helpers
async function exportKey(key) {
    const exported = await crypto.subtle.exportKey("spki" in key ? "spki" : "pkcs8", key);
    return arrayBufferToBase64(exported);
}

async function importPublicKey(spkiBase64) {
    const binary = Uint8Array.from(atob(spkiBase64), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
        "spki",
        binary.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );
}

async function importPrivateKey(pkcs8Base64) {
    const binary = Uint8Array.from(atob(pkcs8Base64), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
        "pkcs8",
        binary.buffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["decrypt"]
    );
}

// AES helper
async function generateAESKey() {
    return crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

async function encryptAES(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );
    return { iv: Array.from(iv), cipher: arrayBufferToBase64(cipherBuffer) };
}

async function decryptAES(encrypted, key) {
    const iv = new Uint8Array(encrypted.iv);
    const cipherBytes = Uint8Array.from(atob(encrypted.cipher), c => c.charCodeAt(0));
    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherBytes
    );
    return JSON.parse(new TextDecoder().decode(plainBuffer));
}

// Encrypt data with hybrid RSA + AES
async function encryptDataHybrid(data, rsaPublicKey) {
    // 1️⃣ Generate AES key
    const aesKey = await generateAESKey();

    // 2️⃣ Encrypt data with AES
    const encryptedData = await encryptAES(data, aesKey);

    // 3 Export AES key and encrypt it with RSA
    const rawAES = await crypto.subtle.exportKey("raw", aesKey);
    const encryptedAESKeyBuffer = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        rsaPublicKey,
        rawAES
    );

    return {
        encryptedKey: arrayBufferToBase64(encryptedAESKeyBuffer),
        data: encryptedData
    };
}

// Decrypt hybrid
async function decryptDataHybrid(encryptedObj, rsaPrivateKey) {
    // 1️⃣ Decrypt AES key with RSA private key
    const encryptedAESKeyBytes = Uint8Array.from(atob(encryptedObj.encryptedKey), c => c.charCodeAt(0));
    const rawAES = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        rsaPrivateKey,
        encryptedAESKeyBytes
    );

    const aesKey = await crypto.subtle.importKey(
        "raw",
        rawAES,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
    );

    // Decrypt data with AES key
    return await decryptAES(encryptedObj.data, aesKey);
}

// Helper: ArrayBuffer -> Base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000; // 32KB
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
}



/// Provide keys and implement the encryption and decrypption for rmy storage handler.
// (async () => {
//     //  Generate keys
//     const { publicKey, privateKey } = await generateRSAKeys();
//
//     const message = { secret: "Hello RSA + AES!" };
//
//     // Encrypt
//     const encrypted = await encryptDataHybrid(message, publicKey);
//     console.log("Encrypted:", encrypted);
//
//     // 3 Decrypt
//     const decrypted = await decryptDataHybrid(encrypted, privateKey);
//     console.log("Decrypted:", decrypted);
// })();


