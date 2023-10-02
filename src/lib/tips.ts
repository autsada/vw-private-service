/**
 * For use to interact with the VwTips Contract.
 */

import { ethers } from "ethers"

import { getContractWrite, getContractRead } from "./wallet"
import TipsDev from "../abi/localhost/Tips.json"
import TipsTest from "../abi/testnet/Tips.json"
import type { VwTips } from "../typechain-types"
import type { TipsTransferredEvent } from "../typechain-types/contracts/VwTips"
import { Role, CheckRoleParams, Environment, SendTipsInput } from "../types"

const { NODE_ENV } = process.env
const env = NODE_ENV as Environment

/**
 * Get the conract for write.
 * @param key a wallet private key
 */
export function contractWrite(key: string) {
  const contract = getContractWrite({
    privateKey: key,
    address: env === "test" ? TipsTest.address : TipsDev.address,
    contractInterface: env === "test" ? TipsTest.abi : TipsDev.abi,
  }) as unknown as VwTips

  return contract
}

/**
 * Get the contract for read
 */
export function contractRead() {
  const contract = getContractRead({
    address: env === "test" ? TipsTest.address : TipsDev.address,
    contractInterface: env === "test" ? TipsTest.abi : TipsDev.abi,
  }) as unknown as VwTips

  return contract
}

/**
 * The function to check caller's role.
 * @dev see CheckRoleParams
 * @return hasRole {boolean}
 */
export async function checkUserRole({ role, address, key }: CheckRoleParams) {
  const profileContract = contractWrite(key)
  const formattedBytes =
    role === Role.DEFAULT
      ? ethers.encodeBytes32String("")
      : ethers.keccak256(ethers.toUtf8Bytes(role))
  const hasGivenRole = await profileContract.hasRole(formattedBytes, address)

  return hasGivenRole
}

/**
 * The function to calculate tips in wei for the given usd amount
 * @param qty
 */
export async function calculateTips(qty: number) {
  const contract = contractRead()
  const tips = await contract.calculateTips(qty)

  return tips
}

/**
 * The function to send tips.
 * @param input
 */
export async function sendTips(input: SendTipsInput) {
  const {
    key,
    data: { senderId, receiverId, publishId, to, qty },
  } = input
  const contract = contractWrite(key)

  // Calculate tips amount for the given quantity
  const tips = await calculateTips(qty)
  const txn = await contract.tip(
    {
      senderId,
      receiverId,
      publishId,
      to: to.toLowerCase(),
      qty,
    },
    {
      value: tips,
    }
  )
  const txnRct = await txn.wait()
  const event = txnRct?.logs[0] as ethers.EventLog

  if (!event) return null

  const args = event.args
  if (!args) return null

  const [_, __, ___, from, receiver, amount, fee] =
    args as unknown as TipsTransferredEvent.OutputTuple

  return {
    from,
    to: receiver,
    amount: ethers.formatEther(amount),
    fee: ethers.formatEther(fee),
  }
}
