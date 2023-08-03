import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import http from "http"

import "./firebase/config"
import "./listensers"
import * as router from "./routes"
import { errorHandler } from "./middlewares/error"
import { createIdTokenfromCustomToken } from "./firebase/helpers"

const { PORT } = process.env

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

/**
 * This route is for testing only
 */
// =============
app.get("/id-token", async (req, res, next) => {
  try {
    const { uid } = req.body as { uid: string }
    const result = await createIdTokenfromCustomToken(uid)

    res.status(200).json({ token: result })
  } catch (error) {
    console.log("error: ", error)
    next(error)
  }
})
// =============

app.use("/wallet", router.walletRouter)
app.use("/auth", router.authRouter)
app.use(errorHandler)

// Create the HTTP server
const httpServer = http.createServer(app)

httpServer.listen({ port: PORT || 8000 }, () => {
  console.log(`Server ready at port: ${PORT}`)
})
