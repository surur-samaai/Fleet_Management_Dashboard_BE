import { Request, Response } from "express";
import DriverService from "../services/DriverService";
import { driverSchema } from "../vallidators/driverVallidator";

export default class DriverController {
  static async create(req: Request, res: Response) {
    const { error } = driverSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const driver = await DriverService.createDriver(req.body);
    res.status(201).json(driver);
  }

  static async getOne(req: Request, res: Response) {
    const driver = await DriverService.getDriverById(req.params.id); // ✅ STRING!
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    res.json(driver);
  }

  static async update(req: Request, res: Response) {
    const { error } = driverSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    await DriverService.updateDriver(req.params.id, req.body); // ✅ STRING!
    res.json({ message: "Driver updated successfully" });
  }

  static async delete(req: Request, res: Response) {
    await DriverService.deleteDriver(req.params.id); // ✅ STRING!
    res.json({ message: "Driver deleted successfully" });
  }
}
