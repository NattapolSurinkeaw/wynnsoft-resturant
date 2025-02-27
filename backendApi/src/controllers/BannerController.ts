import { Banner } from "./../models/banner";
import moment from "moment";
import { validationResult } from "express-validator";
import fs from "fs";
const sharp = require("sharp");
import path from "path";
import { Store } from "../models/store";

export class BannerController {
  OnGetBanner = async (req: any, res: any) => {
    let gender: string;
    if (req.store_id) {
      const store = await Store.findOne({ where: { id: req.store_id } });
      if (!store) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "store was not found.",
        });
      }
      gender = store.gender;
    } else {
      gender = req.body.gender;
    }
    const finding = await Banner.findOne({
      where: {
        position: req.body.page,
        isMen: gender == "men" ? true : false,
        display: true,
      },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "banner was not found.",
      });
    }
    const filtered = {
      title: finding.title,
      content: finding.content,
      image: finding.img_path,
      h1: finding.h1,
      h2: finding.h2,
    };
    return res.status(200).json({
      status: true,
      message: "ok",
      descriptin: "get banner success.",
      banner: filtered,
    });
  };
  OnUpdateBanner = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "erorr",
        errorMessage: errors.array(),
      });
    }
    const finding = await Banner.findOne({ where: { id: req.body.id } });
    if (!finding) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "banner was not found.",
      });
    }
    try {
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
          .then((data: any) => {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.log(err);
              }
            });
            return upload + originalname + ext;
          });
        finding.img_path = image;
      }
      finding.title = req.body.title;
      finding.content = req.body.content;
      finding.display = req.body.display;
      finding.h1 = req.body.h1;
      finding.h2 = req.body.h2;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "banner was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnChangeDisplayBanner = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await Banner.findOne({ where: { id: req.body.id } });
      if (!finding) {
        return res.status(400).json({
          status: false,
          message: "error",
          description: "banner was not found.",
        });
      }
      finding.display = req.body.display;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "adbanners was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
}
