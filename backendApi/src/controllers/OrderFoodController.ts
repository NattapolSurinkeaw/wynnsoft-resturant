import moment from 'moment'
import { validationResult } from 'express-validator'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import { ViewService } from '../services/View.service'
import * as jwt from 'jsonwebtoken'
import { Table } from '../models/table'
import { Orders } from '../models/orders'
import { OrdersList } from '../models/orderList'
import { Foods } from '../models/food'


export class OrderFoodController {
  OngetAllOrderFoods = async(req: any, res: any) => {
    try {
      const order = await Orders.findAll({
        include: [
          { model: Table, as: "table" }, // ดึงข้อมูลโต๊ะ
          { model: OrdersList, as: "orderList",
            include: [{ model: Foods, as: "food" }] 
           }, // ดึงข้อมูลรายการอาหารในออเดอร์
        ],
      });
  
      return res.status(200).json({
        status: true,
        message: 'ok',
        description: 'confirm payment success.',
        data: order
      })
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    }
  } 

  // สั่งอาหาร
  OnAddOrderFood = async(req: any, res: any) => {
    try {
      const decodedJWT = jwt.decode(req.body.token);
      const paramFoods = req.body.food;

      if (decodedJWT && typeof decodedJWT === "object") {
        const table = await Table.findOne({where: {id: decodedJWT.table_id}});
        if(table.table_token === decodedJWT.table_token) {
          const order = await Orders.findOne({where: {id: decodedJWT.order_id}});
          if(!order.order_number) {
            order.order_number = String(order.id).padStart(6, "0");
          }

          const orderItems = paramFoods.map((item: any) => ({
            food_id: item.id, // ใช้ id ของอาหาร
            orders_id: order.id, // อ้างอิงไปที่ order_id ที่สร้าง
            amount: item.count, // จำนวนที่สั่ง
            status: 1, // สมมุติว่า 1 = กำลังดำเนินการ
            note: item.note, // หมายเหตุของรายการ
          }));
          
          console.log(orderItems);
          await OrdersList.bulkCreate(orderItems);
          
          order.price = orderItems.reduce((sum: any, item: any) => sum + item.price, 0);
          await order.save();

          return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'confirm payment success.'
          })
        } else {
          return res.status(400).json({
            status: false,
            message: 'error',
            description: 'qrcode incorrect'
          })
        }
      }


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