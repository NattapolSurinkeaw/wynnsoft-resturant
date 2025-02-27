import { DBconnect } from "../util/dbconnect";
let sql: string;

export class ViewService extends DBconnect {
  constructor() {
    super();
  }
  view_member_package = async (mem_id: any, gender: any) => {
    sql = `SELECT * FROM view_member_package WHERE mem_id = ? AND member_gender = ?`;
    return this.findOne(sql, [mem_id, gender]);
  };
  view_product = async (package_id: any, sex: any, store_id: any) => {
    sql = ` SELECT view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "no"
                GROUP BY view_product.store_id, view_product.id`;
    return this.findAll(sql, [package_id, sex, store_id]);
  };
  query_product_recommend = async (package_id: any, sex: any) => {
    sql = ` SELECT view_product.*, store.username, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product
                JOIN store ON (view_product.store_id = store.id) WHERE package_id = ? AND sex = ? AND recommend = "yes"
                GROUP BY view_product.store_id, view_product.id ORDER BY view_product.priority_recommend`;
    return this.findAll(sql, [package_id, sex]);
  };
  query_product_preorder = async (package_id: any, sex: any, store_id: any) => {
    sql = ` SELECT view_product.*, GROUP_CONCAT(view_product.path_img) as product_img
                FROM view_product WHERE package_id = ? AND sex = ? AND store_id = ? AND pre_order = "yes"
                GROUP BY view_product.store_id, view_product.id ORDER BY view_product.priority`;
    return this.findAll(sql, [package_id, sex, store_id]);
  };
  query_store_post = async (store_id: any) => {
    sql = `SELECT post_result.*, 
                        GROUP_CONCAT(post_result.path_image) as post_img 
                FROM
                    (
                    SELECT
                        posts.*,
                        store.name AS store_name,
                        store.profile_img AS store_profile,
                        store.concept AS store_concept,
                        ROW_NUMBER() OVER(
                    ORDER BY
                        posts.priority ASC
                    ) AS priority_row
                FROM
                    store
                JOIN(
                    SELECT post.*,
                        post_image.path_image,
                        post_image.priority
                    FROM post
                    LEFT JOIN post_image ON post.id = post_image.post_id
                ) posts
                ON ( store.id = posts.store_id AND posts.status = "active" AND posts.post_fashion = 0 )) AS post_result
                    WHERE post_result.store_id = ?
                    GROUP BY post_result.id
                ORDER BY post_result.createdAt DESC LIMIT 10`;
    return this.findAll(sql, [store_id]);
  };
  query_product_incart = async (member_id: any) => {
    sql = `SELECT * FROM 
                    (SELECT products.*, 
                            view_member_package.premium 
                    FROM view_member_package 
                        INNER JOIN 
                        (
                            SELECT product.*, orders_cart.memberId 
                            FROM (
                                SELECT product.*, 
                                    product_image.path_img 
                                FROM product 
                                LEFT JOIN product_image 
                                    ON (product.id = product_image.product_id) 
                                WHERE product.status = "active"
                                GROUP BY product.id
                            ) AS product 
                            INNER JOIN orders_cart ON orders_cart.productId = product.id
                        ) AS products
                        ON (view_member_package.mem_id = products.memberId)
                    ) AS cart
                WHERE cart.memberId = ?`;
    return this.findAll(sql, [member_id]);
  };
  query_member_order = async (member_id: any) => {
    sql = `SELECT * FROM 
                    (SELECT order_number, payment_status, status, totalprice, netprice, member_id, createdAt,
                        updatedAt, name, address, phone, district, subdistrict, province, code, note, payment_type,
                        spacial_image as spacial_image,
                        GROUP_CONCAT(product_id) as product_id,
                        GROUP_CONCAT(product_name) as product_name,
                        GROUP_CONCAT(product_content) as product_content,
                        GROUP_CONCAT(price) as price,
                        GROUP_CONCAT(product_status) as product_status,
                        GROUP_CONCAT(store_id) as store_id,
                        GROUP_CONCAT(product_image) as product_image,
                        GROUP_CONCAT(store_code) as store_code,
                        GROUP_CONCAT(store_name) as store_name,
                        GROUP_CONCAT(hasImage) as hasImage,
                        GROUP_CONCAT(star) as star
                    FROM 
                        (SELECT orders.*,
                            orders_address.name, 
                            orders_address.address, 
                            orders_address.phone, 
                            orders_address.district, 
                            orders_address.subdistrict, 
                            orders_address.province, 
                            orders_address.code,
                            orders_address.note,
                            ord_product.product_id, 
                            ord_product.product_name, 
                            ord_product.product_content, 
                            ord_product.price, 
                            ord_product.store_id,
                            ord_product.status as product_status,
                            ord_product.path_img as product_image,
                            ord_product.store_code,
                            ord_product.store_name,
                            ord_product.hasImage,
                            orders_payment.payment_type,
                            IFNULL(ord_product.star, '0') AS star
                        FROM orders 
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN orders_payment ON (orders_payment.order_number = orders.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id,
                                product.path_img,
                                product.store_code,
                                product.hasImage,
                                product.name as store_name,
                                review.star
                            FROM orders_product 
                            LEFT JOIN (
                                SELECT product.*, 
                                    product_image.path_img,
                                    store.store_code,
                                    store.name
                                FROM product 
                                JOIN store ON (product.store_id = store.id)
                                JOIN product_image ON (product.id = product_image.product_id) 
                                GROUP BY product.id) as product 
                            ON (orders_product.product_id = product.id)
                            LEFT JOIN review ON (orders_product.product_id = review.product_id)
                            ) as ord_product 
                        ON (orders.order_number = ord_product.order_number)
                    ) as ord 
                    GROUP BY ord.order_number
                ) as mem_ord
                WHERE mem_ord.member_id = ? ORDER BY mem_ord.createdAt DESC`;
    return this.findAll(sql, [member_id]);
  };
  query_member_orderFashion = async (member_id: any) => {
    sql = `SELECT * FROM 
                    (SELECT order_number, payment_status, status, totalprice, netprice, member_id, createdAt,
                        updatedAt, name, address, phone, district, subdistrict, province, code, note, payment_type,
                        GROUP_CONCAT(product_id) as product_id,
                        GROUP_CONCAT(product_name) as product_name,
                        GROUP_CONCAT(product_content) as product_content,
                        GROUP_CONCAT(price) as price,
                        GROUP_CONCAT(product_status) as product_status,
                        GROUP_CONCAT(store_id) as store_id,
                        GROUP_CONCAT(product_image) as product_image,
                        GROUP_CONCAT(store_code) as store_code,
                        GROUP_CONCAT(store_name) as store_name,
                        GROUP_CONCAT(star) as star
                    FROM 
                        (SELECT orders.*,
                            orders_address.name, 
                            orders_address.address, 
                            orders_address.phone, 
                            orders_address.district, 
                            orders_address.subdistrict, 
                            orders_address.province, 
                            orders_address.code,
                            orders_address.note,
                            ord_product.product_id, 
                            ord_product.product_name, 
                            ord_product.product_content, 
                            ord_product.price, 
                            ord_product.status as product_status,
                            ord_product.path_img as product_image,
                            ord_product.store_code,
                            ord_product.store_name,
                            orders_payment.payment_type,
                            IFNULL(ord_product.star, '0') AS star
                        FROM order_fashion AS orders
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN orders_payment ON (orders_payment.order_number = orders.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id,
                                product.path_img,
                                product.store_code,
                                product.name as store_name,
                                review_fashion.star
                            FROM orders_product 
                            LEFT JOIN (
                                SELECT product.*, 
                                    product_image.path_img,
                                    store.store_code,
                                    store.name
                                FROM product_fashions as product
                                JOIN store ON (product.store_id = store.id)
                                JOIN product_fashion_image as product_image ON (product.id = product_image.product_id) 
                                GROUP BY product.id) as product 
                            ON (orders_product.product_id = product.id)
                            LEFT JOIN review_fashion ON (orders_product.product_id = review_fashion.product_id)
                            ) as ord_product 
                        ON (orders.order_number = ord_product.order_number)
                    ) as ord 
                    GROUP BY ord.order_number
                ) as mem_ord
                WHERE mem_ord.member_id = ? ORDER BY mem_ord.createdAt DESC`;
    return this.findAll(sql, [member_id]);
  };
  query_store_order = async (store_id: any) => {
    sql = `SELECT * FROM 
                    (SELECT order_number, payment_status, status, totalprice, netprice, member_id, createdAt,
                        updatedAt, name, address, phone, district, subdistrict, province, code, note, store_id,
                        spacial_image as spacial_image,
                        GROUP_CONCAT(product_id) as product_id,
                        GROUP_CONCAT(product_name) as product_name,
                        GROUP_CONCAT(product_content) as product_content,
                        GROUP_CONCAT(price) as price,
                        GROUP_CONCAT(product_status) as product_status,
                        GROUP_CONCAT(product_image) as product_image,
                        GROUP_CONCAT(hasImage) as hasImage
                    FROM
                    (SELECT orders.*,
                        orders_address.name, 
                        orders_address.address, 
                        orders_address.phone, 
                        orders_address.district, 
                        orders_address.subdistrict, 
                        orders_address.province, 
                        orders_address.code,
                        orders_address.note,
                        ord_product.product_id, 
                        ord_product.product_name, 
                        ord_product.product_content, 
                        ord_product.price, 
                        ord_product.store_id,
                        ord_product.status as product_status,
                        ord_product.path_img as product_image,
                        ord_product.hasImage as hasImage
                    FROM orders 
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id,
                                product.path_img,
                                product.hasImage
                            FROM orders_product 
                            LEFT JOIN (SELECT product.*, 
                                    product_image.path_img
                            FROM product JOIN product_image ON (product.id = product_image.product_id) 
                            GROUP BY product.id) as product 
                        ON (orders_product.product_id = product.id)
                        ) as ord_product
                        ON (orders.order_number = ord_product.order_number)
                    ) as ord GROUP BY ord.order_number, ord.store_id) as store_order
                WHERE store_order.store_id = ? ORDER BY store_order.createdAt DESC`;
    return this.findAll(sql, [store_id]);
  };
  query_admin_order = async () => {
    sql = `SELECT * FROM 
                    (SELECT order_number, SUM(price) as total_order_price, payment_status, status, totalprice, netprice, member_id, createdAt,
                        updatedAt, member_name, address, phone, district, subdistrict, province, code, note, message, slip, payment_type, isRead,
                        username as member_user,
                        spacial_image as spacial_image,
                        GROUP_CONCAT(product_id) as product_id,
                        GROUP_CONCAT(product_name) as product_name,
                        GROUP_CONCAT(product_content) as product_content,
                        GROUP_CONCAT(recommend) as recommend,
                        GROUP_CONCAT(pre_order) as preOrder,
                        GROUP_CONCAT(price) as price,
                        GROUP_CONCAT(product_status) as product_status,
                        GROUP_CONCAT(product_image) as product_image,
                        GROUP_CONCAT(gross_profit) as gross_profit,
                        GROUP_CONCAT(store_id) as store_id,
                        GROUP_CONCAT(storename) as storename,
                        GROUP_CONCAT(store_user) as store_user,
                        GROUP_CONCAT(hasImage) as hasImage,
                        GROUP_CONCAT(note_cancel) as note_cancel
                    FROM
                    (SELECT orders.*,
                        orders_address.name as member_name, 
                        orders_address.address, 
                        orders_address.phone, 
                        orders_address.district, 
                        orders_address.subdistrict, 
                        orders_address.province, 
                        orders_address.code,
                        orders_address.note,
                        ord_product.product_id, 
                        ord_product.product_name, 
                        ord_product.product_content, 
                        ord_product.price, 
                        ord_product.store_id,
                        ord_product.status as product_status,
                        ord_product.path_img as product_image,
                        orders_payment.slip,
                        orders_payment.payment_type,
                        ord_product.recommend,
                        ord_product.pre_order,
                        ord_product.gross_profit,
                        ord_product.storename,
                        ord_product.store_user,
                        ord_product.note_cancel,
                        ord_product.hasImage,
                        members.username
                    FROM orders 
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id,
                                product.path_img,
                                product.recommend,
                                product.storename,
                                product.store_user,
                                product.hasImage,
                                product.pre_order
                            FROM orders_product 
                            JOIN (SELECT product.*,
                                    store.name as storename,
                                    store.username as store_user,
                                    product_image.path_img
                            FROM product 
                            JOIN store ON (product.store_id = store.id)
                            LEFT JOIN product_image ON (product.id = product_image.product_id) 
                            GROUP BY product.id) as product 
                            ON (orders_product.product_id = product.id)
                            ) as ord_product
                        ON (orders.order_number = ord_product.order_number)
                        JOIN orders_payment ON (orders_payment.order_number = orders.order_number)
                        JOIN members ON (orders.member_id = members.id)
                ) as ord GROUP BY ord.order_number) as store_order  
            ORDER BY store_order.order_number DESC`;
    return this.findAll(sql, []);
  };
  query_order_one = async (order_number: any, product_id: any) => {
    sql = `SELECT * FROM 
                    (SELECT orders.*,
                        orders_address.name,
                        orders_address.address,
                        orders_address.phone,
                        orders_address.district,
                        orders_address.subdistrict,
                        orders_address.province,
                        orders_address.code,
                        orders_address.note,
                        ord_product.product_id,
                        ord_product.product_name,
                        ord_product.product_content,
                        ord_product.price,
                        ord_product.status as status_product,
                        ord_product.store_id
                    FROM orders 
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id 
                            FROM orders_product 
                            JOIN product ON (orders_product.product_id = product.id)
                            ) as ord_product 
                        ON (orders.order_number = ord_product.order_number)
                    ) as ord 
                WHERE ord.order_number = ? AND ord.product_id = ?`;
    return this.findOne(sql, [order_number, product_id]);
  };
  query_orderfashion_one = async (order_number: any, product_id: any) => {
    sql = `SELECT * FROM 
                    (SELECT orders.*,
                        orders_address.name,
                        orders_address.address,
                        orders_address.phone,
                        orders_address.district,
                        orders_address.subdistrict,
                        orders_address.province,
                        orders_address.code,
                        orders_address.note,
                        ord_product.product_id,
                        ord_product.product_name,
                        ord_product.product_content,
                        ord_product.price,
                        ord_product.status as status_product
                    FROM order_fashion as orders
                        JOIN orders_address ON (orders.order_number = orders_address.order_number)
                        JOIN 
                            (SELECT orders_product.*, 
                                product.store_id 
                            FROM orders_product 
                            JOIN product_fashions as product ON (orders_product.product_id = product.id)
                            ) as ord_product 
                        ON (orders.order_number = ord_product.order_number)
                    ) as ord 
                WHERE ord.order_number = ? AND ord.product_id = ?`;
    return this.findOne(sql, [order_number, product_id]);
  };
  queryReviewForMember = async (store_id: any) => {
    sql = `SELECT   review.id as reviewId,
                    members.username, 
                    review.message, 
                    review.star, 
                    review.store_id, 
                    review.display  
                FROM review JOIN members ON (review.member_id = members.id) where review.display = "yes" AND store_id = ?`;
    return this.findAll(sql, [store_id]);
  };
  queryChatMember = async () => {
    sql = `SELECT * FROM (
                    SELECT chat_temp.*, 
                        members.username, 
                        row_number() over (partition by chat_temp.member_code order by chat_temp.isRead ASC) AS priority 
                    FROM chat_temp 
                    JOIN members ON (chat_temp.member_code = members.member_code)
                ) as chatMember WHERE chatMember.from = "member"
                GROUP BY chatMember.member_code`;
    return this.findAll(sql, []);
  };
  queryPositionAll = async () => {
    sql = `SELECT position FROM ads GROUP BY position`;
    return this.findAll(sql, []);
  };
  queryAdsShow = async (page: any) => {
    sql = `SELECT *, GROUP_CONCAT(tt.img_path) as imgPath FROM (
                    SELECT * 
                    FROM ads 
                    WHERE display ORDER BY priority ASC
                ) as tt 
                WHERE tt.position = ?
                GROUP BY tt.position`;
    return this.findOne(sql, [page]);
  };
  query_store_post_admin = async (store_id: any, post_fashion: any) => {
    sql = `SELECT popost.* 
                FROM (SELECT posts.*, 
                        GROUP_CONCAT(posts.path_image ORDER BY posts.priority ASC) as post_img
                        FROM (
                            SELECT store_post.*, 
                                    post_image.path_image, 
                                    post_image.priority
                            FROM (
                                SELECT post.*,
                                    store.name as store_name,
                                    store.profile_img as store_profile, 
                                    store.concept as store_concept
                                FROM store
                                JOIN post ON (store.id = post.store_id)
                            ) as store_post 
                            LEFT JOIN post_image ON (post_image.post_id = store_post.id)
                        ) as posts
                    GROUP BY posts.id 
                ) as popost
                WHERE popost.store_id = ? AND popost.post_fashion = ?
                ORDER BY popost.createdAt DESC LIMIT 10`;
    return this.findAll(sql, [store_id, post_fashion]);
  };
  query_product_store_admin = async (store_id: any) => {
    sql = `SELECT prod.*, GROUP_CONCAT(prod.path_img) as product_img 
                FROM (
                    SELECT  product_show.*
                    FROM (
                        SELECT all_product.*,
                                store.name AS store_name,
                                store.profile_img AS store_profile,
                                store.concept AS store_concept 
                        FROM (store JOIN 
                            (
                                SELECT product.*
                                FROM (
                                    SELECT product.*,
                                        product_image.path_img,
                                        row_number() OVER (partition by product.id order by product_image.priority ASC) AS itemNum 
                                    FROM (product 
                                        LEFT JOIN product_image 
                                            ON(product.id = product_image.product_id)
                                        ) 
                                ) AS product ORDER BY product.id, itemNum
                            ) AS all_product
                            ON (store.id = all_product.store_id AND all_product.status != 'sold')
                        )
                    ) AS product_show
                ORDER BY product_show.priority ASC) as prod WHERE prod.store_id = ? GROUP BY prod.store_id, prod.id ORDER BY prod.createdAt DESC`;
    return this.findAll(sql, [store_id]);
  };
  query_product_fashion_store_admin = async (store_id: any) => {
    sql = `SELECT prod.*, GROUP_CONCAT(prod.path_img) as product_img 
                FROM (
                    SELECT  product_show.*
                    FROM (
                        SELECT all_product.*,
                                store.name AS store_name,
                                store.profile_img AS store_profile,
                                store.concept AS store_concept 
                        FROM (store JOIN 
                            (
                                SELECT product.*
                                FROM (
                                    SELECT product.*,
                                        product_image.path_img,
                                        row_number() OVER (partition by product.id order by product_image.priority ASC) AS itemNum 
                                    FROM (product_fashions as product
                                        LEFT JOIN product_fashion_image as product_image
                                            ON(product.id = product_image.product_id)
                                        ) 
                                ) AS product ORDER BY product.id, itemNum
                            ) AS all_product
                            ON (store.id = all_product.store_id AND all_product.status != 'sold')
                        )
                    ) AS product_show
                ORDER BY product_show.priority ASC) as prod WHERE prod.store_id = ? GROUP BY prod.store_id, prod.id ORDER BY prod.createdAt DESC`;
    return this.findAll(sql, [store_id]);
  };
  query_memberall_admin = async () => {
    sql = `SELECT members.id as id,
                        members.member_code,
                        members.username,
                        members.password,
                        members.gender,
                        members.isStore,
                        members.note,
                        members.statusMember,
                        members.createdAt,
                        members.updatedAt,
                        store.store_code,
                        view_member_package.package_id,
                        view_member_package.name as package_name,
                        view_member_package.begin,
                        view_member_package.expire,
                        view_member_package.status_expire
                FROM members 
                LEFT JOIN view_member_package ON members.id = view_member_package.mem_id
                LEFT JOIN store ON members.username = store.username  
                ORDER BY members.createdAt DESC`;
    return this.findAll(sql, []);
  };
  query_store_product_pending = async (store_id: any) => {
    sql = `SELECT * FROM orders_product 
                JOIN product 
                ON (orders_product.product_id = product.id) 
                WHERE orders_product.status = 'pending' AND product.store_id = ?`;
    return this.findOne(sql, [store_id]);
  };

