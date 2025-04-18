import fs from "fs";
import bcrypt from "bcrypt";
const sharp = require("sharp");
import path from "path";
import { validationResult } from "express-validator";
import { Orders } from "../models/orders";
import { OrdersList } from "../models/orderList";
import { Table } from "../models/table";
import { Foods } from "../models/food";
import { SIO } from "../util/Sockets";
const jwt = require('jsonwebtoken');

export class KitchenManageController {
  // ดึงข้อมูลอาหารที่ลูกค้ากดสั่งเข้ามา
  OngetAllNewMenuFood = async (req: any, res: any) => {
    try {
      const orderList = await OrdersList.findAll({
        include: [
          {
            model: Orders,
            as: "order", // ✅ ต้องกำหนด "as" ให้ตรงกับ association
            attributes: ["order_number"],
            include: [
              {
                model: Table,
                as: "table", // ✅ ต้องกำหนด "as" ให้ตรงกับ association
                attributes: ["title"],
              },
            ],
          },
          {
            model: Foods,
            as: "food", // ✅ ต้องกำหนด "as" ให้ตรงกับ association
            attributes: ["name", "price", "special_price", "thumbnail_link"],
          },
        ],
      });
  
      return res.status(200).json({
        status: true,
        message: "get data foods",
        orderList: orderList,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        errorsMessage: error,
      });
    }
  }
  //เปลี่ยนสถานะอาหาร
  OnUpdateOrderListStatus = async(req: any, res: any) => {
    try {
      const io = SIO.getIO(); // ใช้งาน Socket.IO
      const { orderList, orderId }: { orderList: { id: number; status: number }[]; orderId: number } = req.body;

      // console.log(orderList)
      await Promise.all(
        orderList.map(({ id, status }: { id: number; status: number }) => 
          OrdersList.update(
            { status }, 
            { where: { id } }
          )
        )
      );
      
      // console.log(orderId)
      // ✅ แจ้งเตือน React Backoffice ผ่าน Socket.IO
      io.emit("newOrder", {
        orderList: orderList
      });

      return res.status(200).json({
        status: true,
        message: "update status food success",
      });
      
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        errorsMessage: error,
      });
    }
  }

  // สินค้าหมด
  OngetAllOutFoods = async(req: any, res: any) => {
    try {
      const outfood = await Foods.findAll({where: {status_food: false}});

      return res.status(200).json({
        status: true,
        message: "get data out foods success",
        outFood: outfood,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        errorsMessage: error,
      });
    }
  }
  OnChangeStatusOutFood = async(req: any, res: any) => {
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
      const orderList = await OrdersList.findOne({ where: { food_id: req.params.id, status: 1 } });
      if (!orderList) {
        return res.status(404).json({
          status: false,
          message: "Order list for this food not found.",
        });
      }
  
      // 🔹 อัปเดตสถานะของ OrdersList
      orderList.status = "6";
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
      const food = await Foods.findOne({where: {id: req.params.id}});
      if (!food) {
        return res.status(404).json({
          status: false,
          message: "food data is not found",
        });
      }

      food.note = req.body.note;
      food.save();
      return res.status(200).json({
        status: true,
        message: "Food status updated successfully.",
        food: food
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
  OnCancelOutFood = async(req: any, res: any) => {
    try {
      const food = await Foods.findOne({ where: {id: req.params.id }});
      food.status_food = true;
      food.note = null;
      food.save();

      return res.status(200).json({
        status: true,
        message: "Food status updated successfully.",
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
  OnChangeStatusOrderList = async(req: any, res: any) => {
    try {
      const orderList = await OrdersList.findOne({where: {id: req.body.list_id}});
      if(!orderList) {
        return res.status(404).json({
          status: false,
          message: "order list not found",
        });
      }
      orderList.status = req.body.status;
      orderList.save();

      const food = await Foods.findOne({where: {id: req.body.food_id}});
      if(!food) {
        return res.status(404).json({
          status: false,
          message: "food not found",
        });
      }
      food.status_food = false;
      food.note = req.body.note;
      food.save();
      
      return res.status(200).json({
        status: true,
        message: "status updated successfully.",
      });

    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "some thing went wrong",
        errorsMessage: error.message, // ✅ ใช้ error.message เพื่อให้เข้าใจง่ายขึ้น
      });
    }
  }
  OnDeleteOrderList = async(req: any, res: any) => {
    try {
      const orderList = await OrdersList.findOne({where: {id: req.params.id}});
      if(!orderList) {
        return res.status(404).json({
          status: false,
          message: "not found order list",
        });
      }

      await orderList.destroy();
      return res.status(200).json({
        status: true,
        message: "delete order list success fully",
      });


    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "some thing went wrong",
        errorsMessage: error.message, // ✅ ใช้ error.message เพื่อให้เข้าใจง่ายขึ้น
      });
    }
  }
  OnDeleteOrder = async(req: any, res: any) => {
    try {
      await OrdersList.destroy({
          where: {
              orders_id: req.body.order_id
          }
      });

      const order = await Orders.findOne({where: {id: req.body.order_id}});

      if(req.body.table_id) {
        const table = await Table.findOne({where: {id: req.body.table_id}});
        if(table.qrcode) {
          const decodedQr = jwt.verify(table.qrcode, 'nattapolsurinkeaw'); 
          if(decodedQr.order_id == order.id) {
            table.table_token = null;
            table.qrcode = null;
            table.status = 1;
            await table.save();
          }
        }
      }

      await order.destroy();

      return res.status(200).json({
        status: true,
        message: "delete order success fully",
      });

    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "some thing went wrong",
        errorsMessage: error.message, // ✅ ใช้ error.message เพื่อให้เข้าใจง่ายขึ้น
      });
    }
  }
  
}