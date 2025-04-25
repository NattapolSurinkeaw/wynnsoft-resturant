import moment from "moment";
import { validationResult } from "express-validator";
import fs, { stat } from "fs";
const sharp = require("sharp");
import path from "path";
import { ViewService } from "../services/View.service";
import * as jwt from "jsonwebtoken";
import { Table } from "../models/table";
import { Orders } from "../models/orders";
import { OrdersList } from "../models/orderList";
import { Foods } from "../models/food";
import { SIO } from "../util/Sockets";
import { Op } from "sequelize";
import { WebInfo } from "../models/webInfo";

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

  OngetAllOrderFoodsCurrent = async (req: any, res: any) => {
    try {
      const order = await Orders.findAll({
        where: { status: { [Op.ne]: 5 } },
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

  OngetOrderListForTopMenu = async(req: any, res: any) => {
    try {
      const startOfMonth = moment().startOf("month").toDate();  // 2025-04-01T00:00:00
      const endOfMonth = moment().endOf("month").toDate();      // 2025-04-30T23:59:59

      const orderList = await OrdersList.findAll({
        where: {
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        include: [
          {
            model: Foods,
            as: "food",
            attributes: ["name", "thumbnail_link"],
          },
        ],
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get orde list All success.",
        orderList: orderList,
      });
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  }

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
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  }
  OnCheckBillOrder = async(req: any, res: any) => {
    try {
      const order = await Orders.findOne({ where: {id: req.body.order_id }});
      order.pay_by = req.body.pay_by;
      order.status = 5;

      let image = null;

      if (req.file) {
        let upload = "/uploads" + req.file.destination.split("uploads").pop();
        let dest = req.file.destination;
        var ext = path.extname(req.file.originalname);
        let originalname = path.basename(req.file.originalname, ext);

        for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
          originalname = originalname.split("(")[0];
          originalname += "(" + i + ")";
        }

        order.slip_image = await sharp(req.file.path)
          .withMetadata()
          .jpeg({ quality: 95 })
          .toFile(path.resolve(req.file.destination, originalname + ext))
          .then(() => {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.log(err);
              }
            });
            return upload + originalname + ext;
          });
      }
      await order.save();

      const table = await Table.findOne({where: {id: req.body.table_id}});
      table.table_token = null;
      table.qrcode = null;
      table.status = 1;
      await table.save();

      return res.status(200).json({
        status: true,
        message: "check bill",
        description: "check bill order is success",
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  }

  onGetCallStaff = async(req: any, res: any) => {
    try {
      const table = await Table.findAll({
        where: {
          call_staff: {
            [Op.ne]: 0  // ไม่เท่ากับ 0
          }
        }
      });

      const kitchenCall = await WebInfo.findOne({where: {info_param: 'kitchen_call', info_value: 1}});
     
      if (kitchenCall) {
        const extraTable = {
          id: 1,
          table_token: null,
          qrcode: null,
          title: kitchenCall.info_title,
          status: null,
          call_staff: parseInt(kitchenCall.info_value), // แปลงเป็นตัวเลข
          priority: null,
          display: true,
          createdAt: kitchenCall.createdAt,
          updatedAt: kitchenCall.updatedAt
        };
      
        table.push(extraTable);
      }

      return res.status(200).json({
        status: true,
        message: "check bill",
        description: "check bill order is success",
        messageCall: table
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  }

  onCallStaff = async(req: any, res: any) => {
    console.log(req.params.type);
    try {
      const type = req.params.type;
      if(type == 1) {

      } else {
        const webinfo = await WebInfo.findOne({where: {info_param: 'kitchen_call'}});
        webinfo.info_value = 1;
        await webinfo.save();
      }

      return res.status(200).json({
        status: true,
        message: "call staff",
        description: "call staff",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  }

  onGetAcceptCall = async(req: any, res: any) => {
    try {
      console.log(req.body)
      if(req.body.table_type == 'table') {
        const table = await Table.findOne({where: {id: req.body.table_id}});
        table.call_staff = false;
        await table.save();
      } else {
        const webinfo = await WebInfo.findOne({where: {info_param: 'kitchen_call'}});
        webinfo.info_value = 0;
        await webinfo.save();
      }



      return res.status(200).json({
        status: true,
        message: "check bill",
        description: "check bill order is success",
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  }

  onGetCountOrder = async(req: any, res: any) => {
    try {
      const orderWaitCount = await OrdersList.count({
        where: { status: 3 }
      });

      const orderAll = await Orders.findAll({
        attributes: ["id", "order_number", "table_id", "price"],
        where: {
          status: {
            [Op.ne]: 5  // ไม่เท่ากับ 5
          }
        },
        include: [
          {
            model: OrdersList,
            as: "orderList",
          }
        ],
      });

      const countOrderPay = orderAll.filter((order: any) => order.orderList && order.orderList.length > 0).length;
      
      return res.status(200).json({
        status: true,
        message: "get count order",
        description: "get count order success",
        orderWait: orderWaitCount,
        orderDay: orderAll.length,
        orderPay: countOrderPay
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        error: error,
        description: "something went wrong.",
      });
    }
  }

  // สั่งอาหาร
  OnAddOrderFood = async(req: any, res: any) => {
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
            price: item.price,
          }));

          console.log(paramFoods);
          await OrdersList.bulkCreate(orderItems);

          const newTotalPrice =
            (order.price || 0) +
            orderItems.reduce(
              (sum: any, item: any) => sum + item.price * item.amount,
              0
            );
          await order.update({ price: newTotalPrice, status: 2 });

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
