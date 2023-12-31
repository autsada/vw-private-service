/**
 * Enum for contract's role.
 */
export enum Role {
  DEFAULT = "DEFAULT_ADMIN_ROLE",
  ADMIN = "ADMIN_ROLE",
  UPGRADER = "UPGRADER_ROLE",
}

export type CheckRoleParams = {
  role: Role
  address: string
  key: string
}

/**
 * Input data required to send tips to a profile.
 * @param key {string} - wallet's key
 * @param data.tipId {string} - a tip id in the database
 * @param data.to {string} - a receiver's wallet address
 * @param data.qty {number} - a quantity of the tips, for example 1 = 1 USD, 2 = 2 USDs
 */
export type SendTipsInput = {
  key: string
  data: {
    tipId: string
    to: string
    qty: number
  }
}
