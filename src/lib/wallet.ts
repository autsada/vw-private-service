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
  // Use this address/key for user1 for local blockchain
  const address = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  const key =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"

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
