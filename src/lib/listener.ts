import { ethers } from "ethers"

import { publishMessage } from "../pubsub"
import TipContract from "../abi/testnet/Tips.json"
import { encryptString } from "./utils"
import type { VwTips } from "../typechain-types"

const { SEND_TIPS_TOPIC, ALCHEMY_API_KEY, PUBSUB_ENCRYPT_KEY } = process.env

export function eventListener() {
  try {
    console.log("listening...")
    const provider = new ethers.WebSocketProvider(
      `wss://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    )

    const contract = new ethers.Contract(
      TipContract.address,
      TipContract.abi,
      provider
    ) as unknown as VwTips

    contract.on(
      contract.getEvent("TipsTransferred"),
      async (tipId, from, receiverAddress, amount, fee) => {
        const data = {
          tipId,
          from,
          to: receiverAddress,
          amount: ethers.formatEther(amount),
          fee: ethers.formatEther(fee),
        }

        const encryptedData = encryptString(
          JSON.stringify(data),
          PUBSUB_ENCRYPT_KEY
        )

        await publishMessage(SEND_TIPS_TOPIC!, encryptedData)
      }
    )
  } catch (error) {
    console.error(error)
  }
}
