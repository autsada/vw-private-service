import type { Request, Response, NextFunction } from "express"
import { ethers } from "ethers"

import { getWallet } from "../firebase/helpers"
import { calculateTips, sendTips } from "../lib/tips"
import { decrypt } from "../lib/kms"
import { SendTipsInput } from "../types"
import { authError } from "../lib/constants"

/**
 * A route to calculate tips amount in ETH from a given usd.
 */
export async function calculateTipsAmount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { qty } = req.body as { qty: string }
    // Validate input.
    if (!qty || typeof Number(qty) !== "number")
      throw new Error("Invalid input")

    const tips = await calculateTips(Number(qty))

    res.status(200).json({ tips: ethers.formatEther(tips) })
  } catch (error) {
    next(error)
  }
}

/**
 * A route to send tips to station owner.
 */
export async function transferTips(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req
    // Validate auth.
    if (!uid) throw new Error(authError)

    const { to, qty } = req.body as SendTipsInput["data"]
    // Validate input.
    if (!to || !qty || typeof Number(qty) !== "number")
      throw new Error("Invalid input")

    // Get encrypted key
    const { key: encryptedKey } = await getWallet(uid)
    // Decrypt the key
    const key = await decrypt(encryptedKey)

    // Mint a DiiR NFT
    const result = await sendTips({
      key,
      data: {
        to,
        qty: Number(qty),
      },
    })

    res.status(200).json({ result })
  } catch (error) {
    next(error)
  }
}
