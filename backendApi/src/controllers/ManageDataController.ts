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
}