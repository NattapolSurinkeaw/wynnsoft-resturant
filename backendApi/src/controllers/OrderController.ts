import { RecommendSettingGp } from "./../models/recommendSettingGp";
import { Settings } from "./../models/settings";
import { Website } from "./../models/website";
import { Review } from "./../models/review";
import { OrdersCart } from "./../models/ordersCart";
import { Product } from "./../models/product";
import { OrdersProduct } from "./../models/ordersProduct";
import { OrdersPayment } from "./../models/ordersPayment";
import { OrdersAddress } from "./../models/ordersAddress";
import { ViewService } from "./../services/View.service";
import { ViewProduct } from "./../models/viewProduct";
import { Orders } from "./../models/orders";
import { sequelize } from "./../util/database";
import * as jwt from "jsonwebtoken";
import * as Config from "../util/config";
import { Op } from "sequelize";
import moment from "moment";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import fs from "fs";
import path from "path";
import { LineNotify, LineMessageCreateOrder } from "../util/linenotify";
import { OrderFashion } from "../models/orderFashion";
import { ReviewFashion } from "../models/reviewFashion";

const sharp = require("sharp");

export class OrderController extends ViewService {
  public public_path: string;
  constructor() {
    super();
    this.public_path = path.join(__dirname, "../../public");
  }

