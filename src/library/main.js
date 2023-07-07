import aesRun from "./aesRun.js";

export const aes_key = Math.floor(
  Math.random() * (Math.pow(10, 33) - Math.pow(10, 32)) + Math.pow(10, 32)
);
const bit = 128;

export const encryptData = (text) => {
  return aesRun.encrypt(text, aes_key, bit);
};

export const decryptData = (cipher_text) => {
  return aesRun.decrypt(cipher_text, aes_key, bit);
};
