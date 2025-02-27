import { RecommendSettingGp } from "./../models/recommendSettingGp";
import { TokenLog } from "./../models/tokenLog";
import { Settings } from "./../models/settings";
import { Store } from "./../models/store";
import { Members } from "./../models/members";
import fs from "fs";
import bcrypt from "bcrypt";
const sharp = require("sharp");
import path from "path";
import { validationResult } from "express-validator";
import { User } from "../models/users";
import { Log } from "../models/log";

export class AdminManageController {
  OnChangePasswordMember = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await Members.findOne({
        where: { member_code: req.body.memberCode },
      });
      finding.password = req.body.newPassword;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "passsword was changed.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnChangePasswordStore = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await Store.findOne({
        where: { store_code: req.body.storeCode },
      });
      // finding.password = await bcrypt.hash(req.body.newPassword, 10)
      finding.password = req.body.newPassword;
      finding.save();
      const findingMember = await Members.findOne({
        where: { username: finding.username },
      });
      findingMember.password = req.body.newPassword;
      findingMember.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "passsword was changed.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnChangePasswordAdmin = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await User.findOne({
        where: { users_code: req.body.adminCode },
      });
      // if(finding.permission !== 1){
      //     return res.status(405).json({
      //         status: false,
      //         message: 'error',
      //         description: "Don't have permission"
      //     })
      // }
      finding.password = await bcrypt.hash(req.body.newPassword, 10);
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "passsword was changed.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnSetGrossProfit = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await Settings.findOne({
        where: { setting_name: "gross_profit" },
      });
      finding.setting_value = req.body.gp;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "set gp success.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetLogSignin = async (req: any, res: any) => {
    const finding: any = await Log.findAll();
    const filtered = finding.map((data: any) => {
      return {
        adminCode: data.user_code,
        ipAddress: data.ip_address,
        section: data.section,
        details: data.details,
        status: data.status,
        dateSignin: data.createdAt,
      };
    });
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get data success.",
      log: filtered,
    });
  };
  OnChangeStatusLog = async (req: any, res: any) => {
    const finding = await Log.findOne({
      where: { user_code: req.body.adminCode },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "admin was not found.",
      });
    }
    try {
      if (req.body.status === "banned") {
        const token = await TokenLog.findOne({
          where: { refresh_token: finding.refresh_token },
        });
        if (token) {
          token.active = false;
          token.save();
        }
      }
      finding.status = req.body.status;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "admin status was changed.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetDataSettings = async (req: any, res: any) => {
    const finding = await Settings.findAll();
    const filtered = finding.map((data: any) => {
      return {
        settingName: data.setting_name,
        settingValue: data.setting_value,
        link: data.link,
        image: data.image,
        extra_image: data.extra_image,
        display: data.display,
      };
    });
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get data success.",
      setting: filtered,
    });
  };
  OnUpdateSettings = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Settings.findOne({
      where: { setting_name: req.body.settingName },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
    try {
      /** upload line image */
      if (req.files && req.files["image"]) {
        const file = req.files["image"][0];
        const imageUrl = await this.uploadImage(file);
        finding.image = imageUrl;
      }

      /** upload profile image */
      if (req.files && req.files["profile_image"]) {
        const file = req.files["profile_image"][0];
        const imageUrl = await this.uploadImage(file);
        finding.extra_image = imageUrl;
      }

      finding.setting_value = req.body.settingValue;
      finding.link = req.body.link;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "update value success.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        errorMessage: error,
        description: "something went wrong.",
      });
    }
  };
  OnUpdateDisplayWebExt = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Settings.findOne({
      where: { setting_name: req.body.settingName },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
    try {
      finding.display = req.body.display;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "update display web success.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        errorMessage: error,
        description: "something went wrong.",
      });
    }
  };
  OnUploadManual = async (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file uploaded.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "File uploaded successfully.",
      file: req.file,
    });
  };
  OnGetLineQR = async (req: any, res: any) => {
    const finding = await Settings.findOne({
      where: { setting_name: req.params.section },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "line was not found.",
      });
    }
    const filtered = {
      settingName: finding.setting_name,
      settingValue: finding.setting_value,
      link: finding.link,
      image: finding.image,
      lineProfile: finding.extra_image,
    };
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get data success.",
      setting: filtered,
    });
  };
  OnGetReservedWord = async (req: any, res: any) => {
    const finding = await Settings.findOne({
      where: { setting_name: "reserved_word" },
    });
    const filtered = {
      settingName: finding.setting_name,
      settingValue: finding.setting_value,
      image: finding.image,
      display: finding.display,
    };
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get data success.",
      setting: filtered,
    });
  };
  OnCreateRecommendGp = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await RecommendSettingGp.findOne({
        where: { priority: req.body.priority },
      });
      if (finding) {
        finding.destroy();
      }
      const recommend = await RecommendSettingGp.create({
        priority: parseInt(req.body.priority),
        value: parseInt(req.body.value),
      });
      return res.status(201).json({
        sttaus: true,
        message: "ok",
        description: "priority has been created.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnDeleteRecommendGp = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await RecommendSettingGp.destroy({
        where: { id: req.params.id },
      });
      return res.status(200).json({
        sttaus: true,
        message: "ok",
        description: "priority has been deleted.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetRecommendGp = async (req: any, res: any) => {
    try {
      const finding = await RecommendSettingGp.findAll({
        order: [["priority", "ASC"]],
      });
      return res.status(200).json({
        sttaus: true,
        message: "ok",
        description: "get data success.",
        data: finding,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };

  /** Private Function */
  private async uploadImage(file: any) {
    if (file) {
      let upload = "/uploads" + file.destination.split("uploads").pop();
      let dest = file.destination;
      var ext = path.extname(file.originalname);
      let originalname = path.basename(file.originalname, ext);
      for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
        originalname = originalname.split("(")[0];
        originalname += "(" + i + ")";
      }
      const image = await sharp(file.path)
        .withMetadata()
        .jpeg({ quality: 95 })
        .toFile(path.resolve(file.destination, originalname + ext))
        .then((data: any) => {
          fs.unlink(file.path, (err) => {
            if (err) {
              console.log(err);
            }
          });
          return upload + originalname + ext;
        });
      return image;
    } else {
      return false;
    }
  }
}
