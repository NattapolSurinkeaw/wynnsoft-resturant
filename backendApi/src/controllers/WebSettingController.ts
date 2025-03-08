import fs from "fs";
import path from "path";
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
}