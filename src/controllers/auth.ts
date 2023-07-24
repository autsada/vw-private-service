import type { Request, Response, NextFunction } from "express"

/**
 * @dev A function to verify id token and get Firebase auth user uid
 */
export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req

    res.status(200).json({ uid })
  } catch (error) {
    next(error)
  }
}
