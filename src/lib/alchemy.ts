import axios from "axios"

const { ALCHEMY_NOTIFY_URL, ALCHEMY_WEBHOOK_ID, ALCHEMY_WEBHOOK_AUTH_TOKEN } =
  process.env

export async function addAddress(address: string) {
  return axios({
    url: ALCHEMY_NOTIFY_URL!,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-alchemy-token": ALCHEMY_WEBHOOK_AUTH_TOKEN || "",
    },
    data: {
      webhook_id: ALCHEMY_WEBHOOK_ID,
      addresses_to_add: [address],
      addresses_to_remove: [],
    },
  })
}
