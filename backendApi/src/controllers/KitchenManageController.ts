import fs from "fs";
import bcrypt from "bcrypt";
const sharp = require("sharp");
import path from "path";
import { validationResult } from "express-validator";
import { Orders } from "../models/orders";
import { OrdersList } from "../models/orderList";
import { Table } from "../models/table";
import { Foods } from "../models/food";

export class KitchenManageController {
  OngetAllNewMenuFood = async(req: any, res: any) => {
    try {
      const orderList = await OrdersList.findAll({
        include: [
          {
            model: Orders,
            attributes: ['order_number'],
            include: [
              {
                  model: Table,
                  attributes: ['title'],
              }
            ]
          }
        ]
      });
    
      return res.status(200).json({
        status: true,
        message: 'get data foods',
        orderList: orderList
      });
  
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        errorsMessage: error,
      });
    }
  }
  OnChangeStatusOutFood = async (req: any, res: any) => {
    try {
      // 🔹 ค้นหา Food ตาม id
      const food = await Foods.findOne({ where: { id: req.params.id } });
      if (!food) {
        return res.status(404).json({
          status: false,
          message: "Food product not found.",
        });
      }
  
      // 🔹 อัปเดตสถานะของ Food
      food.status_food = false;
      await food.save(); // ✅ ใช้ await
  
      // 🔹 ค้นหา OrdersList ตาม food_id
      const orderList = await OrdersList.findOne({ where: { food_id: req.params.id } });
      if (!orderList) {
        return res.status(404).json({
          status: false,
          message: "Order list for this food not found.",
        });
      }
  
      // 🔹 อัปเดตสถานะของ OrdersList
      orderList.status = "5";
      await orderList.save(); // ✅ ใช้ await
  
      // 🔹 ส่ง Response สำเร็จ
      return res.status(200).json({
        status: true,
        message: "Food status updated successfully.",
        updatedFood: food,
        updatedOrderList: orderList,
      });
  
    } catch (error: any) {
      console.error("Error updating food status:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        errorsMessage: error.message, // ✅ ใช้ error.message เพื่อให้เข้าใจง่ายขึ้น
      });
    }
  }
  OnUpdateNoteOutfood = async(req: any, res: any) => {
    try {
      
    } catch (error: any) {
      console.error("Error updating food status:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
        errorsMessage: error.message, // ✅ ใช้ error.message เพื่อให้เข้าใจง่ายขึ้น
      });
    }
  }
  
}