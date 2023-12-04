import crypto from 'crypto';

const sha1 = (data: string): string => {
    const hash = crypto.createHash('sha1');
    hash.update(data);
    return hash.digest('hex');
}

const generateToken = (): string => {
    return crypto.randomUUID();
}

class RSAEncryption {
    publicKey: CryptoKey | null = null;
    privateKey: CryptoKey | null = null;

    async generateKeyPair(): Promise<void> {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
        );
        this.publicKey = keyPair.publicKey;
        this.privateKey = keyPair.privateKey;
    }

    async exportPublicKey(): Promise<ArrayBuffer> {
        return await crypto.subtle.exportKey(
            "spki",
            this.publicKey as CryptoKey
        );
    }

    async exportPrivateKey(): Promise<ArrayBuffer> {
        return await crypto.subtle.exportKey(
            "pkcs8",
            this.privateKey as CryptoKey
        );
    }

    async importPublicKey(publicKey: ArrayBuffer): Promise<void> {
        this.publicKey = await crypto.subtle.importKey(
            "spki",
            publicKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["encrypt"]
        );
    }

    async importPrivateKey(privateKey: ArrayBuffer): Promise<void> {
        this.privateKey = await crypto.subtle.importKey(
            "pkcs8",
            privateKey,
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            true,
            ["decrypt"]
        );
    }

    async encryptData(data: ArrayBuffer): Promise<ArrayBuffer> {
        return await crypto.subtle.encrypt(
            {
                name: "RSA-OAEP"
            },
            this.publicKey as CryptoKey,
            data
        );
    }

    async decryptData(encryptedData: ArrayBuffer): Promise<ArrayBuffer> {
        return await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            this.privateKey as CryptoKey,
            encryptedData
        );
    }
}

export default { sha1, generateToken, RSAEncryption };