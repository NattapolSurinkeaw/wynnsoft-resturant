import fs from "fs";
import path from "path";
const sharp = require("sharp");
import { validationResult } from "express-validator";
import { CategoryFood } from "../models/categoryFood"
import { Foods } from "../models/food";

export class ManageDataController {
  // start หมวดหมู่เมนู
  OngetCategoryFood = async (req: any, res: any) => {
    const cateFood = await CategoryFood.findAll();
    return res.status(200).json({
      status: true,
      message: "ok",
      data: cateFood
    });
  }
  OnCreateCategoryFood = async (req: any, res: any) => {
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

      const status_display = req.body.status === "true" ? 1 : 0;

      const categoryFood = await CategoryFood.create({
          title: req.body.title,
          priority: req.body.priority,
          status_display: status_display,
          thumbnail: image
      });

      return res.status(201).json({
          status: true,
          message: "ok",
          description: "data was created.",
          data: categoryFood
      });
    } catch(error) {
      return res.status(500).json({
          status: false,
          message: error,
          description: 'something went wrong.'
      })
    }
  }
  OnUpdateCategoryFood = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    const categoryFood = await CategoryFood.findOne({ where: { id : req.params.id}});
    if (!categoryFood) {
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
    categoryFood.status_display = req.body.status === "true" ? 1 : 0;
    categoryFood.save();
    return res.status(200).json({
      status: true,
      message: 'ok',
      description: 'data was update.'
    })
  }
  OnDeleteCategoryFood = async (req: any, res: any) => {
    const categoryFood = await CategoryFood.findOne({ where: { id : req.params.id}});
    if (!categoryFood) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "content was not found.",
      });
    }
    categoryFood.destroy();
    return res.status(200).json({
      status: true,
      message: 'ok',
      description: 'data was deleted'
    });
  }
  OnUpdateDisplay = async (req: any, res: any) => {
    const categoryFood = await CategoryFood.findOne({where: {id: req.params.id}});
    if (!categoryFood) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "content was not found.",
      });
    }
    categoryFood.status_display = req.body.status == 1 ? 1 : 0;
    categoryFood.save();
    return res.status(200).json({
      status: true,
      message: 'ok',
      description: 'data was update.'
    });
  }
  // end หมวดหมู่เมนู

  // start เมนูอาหาร
  OnGetfoodAll = async (req: any, res: any) => {
    const foods = await Foods.findAll();
    return res.status(200).json({
      status: true,
      message: 'get data foods',
      data : foods
    });
  }
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
        cate_id : req.body.cate_id,
        name: req.body.name,
        price: req.body.price,
        special_price: req.body.special_price,
        best_seller: best_seller,
        details: req.body.details,
        thumbnail_link: image,
        thumbnail_title: req.body.thumbnail_title,
        display : status_display,
      })
      return res.status(200).json({
        status: true,
        message: 'get data foods',
        data : food
      });

    } catch(error) {
      return res.status(500).json({
          status: false,
          message: error,
          description: 'something went wrong.'
      })
    }
  }
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
      const food = await Foods.findOne({where: {id: req.params.id}});

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
      food.name= req.body.name;
      food.price= req.body.price;
      food.special_price= req.body.special_price;
      food.best_seller= best_seller;
      food.details= req.body.details;
      food.thumbnail_title= req.body.thumbnail_title;
      food.display = status_display;
      food.save();

      return res.status(200).json({
        status: true,
        message: 'get data foods',
        data : food
      });
    } catch(error) {
      return res.status(500).json({
          status: false,
          message: error,
          description: 'something went wrong.'
      })
    }
  }
  OnDeleteFood = async(req: any, res: any) => {
    try {
      const food = await Foods.findOne({ where: {id: req.params.id}});

      if (!food) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "content was not found.",
        });
      }
      food.destroy();
      return res.status(200).json({
        status: true,
        message: 'delete food successfully',
      });

    } catch(error) {
      return res.status(500).json({
          status: false,
          message: error,
          description: 'something went wrong.'
      })
    }
  }
  // end เมนูอาหาร
}