import CryptoJs from "crypto-js"

const { ENCRYPT_KEY } = process.env

export function encryptString(text: string): string {
  console.time("string-encrypt")
  const encrypted = CryptoJs.AES.encrypt(text, ENCRYPT_KEY!).toString()

  console.timeEnd("string-encrypt")
  return encrypted
}

export function decryptString(text: string) {
  const bytes = CryptoJs.AES.decrypt(text, ENCRYPT_KEY!)

  return bytes.toString(CryptoJs.enc.Utf8)
}

export function throwError(code: number, message: string) {
  throw { status: code, message }
}

/**
 * A helper function to wait
 * @param time milliseconds
 */
export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
