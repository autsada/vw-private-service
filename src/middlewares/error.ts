import type { Request, Response, NextFunction } from "express"

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status =
    typeof err.status === "number"
      ? err.status
      : typeof err.statusCode === "number"
      ? err.statusCode
      : 500
  const message = err.message || "Something went wrong."

  console.error(err)
  res.status(status).json({ message })
}
