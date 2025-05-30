import fs from "fs";
import path from "path";
import moment from 'moment'
import bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken'
import { validationResult } from "express-validator";
import * as Config from '../util/config'
import { Op, where } from "sequelize";

// const sharp = require("sharp");
import { v4 as uuidv4 } from "uuid";
import { Table } from "../models/table";
import { Orders } from "../models/orders";
import { BookingTable } from "../models/bookingTable";
import OrdersList from "../models/orderList";

export class TableManageController {

  OngetAllTable = async(req: any, res: any) => {
    try {
      const tables = await Table.findAll({
        order: [['priority', 'ASC']], // ✅ เรียงลำดับตาม priority ของ Table
        include: [
          {
            model: BookingTable,
            as: "bookings",
            attributes: ["id", "name_booking", "phone_booking", "email_booking", "date_booking", "time_booking", "people"],
            order: [
              ["date_booking", "ASC"],  // ✅ เรียงลำดับวันที่
              ["time_booking", "ASC"],  // ✅ เรียงลำดับเวลา
            ],
            separate: true, // ✅ ใช้ separate เพื่อให้ order ทำงานกับ BookingTable
          },
        ],
      });
      
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        tables: tables
      });

    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: error,
          description: 'something went wrong.'
      })
    }
  } 
  OngetOnlyTable = async(req: any, res: any) => {
    try {
      const table = await Table.findAll({order: [['priority', 'ASC']]});

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        table: table
      });
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: error,
          description: 'something went wrong.'
      })
    }
  }
  OnCreateTable = async(req: any, res: any) => {
    try {
      const table = await Table.create({
        title: req.body.title,
        status: 1,
        call_staff: 0,
        priority: req.body.priority,
        display: req.body.display
      });
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        table: table
      });
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: error,
          description: 'something went wrong.'
      })
    }
  }
  OnEditTable = async(req: any, res: any) => {
    try {
      const table = await Table.findOne({where: {id: req.params.id}});
      if(!table) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "table not found",
        });
      }
      table.title = req.body.title;
      table.priority = req.body.priority;
      table.display = req.body.display;
      if(req.body.display == true && table.status == 4) {
        table.status = 1;
      } else if (req.body.display == false) {
        table.status = 4;
      }
      table.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get edit tablee success.",
        booking: table
      });

    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: error,
          description: 'something went wrong.'
      })
    }
  }
  OnChangeTable = async(req: any, res: any) => {
    try {
      const tableOld = await Table.findOne({where: {id: req.body.old_table}});
      tableOld.table_token = null;
      tableOld.qrcode = null;
      tableOld.status = 1;
      tableOld.save();
      
      console.log(tableOld)
      
      const tableNew = await Table.findOne({where: {id: req.body.new_table}});
      const generate_token = uuidv4();
      const payload = {
        table_id: tableNew.id,
        table_token: generate_token,
        order_id: req.body.order_id,
      };

      const JWT_token = jwt.sign(payload, 'nattapolsurinkeaw', { expiresIn: "1h" });
      tableNew.table_token = generate_token;
      tableNew.qrcode = JWT_token;
      tableNew.status = 2;
      await tableNew.save();

      const order = await Orders.findOne({where: {id: req.body.order_id}});
      order.table_id = tableNew.id;
      await order.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "change table success fully",
      });

    } catch(err){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: err,
          description: 'something went wrong.'
      })
    }
  }
  OngetGenerateQrcode = async(req: any, res: any) => {
    try {
      const table = await Table.findOne({where: {id: req.params.id}});
      const generate_token = uuidv4();
      
      let order = await Orders.findOne({
        where: {
          table_id: table.id, 
          status: { [Op.ne]: 5}
        }
      });

      if(!order) {
        order = await Orders.create({
          order_number: '',
          table_id: table.id,
          status: 0,
          price: 0,
        })
      }
      order.order_number = String(order.id).padStart(6, "0");
      order.save();

      const payload = {
        table_id: table.id,
        table_token: generate_token,
        order_id: order.id,
      };

      const JWT_token = jwt.sign(payload, 'nattapolsurinkeaw', { expiresIn: "12h" });
      table.table_token = generate_token;
      table.qrcode = JWT_token;
      table.status = 2;
      await table.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        token: JWT_token
      });

    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: error,
          description: 'something went wrong.'
      })
    }
  }
  OnverifyQrCode = async(req: any, res: any) => {
    try {
      const token = req.params.token;

      
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          error: error,
          description: 'something went wrong.'
      })
    }
  }

  // จองโต๊ะ
  OnCreateBookingTable = async (req: any, res: any) => {
    try {
      const table = await Table.findOne({where: {id: req.body.table_booking}}); 
      if(!table) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "table not found",
        });
      }
      table.status = 3;
      await table.save();
      
      const bookingTable = await BookingTable.create({
        name_booking: req.body.name_booking,
        phone_booking: req.body.phone_booking,
        email_booking: req.body.email_booking,
        table_booking: req.body.table_booking,
        date_booking: req.body.date_booking,
        time_booking: req.body.time_booking,
        people: req.body.people
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        booking: bookingTable // เปลี่ยนจาก `token` เป็น `data`
      });

    } catch(error){
      return res.status(500).json({
        status: false,
        message: 'error',
        error: error,
        description: 'something went wrong.'
      })
    }
  };

  OnAddBillPayment = async(req: any, res: any) => {
    try {
      const param = req.body.bill_id
      const orders = await Orders.findAll({where: {id: param}});
      console.log(orders);
      if (orders.length < 2) {
        return { status: 400, message: "ต้องมี order อย่างน้อย 2 รายการในการรวมบิล" };
      }

      // ดึง table_id ของ order แรก
      // const mainTableId = orders[0].table_id;
  
      // อัปเดต order อื่น ๆ ให้มี table_id เดียวกับ order แรก
      const otherOrderIds = orders.slice(1).map((order: { id: number }) => order.id); // order 88, 89 เป็นต้น
      const otherTableIds = orders.slice(1).map((order: { table_id: number }) => order.table_id); // order 88, 89 เป็นต้น
      console.log(orders[0].id)

      // เปลี่ยน order_id ของ order_list
      await OrdersList.update(
        { orders_id: orders[0].id },
        {
          where: {
            orders_id: otherOrderIds
          }
        }
      );
      
      await Table.update(
        { table_token: null, qrcode: null, status: 1 },
        {
          where: {
            id: otherTableIds
          }
        }
      );
      
      await Orders.destroy({
        where: {
          id: otherOrderIds
        }
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success",
      });

      // ลบข้อมูล table ที่ไม่ใช่ main
    } catch(error){
      return res.status(500).json({
        status: false,
        message: 'error',
        error: error,
        description: 'something went wrong.'
      })
    }
  }

}