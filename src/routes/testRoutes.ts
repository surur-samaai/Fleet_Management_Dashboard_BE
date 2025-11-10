// src/routes/testRoutes.ts
import { Router } from "express";
import { db } from "../firebase";

const router = Router();

router.get("/firebase-test", async (req, res) => {
  try {
    const ref = db.collection("test").doc();
    await ref.set({ connected: true, timestamp: Date.now() });
    res.json({ success: true, id: ref.id });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
