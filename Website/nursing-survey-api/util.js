import dotenv from 'dotenv';
import CryptoES from 'crypto-es';
import crypto from 'crypto';
const AES = CryptoES.AES;
const enc = CryptoES.enc;


dotenv.config();
// const KEY = enc.Utf8.parse(crypto.randomBytes(64).toString("base64"));
const KEY = process.env.SECRET_KEY;
const IV = enc.Utf8.parse(crypto.randomBytes(64).toString("base64"));


export const encrypt = plainText => {
    const AESCipher = AES.encrypt(plainText, KEY, { iv: IV });
    return AESCipher.toString();
};

export const decrypt = AESCipher => {
    const AESCipherText = AES.decrypt(AESCipher, KEY, { iv: IV });
    return AESCipherText.toString(enc.Latin1);
};