  query_product_not_preorder = async (
    sex: any,
    search: any = "",
    limit: number,
    offset: number
  ) => {
    sql = `SELECT all_store.*, COUNT(all_store.product_code) as totalProduct
                FROM (
                    SELECT store.id as store_id, store.name as store_name, store.profile_img as store_profile, store.concept as store_concept, 
                            store.store_code, store.status as storeStatus, store.updatedAt as lastUpdate, products.id, products.product_code,
                            products.name_member, products.content_member, products.name_premium, products.content_premium, 
                            products.price_standard, products.price_premium, products.recommend, products.pre_order, products.status, 
                            products.clip, products.priority, products.createdAt, products.updatedAt, products.product_img, store.gender as sex,
                            row_number() over (partition by products.store_id order by products.createdAt desc) as productPriority
                    FROM store 
                    LEFT JOIN (
                            SELECT product.id,
                                    product.product_code, product.name_member, product.content_member, product.name_premium,
                                    product.content_premium, product.price_standard, product.price_premium, product.recommend,
                                    product.pre_order, product.status, product.clip, product.store_id, product.priority, product.createdAt, 
                                    product.updatedAt, GROUP_CONCAT(product_image.path_img) as product_img
                            FROM product
                            LEFT JOIN (SELECT * FROM product_image where (product_image.premium = "no")) as product_image 
                            ON (product.id = product_image.product_id)
                            WHERE  product.status = "active" AND product.pre_order = "no"
                            GROUP BY product.id
                    ) as products
                    ON (store.id = products.store_id)
                    ORDER BY products.pre_order ASC
                ) as all_store 
                WHERE all_store.storeStatus = "active" AND all_store.sex = ? AND all_store.storeStatus = "active" AND all_store.store_name LIKE "%${search}%"
                GROUP BY all_store.store_id
                ORDER BY all_store.lastUpdate DESC, all_store.updatedAt DESC
                LIMIT ? OFFSET ?`;
    return this.findAll(sql, [sex, limit, offset]);
  };
}
