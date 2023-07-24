/**
 * A Router to verify id token and returns user's uid
 */

import express from "express"

import { checkAuth } from "../controllers/auth"
import { auth } from "../middlewares/auth"

export const authRouter = express.Router()

authRouter.get("/verify", auth, checkAuth)
