/**
 * @param id {string} - a document id
 * @param key {string} - a blockchain wallet key (encrypted)
 * @param address {string} - a blockchain wallet address
 */
export type Wallet = {
  id: string
  key: string
  address: string
}

export type Environment = "development" | "test" | "production"
