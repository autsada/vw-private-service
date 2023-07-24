import { Request, Response, NextFunction } from "express"

import { verifyIdToken } from "../firebase/helpers"

export async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get Firebase auth id token.
    const idToken = req.headers["id-token"]
    if (!idToken || typeof idToken !== "string") {
      res.status(401).send("Un Authorized")
    } else {
      const user = await verifyIdToken(idToken)
      req.uid = user?.uid
      next()
    }
  } catch (error) {
    next(error)
  }
}
