// --- Encryption Utility ---
const SECRET_KEY = "tatua-secret-key";

async function getKey() {
    const enc = new TextEncoder();
    return crypto.subtle.importKey(
        "raw",
        enc.encode(SECRET_KEY),
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
}

async function encryptData(data) {
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));

    const cipherBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );

    return {
        iv: Array.from(iv),
        cipher: arrayBufferToBase64(cipherBuffer)
    };
}

async function decryptData(encrypted) {
    const key = await getKey();
    const iv = new Uint8Array(encrypted.iv);
    const cipherBytes = Uint8Array.from(atob(encrypted.cipher), c => c.charCodeAt(0));

    const plainBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        cipherBytes
    );

    const decoded = new TextDecoder().decode(plainBuffer);

    // Return the original object/array
    return JSON.parse(decoded);
}