  OnCreateOrder = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const member = req.authMember;
    const t = await sequelize.transaction();
    const packages: any = await this.view_member_package(
      member.member_id,
      member.gender
    );
    const order_number: string =
      "OD-" +
      moment().unix() +
      Math.floor(Math.random() * 100 + 1)
        .toString()
        .padStart(3, "0");
    const order_product: any = await this.query_product_incart(
      member.member_id
    );
    const gp_recommend: any = await Settings.findOne({
      where: { setting_name: "gross_profit" },
    });
    let missingProduct: any[] = [];
    let orderProduct: any[] = [];
    let arrProductId: any[] = [];
    let totalPrice: number = 0;
    let netPrice: number = 0;
    let productMesssage: string = "";
    for await (const data of order_product) {
      let gp_recom: number = 0;
      const prod = await Product.findOne({
        where: { product_code: data.product_code },
      });
      const viewproduct = await ViewProduct.findOne({
        where: {
          product_code: data.product_code,
        },
        attributes: [
          "store_name",
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
          "store_id",
          "path_img",
          "package_id",
          "buy_limit",
          "show_gift",
          "price_sell",
          "createdAt",
        ],
        group: ["store_id", "id"],
        order: [["createdAt", "DESC"]],
      });

      const gp_recommend_priority = await RecommendSettingGp.findOne({
        where: { priority: prod.priority },
      });
      if (gp_recommend_priority) {
        gp_recom = parseInt(gp_recommend_priority.value);
      } else {
        gp_recom = parseInt(gp_recommend.setting_value);
      }
      if (prod.status !== "active") {
        await OrdersCart.destroy({
          where: { productId: prod.id, memberId: member.member_id },
        });
        const res_data = {
          name_product:
            data.premium === "yes" ? data.name_premium : data.name_member,
        };
        missingProduct.push(res_data);
      } else {
        const order_data = {
          order_number: order_number,
          product_id: prod.id,
          product_name:
            data.premium === "yes"
              ? data.name_premium !== ""
                ? data.name_premium
                : data.name_member
              : data.name_member !== ""
              ? data.name_member
              : data.name_premium,
          status: "pending",
          product_content:
            data.premium === "yes" ? data.content_premium : data.content_member,
          gross_profit:
            data.recommend === "yes"
              ? gp_recom
              : parseInt(packages.gross_profit),
          price:
            data.premium === "yes" ? data.price_premium : data.price_standard,
        };
        totalPrice += order_data.price;
        netPrice += order_data.price * (1 - order_data.gross_profit / 100);
        arrProductId.push(prod.id);
        orderProduct.push(order_data);

        productMesssage += `สินค้า: ${order_data.product_name} ร้านค้า: ${viewproduct.store_name}`;
      }
    }
    if (missingProduct.length !== 0) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "product has been sold.",
        data: missingProduct,
      });
    }
    if (orderProduct.length === 0) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "not found product in cart.",
      });
    }

    try {
      let slip = "";
      if (req.file) {
        /** for slip destination */
        const destSlip =
          req.file.destination.split("uploads")[0] +
          "/slip" +
          req.file.destination.split("uploads")[1];
        if (!fs.existsSync(`${destSlip}`)) {
          fs.mkdirSync(destSlip, { recursive: true });
        }
        /** for slip destination */
        let upload = "/slip" + req.file.destination.split("uploads").pop();
        var ext = path.extname(req.file.originalname);
        let originalname = path.basename(req.file.originalname, ext);
        for (let i = 1; fs.existsSync(destSlip + originalname + ext); i++) {
          originalname = originalname.split("(")[0];
          originalname += "(" + i + ")";
        }
        const image = await sharp(req.file.path)
          //.resize(500, 500)
          .resize(500)
          .withMetadata()
          .jpeg({ quality: 95 })
          .toFile(path.resolve(destSlip, originalname + ext))
          .then((data: any) => {
            fs.unlink(req.file.path, (err) => {
              if (err) {
                console.log(err);
              }
            });
            return upload + originalname + ext;
          });
        slip = image;
      }
      const order_pro = await OrdersProduct.bulkCreate(orderProduct);
      const update_product = await Product.update(
        { status: "sold" },
        { where: { id: { [Op.in]: arrProductId } } },
        { transaction: t }
      );
      const ord_delete = await OrdersCart.destroy(
        { where: { memberId: member.member_id } },
        { transaction: t }
      );
      const order = await Orders.create(
        {
          order_number: order_number,
          payment_status:
            req.body.payment_type == "COD" ? "deposit" : "pending",
          status: "pending",
          totalprice: req.body.payment_type == "COD" ?  (totalPrice) + 20 : totalPrice, // เพิ่ม ค่า cod 20 บาท
          netprice: netPrice,
          member_id: member.member_id,
          message: "",
          isRead: false,
          isReview: false,
        },
        { transaction: t }
      );
      const order_address = await OrdersAddress.create(
        {
          order_number: order_number,
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          district: req.body.district,
          subdistrict: req.body.subdistrict,
          province: req.body.province,
          code: req.body.code,
          note: req.body.note,
        },
        { transaction: t }
      );
      const order_payment = await OrdersPayment.create(
        {
          order_number: order_number,
          payment_type: req.body.payment_type,
          bank_id: parseInt(req.body.bank_ref),
          slip: slip,
          status_confirm: "pending",
          name: "", //req.body.name_payment,
          total_pay: 0, //req.body.totalpay_payment,
          date_pay: new Date(), //req.body.date_pay,
        },
        { transaction: t }
      );
      await t.commit();

      /* sent line notify */
      let _dataMessage = {
        proList: productMesssage,
        order_number: order_number,
        member: member.username,
        totalPrice: totalPrice,
      };
      let _messageLine = LineMessageCreateOrder(_dataMessage);
      // await LineNotify(_messageLine);

      return res.status(201).json({
        status: false,
        message: "error",
        description: "create order success.",
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).json({
        status: true,
        message: "ok",
        description: "something went wrong.",
        error: error,
      });
    }
  };
  OnGetOrderMember = async (req: any, res: any) => {
    try {
      const member = req.authMember;
      const order: any = await this.query_member_order(member.member_id);
      const orderFashion: any = await this.query_member_orderFashion(
        member.member_id
      );
      const order_response: any = order.map((data: any) => {
        const arr_product: any = [];
        let product_id = data.product_id?.split(",");
        if (product_id.length > 0) {
          let product_name = data.product_name?.split(",");
          let product_content = data.product_content?.split(",");
          let price = data.price?.split(",");
          let product_status = data.product_status?.split(",");
          let store_id = data.store_id?.split(",");
          let product_image = data.product_image?.split(",");
          let store_code = data.store_code?.split(",");
          let store_name = data.store_name?.split(",");
          let hasImage = data.hasImage?.split(",");
          let star = data.star?.split(",").map((e: any) => parseInt(e));
          for (let i = 0; i < product_id.length; i++) {
            const dd = {
              product_id: product_id
                ? product_id[i]
                  ? product_id[i]
                  : null
                : null,
              product_name: product_name
                ? product_name[i]
                  ? product_name[i]
                  : null
                : null,
              product_content: product_content
                ? product_content[i]
                  ? product_content[i]
                  : null
                : null,
              price: price ? (price[i] ? price[i] : null) : null,
              product_status: product_status
                ? product_status[i]
                  ? product_status[i]
                  : null
                : null,
              store_id: store_id ? (store_id[i] ? store_id[i] : null) : null,
              product_image: product_image
                ? product_image[i]
                  ? product_image[i]
                  : null
                : null,
              store_code: store_code
                ? store_code[i]
                  ? store_code[i]
                  : null
                : null,
              store_name: store_name
                ? store_name[i]
                  ? store_name[i]
                  : null
                : null,
              hasImage: hasImage ? (hasImage[i] ? hasImage[i] : null) : null,
              star: star ? (star[i] ? star[i] : 0) : 0,
            };
            arr_product.push(dd);
          }
        }
        return {
          orderNumber: data.order_number,
          spacial_image: data.spacial_image,
          paymentStatus: data.payment_status,
          status: data.status,
          totalPrice: data.totalprice,
          netprice: data.netprice,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          name: data.name,
          address:
            data.address +
            " " +
            data.subdistrict +
            " " +
            data.district +
            " " +
            data.province +
            " " +
            data.code,
          phone: data.phone,
          district: data.district,
          subdistrict: data.subdistrict,
          province: data.province,
          code: data.code,
          note: data.note,
          isReview: data.isReview,
          product: arr_product,
          payment_type: data.payment_type,
        };
      });
      const order_response_fashion: any = orderFashion.map((data: any) => {
        const arr_product: any = [];
        let product_id = data.product_id?.split(",");
        if (product_id.length > 0) {
          let product_name = data.product_name?.split(",");
          let product_content = data.product_content?.split(",");
          let price = data.price?.split(",");
          let product_status = data.product_status?.split(",");
          let store_id = data.store_id?.split(",");
          let product_image = data.product_image?.split(",");
          let store_code = data.store_code?.split(",");
          let store_name = data.store_name?.split(",");
          let star = data.star?.split(",").map((e: any) => parseInt(e));
          for (let i = 0; i < product_id.length; i++) {
            const dd = {
              product_id: product_id
                ? product_id[i]
                  ? product_id[i]
                  : null
                : null,
              product_name: product_name
                ? product_name[i]
                  ? product_name[i]
                  : null
                : null,
              product_content: product_content
                ? product_content[i]
                  ? product_content[i]
                  : null
                : null,
              price: price ? (price[i] ? price[i] : null) : null,
              product_status: product_status
                ? product_status[i]
                  ? product_status[i]
                  : null
                : null,
              store_id: store_id ? (store_id[i] ? store_id[i] : null) : null,
              product_image: product_image
                ? product_image[i]
                  ? product_image[i]
                  : null
                : null,
              store_code: store_code
                ? store_code[i]
                  ? store_code[i]
                  : null
                : null,
              store_name: store_name
                ? store_name[i]
                  ? store_name[i]
                  : null
                : null,
              star: star ? (star[i] ? star[i] : 0) : 0,
            };
            arr_product.push(dd);
          }
        }
        return {
          orderNumber: data.order_number,
          paymentStatus: data.payment_status,
          status: data.status,
          totalPrice: data.totalprice,
          netprice: data.netprice,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          name: data.name,
          address:
            data.address +
            " " +
            data.subdistrict +
            " " +
            data.district +
            " " +
            data.province +
            " " +
            data.code,
          phone: data.phone,
          district: data.district,
          subdistrict: data.subdistrict,
          province: data.province,
          code: data.code,
          note: data.note,
          isReview: data.isReview,
          product: arr_product,
          payment_type: data.payment_type,
        };
      });
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        order: order_response,
        orderFashion: order_response_fashion,
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
  OnGetOrderStore = async (req: any, res: any) => {
    try {
      const store = req.authStore;
      const orderss: any = await this.query_store_order(store.store_id);
      const order_response = orderss.map((data: any) => {
        const arr_product: any = [];
        let product_id = data.product_id?.split(",");
        if (product_id.length > 0) {
          let product_name = data.product_name?.split(",");
          let product_content = data.product_content?.split(",");
          let price = data.price?.split(",");
          let product_status = data.product_status?.split(",");
          let product_image = data.product_image?.split(",");
          let has_image = data.hasImage?.split(",");
          for (let i = 0; i < product_id.length; i++) {
            const dd = {
              product_id: product_id ? product_id[i] : null,
              product_name: product_name ? product_name[i] : null,
              product_content: product_content ? product_content[i] : null,
              price: price ? price[i] : null,
              product_status: product_status ? product_status[i] : null,
              product_image: product_image ? product_image[i] : null,
              has_image: has_image ? has_image[i] : null,
            };
            arr_product.push(dd);
          }
        }
        return {
          orderNumber: data.order_number,
          spacial_image: data.spacial_image,
          paymentStatus: data.payment_status,
          status: data.status,
          totalPrice: data.totalprice,
          netprice: data.netprice,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          name: data.name,
          address:
            data.address +
            " " +
            data.subdistrict +
            " " +
            data.district +
            " " +
            data.province +
            " " +
            data.code,
          phone: data.phone,
          district: data.district,
          subdistrict: data.subdistrict,
          province: data.province,
          code: data.code,
          note: data.note,
          product: arr_product,
        };
      });
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        order: order_response,
      });
    } catch (error) {
      console.log(error);
      return res.statsu(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnUpdateHasImageOrder = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "erorr",
        errorMessage: errors.array(),
      });
    }

    try {
      const order: any = await Orders.findOne({
        where: { order_number: req.body.order_number },
      });
      if (!order) {
        return res.status(400).json({
          status: false,
          message: "error",
          description: "Order was not found.",
        });
      }

      /** upload spacial image */
      if (req.file) {
        const file = req.file;
        const imageUrl = await this.uploadImage(file);
        order.spacial_image = imageUrl;
        order.start_date_image = moment();
      } else {
        order.spacial_image = null;
        order.start_date_image = null;
      }

      order.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "Update has image order success.",
        order,
      });
    } catch (error) {
      console.log(error);
      return res.statsu(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnGetOrderAdmin = async (req: any, res: any) => {
    var public_path = path.join(__dirname, "../../dist/public/");
    const store = req.authAdmin;
    try {
      const order: any = await this.query_admin_order();
      const order_response: any = order.map((data: any) => {
        const arr_product: any = [];
        let product_id = data.product_id?.split(",");
        let checkCancel = false;
        if (product_id.length > 0) {
          let product_name = data.product_name?.split(",");
          let product_content = data.product_content?.split(",");
          let price = data.price?.split(",");
          let product_status = data.product_status?.split(",");
          let product_image = data.product_image?.split(",");
          let recommend = data.recommend?.split(",");
          let preOrder = data.preOrder?.split(",");
          let grossProfit = data.gross_profit?.split(",");
          let hasImage = data.hasImage?.split(",");

          let store_user = data.store_user?.split(",");
          let storename = data.storename?.split(",");
          let note_cancel = data.note_cancel?.split(",");
          for (let i = 0; i < product_id.length; i++) {
            if (product_status[i] === "canceled") {
              checkCancel = true;
            }
            const dd = {
              product_id: product_id ? product_id[i] : null,
              product_name: product_name ? product_name[i] : null,
              product_content: product_content ? product_content[i] : null,
              price: price ? price[i] : 0,
              product_status: product_status ? product_status[i] : null,
              recommend: recommend ? recommend[i] : null,
              preOrder: preOrder ? preOrder[i] : null,
              grossProfit: grossProfit ? grossProfit[i] : 0,
              store_user: store_user ? store_user[i] : null,
              storename: storename ? storename[i] : null,
              note: note_cancel ? note_cancel[i] : null,
              hasImage: hasImage ? hasImage[i] : null,
              product_image: product_image ? product_image[i] : null,
              netPrices: Math.ceil(
                price[i] - (price[i] * grossProfit[i]) / 100
              ),
              orderNumber: data.order_number,
            };
            arr_product.push(dd);
          }
        }

        return {
          store_user: data.store_user,
          storename: data.storename,
          total_order_price: data.total_order_price,
          orderNumber: data.order_number,
          paymentStatus: data.payment_status,
          status: data.status,
          totalPrice: data.totalprice,
          netprice: data.netprice,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          member_name: data.member_name,
          address: data.address,
          phone: data.phone,
          district: data.district,
          subdistrict: data.subdistrict,
          province: data.province,
          code: data.code,
          note: data.note,
          message: data.message,
          slip: fs.existsSync(public_path + data.slip) ? data.slip : null,
          payment_type: data.payment_type,
          isRead: data.isRead ? true : false,
          member_user: data.member_user,
          product: arr_product,
          hasCancel: checkCancel,
          spacial_image: fs.existsSync(public_path + data.spacial_image)
            ? data.spacial_image
            : null,
          isHasImage: data.hasImage?.split(",").includes("1"),
          public_image_path: public_path + data.spacial_image,
        };
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get data success.",
        order: order_response,
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
  OnReview = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const member = req.authMember;
    const order: any = await this.query_order_one(
      req.body.orderNumber,
      req.body.productId
    );
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order was not found.",
      });
    }
    if (
      order.status_product != "success" &&
      order.status_product != "accepted"
    ) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "product has delivery.",
      });
    }
    const t = await sequelize.transaction();
    try {
      const checkReview = await Review.findOne({
        where: { product_id: order.product_id },
      });
      if (checkReview) {
        checkReview.message = req.body.message;
        checkReview.star = req.body.star;
        checkReview.save();
      } else {
        const review = await Review.create(
          {
            member_id: member.member_id,
            message: req.body.message,
            product_id: order.product_id,
            star: req.body.star,
            display: "yes",
            store_id: order.store_id,
          },
          { transaction: t }
        );
      }
      const order_prod = await OrdersProduct.update(
        {
          status: "accepted",
        },
        {
          where: {
            order_number: order.order_number,
            product_id: req.body.productId,
          },
        },
        { transaction: t }
      );
      const checkAccept = await OrdersProduct.findOne({
        where: {
          order_number: req.body.orderNumber,
          [Op.and]: [
            { status: { [Op.not]: "accepted" } },
            { status: { [Op.not]: "canceled" } },
          ],
        },
      });
      if (!checkAccept) {
        const orders = await Orders.update(
          {
            status: "success",
            isReview: true,
          },
          {
            where: {
              order_number: order.order_number,
            },
          },
          { transaction: t }
        );
      }
      await t.commit();
      return res.status(201).json({
        status: true,
        message: "ok",
        description: "order has been review.",
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
  OnReviewFashion = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const member = req.authMember;
    const order: any = await this.query_orderfashion_one(
      req.body.orderNumber,
      req.body.productId
    );
    if (!order) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order was not found.",
      });
    }
    if (
      order.status_product != "success" &&
      order.status_product != "accepted"
    ) {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "product has delivery.",
      });
    }
    const t = await sequelize.transaction();
    try {
      const checkReview = await ReviewFashion.findOne({
        where: { product_id: order.product_id },
      });
      if (checkReview) {
        checkReview.message = req.body.message;
        checkReview.star = req.body.star;
        checkReview.save();
      } else {
        const review = await ReviewFashion.create(
          {
            member_id: member.member_id,
            message: req.body.message,
            product_id: order.product_id,
            star: req.body.star,
            display: "yes",
            store_id: order.store_id,
          },
          { transaction: t }
        );
      }
      const order_prod = await OrdersProduct.update(
        {
          status: "accepted",
        },
        {
          where: {
            order_number: order.order_number,
            product_id: req.body.productId,
          },
        },
        { transaction: t }
      );
      const checkAccept = await OrdersProduct.findOne({
        where: {
          order_number: req.body.orderNumber,
          [Op.and]: [
            { status: { [Op.not]: "accepted" } },
            { status: { [Op.not]: "canceled" } },
          ],
        },
      });
      if (!checkAccept) {
        const orders = await OrderFashion.update(
          {
            status: "success",
            isReview: true,
          },
          {
            where: {
              order_number: order.order_number,
            },
          },
          { transaction: t }
        );
      }
      await t.commit();
      return res.status(201).json({
        status: true,
        message: "ok",
        description: "order has been review.",
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
  OnUpdatePaymentStatus = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const finding = await Orders.findOne({
      where: { order_number: req.body.orderNumber },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order was not found.",
      });
    }
    try {
      finding.payment_status = req.body.status;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "payment status was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnUpdateStatus = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const finding = await Orders.findOne({
        where: { order_number: req.body.orderNumber },
      });
      if (!finding) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "order was not found.",
        });
      }
      const prodInOrder = await OrdersProduct.findAll({
        where: { order_number: req.body.orderNumber },
      });
      if (req.body.status == "failed") {
        for await (const data of prodInOrder) {
          const update_product = await Product.update(
            { status: "active" },
            { where: { id: data.id } }
          );
        }
      }
      finding.status = req.body.status;
      finding.message = req.body.message;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "order status was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnUpdateProductStatus = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    try {
      const order_prod = await OrdersProduct.update(
        {
          status: req.body.status,
        },
        {
          where: {
            order_number: req.body.orderNumber,
            product_id: req.body.productId,
          },
        }
      );
      const checkAccept = await OrdersProduct.findOne({
        where: {
          order_number: req.body.orderNumber,
          [Op.and]: [
            { status: { [Op.not]: "accepted" } },
            { status: { [Op.not]: "canceled" } },
          ],
        },
      });
      if (!checkAccept) {
        const orders = await Orders.update(
          {
            status: "success",
          },
          {
            where: {
              order_number: req.body.orderNumber,
            },
          }
        );
      }
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
  OnUpdateGPInOrder = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const productForSet = await OrdersProduct.findOne({
      where: {
        order_number: req.body.orderNumber,
        product_id: req.body.productId,
      },
    });
    const productAllInOrder: any = await OrdersProduct.findAll({
      where: { order_number: req.body.orderNumber },
    });
    const orders = await Orders.findOne({
      where: { order_number: req.body.orderNumber },
    });
    if (!productForSet || !orders) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order was not found.",
      });
    }
    try {
      let totalPrice: number = 0;
      let netPrice: number = 0;
      productAllInOrder.forEach((data: any) => {
        totalPrice += data.price;
        if (data.product_id == req.body.productId) {
          netPrice += data.price * (1 - parseInt(req.body.gp) / 100);
        } else {
          netPrice += data.price * (1 - data.gross_profit / 100);
        }
      });
      productForSet.gross_profit = parseInt(req.body.gp);
      productForSet.save();
      orders.totalprice = Math.round(totalPrice);
      orders.netprice = Math.round(netPrice);
      orders.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "order GP was updated.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };
  OnReadOrder = async (req: any, res: any) => {
    const finding = await Orders.findOne({
      where: { order_number: req.params.number },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order was not found.",
      });
    }
    finding.isRead = true;
    finding.save();
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "order was readed.",
    });
  };
  OnCancelProductInOrder = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const productForSet = await OrdersProduct.findOne({
      where: {
        order_number: req.body.orderNumber,
        product_id: req.body.productId,
      },
    });
    const productAllInOrder: any = await OrdersProduct.findAll({
      where: {
        order_number: req.body.orderNumber,
        status: { [Op.ne]: "canceled" },
        product_id: { [Op.ne]: req.body.productId },
      },
    });
    const orders = await Orders.findOne({
      where: { order_number: req.body.orderNumber },
    });
    if (!productForSet || !orders) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order was not found.",
      });
    }
    try {
      let totalPrice: number = 0;
      let netPrice: number = 0;
      productAllInOrder.forEach((data: any) => {
        totalPrice += data.price;
        netPrice += data.price * (1 - data.gross_profit / 100);
      });
      productForSet.status = "canceled";
      productForSet.note_cancel = req.body.note;
      const updateProd = await Product.update(
        {
          status: "active",
        },
        {
          where: {
            id: req.body.productId,
          },
        }
      );
      orders.totalprice = Math.round(totalPrice);
      orders.netprice = Math.round(netPrice);
      productForSet.save();
      orders.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "order product was canceled.",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
      });
    }
  };

  OnDownloadImage = async (req: any, res: any) => {
    var public_path = path.join(__dirname, "../../dist/public");

    try {
      const orderNumber = req.params.orderNumber;
      const order = await Orders.findOne({
        where: { order_number: orderNumber },
      });

      if (!order) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "order was not found.",
        });
      }
      const filePath = public_path + order.spacial_image;
      const fileName = order.spacial_image?.split("/").pop();

      if (fs.existsSync(filePath)) {
        return res.download(filePath, fileName, function (err: any) {
          if (err) {
            console.log(err)
          }
        });
      }

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
}
