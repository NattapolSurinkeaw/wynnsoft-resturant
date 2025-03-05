import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";
const sharp = require("sharp");
import { CategoryFood } from "../models/categoryFood";
import { Foods } from "../models/food";

export class FrontendController {
  OngetCategoryAndFood = async (req: any, res: any) => {
    try {
      const catefoods = await CategoryFood.findAll({where: { status_display: true }});
      const foods = await Foods.findAll();
      return res.status(200).json({
        status: true,
        message: 'get data foods',
        catefoods: catefoods,
        foods : foods,
      });
    } catch(error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: 'something went wrong.'
      })
    }
  }
}