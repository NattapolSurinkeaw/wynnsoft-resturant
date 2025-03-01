import { validationResult } from "express-validator";
import { CategoryFood } from "../models/categoryFood"

export class ManageDataController {
  OngetCategoryFood = async (req: any, res: any) => {
    const cateFood = await CategoryFood.findAll();
    return res.status(200).json({
      status: true,
      message: "ok",
      data: cateFood
    });
  }
  OnCreateCategoryFood = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    console.log(req);
  }
}