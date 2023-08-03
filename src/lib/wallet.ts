import { ethers } from "ethers"
import crypto from "crypto"

import { encrypt } from "./kms"
import { encryptString } from "./utils"
import type { Environment } from "../types"

const {
  LOCAL_BLOCKCHAIN_URL,
  NODE_ENV,
  ALCHEMY_API_KEY,
  ETHERSCAN_API_KEY,
  INFURA_API_KEY,
} = process.env
const env = (NODE_ENV || "development") as Environment

export function getProvider() {
  return env === "development"
    ? new ethers.JsonRpcProvider(LOCAL_BLOCKCHAIN_URL!)
    : ethers.getDefaultProvider(
        env === "production" ? "homestead" : "sepolia",
        {
          etherscan: ETHERSCAN_API_KEY,
          infura: INFURA_API_KEY,
          alchemy: ALCHEMY_API_KEY,
        }
      )
}

export function getSigner(privateKey: string) {
  const provider = getProvider()

  return new ethers.Wallet(privateKey, provider)
}

/**
 * Provider Contract is for read-only
 */
export function getContractRead({
  address,
  contractInterface,
}: {
  address: string
  contractInterface: ethers.InterfaceAbi
}) {
  const provider = getProvider()

  return new ethers.Contract(address, contractInterface, provider)
}

/**
 * For write functionalities use Signer Contract
 */
export function getContractWrite({
  address,
  privateKey,
  contractInterface,
}: {
  address: string
  privateKey: string
  contractInterface: ethers.InterfaceAbi
}) {
  const signer = getSigner(privateKey)

  return new ethers.Contract(address, contractInterface, signer)
}

/**
 * @dev get balance of a specific address
 *
 */
export async function getBalance(address: string) {
  const provider = getProvider()

  const balanceInWei = await provider.getBalance(address)

  return ethers.formatEther(balanceInWei)
}

/**
 * @dev Generate wallet and return the encrypted key (For development env)
 *
 */
export async function generateWalletDev() {
  // // Use this address/key for user1 for local blockchain
  // const address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  // const key =
  //   "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"

  // // Use this address/key for user2 for local blockchain
  // const address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  // const key =
  //   "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"

  // // Use this address/key for user3 for local blockchain
  // const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  // const key =
  //   "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

  // // Use this address/key for user4 for local blockchain
  // const address = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
  // const key =
  //   "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a"

  // // Use this address/key for user5 for local blockchain
  // const address = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
  // const key =
  //   "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"

  // // Use this address/key for user6 for local blockchain
  // const address = "0x976EA74026E726554dB657fA54763abd0C3a0aa9"
  // const key =
  //   "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e"

  // // Use this address/key for user7 for local blockchain
  // const address = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"
  // const key =
  //   "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356"

  // // Use this address/key for user8 for local blockchain
  // const address = "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
  // const key =
  //   "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97"

  // Use this address/key for user9 for local blockchain
  const address = "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720"
  const key =
    "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6"

  // First encrypt with internal key
  const firstEncryptedKey = encryptString(key)

  // Encrypt the encrypted key with GCP cloud kms
  const encryptedKey = await encrypt(firstEncryptedKey)

  return { key: encryptedKey, address }
}

/**
 * @dev Generate wallet and return the encrypted key
 *
 */
export async function generateWallet() {
  const randomBytes = crypto.randomBytes(32).toString("hex")

  // Generate private key
  const key = `0x${randomBytes}`

  // Generate wallet from private key
  const { address } = new ethers.Wallet(key)

  // First encrypt key with internal key
  const firstEncryptedKey = encryptString(key)

  // Encrypt the first encrypted key with GCP cloud kms
  const encryptedKey = await encrypt(firstEncryptedKey)

  return { key: encryptedKey, address }
}
