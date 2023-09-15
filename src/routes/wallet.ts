/**
 * A route to create wallets for users
 */

import express from "express"

import {
  createWallet,
  getWalletAddress,
  getWalletBalance,
  addAddressToAlchemyNotify,
} from "../controllers/wallet"
import { calculateTipsAmount, transferTips } from "../controllers/tips"
import { auth } from "../middlewares/auth"

export const walletRouter = express.Router()

walletRouter.get("/balance/:address", getWalletBalance)
walletRouter.get("/address", auth, getWalletAddress)
walletRouter.post("/create", auth, createWallet)
walletRouter.post("/tips/calculate", calculateTipsAmount) // No auth required
walletRouter.post("/tips/send", auth, transferTips) // Required auth
walletRouter.post("/notify/add", auth, addAddressToAlchemyNotify) // Required auth
