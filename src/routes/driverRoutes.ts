import express from "express";
const router = express.Router();

import DriverController from "../controllers/DriverController";
import verifyAdmin from "../middleware/verifyAdmin";

router.post("/", verifyAdmin, DriverController.create);
router.get("/:id", verifyAdmin, DriverController.getOne);
router.put("/:id", verifyAdmin, DriverController.update);
router.delete("/:id", verifyAdmin, DriverController.delete);

export default router;
