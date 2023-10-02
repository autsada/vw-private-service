import { ethers } from "ethers"

import { publishMessage } from "../pubsub"
import TipContract from "../abi/testnet/Tips.json"
import type { VwTips } from "../typechain-types"

const { SEND_TIPS_TOPIC, ALCHEMY_API_KEY } = process.env

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
      async (
        senderId,
        receiverId,
        publishId,
        from,
        receiverAddress,
        amount,
        fee
      ) => {
        const data = {
          senderId,
          receiverId,
          publishId,
          from,
          to: receiverAddress,
          amount: ethers.formatEther(amount),
          fee: ethers.formatEther(fee),
        }

        await publishMessage(SEND_TIPS_TOPIC!, JSON.stringify(data))
      }
    )
  } catch (error) {
    console.log("error -->", error)
    console.error(error)
  }
}
