import { RecommendSettingGp } from "./../models/recommendSettingGp";
import { Settings } from "./../models/settings";
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
import { ProductFashion } from "../models/productFashion";
import { ProductFashionImage } from "../models/productFashionImage";
import { Store } from "../models/store";
import { ProductCategory } from "../models/productCategory";

const sharp = require("sharp");

export class OrderFashionController extends ViewService {
  OnCreateOrderFashion = async (req: any, res: any) => {
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
    const order_number: string =
      "ODF-" +
      moment().unix() +
      Math.floor(Math.random() * 100 + 1)
        .toString()
        .padStart(3, "0");

    const product_fashion = await ProductFashion.findOne({
      where: {
        id: req.body.product_id,
      },
    });

    if (!product_fashion) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "product was not found.",
      });
    }
    if (product_fashion.status === "sold") {
      return res.status(400).json({
        status: false,
        message: "error",
        description: "product has been sold.",
      });
    }

    const setting_fashion = await Settings.findOne({
      where: {
        setting_name: "gross_profit_fashion",
      },
    });
    if (!setting_fashion.setting_value) {
      setting_fashion.setting_value = 0;
    }

    const gp_fashion = setting_fashion.setting_value;
    const product_price_gp = product_fashion.price + Math.ceil(product_fashion.price * (gp_fashion / 100));
    const cod_fashion = req.body.cod_fashion ? (req.body.cod_fashion) : await this.get_cod_value("cod_fashion");
    let totalPrice =
      req.body.payment_type == "COD"
        ? product_price_gp + parseInt(cod_fashion)
        : product_price_gp;

    try {
      let slip: string = "";
      if (req.file) {
        slip = await this.uploadImage(req.file, "/slip");
      }

      const product_fashion_data = {
        order_number: order_number,
        product_id: product_fashion.id,
        product_name: product_fashion.product_name,
        status: "pending",
        product_content: product_fashion.details,
        gross_profit: gp_fashion,
        price: product_price_gp,
      };
      const order_pro = await OrdersProduct.create(product_fashion_data);
      const update_product_fashion = await ProductFashion.update(
        { status: "sold" },
        { where: { id: product_fashion.id } },
        { transaction: t }
      );

      const order_fashion = await OrderFashion.create(
        {
          order_number: order_number,
          payment_status:
            req.body.payment_type == "COD" ? "deposit" : "pending",
          status: "pending",
          store_id: req.body.store_id,
          totalprice: totalPrice,
          netprice: parseInt(product_fashion.price) ,
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
          code: req.body.zip_code,
          note: req.body.note,
        },
        { transaction: t }
      );
      const order_payment = await OrdersPayment.create(
        {
          order_number: order_number,
          payment_type: req.body.payment_type || "",
          bank_id: parseInt(req.body.bank_id),
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
      const store = await Store.findOne({
        where: {
          id: req.body.store_id,
        },
      });
      let _dataMessage = {
        proList: `สินค้า: ${order_pro.product_name} ร้านค้า: ${store.name}`,
        order_number: order_number,
        member: member ? member?.username : order_address.name,
        totalPrice: totalPrice,
      };
      let _messageLine = LineMessageCreateOrder(_dataMessage, "แฟชั่น");
      await LineNotify(_messageLine);

      return res.status(201).json({
        status: true,
        message: "ok",
        description: "create order fashion success.",
        order_details: {
          order_fashion,
          order_address,
          order_payment,
          order_product: order_pro,
          // _messageLine,
        },
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      return res.status(500).json({
        status: true,
        message: "ok",
        description: "something went wrong.",
        errorMessage: error,
      });
    }
  };

  OnUploadBill = async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: "error",
        errorMessage: errors.array(),
      });
    }
    const orderFasion = await OrderFashion.findOne({
      where: {
        order_number: req.body.orderNumber,
      },
    });
    if (!orderFasion) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order fashion was not found.",
      });
    }
    try {
      let bill: string = "";
      if (req.file) {
        bill = await this.uploadImage(req.file, "/bill");
      }

      orderFasion.bill_img = bill;
      await orderFasion.save();

      return res.status(201).json({
        status: true,
        message: "ok",
        description: "upload bill success.",
        bill: bill,
      });
    } catch (error) {
      return res.status(500).json({
        status: true,
        message: "ok",
        description: "something went wrong.",
        errorMessage: error,
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
    const finding = await OrderFashion.findOne({
      where: { order_number: req.body.orderNumber },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order fashion was not found.",
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
        const orders = await OrderFashion.update(
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
      const finding = await OrderFashion.findOne({
        where: { order_number: req.body.orderNumber },
      });
      if (!finding) {
        return res.status(404).json({
          status: false,
          message: "error",
          description: "order fashion was not found.",
        });
      }
      const prodInOrder = await OrdersProduct.findAll({
        where: { order_number: req.body.orderNumber },
      });
      if (req.body.status == "failed") {
        for await (const data of prodInOrder) {
          const update_product = await ProductFashion.update(
            { status: "active" },
            { where: { id: data.product_id } }
          );
        }
      }
      finding.status = req.body.status;
      finding.message = req.body.message;
      finding.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "order fashion status was updated.",
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
    const finding = await OrderFashion.findOne({
      where: { order_number: req.params.number },
    });
    if (!finding) {
      return res.status(404).json({
        status: false,
        message: "error",
        description: "order fashion was not found.",
      });
    }
    finding.isRead = true;
    finding.save();
    return res.status(200).json({
      status: true,
      message: "ok",
      description: "order fashion was readed.",
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  OnGetOrderMember = async (req: any, res: any) => {
    try {
      const member = req.authMember;
      const order: any = await this.query_member_order(member.member_id);
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
  OnGetOrderFashionAdmin = async (req: any, res: any) => {
    var public_path = path.join(__dirname, "../../dist/public/");
    try {
      const order: any = await this.query_admin_order();
      const order_fashion = await OrderFashion.findAll({
        include: [
          {
            model: OrdersProduct,
            required: true, // RIGHT JOIN
            include: {
              model: ProductFashion,
              required: true, // RIGHT JOIN
              include: [
                {
                  model: ProductFashionImage,
                  required: false, // LEFT JOIN
                },
                {
                  model: ProductCategory,
                  required: false, // LEFT JOIN
                },
                {
                  model: Store,
                  required: false, // LEFT JOIN
                },
              ],
            },
            attributes: {
              include: [
                [sequelize.literal("OrdersProduct.status"), "product_status"],
              ],
              // exclude: ["status"],
            },
          },
          {
            model: Store,
            required: false, // LEFT JOIN
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
        attributes: {
          include: [
            [sequelize.literal("OrderFashion.payment_status"), "paymentStatus"],
          ],
        },
        order: [["createdAt", "DESC"]],
      });

      const mappedOrder = order_fashion?.map((order: any) => {
        order.bill_img = fs.existsSync(public_path + order.bill_img)
          ? order.bill_img
          : null;
        order.OrdersPayment.slip = fs.existsSync(
          public_path + order.OrdersPayment.slip
        )
          ? order.OrdersPayment.slip
          : null;
        return order;
      });

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
          slip: data.slip,
          isRead: data.isRead ? true : false,
          member_user: data.member_user,
          product: arr_product,
          hasCancel: checkCancel,
          spacial_image: fs.existsSync(public_path + data.spacial_image)
            ? data.spacial_image
            : null,
          isHasImage: data.hasImage?.split(",").includes("1"),
        };
      });

      return res.status(200).json({
        status: true,
        message: "ok",
        description: "get order fashion success.",
        order: order_response,
        order_fashion: mappedOrder,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: false,
        message: "error",
        description: "something went wrong.",
        errorMessage: error,
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
    const orders = await OrderFashion.findOne({
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
      productForSet.status = "canceled";
      productForSet.note_cancel = req.body.note;
      const updateProd = await ProductFashion.update(
        {
          status: "active",
        },
        {
          where: {
            id: req.body.productId,
          },
        }
      );
      productForSet.save();
      return res.status(200).json({
        status: true,
        message: "ok",
        description: "order fashion product was canceled.",
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
  private async uploadImage(file: any, des_path: string = "/spacialImage") {
    if (file) {
      /** for slip destination */
      const destImage =
        file.destination.split("uploads")[0] +
        des_path +
        file.destination.split("uploads")[1];
      if (!fs.existsSync(`${destImage}`)) {
        fs.mkdirSync(destImage, { recursive: true });
      }
      // let dest = file.destination
      let upload = des_path + file.destination.split("uploads").pop();
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

  private async get_cod_value(_type : string) {
    const setting_fashion = await Settings.findOne({
      where: { setting_name: _type },
    });

    return setting_fashion.setting_value;
  }
}
