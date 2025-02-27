import { Orders } from "./../models/orders";
import { Post } from "./../models/post";
import { Product } from "./../models/product";
import { TokenLog } from "./../models/tokenLog";
import { Log } from "./../models/log";
import { ViewService } from "./../services/View.service";
import { Review } from "./../models/review";
import { ViewProduct } from "./../models/viewProduct";
import { Members } from "./../models/members";
import { sequelize } from "./../util/database";
import { Store } from "./../models/store";
import * as Config from "../util/config";
import moment from "moment";
import bcrypt from "bcrypt";
import fs from "fs";
const sharp = require("sharp");
import path from "path";
import { validationResult } from "express-validator";
import * as jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { getTestMessageUrl } from "nodemailer";
import { LineNotify, LineMessageCreateStore } from "../util/linenotify";
import { ProductFashionImage } from "../models/productFashionImage";
import { ProductFashion } from "../models/productFashion";
import { ProductCategory } from "../models/productCategory";
import { PostImage } from "../models/postImage";
import { OrderFashion } from "../models/orderFashion";
import { OrdersProduct } from "../models/ordersProduct";
import { OrdersPayment } from "../models/ordersPayment";
import { OrdersAddress } from "../models/ordersAddress";
import { ReviewFashion } from "../models/reviewFashion";
import { Settings } from "../models/settings";
export class StoreController extends ViewService {
  OnRegister = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Store.findOne({
      where: { username: req.body.username },
    });
    const finding_member = await Members.findOne({
      where: { username: req.body.username },
    });
    if (finding || finding_member) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "username already used.",
      });
    }
    /* generate access_token for user */
    const access_token = jwt.sign(
      {
        username: req.body.username,
        gender: req.body.gender,
        at: new Date().getTime(),
      },
      `${Config.secretKey}`,
      { expiresIn: "30d" }
    );
    /* generate refresh_token when register and no expire */
    const refresh_token = jwt.sign(
      {
        username: req.body.username,
        gender: req.body.gender,
        at: new Date().getTime(),
        token: access_token,
      },
      `${Config.secretKey}`
    );
    const store_str =
      req.body.username +
      req.body.gender +
      Math.random().toString().substr(2, 8) +
      moment().unix();
    const store_code = await bcrypt.hash(store_str, 10);
    const store_member_code = await bcrypt.hash(store_code, 10);
    // const hashPass = await bcrypt.hash(req.body.password, 10)
    const t = await sequelize.transaction();
    try {
      let profile_img = "";
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
          .resize(500, 500)
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
        profile_img = image;
      }
      const result = await Store.create(
        {
          store_code: store_code.replace(/\W/g, ""),
          access_token: access_token,
          refresh_token: refresh_token,
          name: req.body.name,
          username: req.body.username,
          password: req.body.password,
          age: req.body.age,
          profile_img: profile_img,
          profile_video: "",
          concept: "",
          weight: "",
          height: "",
          bwh: "",
          gender: req.body.gender,
          status: "inactive",
        },
        { transaction: t }
      );
      const store_member = await Members.create(
        {
          member_code: store_member_code.replace(/\W/g, ""),
          access_token: "",
          refresh_token: refresh_token,
          username: req.body.username,
          password: req.body.password,
          gender: req.body.gender,
          isStore: "yes",
          statusMember: "active",
        },
        { transaction: t }
      );
      await t.commit();

      /* sent line notify */
      let _dataMessage = { store: req.body.username };
      let _messageLine = LineMessageCreateStore(_dataMessage);
      await LineNotify(_messageLine);
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
  OnSingin = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array,
      });
    }
    const finding = await Store.findOne({
      where: { username: req.body.username },
    });
    if (!finding) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "user was not found.",
      });
    }
    // if(finding.status !== 'active'){
    //     return res.status(400).json({
    //         status: false,
    //         message: 'error',
    //         description: 'wait admin to verify.'
    //     })
    // }
    // const isPasswordCorrect = await bcrypt.compare(req.body.password, finding.password)
    if (req.body.password != finding.password) {
      return res.status(401).json({
        status: false,
        message: "error",
        description: "password was incorrect.",
      });
    }

    try {
      /* generate access_token for user */
      const access_token = jwt.sign(
        {
          store_id: finding.id,
          section: "store",
          store_code: finding.store_code,
          username: finding.username,
          gender: finding.gender,
          at: new Date().getTime(),
        },
        `${Config.secretKey}`,
        { expiresIn: "30d" }
      );
      // const refresh_token = jwt.sign({
      //     username: finding.username,
      //     gender: finding.gender,
      //     section: 'store',
      //     at: new Date().getTime(),
      //     token: access_token
      // }, `${Config.secretKey}`)
      // finding.access_token = access_token
      // finding.save()
      const ip = req.ip.split(":")[3];
      const userAgent = req.headers["user-agent"];
      const logging = await Log.create({
        user_code: finding.store_code,
        refresh_token: finding.refresh_token,
        details: userAgent,
        ip_address: ip ? ip : "",
        section: "store",
        status: "active",
      });
      const tokenLogging = await TokenLog.create({
        refresh_token: finding.refresh_token,
        reset_token: "",
        section: "store",
        active: true,
      });
      const orderss: any = await this.query_store_order(finding.id);
      const countOrderFashion: number = await OrderFashion.count({
        where: {
          store_id: finding.id,
          status: "pending",
        },
      });
      const result_order = orderss.filter(
        (data: any) => data.status === "pending"
      );
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "login success.",
        data: {
          access_token: access_token,
          refresh_token: finding.refresh_token,
          storeName: finding.name,
          storeCode: finding.store_code,
          gender: finding.gender,
          orderAmount: result_order.length + countOrderFashion,
          // orderAmount: result_order.length,
        },
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
  OnUpdateProfile = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Store.findOne({
      where: { store_code: req.body.storeCode },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store is not found.",
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
          .resize(500, 500)
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
        finding.profile_img = image;
      }
      const readLog = await Log.update(
        {
          status: "invoke",
        },
        {
          where: {
            user_code: finding.store_code,
            section: "store",
            details: "update-profile",
          },
        }
      );
      const logging = await Log.create({
        user_code: finding.store_code,
        refresh_token: "",
        details: "update-profile",
        ip_address: "",
        section: "store",
        status: "active",
      });
      (finding.name = req.body.name),
        (finding.age = req.body.age),
        (finding.weight = req.body.weight),
        (finding.height = req.body.height),
        (finding.bwh = req.body.bwh),
        (finding.note = req.body.note),
        finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "update data success.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetDataAll = async (req: any, res: any) => {
    const storeToken = req.authStore;
    const store = await Store.findOne({
      where: { store_code: storeToken.store_code },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "access_token",
          "refresh_token",
          "username",
          "password",
        ],
      },
    });
    if (!store) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "store was not found.",
      });
    }
    const product = await ViewProduct.findAll({
      where: {
        package_id: "PACKAGE_EXCLUSIVE",
        store_id: store.id,
        status: "active",
      },
      attributes: [
        "product_code",
        "name_member",
        "content_member",
        "name_premium",
        "content_premium",
        "price_standard",
        "price_premium",
        "recommend",
        "pre_order",
        "status",
        "sex",
        "clip",
        "hasImage",
        "store_id",
        "path_img",
        "package_id",
        "buy_limit",
        "show_gift",
        "price_sell",
        "createdAt",
        [
          sequelize.fn("GROUP_CONCAT", sequelize.col("path_img")),
          "product_img",
        ],
      ],
      group: ["store_id", "id"],
      order: [["createdAt", "DESC"]],
    });
    const review = await this.queryReviewForMember(store.id);
    const store_post = await this.query_store_post(store.id);
    let arr_product: any[] = [];
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
      };
      if (data.pre_order == "no") {
        arr_product.push(arr_data);
      } else {
        arr_product_pre.push(arr_data);
      }
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
      },
    });
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
    const store = req.authStore;
    try {
      const finding = await Store.findOne({
        where: { store_code: store.store_code },
      });
      finding.concept = req.body.concept;
      finding.save();
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
  OnGetStoreAll = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const findUpdate = await Log.findAll({
      where: {
        status: "active",
        section: "store",
        details: { [Op.substring]: "update" },
      },
    });
    const finding = await Store.findAll({
      where: { gender: req.query.gender },
      order: [["updatedAt", "DESC"]],
    });
    const filter_data = finding.map((data: any) => {
      const checkUpdateProfile = findUpdate.find(
        (e: any) =>
          e.user_code === data.store_code && e.details === "update-profile"
      );
      const checkUpdateProduct = findUpdate.find(
        (e: any) =>
          e.user_code === data.store_code && e.details === "update-product"
      );
      const checkUpdatePost = findUpdate.find(
        (e: any) =>
          e.user_code === data.store_code && e.details === "update-post"
      );
      return {
        store_code: data.store_code,
        name: data.name,
        username: data.username,
        password: data.password,
        profile_img: data.profile_img,
        profile_video: data.profile_video,
        concept: data.concept,
        age: data.age,
        weight: data.weight,
        height: data.height,
        bwh: data.bwd,
        updateProfile: checkUpdateProfile ? true : false,
        updateProduct: checkUpdateProduct ? true : false,
        updatePost: checkUpdatePost ? true : false,
        status: data.status,
        gender: data.gender,
        note: data.note,
      };
    });
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get store success.",
      store: filter_data,
    });
  };
  OnChangeStatusStore = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Store.update(
      {
        status: req.body.status,
      },
      {
        where: { store_code: req.body.storeCode },
      }
    );
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "update store success.",
    });
  };
  OnChangeStatusProduct = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const updateProd = await Product.update(
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
      description: "update product success.",
    });
  };
  OnChangeStatusPost = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const updateProd = await Post.update(
      {
        status: req.body.status,
      },
      {
        where: { post_code: req.body.postCode },
      }
    );
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "update product success.",
    });
  };
  OnCheckTotalOrder = async (req: any, res: any) => {
    const store = req.authStore;
    const orderss: any = await this.query_store_order(store.store_id);
    const result_order = orderss.filter(
      (data: any) => data.status === "pending"
    );
    const countOrderFashion: number = await OrderFashion.count({
      where: {
        store_id: store.store_id,
        status: "pending",
      },
    });
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "get order amount success.",
      orderAmount: result_order.length + countOrderFashion,
    });
  };
  OnDeleteStore = async (req: any, res: any) => {
    try {
      const findStore = await Store.findOne({
        where: { store_code: req.params.code },
      });
      if (!findStore) {
        return res.status(400).json({
          status: false,
          message: "error",
          description: "store was not found.",
        });
      }
      const findMember = await Members.findOne({
        where: { username: findStore.username },
      });
      if (!findMember) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "member account of store not found.",
        });
      }
      const findOrder = await Orders.findOne({
        where: { member_id: findMember.id, status: { [Op.not]: "success" } },
      });
      if (findOrder) {
        return res.status(400).json({
          status: false,
          message: "error",
          description: "order not success.",
        });
      }
      const findProductPending = await this.query_store_product_pending(
        findStore.id
      );
      if (findProductPending) {
        return res.status(400).json({
          status: false,
          message: "error",
          description: "product has pending.",
        });
      }
      findStore.destroy();
      if (!findMember) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "member was not found.",
        });
      }
      findMember.destroy();
      return res.status(200).json({
        status: false,
        message: "ok",
        description: "store was deleted.",
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /** For Store Fashion */
  OnGetStoreFashionData = async (req: any, res: any) => {
    
    try {
      const gp_fashion = await this.get_gp_fashion()
      const storeToken = req.authStore;
      const store = await Store.findOne({
        where: { store_code: storeToken.store_code },
        include: [
          {
            model: ProductFashion,
            required: false, // LEFT JOIN
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
            required: false, // LEFT JOIN
            where: { post_fashion: true },
            include: {
              model: PostImage,
              required: false, // LEFT JOIN
            },
          },
        ],
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "access_token",
            "refresh_token",
            "username",
            "password",
          ],
        },
        order: [
          [{ model: ProductFashion, as: "ProductFashions" }, "status", "ASC"],
          [
            { model: ProductFashion, as: "ProductFashions" },
            "createdAt",
            "DESC",
          ],
          [
            { model: ProductFashion, as: "ProductFashions" },
            { model: ProductFashionImage },
            "priority",
            "ASC",
          ],
          [{ model: Post, as: "Posts" }, "createdAt", "DESC"],
          [
            { model: Post, as: "Posts" },
            { model: PostImage },
            "priority",
            "ASC",
          ],
        ],
      });

      if (!store) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "store was not found.",
        });
      }

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get store data success.",
        storeData: store,
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

  OnGetCateFashion = async (req: any, res: any) => {
    try {
      const cates = await ProductCategory.findAll({
        where: { display: true },
        order: [["priority", "ASC"]],
        attributes: {
          include: [[sequelize.literal("ProductCategory.id"), "cate_id"]],
        },
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get cate fashion success.",
        product_cate: cates,
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

  OnGetOrderFashion = async (req: any, res: any) => {
    try {
      const gp_fashion = await this.get_gp_fashion()
      const storeToken = req.authStore;
      const store = await Store.findOne({
        where: { store_code: storeToken.store_code },
      });
      const order_fashions = await OrderFashion.findAll({
        where: { store_id: store.id },
        include: [
          {
            model: OrdersProduct,
            required: false, // LEFT JOIN
            include: {
              model: ProductFashion,
              required: false, // LEFT JOIN
              include: [
                {
                  model: ProductFashionImage,
                  required: false, // LEFT JOIN
                },
                {
                  model: ReviewFashion,
                  required: false, // LEFT JOIN
                },
              ],
              
            },
          },
          {
            model: OrdersPayment,
            required: false, // LEFT JOIN
          },
          {
            model: OrdersAddress,
            required: false, // LEFT JOIN
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (!order_fashions) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "Order fashion was not found.",
        });
      }

      order_fashions?.map((order: any) => {
        const orderProd = order?.dataValues?.OrdersProduct?.dataValues
        if (orderProd) {
          const price_store = Math.ceil(orderProd.price / ((orderProd.gross_profit / 100) + 1))
          orderProd.price_store = price_store
        }
        const prod = order?.dataValues?.OrdersProduct?.dataValues?.ProductFashion?.dataValues
        if (prod) {
          prod.price = prod?.price + Math.ceil(prod?.price * orderProd.gross_profit / 100)
        }
      })

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "Get order fashion data success.",
        orderData: order_fashions,
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


  /** Private Function */
  private async get_gp_fashion() {
    const setting_fashion = await Settings.findOne({
      where: { setting_name: "gross_profit_fashion" },
    });

    return setting_fashion.setting_value || 0;
  }
}
