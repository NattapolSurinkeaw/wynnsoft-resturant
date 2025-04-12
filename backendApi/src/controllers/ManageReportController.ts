import fs from "fs";
import path from "path";
const sharp = require("sharp");
import { validationResult } from "express-validator";
import { CategoryFood } from "../models/categoryFood";
import { Foods } from "../models/food";
import {Orders} from "../models/orders";
import {OrdersList} from "../models/orderList";
import { Op, fn, col, literal } from "sequelize";

export class ManageReportController {
  // start หมวดหมู่เมนู
  getBestSellingFoods = async (req: any, res: any) => {
    try {
      const result = await Foods.findAll({
        attributes: [
          'id',
          'name',
          'price',
          'special_price',
          'thumbnail_link',
          [fn('SUM', literal(`CASE WHEN orderList.status = '4' THEN orderList.amount ELSE 0 END`)), 'totalSold']
        ],
        include: [
          {
            model: OrdersList,
            as: 'orderList',
            attributes: [] // ✅ ไม่ต้องใช้ fields จาก orderList โดยตรง แต่ต้องให้ Sequelize join มาก่อน!
          }
        ],
        group: ['Foods.id'],
        order: [[literal('totalSold'), 'DESC']],
        // limit: 10,
        subQuery: false // ✅ สำคัญ! เพื่อให้ Sequelize ไม่ wrap query ด้านในก่อน join
      });
  
      return res.status(200).json({
        status: true,
        message: "update status food success",
        data: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error
      });
    }
  }

  getPuredataTopmenu = async(req: any, res: any) => {
    try {
      const orderList = await OrdersList.findAll({where: {status: 4}});
      const foods = await Foods.findAll();

      return res.status(200).json({
        status: true,
        message: "update status food success",
        orderList: orderList,
        foods: foods
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error
      });
    }
  }
}