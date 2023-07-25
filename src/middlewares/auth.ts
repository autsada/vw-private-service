import { Request, Response, NextFunction } from "express"

import { verifyIdToken } from "../firebase/helpers"

const { ADMIN_EMAIL } = process.env

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get Firebase auth id token.
    const idToken = req.headers["id-token"]
    if (!idToken || typeof idToken !== "string") {
      res.status(401).send("Un Authorized")
    } else {
      const user = await verifyIdToken(idToken)
      req.uid = user?.uid
      req.isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL?.toLowerCase()
      next()
    }
  } catch (error) {
    next(error)
  }
}
