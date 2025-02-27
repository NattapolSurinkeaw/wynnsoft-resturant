import { DBconnect } from "../util/dbconnect";
let sql: string;

export class ReportService extends DBconnect {
  constructor() {
    super();
  }
  queryReportStore = async (start: any, end: any) => {
    sql = ` SELECT  store.name as storeName, 
                        store.gender, 
                        reportShop.* 
                FROM store 
                LEFT JOIN (
                            SELECT 
                                view_member_package.name as packageLevel,
                                view_member_package.username,
                                orderss.*
                            FROM view_member_package
                            JOIN (
                                SELECT 	
                                        orders_products.*,
                                        orders.totalprice,
                                        orders.netprice,
                                        orders.member_id,
                                        orders.status as orders_status,
                                        orders.createdAt
                                FROM orders 
                                JOIN (
                                    SELECT orders_product.order_number, 
                                            orders_product.product_id, 
                                            orders_product.product_name, 
                                            orders_product.price,
                                    		orders_product.status as product_status,
                                            products.store_id
                                    FROM orders_product JOIN 
                                    (
                                        SELECT product.id, 
                                                store.id as store_id, 
                                                store.name as store_name 
                                        FROM product 
                                        JOIN store ON (product.store_id = store.id)
                                    ) as products ON (orders_product.product_id = products.id)
                                ) as orders_products
                                ON (orders.order_number = orders_products.order_number)
                            ) as orderss ON (view_member_package.mem_id = orderss.member_id)
                ) as reportShop
                ON (store.id = reportShop.store_id)
                WHERE ((reportShop.createdAt > ? AND reportShop.createdAt < ?) OR (reportShop.createdAt IS NULL)) AND (reportShop.product_status != 'canceled' AND reportShop.orders_status != 'failed')
                ORDER BY reportShop.createdAt DESC`;
    return this.findAll(sql, [start, end]);
  };
  queryReportCustomer = async (start: any, end: any) => {
    sql = `SELECT  memberCurrent.*, 
                        orders.priceTotal, 
                        packageOrder.totalPackagePrice as totalRenewal,
                        packageOrder.totalPackage
                FROM (
                    SELECT member.id,
                        member.username,
                        view_member_package.name as packageLevel,
                        view_member_package.begin as packageBegin,
                        member.createdAt as registerDate,
                        member.note
                    FROM (
                        SELECT * FROM members 
                        WHERE members.isStore = "no"
                    ) as member 
                    LEFT JOIN view_member_package 
                    ON (member.id = view_member_package.mem_id)
                ) as memberCurrent 
                LEFT JOIN (
                        SELECT orders.*, 
                                SUM(orders.netprice) as priceTotal 
                        FROM orders 
                        WHERE (orders.status = "success" AND orders.payment_status = "confirm")
                        GROUP BY orders.member_id
                ) as orders
                ON (memberCurrent.id = orders.member_id)
                LEFT JOIN (
                        SELECT package_order.member_id, 
                                COUNT(package_order.member_id) as totalPackage,
                                SUM(package.price) as totalPackagePrice
                        FROM package_order 
                        JOIN package 
                        ON (package_order.package_id = package.package_id AND package_order.gender = package.gender)
                        WHERE (package_order.status_confirm = "confirm" AND package_order.status_payment = "confirm") 
                        GROUP BY (package_order.member_id)
                ) as packageOrder
                ON (memberCurrent.id = packageOrder.member_id)
                where (memberCurrent.registerDate > ? AND memberCurrent.registerDate < ?)
                ORDER BY memberCurrent.registerDate DESC`;
    return this.findAll(sql, [start, end]);
  };
  queryReportOrder = async (start: any, end: any) => {
    sql = `SELECT orders.order_number, 
                    orders_address.name as member_name,
                    orders_address.address,
                    orders_address.district,
                    orders_address.subdistrict,
                    orders_address.province,
                    orders_address.code,
                    orders_address.phone,
                    orders.totalprice, 
                    orders.netprice,
                    orders_payment.slip,
                    orders_payment.payment_type as payment_type,
                    orders_address.note,
                    orders.payment_status, 
                    orders.status AS orders_status,
                    orders.createdAt,
                    storeProduct.*
                FROM orders 
                JOIN orders_address 
                ON (orders.order_number = orders_address.order_number)
                JOIN orders_payment 
                ON (orders.order_number = orders_payment.order_number AND orders.payment_status = "confirm")
                JOIN (SELECT orders_product.*, store.name, store.username FROM product 
                    INNER JOIN store 
                    ON product.store_id = store.id
                    INNER JOIN orders_product
                    ON (product.id = orders_product.product_id)
                ) as storeProduct ON (orders.order_number = storeProduct.order_number)
                WHERE (orders.createdAt > ? AND orders.createdAt < ?) AND orders.status != "failed" AND storeProduct.status != "canceled"
                ORDER BY orders.createdAt DESC`;
    return this.findAll(sql, [start, end]);
  };
  queryReportOrderFashion = async (start: any, end: any) => {
    sql = `SELECT orders.order_number, 
                    orders_address.name as member_name,
                    orders_address.address,
                    orders_address.district,
                    orders_address.subdistrict,
                    orders_address.province,
                    orders_address.code,
                    orders_address.phone,
                    orders.totalprice, 
                    orders.netprice,
                    orders_payment.slip,
                    orders_payment.payment_type as payment_type,
                    orders_address.note,
                    orders.payment_status, 
                    orders.status AS orders_status,
                    orders.createdAt,
                    storeProduct.*
                FROM order_fashion AS orders
                JOIN orders_address 
                ON (orders.order_number = orders_address.order_number)
                JOIN orders_payment 
                ON (orders.order_number = orders_payment.order_number AND orders.payment_status = "confirm")
                JOIN (SELECT orders_product.*, product.price_store as price_store, store.name, store.username, store.gender, product_category.name AS cate_name FROM product_fashions AS product 
                    INNER JOIN store 
                    ON product.store_id = store.id
                    INNER JOIN orders_product
                    ON (product.id = orders_product.product_id)
                    LEFT JOIN product_category
                    ON (product.cate_id = product_category.id)
                ) as storeProduct ON (orders.order_number = storeProduct.order_number)
                WHERE (orders.createdAt > ? AND orders.createdAt < ?) AND orders.status != "failed" AND storeProduct.status != "canceled"
                ORDER BY orders.createdAt DESC`;
    return this.findAll(sql, [start, end]);
  };
  queryMemberPackage = async () => {
    sql = `SELECT *, 
                    COUNT(view_member_package.mem_id) as totalMember
                FROM view_member_package 
                WHERE isStore = "no" 
                GROUP BY package_id`;
    return this.findAll(sql, []);
  };
  queryStoreOrder = async () => {
    sql = `SELECT perStore.*, 
                        store.name 
                FROM store 
                JOIN (SELECT allPro.store_id,
                        allPro.status,
                        SUM(allPro.price) as totalPrice, 
                        COUNT(allPro.store_id) as totalProductSold
                    FROM (
                        SELECT orders_product.*, 
                            product.store_id 
                        FROM product 
                        JOIN orders_product 
                        ON (product.id = orders_product.product_id)
                    ) as allPro 
                GROUP BY allPro.store_id) as perStore 
                ON (store.id = perStore.store_id)`;
    return this.findAll(sql, []);
  };
  queryStoreOrderFashion = async () => {
    sql = `SELECT perStore.*, 
                        store.name 
                FROM store 
                JOIN (SELECT allPro.store_id,
                        allPro.status,
                        SUM(allPro.price) as totalPrice, 
                        COUNT(allPro.store_id) as totalProductSold
                    FROM (
                        SELECT orders_product.*, 
                        product_fashions.store_id 
                        FROM product_fashions
                        JOIN orders_product 
                        ON (product_fashions.id = orders_product.product_id)
                        WHERE orders_product.order_number LIKE "ODF%"
                        AND orders_product.status = "accepted" 
                    ) as allPro 
                GROUP BY allPro.store_id) as perStore 
                ON (store.id = perStore.store_id)`;
    return this.findAll(sql, []);
  };
  queryNewMember = async () => {
    sql = `SELECT package_order.* 
                FROM members 
                JOIN package_order ON (members.id = package_order.member_id) 
                JOIN package_payment ON (package_payment.package_order_id = package_order.pack_order_id) 
                WHERE package_order.status_confirm != "confirm" OR package_order.status_payment != "confirm" 
                GROUP BY package_order.member_id;`;
    return this.findAll(sql, []);
  };
}
