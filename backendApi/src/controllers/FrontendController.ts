import { validationResult } from "express-validator";
import path from "path";
import fs from "fs";
const sharp = require("sharp");
import { CategoryFood } from "../models/categoryFood";
import { Foods } from "../models/food";
import Orders from "../models/orders";
import OrdersList from "../models/orderList";
import { Table } from "../models/table";
import { WebInfo } from "../models/webInfo";

export class FrontendController {
  OngetCategoryAndFood = async (req: any, res: any) => {
    try {
      const catefoods = await CategoryFood.findAll({
        where: { status_display: true },
      });
      const foods = await Foods.findAll();
      return res.status(200).json({
        status: true,
        message: "get data foods",
        catefoods: catefoods,
        foods: foods,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };

  OngetStatusFoodOrders = async (req: any, res: any) => {
    try {
      const orderAll = await Orders.findAll({
        attributes: ["id", "order_number", "table_id", "price"],
        include: [
          {
            model: OrdersList,
            as: "orderList",
            include: [{ model: Foods, as: "food" }],
          },
          { model: Table, as: "table" },
        ],
      });
      const taxAndService = await WebInfo.findAll({
        where: { info_type: 4 },
      });
      return res.status(200).json({
        status: true,
        message: "get data foods",
        orderAll: orderAll,
        taxAndService: taxAndService,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
}
