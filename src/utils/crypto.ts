import * as Crypto from "expo-crypto";


export async function hashString(value: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value
  );
}
