import fs from "fs";
import path from "path";
import moment from 'moment'
import bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken'
import { validationResult } from "express-validator";
import * as Config from '../util/config'

// const sharp = require("sharp");
import { v4 as uuidv4 } from "uuid";
import { Table } from "../models/table";
import { Orders } from "../models/orders";
import { BookingTable } from "../models/bookingTable";

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
  OngetGenerateQrcode = async(req: any, res: any) => {
    try {
      const table = await Table.findOne({where: {id: req.params.id}});
      const generate_token = uuidv4();
      
      let order = await Orders.findOne({where: {table_id: table.id}});
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

      const JWT_token = jwt.sign(payload, 'nattapolsurinkeaw', { expiresIn: "1h" });
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

}