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

export class TableManageController {
  OngetAllTable = async(req: any, res: any) => {
    try {
      const tables = await Table.findAll({order: [['priority', 'ASC']]});
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
  OngetGenerateQrcode = async(req: any, res: any) => {
    try {
      const table = await Table.findOne({where: {id: req.params.id}});
      table.table_token = uuidv4();
      table.save();

      const order = await Orders.create({
        order_number: '',
        table_id: table.id,
        status: 0,
        price: 0,
      })

      const payload = {
        table_id: table.id,
        table_token: table.table_token,
        order_id: order.id,
      };

      const token = jwt.sign(payload, 'nattapolsurinkeaw', { expiresIn: "1h" });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        token: token
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
}