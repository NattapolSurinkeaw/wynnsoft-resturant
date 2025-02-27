import { ChatTemp } from "./chat_temp";
import { Settings } from "./settings";
import { TokenLog } from "./tokenLog";
import { Log } from "./log";
import { Banner } from "./banner";
import { Ads } from "./ads";
import { Website } from "./website";
import { UsersPermission } from "./usersPermission";
import { User } from "./users";
import { Store } from "./store";
import { Review } from "./review";
import { ProductImage } from "./productImage";
import { Product } from "./product";
import { PostImage } from "./postImage";
import { Post } from "./post";
import { PackageStatus } from "./packageStatus";
import { PackagePayment } from "./packagePayment";
import { PackageOrder } from "./packageOrder";
import { Package } from "./package";
import { OrdersProduct } from "./ordersProduct";
import { OrdersPayment } from "./ordersPayment";
import { OrdersCart } from "./ordersCart";
import { OrdersAddress } from "./ordersAddress";
import { Orders } from "./orders";
import { Members } from "./members";
import { BankProvider } from "./bankProvider";
import { BankAccount } from "./bankAccount";
import { BankType } from "./bankType";
import { sequelize } from "../util/database";

import { OrderFashion } from "./orderFashion";
import { ProductFashionImage } from "./productFashionImage";
import { ProductFashion } from "./productFashion";
import { ProductCategory } from "./productCategory";
import { ReviewFashion } from "./reviewFashion";

export function OnInit() {
  const declaredModel = {
    BankAccount,
    BankProvider,
    BankType,
    Members,
    Orders,
    OrdersAddress,
    OrdersCart,
    OrdersPayment,
    OrdersProduct,
    Package,
    PackageOrder,
    PackagePayment,
    PackageStatus,
    Post,
    PostImage,
    Product,
    ProductImage,
    Review,
    Store,
    User,
    UsersPermission,
    Website,
    Ads,
    Banner,
    Log,
    TokenLog,
    Settings,
    ChatTemp,
    OrderFashion,
    ProductFashion,
    ProductFashionImage,
    ProductCategory,
    ReviewFashion,
  };
  // sequelize.sync();
  sequelize.sync({ alter: true }).then(() => {
    // ProductFashion.bulkCreate([
    //   {
    //     id: 2,
    //     cate_id: 2,
    //     store_id: 2,
    //     product_name: "Áo thun2",
    //     defect: "",
    //     price: 1000,
    //     sex: "women",
    //     status: "active",
    //     display: true,
    //     priority: 2,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    //   {
    //     id: 3,
    //     cate_id: 2,
    //     store_id: 1,
    //     product_name: "Áo thun3",
    //     defect: "",
    //     price: 1000,
    //     sex: "women",
    //     status: "active",
    //     display: true,
    //     priority: 3,
    //     created_at: new Date(),
    //     updated_at: new Date(),
    //   },
    // ])

  }).catch((err: any) => console.log(err));
}
