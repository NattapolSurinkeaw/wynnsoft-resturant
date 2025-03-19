import fs from "fs";
import path from "path";
import moment from 'moment'
import bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken'
import { body, validationResult } from "express-validator";
import * as Config from '../util/config'

const sharp = require("sharp");
import { User } from "../models/users";
import { UsersPermission } from "../models/usersPermission";
import { WebInfo } from "../models/webInfo";
import { webInfoType } from "../models/webInfoType";
import { BankAccount } from "../models/bankAccount";

export class WebSettingController {
  OngetWebinfos = async (req: any, res: any) => {
    try {
      const webinfo = await WebInfo.findAll();
      const web_info_types = await webInfoType.findAll();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        webinfo: webinfo,
        webinfotype: web_info_types,
      });
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          description: 'something went wrong.'
      })
    }
  }
  // โปรไฟล์ร้านค้า
  OnUpdateProfileShop = async(req: any, res: any) => {
    try {
      const { time_open, time_close } = req.body;

      const processImage = async (file: any) => {
        if (!file) return null;
    
        let uploadPath = "/uploads" + file.destination.split("uploads").pop();
        let dest = file.destination;
        let ext = path.extname(file.originalname);
        let originalname = path.basename(file.originalname, ext);
    
        // ป้องกันชื่อไฟล์ซ้ำ
        for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
            originalname = originalname.split("(")[0] + `(${i})`;
        }
    
        const outputPath = path.resolve(file.destination, originalname + ext);
    
        // ประมวลผลภาพด้วย sharp
        const imagePath = await sharp(file.path)
            .withMetadata()
            .jpeg({ quality: 95 })
            .toFile(outputPath)
            .then(() => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
                return uploadPath + originalname + ext;
            });
    
        return imagePath;
      };
    
      if (req.files.web_logo) {
          const webLogoPath = await processImage(req.files.web_logo[0]);
          await WebInfo.update(
            { info_link: webLogoPath },
            { where: { info_param: 'web_logo' } }
          );
      }
      
      if (req.files.web_bg) {
          const webBgPath = await processImage(req.files.web_bg[0]);
          await WebInfo.update(
            { info_link: webBgPath },
            { where: { info_param: 'web_bg' } }
          );
      }

      await Promise.all([
        WebInfo.update({ info_value: time_open }, { where: { info_param: 'time_open' } }),
        WebInfo.update({ info_value: time_close }, { where: { info_param: 'time_close' } })
      ]);

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success."
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
  // ข้อมูลร้านค้า
  OnEditDataShop = async (req: any, res: any) => {
    try {
      const webinfo = await Promise.all(
        Object.entries(req.body).map(([key, value]) =>
          WebInfo.update(
            { info_value: value }, // อัปเดตค่าของ info_value
            { where: { info_param: key } } // ค้นหาจาก info_param
          )
        )
      );
      
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "update data success."
      });
    } catch(error){
      return res.status(500).json({
          status: false,
          message: 'error',
          description: 'something went wrong.'
      })
    }
  }
  // ตั้งค่าภาษีและบริการ
  OnUpdateTaxService = async(req: any, res: any) => {
    try {
      const webinfo = await WebInfo.findOne({where: {info_id: req.body.id}});
      webinfo.info_value = req.body.info_value;
      webinfo.info_display = req.body.display_status;
      webinfo.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "update data success."
      });
    } catch(error){
      return res.status(500).json({
        status: false,
        message: 'error',
        description: 'something went wrong.'
      })
    }
  }
  //ข้อมูลบัญชีธนาคาร
  OngetAllBankAccount = async(req: any, res: any) => {
    try {
      const bankAccount = await BankAccount.findAll();

      return res.status(200).json({
        status: true,
        message: "ok",
        bank: bankAccount
      });
    } catch(error){
      return res.status(500).json({
        status: false,
        message: 'error',
        description: 'something went wrong.'
      })
    }
  }
  OnUpdateBank = async(req: any, res: any) => {
    try {
      const bankAccount = await BankAccount.findOne({where: {id: req.params.id}});
      if (!bankAccount) {
        return res.status(404).json({
          status: false,
          message: "error",
          title: "เกิดข้อผิดพลาด!",
          description: "ไม่พบข้อมูล",
        });
      }

      if (req.file) {
        let upload = "/uploads" + req.file.destination.split("uploads").pop();
        let dest = req.file.destination;
        var ext = path.extname(req.file.originalname);
        let originalname = path.basename(req.file.originalname, ext);

        for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
          originalname = originalname.split("(")[0];
          originalname += "(" + i + ")";
        }

        const image = await sharp(req.file.path)
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
          bankAccount.qrcode = image;
      }

      bankAccount.bank_provider = req.body.bank_provider;
      bankAccount.name = req.body.name;
      bankAccount.bank_number = req.body.bank_number;
      bankAccount.save();
      return res.status(200).json({
        status: true,
        message: "ok"
      });
      
    } catch(error){
      return res.status(500).json({
        status: false,
        message: 'error',
        description: 'something went wrong.'
      })
    }
  }
  // ตั้งค่าผู้ใช้งาน
  OnCreateNewUser = async(req: any, res:any) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            status: false,
            message: 'error',
            errorMessage: errors.array()
        })
    }
    /** finding user */
    const finding = await User.findOne({where:{username: req.body.username}})
    if(finding){
        return res.status(400).json({
            status: false,
            message: 'error',
            description: 'username has already used.'
        })
    }
    /* generate access_token for user */
    const access_token = jwt.sign({
        username: req.body.username,
        at: new Date().getTime()
    }, `${Config.secretKey}`, { expiresIn: '30d' })
    /* generate refresh_token when register and no expire */
    const refresh_token = jwt.sign({
        username: req.body.username,
        at: new Date().getTime(),
        token: access_token
    }, `${Config.secretKey}`)
    /** generate user_code */
    const users_str = req.body.username+Math.random().toString().substr(2, 8)+moment().unix()
    const users_code = await bcrypt.hash(users_str, 10)
    /** hash password */
    const hashPass = await bcrypt.hash(req.body.password, 10)
    try {
        /** create user */
        const users = await User.create({
            users_code: users_code.replace(/\W/g, ""),
            access_token: access_token,
            refresh_token: refresh_token,
            username: req.body.username,
            password: hashPass,
            email: req.body.email,
            profile_img: "",
            permission: parseInt(req.body.permission),
            status_confirm: 'confirm',
            display_name: req.body.displayName,
            status: req.body.status
        })
        return res.status(201).json({
            status: true,
            message: 'ok',
            description: 'data was created.'
        })
    } catch(error){
        return res.status(500).json({
            status: false,
            message: 'error',
            error: error,
            description: 'something went wrong.'
        })
    }
  }
  OnUpdateDataUser = async(req: any, res: any) => {
    try {
      const user = await User.findOne({where: {users_code: req.body.adminCode}});
      if(!user) {
        return res.status(404).json({
          status: false,
          message: "error",
          title: "เกิดข้อผิดพลาด!",
          description: "ไม่พบข้อมูล",
        });
      }

      user.display_name = req.body.displayName;
      user.email = req.body.email;
      user.permission = req.body.permission;
      user.status_confirm = "confirm";
      user.status = req.body.status;
      user.save();

      return res.status(200).json({
        status: true,
        message: "ok"
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
  OnDeleteUser = async(req: any, res: any) => {
    try {
      const user = await User.findOne({where: {users_code: req.params.code}});
      if(!user) {
        return res.status(404).json({
          status: false,
          message: "error",
          title: "เกิดข้อผิดพลาด!",
          description: "ไม่พบข้อมูล",
        });
      }

      user.destroy();
      return res.status(200).json({
        status: true,
        message: "ok"
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