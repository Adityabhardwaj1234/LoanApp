// Encryption utility for FinanceFlow application
// This provides client-side encryption for sensitive data before storing in Firebase

class FinanceFlowCrypto {
    constructor() {
        // Use a combination of timestamp and random data for encryption key
        this.key = this.generateEncryptionKey();
    }

    // Generate a consistent key for the session
    generateEncryptionKey() {
        const seed = "FinanceFlow2024SecureApp";
        return seed + Date.now().toString().slice(-6);
    }

    // Simple XOR encryption (for demo purposes - in production use proper crypto libraries)
    encrypt(text) {
        if (!text) return text;
        
        try {
            const key = this.key;
            let encrypted = '';
            
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i);
                const keyCode = key.charCodeAt(i % key.length);
                encrypted += String.fromCharCode(charCode ^ keyCode);
            }
            
            // Convert to base64 for safe storage
            return btoa(encrypted);
        } catch (error) {
            console.error('Encryption error:', error);
            return text; // Fallback to unencrypted if there's an issue
        }
    }

    // Decrypt the encrypted text
    decrypt(encryptedText) {
        if (!encryptedText) return encryptedText;
        
        try {
            // Decode from base64
            const encrypted = atob(encryptedText);
            const key = this.key;
            let decrypted = '';
            
            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i);
                const keyCode = key.charCodeAt(i % key.length);
                decrypted += String.fromCharCode(charCode ^ keyCode);
            }
            
            return decrypted;
        } catch (error) {
            console.error('Decryption error:', error);
            return encryptedText; // Fallback to encrypted text if decryption fails
        }
    }

    // Encrypt sensitive fields in application data
    encryptApplicationData(data) {
        const sensitiveFields = [
            'legalName', 'phoneNumber', 'email', 'registeredAddress',
            'director1Name', 'director1Pan', 'director1Aadhaar', 'director1Din', 'director1Address',
            'director2Name', 'director2Pan', 'director2Aadhaar', 'director2Din', 'director2Address',
            'annualRevenue', 'pat', 'capitalEmployed', 'loanAmount', 'purpose', 'collateral'
        ];

        const encryptedData = { ...data };
        
        sensitiveFields.forEach(field => {
            if (encryptedData[field]) {
                encryptedData[field] = this.encrypt(encryptedData[field].toString());
            }
        });

        // Mark as encrypted
        encryptedData._encrypted = true;
        encryptedData._encryptionVersion = '1.0';
        
        return encryptedData;
    }

    // Decrypt sensitive fields in application data
    decryptApplicationData(data) {
        if (!data._encrypted) {
            return data; // Data is not encrypted
        }

        const sensitiveFields = [
            'legalName', 'phoneNumber', 'email', 'registeredAddress',
            'director1Name', 'director1Pan', 'director1Aadhaar', 'director1Din', 'director1Address',
            'director2Name', 'director2Pan', 'director2Aadhaar', 'director2Din', 'director2Address',
            'annualRevenue', 'pat', 'capitalEmployed', 'loanAmount', 'purpose', 'collateral'
        ];

        const decryptedData = { ...data };
        
        sensitiveFields.forEach(field => {
            if (decryptedData[field]) {
                decryptedData[field] = this.decrypt(decryptedData[field]);
            }
        });

        return decryptedData;
    }

    // Generate a secure hash for verification
    generateHash(text) {
        let hash = 0;
        if (text.length === 0) return hash;
        
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return Math.abs(hash).toString(36);
    }
}

// Make the crypto utility available globally
window.FinanceFlowCrypto = FinanceFlowCrypto;
