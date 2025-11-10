import { Request, Response, NextFunction } from "express";

export default function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user; // user attached by auth middleware

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }

  next();
}
