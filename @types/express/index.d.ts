export {}

declare global {
  namespace Express {
    interface Request {
      uid?: string
      isAdmin?: boolean
    }
  }
}
