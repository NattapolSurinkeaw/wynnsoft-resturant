import fs from "fs";
import path from "path";
const sharp = require("sharp");
import { validationResult } from "express-validator";
import { CategoryFood } from "../models/categoryFood";
import { Foods } from "../models/food";
import { Language } from "../models/language";
import { title } from "process";

export class ManageDataController {
  // start หมวดหมู่เมนู
  OngetCategoryFood = async (req: any, res: any) => {
    const cateFood = await CategoryFood.findAll();
    return res.status(200).json({
      status: true,
      message: "ok",
      data: cateFood,
    });
  };

  OnCreateCategoryFood = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        title: "เกิดข้อผิดพลาด!",
        description: "กรุณากรอกข้อมูลให้ครบ",
        errorMessage: errors.array(),
      });
    }

    try {
      // throw new Error("นี่เป็นข้อผิดพลาดที่จำลองขึ้นมาเพื่อทดสอบ catch!");
      const { title } = req.body;
      const existingCategory = await CategoryFood.findOne({ where: { title } });
      if (existingCategory) {
        return res.status(400).json({
          status: false,
          message: "error",
          title: "เกิดข้อผิดพลาด!",
          description: "มีหมวดหมู่นี้อยู่แล้ว",
        });
      }

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

        image = await sharp(req.file.path)
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

      const status_display = req.body.status === "true" ? 1 : 0;

      const categoryFood = await CategoryFood.create({
        title: req.body.title,
        priority: req.body.priority,
        status_display: status_display,
        thumbnail: image,
      });

      return res.status(201).json({
        status: true,
        message: "ok",
        title: "สำเร็จ!",
        description: "เพิ่มหมวดหมู่อาหารเรียบร้อยแล้ว",
        data: categoryFood,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "error",
        title: "เกิดข้อผิดพลาด!",
        description: "ไม่สามารถเพิ่มหมวดหมู่อาหารนี้ได้ กรุณาลองใหม่อีกครั้ง",
        errorsMessage: error.message,
      });
    }
  };

  OnUpdateCategoryFood = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        title: "เกิดข้อผิดพลาด!",
        description: "กรุณากรอกข้อมูลให้ครบ",
        errorMessage: errors.array(),
      });
    }

    try {
      // throw new Error("นี่เป็นข้อผิดพลาดที่จำลองขึ้นมาเพื่อทดสอบ catch!");

      const categoryFood = await CategoryFood.findOne({
        where: { id: req.params.id },
      });
      if (!categoryFood) {
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
        categoryFood.thumbnail = image;
      }

      categoryFood.title = req.body.title;
      categoryFood.priority = req.body.priority;
      categoryFood.status_display = req.body.status == "1" ? 1 : 0;
      categoryFood.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        title: "สำเร็จ!",
        description: "ข้อมูลหมวดหมู่อาหารถูกอัปเดตแล้ว",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "error",
        title: "เกิดข้อผิดพลาด!",
        description: "ไม่สามารถลบหมวดหมู่อาหารนี้ได้ กรุณาลองใหม่อีกครั้ง",
        errorsMessage: error.message,
      });
    }
  };

  OnDeleteCategoryFood = async (req: any, res: any) => {
    try {
      // throw new Error("นี่เป็นข้อผิดพลาดที่จำลองขึ้นมาเพื่อทดสอบ catch!");
      const categoryFood = await CategoryFood.findOne({
        where: { id: req.params.id },
      });
      if (!categoryFood) {
        return res.status(404).json({
          status: false,
          message: "error",
          title: "เกิดข้อผิดพลาด!",
          description: "ไม่พบข้อมูล",
        });
      }
      categoryFood.destroy();
      return res.status(200).json({
        status: true,
        message: "ok",
        title: "สำเร็จ!",
        description: "หมวดหมู่อาหารถูกลบเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "error",
        title: "เกิดข้อผิดพลาด!",
        description: "ไม่สามารถลบหมวดหมู่อาหารนี้ได้ กรุณาลองใหม่อีกครั้ง",
        errorsMessage: error.message,
      });
    }
  };

  OnUpdateDisplay = async (req: any, res: any) => {
    const categoryFood = await CategoryFood.findOne({
      where: { id: req.params.id },
    });
    if (!categoryFood) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "content was not found.",
      });
    }
    categoryFood.status_display = req.body.status == "1" ? 1 : 0;
    categoryFood.save();
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "data was update.",
    });
  };
  // end หมวดหมู่เมนู

  // start เมนูอาหาร
  OnGetfoodAll = async (req: any, res: any) => {
    const foods = await Foods.findAll();
    return res.status(200).json({
      status: true,
      message: "get data foods",
      data: foods,
    });
  };
  OnCreateFood = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    try {
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

        image = await sharp(req.file.path)
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

      const status_display = req.body.display === "true" ? 1 : 0;
      const best_seller = req.body.best_seller === "true" ? 1 : 0;

      const food = await Foods.create({
        cate_id: req.body.cate_id,
        name: req.body.name,
        price: req.body.price,
        special_price: req.body.special_price,
        best_seller: best_seller,
        details: req.body.details,
        thumbnail_link: image,
        thumbnail_title: req.body.thumbnail_title,
        display: status_display,
      });
      return res.status(200).json({
        status: true,
        message: "get data foods",
        data: food,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
  OnUpdateFood = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    try {
      const food = await Foods.findOne({ where: { id: req.params.id } });

      if (req.file) {
        let upload = "/uploads" + req.file.destination.split("uploads").pop();
        let dest = req.file.destination;
        var ext = path.extname(req.file.originalname);
        let originalname = path.basename(req.file.originalname, ext);

        for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
          originalname = originalname.split("(")[0];
          originalname += "(" + i + ")";
        }

        let image = await sharp(req.file.path)
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

        food.thumbnail_link = image;
      }

      const status_display = req.body.display === "true" ? 1 : 0;
      const best_seller = req.body.best_seller === "true" ? 1 : 0;

      food.cate_id = req.body.cate_id;
      food.name = req.body.name;
      food.price = req.body.price;
      food.special_price = req.body.special_price;
      food.best_seller = best_seller;
      food.details = req.body.details;
      food.thumbnail_title = req.body.thumbnail_title;
      food.display = status_display;
      food.save();

      return res.status(200).json({
        status: true,
        message: "get data foods",
        data: food,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
  OnDeleteFood = async (req: any, res: any) => {
    try {
      // throw new Error("นี่เป็นข้อผิดพลาดที่จำลองขึ้นมาเพื่อทดสอบ catch!");
      const food = await Foods.findOne({ where: { id: req.params.id } });

      if (!food) {
        return res.status(404).json({
          status: false,
          message: "error",
          title: "เกิดข้อผิดพลาด!",
          description: "ไม่พบข้อมูล",
        });
      }
      food.destroy();
      return res.status(200).json({
        status: true,
        message: "ok",
        title: "สำเร็จ!",
        description: "เมนูอาหารถูกลบเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      return res.status(500).json({
        status: false,
        message: "error",
        title: "เกิดข้อผิดพลาด!",
        description: "ไม่สามารถลบเมนูอาหารนี้ได้ กรุณาลองใหม่อีกครั้ง",
        errorsMessage: error.message,
      });
    }
  };
  OnUpdateBestSeller = async (req: any, res: any) => {
    const food = await Foods.findOne({
      where: { id: req.params.id },
    });
    if (!food) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "content was not found.",
      });
    }
    food.best_seller = req.body.status == "1" ? 1 : 0;
    food.save();
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "data was update.",
    });
  };
  // end เมนูอาหาร

  // start ตั้งค่าภาษา
  OngetAllLanguage = async (req: any, res: any) => {
    try {
      const language = await Language.findAll();

      return res.status(200).json({
        status: true,
        message: "get all languages successfully",
        data: language,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
  OnCreateLanguage = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    try {
      let imageFlag = null;
      if (req.file) {
        let upload = "/uploads" + req.file.destination.split("uploads").pop();
        let dest = req.file.destination;
        var ext = path.extname(req.file.originalname);
        let originalname = path.basename(req.file.originalname, ext);

        for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
          originalname = originalname.split("(")[0];
          originalname += "(" + i + ")";
        }

        imageFlag = await sharp(req.file.path)
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

      const language = await Language.create({
        language: req.body.language,
        title: req.body.title,
        flag: imageFlag,
        defaults: req.body.defaults,
      });

      return res.status(201).json({
        status: true,
        message: "get all languages successfully",
        data: language,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
  OnUpdateLanguage = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    try {
      const language = await Language.findOne({ where: { id: req.params.id } });
      if (!language) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "content was not found.",
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

        let image = await sharp(req.file.path)
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

        language.flag = image;
      }
      language.language = req.body.language;
      language.title = req.body.title;
      language.defaults = req.body.defaults;
      language.save();

      return res.status(200).json({
        status: true,
        message: "get all languages successfully",
        data: language,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
  OnDeleteLanguage = async (req: any, res: any) => {
    try {
      const language = await Language.findOne({ where: { id: req.params.id } });
      if (!language) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "content was not found.",
        });
      }

      language.destroy();
      return res.status(200).json({
        status: true,
        message: "delete language successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        description: "something went wrong.",
      });
    }
  };
  // end ตั้งค่าภาษา
}
