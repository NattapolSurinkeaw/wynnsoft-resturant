import moment from "moment";
import { validationResult } from "express-validator";
import fs from "fs";
const sharp = require("sharp");
import path from "path";
import { ViewService } from "../services/View.service";
import * as jwt from "jsonwebtoken";
import { Table } from "../models/table";
import { Orders } from "../models/orders";
import { OrdersList } from "../models/orderList";
import { Foods } from "../models/food";
import { SIO } from "../util/Sockets";

export class OrderFoodController {
  OngetAllOrderFoods = async (req: any, res: any) => {
    try {
      const order = await Orders.findAll({
        include: [
          { model: Table, as: "table" }, // ดึงข้อมูลโต๊ะ
          {
            model: OrdersList,
            as: "orderList",
            include: [{ model: Foods, as: "food" }],
          }, // ดึงข้อมูลรายการอาหารในออเดอร์
        ],
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get order All success.",
        data: order,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  };
  
  OngetOrderFoodById = async (req: any, res: any) => {
    try {
      const order = await Orders.findOne({
        where: { id: req.params.id },
        include: [
          { model: Table, as: "table" },
          {
            model: OrdersList,
            as: "orderList",
            include: [{ model: Foods, as: "food" }],
          },
        ],
      });

      if (!order) {
        return res.status(400).json({
          status: false,
          message: "error",
          description: "order was not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get order by id success.",
        data: order,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  };

  // สั่งอาหาร
  OnAddOrderFood = async (req: any, res: any) => {
    try {
      const decodedJWT = jwt.decode(req.body.token);
      const paramFoods = req.body.food;
      const io = SIO.getIO(); // ใช้งาน Socket.IO

      if (decodedJWT && typeof decodedJWT === "object") {
        const table = await Table.findOne({
          where: { id: decodedJWT.table_id },
        });
        if (table.table_token === decodedJWT.table_token) {
          const order = await Orders.findOne({
            where: { id: decodedJWT.order_id },
          });
          // if (!order.order_number) {
          //   order.order_number = String(order.id).padStart(6, "0");
          // }

          const orderItems = paramFoods.map((item: any) => ({
            food_id: item.id,
            orders_id: order.id,
            amount: item.count,
            status: 1,
            note: item.note,
          }));

          // console.log(orderItems);
          await OrdersList.bulkCreate(orderItems);

          const newTotalPrice =
            (order.price || 0) +
            orderItems.reduce(
              (sum: any, item: any) => sum + item.price * item.amount,
              0
            );
          await order.update({ price: newTotalPrice , status: 2});

          // ✅ แจ้งเตือน React Backoffice ผ่าน Socket.IO
          io.emit("newOrder", {
            order_id: order.id,
            order_number: order.order_number,
            items: orderItems,
          });

          return res.status(200).json({
            status: true,
            message: "ok",
            description: "add order success.",
          });
        } else {
          return res.status(400).json({
            status: false,
            message: "error",
            description: "qrcode incorrect",
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  };
}
