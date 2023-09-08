import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../.env") })
import express from "express"
import cors from "cors"
import http from "http"

import "./firebase/config"
import * as router from "./routes"
import { errorHandler } from "./middlewares/error"

const { PORT } = process.env
const port = Number(PORT || 8000)

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

app.use("/wallet", router.walletRouter)
app.use("/auth", router.authRouter)
app.use("/pubsub", router.pubsubRouter)
app.use(errorHandler)

// Create the HTTP server
const httpServer = http.createServer(app)

httpServer.listen({ port }, () => {
  console.log(`Server ready at port: ${port}`)
})
