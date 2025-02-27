import { Settings } from "../models/settings";
import { Log } from "../models/log";
import { ProductImage } from "../models/productImage";
import { ViewProductAllStore } from "../models/viewProductAllStore";
import { sequelize } from "../util/database";
import { Product } from "../models/product";
import { Store } from "../models/store";
import { Op, QueryTypes } from "sequelize";
import * as Config from "../util/config";
import moment from "moment";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { ViewService } from "../services/View.service";
import { ViewProduct } from "../models/viewProduct";
import { ProductCategory } from "../models/productCategory";
import { ProductFashion } from "../models/productFashion";
import fs from "fs";
import path from "path";
import { ProductFashionImage } from "../models/productFashionImage";
import { Post } from "../models/post";
import { PostImage } from "../models/postImage";
import { BankAccount } from "../models/bankAccount";
import { BankProvider } from "../models/bankProvider";

const sharp = require("sharp");
export class ProductFashionController extends ViewService {
  CateIndex = async (req: any, res: any) => {
    try {
      const genderParam = sequelize.escape(req.params.gender);
      // const paramsArr = [genderParam, 'unisex']
      let cates = await ProductCategory.findAll({
        where: { display: true },
        order: [["priority", "ASC"]],
        include: [
          {
            model: ProductFashion,
            required: false, // LeftJoin
            where: {
              display: true,
              status: "active",
              [Op.or]: [{ gender: req.params.gender }, { gender: "unisex" }], // OrWhere
            },
            include: [
              {
                model: ProductFashionImage,
                required: false, // LeftJoin
              },
            ],
          },
        ],
        attributes: {
          include: [
            [sequelize.literal("ProductCategory.id"), "cate_id"],
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM product_fashions AS pf WHERE pf.cate_id = ProductCategory.id AND (pf.gender = ${genderParam} OR pf.gender = 'unisex'))`
              ),
              "product_count",
            ],
          ],
        },
        // replacements: paramsArr,
      });

      const productLimit = await Store.findAll({
        where: {
          status: "active",
        },
        order: [["latest_update", "DESC"]],
        include: [
          {
            model: ProductFashion,
            required: false, // INNER JOIN
            where: {
              gender: req.params.gender,
              display: true,
              status: "active",
            },
            order: [["updatedAt", "DESC"]],
            // limit: 2, // query product ตาม store_id และ limit product = 2
          },
        ],
      });

      let prod: any[] = [];

      productLimit.forEach((store: any) => {
        if (store.ProductFashions.length > 0) {
          if (!prod[store.id]) {
            prod[store.id] = {};
          }
          store.ProductFashions.forEach((product: any) => {
            if (!prod[store.id][product.cate_id]) {
              prod[store.id][product.cate_id] = [];
            }
            if (prod[store.id][product.cate_id].length < 2) {
              prod[store.id][product.cate_id].push(product);
            }
          });
        }
      });

      prod = Object.values(prod);

      const count_underwear = await Product.count({
        where: {
          status: "active",
        },
      });

      if (cates) {
        cates = cates.map((cate: any) => {
          if (cate.id == 8) {
            cate.dataValues.product_count = count_underwear;
            return cate;
          }

          let count = 0;
          prod.forEach((p_cate: any) => {
            if (p_cate[cate.id]) {
              count += parseInt(p_cate[cate.id].length);
            }
          });
          cate.dataValues.product_count = count;
          return cate;
        });
      }

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get product cate success.",
        product_cate: cates,
        // prod: prod,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
        error: error,
      });
    }
  };

  OnGetStoreFashionById = async (req: any, res: any) => {
    try {
      const store_id = req.params.store_id;
      const gp_fashion = await this.get_gp_fashion();

      const store = await Store.findOne({
        where: { id: store_id },
        include: [
          {
            model: ProductFashion,
            required: true, // INNER JOIN
            where: {
              display: true,
              status: "active",
            },
            attributes: {
              include: [
                [
                  sequelize.literal(
                    `price + CEIL(price * ${gp_fashion} / 100)`
                  ),
                  "price",
                ],
              ],
            },
            include: {
              model: ProductFashionImage,
              required: false, // LEFT JOIN
            },
          },
          {
            model: Post,
            required: false, // INNER JOIN
            where: { post_fashion: true, display: "yes", status: "active" },
            include: {
              model: PostImage,
              required: false, // LEFT JOIN
            },
          },
        ],
        order: [
          [{ model: ProductFashion }, "updatedAt", "DESC"],
          [{ model: Post }, "createdAt", "ASC"],
          [
            { model: ProductFashion, as: "ProductFashions" },
            { model: ProductFashionImage },
            "priority",
            "ASC",
          ],
          [
            { model: Post, as: "Posts" },
            { model: PostImage },
            "priority",
            "ASC",
          ],
        ],
        attributes: {
          exclude: ["access_token", "refresh_token", "username", "password"],
        },
      });

      if (!store) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "store was not found.",
        });
      }

      // sort productFashion and post By updatedAt DESC
      store.ProductFashions.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
      );
      store.Posts.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
      );

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get store data by id success.",
        storeData: store,
        // storeData: store,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
        error: error,
      });
    }
  };

  OnGetProductByCate = async (req: any, res: any) => {
    const gender = req.params.gender;
    const cate_id = req.params.cate_id;
    const gp_fashion = await this.get_gp_fashion();

    try {

      const stores = await Store.findAll({
        where: {
          status: "active",
        },
        include: [
          {
            model: ProductFashion,
            required: true, // INNER JOIN
            where: {
              gender: gender,
              cate_id: cate_id,
              display: true,
              status: "active",
            },
            attributes: {
              include: [
                [
                  sequelize.literal(
                    `price + CEIL(price * ${gp_fashion} / 100)`
                  ),
                  "price",
                ],
              ],
            },
            include: [
              {
                model: Store,
                required: false, // LEFT JOIN
                where: { status: "active" },
                attributes: {
                  exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "access_token",
                    "refresh_token",
                  ],
                },
              },
              {
                model: ProductFashionImage,
                required: false, // LEFT JOIN
              },
            ],
            // limit: 2, // query product ตาม store_id และ limit product = 2
          },
        ],
        order: [
          ["latest_update", "DESC"],
          [{ model: ProductFashion }, "updatedAt", "DESC"],
          [
            { model: ProductFashion, as: "ProductFashions" },
            { model: ProductFashionImage },
            "priority",
            "ASC",
          ],
        ],
      });

      let prod: any[] = [];
      stores.map((store: any) => {
        if (store.ProductFashions.length > 0) {
          prod.push(...store.ProductFashions.slice(0, 2));
        }
      });

      const productCate = await ProductCategory.findOne({
        where: { id: cate_id },
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get product fashion success.",
        product: prod,
        productCate,
        stores,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
        error: error,
      });
    }
  };

  OnGetProductById = async (req: any, res: any) => {
    const id = req.params.id;
    const store_id = req.params.store_id;
    const gp_fashion = await this.get_gp_fashion();
    
    try {
      const product = await ProductFashion.findOne({
        where: { id: id, store_id: store_id },
        attributes: {
          include: [
            [
              sequelize.literal(`price + CEIL(price * ${gp_fashion} / 100)`), "price",
            ],
          ],
        },
        include: [
          {
            model: Store,
            required: true, // INNER JOIN
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "access_token",
                "refresh_token",
              ],
            },
            include: {
              model: Post,
              where: { post_fashion: true, display: "yes", status: "active" },
              required: false, // LEFT JOIN
              include: {
                model: PostImage,
                required: false, // LEFT JOIN
              },
            },
          },
          {
            model: ProductFashionImage,
            required: false, // LEFT JOIN
          },
        ],
        order: [
          [{ model: Store }, { model: Post }, "updatedAt", "DESC"],
          [{ model: ProductFashionImage }, "priority", "ASC"],
        ],
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get product by id success.",
        product: product,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
        error: error,
      });
    }
  };

  OnPrePayment = async (req: any, res: any) => {
    const product_code = req.params.code;
    const store_id = req.params.store_id;
    const gp_fashion = await this.get_gp_fashion();
    const cod_fashion = await this.get_cod_value("cod_fashion");

    try {
      const product = await ProductFashion.findOne({
        where: { product_code, store_id, status: "active" },
        attributes: {
          exclude: [
            "price"
          ],
          include: [
            [
              sequelize.literal(`price + CEIL(price * ${gp_fashion} / 100)`), "price"
            ],
          ],
        },
        include: [
          {
            model: Store,
            required: true, // INNER JOIN
            attributes: {
              exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "access_token",
                "refresh_token",
              ],
            },
          },
          {
            model: ProductFashionImage,
            required: false, // LEFT JOIN
          },
        ],
      });

      const bank = await BankAccount.findAll({
        where: { bank_type_id: 2, status: "active" },
        include: [
          {
            model: BankProvider,
            required: true, // INNER JOIN
          },
        ],
      });

      if (!product) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "product fashion was not found.",
        });
      }

      if (!bank) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "Bank account was not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get pre payment details success.",
        product,
        bank,
        cod_fashion,
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
        error: error,
      });
    }
  };

  /** Create Fashion Product */
  OnCreateFashionProduct = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const store = req.authStore;
    const store_profile = await Store.findOne({
      where: { store_code: store.store_code },
    });
    const prod_most_prior = await Product.findOne({
      where: { store_id: store_profile.id },
      order: [["priority", "DESC"]],
    });
    const product_str =
      store_profile.id +
      Math.random().toString().substr(2, 10) +
      moment().unix();
    const product_code = await bcrypt.hash(product_str, 10);
    const verify = await Settings.findOne({
      where: { setting_name: "auto_verify" },
    });
    const t = await sequelize.transaction();
    const gp_fashion = await this.get_gp_fashion()
    try {
      const product_result = await ProductFashion.create(
        {
          product_code: product_code.replace(/\W/g, ""),
          cate_id: req.body.cate_id,
          store_id: store_profile.id,
          product_name: req.body.product_name,
          details: req.body.details,
          defect: req.body.defect,
          price: parseInt(req.body.price),
          // price: parseInt(req.body.price) + Math.ceil((parseInt(req.body.price) * gp_fashion) / 100),
          price_store: parseInt(req.body.price),
          gp: 0,
          status: "active",
          display: true,
          gender: store.gender,
          priority: prod_most_prior ? prod_most_prior.priority + 1 : 0,
          // status: verify.setting_value === "yes" ? "active" : "pending",
        },
        { transaction: t }
      );
      let productImage: any[] = [];
      let count = 0;
      if (req.files) {
        for (const file of req.files) {
          let upload = "/uploads" + file.destination.split("uploads").pop();
          let dest = file.destination;
          var ext = path.extname(file.originalname);
          let originalname = path.basename(file.originalname, ext);
          for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
            originalname = originalname.split("(")[0];
            originalname += "(" + i + ")";
          }
          const image = await sharp(file.path)
            .resize(500, 500, { fit: "inside" }) // no crop
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
          const arr = {
            product_id: product_result.id,
            path_img: image,
            hover: count == 1 ? "yes" : "no",
            display: true,
            priority: count++,
          };
          productImage.push(arr);
        }
      }
      const product_image = await ProductFashionImage.bulkCreate(productImage, {
        transaction: t,
      });

      const readLog = await Log.update(
        {
          status: "invoke",
        },
        {
          where: {
            user_code: store.store_code,
            section: "store",
            details: "update-product",
          },
        }
      );
      const logging = await Log.create({
        user_code: store.store_code,
        refresh_token: "",
        details: "update-product",
        ip_address: "",
        section: "store",
        status: "active",
      });
      const updateStore = await Store.update(
        {
          freefield: new Date(),
          latest_update: new Date(),
        },
        {
          where: {
            id: store_profile.id,
          },
        }
      );

      await t.commit();

      const productFashion = await ProductFashion.findAll({
        where: { store_id: store_profile.id },
        include: {
          model: ProductFashionImage,
          required: false, // LEFT JOIN
        },
        order: [
          ["status", "ASC"],
          ["createdAt", "DESC"],
          [{ model: ProductFashionImage }, "priority", "ASC"],
        ],
      });

      return res.status(201).json({
        status: true,
        message: "ok",
        description: "data was created.",
        productFashion,
        // newProduct : {...product_result, product_images: product_image}
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };

  OnDeleteProductFashion = async (req: any, res: any) => {
    const product = await ProductFashion.findOne({
      where: { product_code: req.params.code },
    });
    if (!product) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "product fashion was not found.",
      });
    }
    try {
      product.destroy();
      const product_image = ProductFashionImage.destroy({
        where: { product_id: product.id },
      });
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "product fashion was deleted.",
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

  /** Private Function */
  private async uploadImage(file: any) {
    if (file) {
      /** for slip destination */
      const destImage =
        file.destination.split("uploads")[0] +
        "/spacialImage" +
        file.destination.split("uploads")[1];
      if (!fs.existsSync(`${destImage}`)) {
        fs.mkdirSync(destImage, { recursive: true });
      }
      // let dest = file.destination
      let upload = "/spacialImage" + file.destination.split("uploads").pop();
      var ext = path.extname(file.originalname);
      let originalname = path.basename(file.originalname, ext);
      for (let i = 1; fs.existsSync(destImage + originalname + ext); i++) {
        originalname = originalname.split("(")[0];
        originalname += "(" + i + ")";
      }
      const image = await sharp(file.path)
        .withMetadata()
        .jpeg({ quality: 95 })
        .toFile(path.resolve(destImage, originalname + ext))
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

  private async get_gp_fashion() {
    const setting_fashion = await Settings.findOne({
      where: { setting_name: "gross_profit_fashion" },
    });

    return setting_fashion.setting_value || 0;
  }

  private async get_cod_value(_type : string) {
    const setting_fashion = await Settings.findOne({
      where: { setting_name: _type },
    });

    return setting_fashion.setting_value;
  }
}
