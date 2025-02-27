import { Log } from "./../models/log";
import { PostImage } from "./../models/postImage";
import { Post } from "./../models/post";
import { ProductImage } from "./../models/productImage";
import { Product } from "./../models/product";
import { ViewService } from "./../services/View.service";
import { Review } from "./../models/review";
import { ViewProduct } from "./../models/viewProduct";
import { Members } from "./../models/members";
import { sequelize } from "./../util/database";
import { Op } from "sequelize";
import { Store } from "./../models/store";
import * as Config from "../util/config";
import moment from "moment";
import bcrypt from "bcrypt";
import fs from "fs";
const sharp = require("sharp");
import path from "path";
import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import { ProductCategory } from "../models/productCategory";
import { ProductFashion } from "../models/productFashion";
import { ProductFashionImage } from "../models/productFashionImage";
import { Settings } from "../models/settings";

export class AdminStoreController extends ViewService {
  OnCreateProduct = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const store_profile = await Store.findOne({
      where: { store_code: req.body.storeCode },
    });
    if (!store_profile) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store was not found.",
      });
    }
    const product_str =
      store_profile.id +
      Math.random().toString().substr(2, 10) +
      moment().unix();
    const product_code = await bcrypt.hash(product_str, 10);
    const prod_most_prior = await Product.findOne({
      where: { store_id: store_profile.id, pre_order: "no", status: "active" },
      order: [["priority", "DESC"]],
    });
    const t = await sequelize.transaction();
    try {
      const product_result = await Product.create(
        {
          product_code: product_code.replace(/\W/g, ""),
          name_member: req.body.name_member,
          content_member: req.body.content_member,
          name_premium: req.body.name_premium,
          content_premium: req.body.content_premium,
          price_standard: parseInt(req.body.price_standard),
          price_premium: parseInt(req.body.price_premium),
          recommend: "no",
          pre_order: "no",
          status: "active",
          sex: store_profile.gender,
          clip: req.body.clip,
          hasImage: req.body.hasImage,
          store_id: store_profile.id,
          priority: prod_most_prior ? prod_most_prior.priority + 1 : 0,
          priority_recommend: 0,
        },
        { transaction: t }
      );
      let productImage: any[] = [];
      let count = 0;
      if (req.files.standard) {
        for (const file of req.files.standard) {
          let upload = "/uploads" + file.destination.split("uploads").pop();
          let dest = file.destination;
          var ext = path.extname(file.originalname);
          let originalname = path.basename(file.originalname, ext);
          for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
            originalname = originalname.split("(")[0];
            originalname += "(" + i + ")";
          }
          const image = await sharp(file.path)
            .resize(500, 500)
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
            display: "yes",
            premium: "no",
            member_type: "",
            priority: count++,
          };
          productImage.push(arr);
        }
      }
      if (req.files.premium) {
        for (const file of req.files.premium) {
          let upload = "/uploads" + file.destination.split("uploads").pop();
          let dest = file.destination;
          var ext = path.extname(file.originalname);
          let originalname = path.basename(file.originalname, ext);
          for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
            originalname = originalname.split("(")[0];
            originalname += "(" + i + ")";
          }
          const image = await sharp(file.path)
            .resize(500, 500)
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
            hover: "no",
            display: "yes",
            premium: "yes",
            member_type: "",
            priority: count++,
          };
          productImage.push(arr);
        }
      }
      const product_image = await ProductImage.bulkCreate(productImage, {
        transaction: t,
      });
      await t.commit();
      return res.status(201).json({
        status: true,
        message: "ok",
        description: "data was created.",
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnCreateProductPre = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const store_profile = await Store.findOne({
      where: { store_code: req.body.storeCode },
    });
    if (!store_profile) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store was not found.",
      });
    }
    const product_str =
      store_profile.id +
      Math.random().toString().substr(2, 10) +
      moment().unix();
    const product_code = await bcrypt.hash(product_str, 10);
    const prod_most_prior = await Product.findOne({
      where: { store_id: store_profile.id, pre_order: "yes", status: "active" },
      order: [["priority_recommend", "DESC"]],
    });
    const t = await sequelize.transaction();
    try {
      const product_result = await Product.create(
        {
          product_code: product_code.replace(/\W/g, ""),
          name_member: "",
          content_member: "",
          name_premium: req.body.name_premium,
          content_premium: req.body.content_premium,
          price_standard: parseInt(req.body.price_premium),
          price_premium: parseInt(req.body.price_premium),
          recommend: "no",
          pre_order: "yes",
          status: "active",
          sex: store_profile.gender,
          clip: req.body.clip,
          hasImage: req.body.hasImage,
          store_id: store_profile.id,
          priority: 0,
          priority_recommend: prod_most_prior
            ? prod_most_prior.priority + 1
            : 0,
        },
        { transaction: t }
      );
      let productImage: any[] = [];
      if (req.files.premium) {
        let count = 0;
        for (const file of req.files.premium) {
          let upload = "/uploads" + file.destination.split("uploads").pop();
          let dest = file.destination;
          var ext = path.extname(file.originalname);
          let originalname = path.basename(file.originalname, ext);
          for (let i = 1; fs.existsSync(dest + originalname + ext); i++) {
            originalname = originalname.split("(")[0];
            originalname += "(" + i + ")";
          }
          const image = await sharp(file.path)
            .resize(500, 500)
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
            hover: "no",
            display: "yes",
            premium: "yes",
            member_type: "",
            priority: count++,
          };
          productImage.push(arr);
        }
      }
      const product_image = await ProductImage.bulkCreate(productImage, {
        transaction: t,
      });
      await t.commit();
      return res.status(201).json({
        status: true,
        message: "ok",
        description: "data was created.",
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnCreatePost = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const store = await Store.findOne({
      where: { store_code: req.body.storeCode },
    });
    if (!store) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store was not found.",
      });
    }
    const all_post = await Post.findAll({
      where: { store_id: store.id, status: "active" },
    });
    // if(all_post.length > 10){
    //     return res.status(400).json({
    //         status: false,
    //         message: 'error',
    //         description: 'your post has limited.'
    //     })
    // }
    const t = await sequelize.transaction();
    try {
      const str_post_code = `${store.code}${moment().format("YYYYMMDDHHmmss")}`;
      let post_code = await bcrypt.hash(str_post_code, 10);
      const post = await Post.create(
        {
          post_code: post_code.replace(/\W/g, ""),
          store_id: store.id,
          display: "yes",
          caption: req.body.caption,
          status: "active",
        },
        { transaction: t }
      );
      let postImage: any[] = [];
      if (req.files) {
        let count = 0;
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
            .resize(500, 500)
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
            post_id: post.id,
            path_image: image,
            priority: count++,
          };
          postImage.push(arr);
        }
      }
      const post_image = await PostImage.bulkCreate(postImage, {
        transaction: t,
      });
      await t.commit();
      return res.status(201).json({
        status: true,
        message: "ok",
        description: "data was created.",
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnUpdateConcept = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const store = await Store.findOne({
      where: { store_code: req.body.storeCode },
    });
    if (!store) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store was not found.",
      });
    }
    try {
      store.concept = req.body.concept;
      store.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "concept was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetStoreDetails = async (req: any, res: any) => {
    const adminToken = req.adminToken;
    const store = await Store.findOne({
      where: { store_code: req.params.code },
      attributes: {
        exclude: ["createdAt", "updatedAt", "access_token", "refresh_token"],
      },
    });
    if (!store) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store was not found.",
      });
    }
    const logging = await Log.update(
      {
        status: "invoke",
      },
      {
        where: {
          user_code: req.params.code,
          details: { [Op.substring]: "update" },
        },
      }
    );
    const product: any = await this.query_product_store_admin(store.id);
    const product_fashion: any = await this.query_product_fashion_store_admin(
      store.id
    );
    const review = await Review.findAll({
      where: { store_id: store.id },
      order: [["createdAt", "DESC"]],
    });
    const store_post = await this.query_store_post_admin(store.id, 0);
    const store_post_fashion = await this.query_store_post_admin(store.id, 1);
    let arr_product: any[] = [];
    let arr_product_fashion: any[] = [];
    let arr_product_pre: any[] = [];
    product.forEach((data: any) => {
      const arr_data = {
        product_code: data.product_code,
        name: data.name_premium,
        content_product: data.content_premium,
        price: data.price_premium,
        recommend: data.recommend,
        sex: data.sex,
        clip: data.clip,
        hasImage: data.hasImage,
        show_gift: data.show_gift,
        preOrder: data.pre_order,
        product_img: data.product_img,
        priority: data.priority,
        status: data.status,
      };
      if (data.pre_order == "no") {
        arr_product.push(arr_data);
      } else {
        arr_product_pre.push(arr_data);
      }
    });
    product_fashion.forEach((data: any) => {
      const arr_data = {
        ...data,
        product_code: data.product_code,
        name: data.product_name,
        recommend: data.recommend,
        product_img: data.product_img,
        sex: data.gender,
        status: data.status,
        priority: data.priority,
        content_product: data.details,
      };
      arr_product_fashion.push(arr_data);
    });
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get data success.",
      data: {
        store_detail: store,
        all_product: arr_product,
        pre_order: arr_product_pre,
        store_post: store_post,
        review: review,
        store_post_fashion,
        product_fashion: arr_product_fashion,
      },
    });
  };
  OnSetProductRecommend = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const product = await Product.findOne({
      where: { product_code: req.body.productCode },
    });
    try {
      product.recommend = req.body.recommend;
      product.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "product status was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnSetProductPriority = async (req: any, res: any) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const product = await Product.findOne({
        where: { product_code: req.body.productCode },
      });
      if (!product) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "product was not found.",
        });
      }
      const updateAds = await Product.update(
        {
          priority: product.priority,
        },
        {
          where: {
            store_id: product.store_id,
            pre_order: product.pre_order,
            priority: parseInt(req.body.priority),
            status: "active",
          },
        }
      );
      product.priority = req.body.priority;
      product.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "product was updated.",
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

  /*** for product recommend */
  OnSetProductPriorityRecommend = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const product = await Product.findOne({
        where: { product_code: req.body.productCode },
      });
      if (!product) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "product was not found.",
        });
      }
      const updateAds = await Product.update(
        {
          priority_recommend: product.priority_recommend,
        },
        {
          where: {
            sex: req.body.sex,
            recommend: "yes",
            status: "active",
            priority_recommend: parseInt(req.body.priority),
          },
        }
      );
      product.priority_recommend = parseInt(req.body.priority);
      product.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "product was updated.",
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
  OnGetProductRecommend = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      // const product = await Product.findAll({
      //     where:{
      //         recommend: 'yes',
      //         status: 'active',
      //         sex: req.params.sex
      //     },
      //     order: [
      //         ['priority_recommend', 'ASC']
      //     ]
      // })
      const product: any = await this.query_product_recommend(
        "PACKAGE_EXCLUSIVE",
        req.params.sex
      );
      const response_product = await product.map((data: any) => {
        return {
          buy_limit: data.buy_limit,
          clip: data.clip,
          content_member: data.content_member,
          content_premium: data.content_premium,
          createdAt: data.createdAt,
          id: data.id,
          itemNum: data.itemNum,
          name_member: data.name_member,
          name_premium: data.name_premium,
          package_id: data.package_id,
          path_img: data.path_img,
          pre_order: data.pre_order,
          price_premium: data.price_premium,
          price_sell: data.price_sell,
          price_standard: data.price_standard,
          priority: data.priority,
          priority_recommend: data.priority_recommend,
          product_code: data.product_code,
          product_img: data.product_img,
          recommend: data.recommend,
          sex: data.sex,
          show_gift: data.show_gift,
          show_img_limit: data.show_img_limit,
          status: data.status,
          status_premium: data.status_premium,
          store_concept: data.store_concept,
          store_detail_limit: data.store_detail_limit,
          store_id: data.store_id,
          storeName: data.store_name,
          store_profile: data.store_profile,
          updatedAt: data.updatedAt,
          username: data.username,
        };
      });
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get product success.",
        product_pre: response_product,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetProductCate = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const cates = await ProductCategory.findAll({
        order: [["priority", "ASC"]],
        attributes: {
          include: [[sequelize.literal("id"), "cate_id"]],
        },
      });

      const maped = await cates.map((data: any) => {
        return {
          ...data,
          cate_id: data.id,
        };
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get product cate success.",
        product_cate: cates,
        // product_cate: maped,
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
  OnUpdateProductCate = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    const finding = await ProductCategory.findOne({
      where: { id: req.body.cate_id },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "Product cate was not found.",
      });
    }
    try {
      /** upload image */
      if (req.files && req.files["image"]) {
        const file = req.files["image"][0];
        const imageUrl = await this.uploadImage(file);
        finding.path_img = imageUrl;
      }

      /** upload banner image */
      if (req.files && req.files["banner_image"]) {
        const file = req.files["banner_image"][0];
        const imageUrl = await this.uploadImage(file);
        finding.path_img_banner = imageUrl;
      }

      finding.name = req.body.name;
      finding.description = req.body.description;
      finding.slug = req.body.slug;
      finding.cate_url = null;
      finding.display = req.body.display;
      finding.priority = req.body.priority;
      finding.updatedAt = moment();
      finding.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "update product cate success.",
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

  /** For Fashion */
  OnSetProductFashionRecommend = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const product = await ProductFashion.findOne({
      where: { product_code: req.body.productCode },
    });
    try {
      product.recommend = req.body.recommend;
      product.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "product fashion status was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };

  OnChangeStatusProductFashion = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const updateProd = await ProductFashion.update(
      {
        status: req.body.status,
      },
      {
        where: { product_code: req.body.productCode },
      }
    );
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "update product fashion success.",
    });
  };

  OnEditProductFashion = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }

    const product = await ProductFashion.findOne({
      where: { product_code: req.params.code, store_id: req.body.store_id },
    });

    if (!product) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "product fashion was not found.",
      });
    }

    try {
      const setting_fashion = await Settings.findOne({
        where: { setting_name: "gross_profit_fashion" },
      });
      if (!setting_fashion.setting_value) setting_fashion.setting_value = 0;
      const gp_fashion = setting_fashion.setting_value;

      product.product_name = req.body.name;
      product.details = req.body.content_product;
      product.defect = req.body.defect;
      product.price = parseInt(req.body.price_store);
      // product.price = parseInt(req.body.price_store) + Math.ceil((parseInt(req.body.price_store) * gp_fashion) / 100);
      product.price_store = parseInt(req.body.price_store);
      product.gp = gp_fashion;
      product.save();

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "product fashion was updated.",
      });
    } catch (error) {
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
