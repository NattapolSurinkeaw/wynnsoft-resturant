SELECT all_store.*
FROM (
       SELECT 
              store.id as store_id,
              store.name as store_name,
              store.profile_img as store_profile, 
              store.concept as store_concept, 
              store.store_code,
              store.status as storeStatus,
              store.updatedAt as lastUpdate,
              products.id,
              products.product_code,
              products.name_member,
              products.content_member,
              products.name_premium,
              products.content_premium,
              products.price_standard,
              products.price_premium,
              products.recommend,
              products.pre_order,
              products.status,
              products.clip,
              products.priority,
              products.createdAt,
              products.updatedAt,
              products.product_img,
              store.gender as sex,
              row_number() over (partition by products.store_id order by products.createdAt desc) as productPriority
       FROM store 
       LEFT JOIN (
              SELECT product.id,
                     product.product_code,
                     product.name_member,
                     product.content_member,
                     product.name_premium,
                     product.content_premium,
                     product.price_standard,
                     product.price_premium,
                     product.recommend,
                     product.pre_order,
                     product.status,
                     product.clip,
                     product.store_id,
                     product.priority,
                     product.createdAt,
                     product.updatedAt,
                     GROUP_CONCAT(product_image.path_img) as product_img
              FROM product
              LEFT JOIN (SELECT * FROM product_image where (product_image.premium = "no")) as product_image 
              ON (product.id = product_image.product_id)
              WHERE  product.status = "active"
           	GROUP BY product.id
       ) as products
       ON (store.id = products.store_id)
       ORDER BY products.pre_order ASC
) as all_store WHERE all_store.storeStatus = "active" ORDER BY all_store.lastUpdate DESC, all_store.updatedAt DESC;


-- -----------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE VIEW view_product_all_store AS SELECT
    all_store.store_id AS store_id,
    all_store.store_name AS store_name,
    all_store.store_profile AS store_profile,
    all_store.store_concept AS store_concept,
    all_store.store_code AS store_code,
    all_store.storeStatus AS storeStatus,
    all_store.lastUpdate AS lastUpdate,
    all_store.id AS id,
    all_store.product_code AS product_code,
    all_store.name_member AS name_member,
    all_store.content_member AS content_member,
    all_store.name_premium AS name_premium,
    all_store.content_premium AS content_premium,
    all_store.price_standard AS price_standard,
    all_store.price_premium AS price_premium,
    all_store.recommend AS recommend,
    all_store.pre_order AS pre_order,
    all_store.status AS status,
    all_store.clip AS clip,
    all_store.hasImage AS hasImage,
    all_store.priority AS priority,
    all_store.createdAt AS createdAt,
    all_store.updatedAt AS updatedAt,
    all_store.product_img AS product_img,
    all_store.sex AS sex,
    all_store.productPriority AS productPriority
FROM
    (
    SELECT
        fillfin.store.id AS store_id,
        fillfin.store.name AS store_name,
        fillfin.store.profile_img AS store_profile,
        fillfin.store.concept AS store_concept,
        fillfin.store.store_code AS store_code,
        fillfin.store.status AS storeStatus,
        fillfin.store.updatedAt AS lastUpdate,
        products.id AS id,
        products.product_code AS product_code,
        products.name_member AS name_member,
        products.content_member AS content_member,
        products.name_premium AS name_premium,
        products.content_premium AS content_premium,
        products.price_standard AS price_standard,
        products.price_premium AS price_premium,
        products.recommend AS recommend,
        products.pre_order AS pre_order,
        products.status AS status,
        products.clip AS clip,
        products.hasImage AS hasImage,
        products.priority AS priority,
        products.createdAt AS createdAt,
        products.updatedAt AS updatedAt,
        products.product_img AS product_img,
        fillfin.store.gender AS sex,
        row_number() OVER(
        PARTITION BY products.store_id
    ORDER BY
        products.createdAt
    DESC
    ) AS productPriority
FROM
    (
        fillfin.store
    LEFT JOIN(
        SELECT
            fillfin.product.id AS id,
            fillfin.product.product_code AS product_code,
            fillfin.product.name_member AS name_member,
            fillfin.product.content_member AS content_member,
            fillfin.product.name_premium AS name_premium,
            fillfin.product.content_premium AS content_premium,
            fillfin.product.price_standard AS price_standard,
            fillfin.product.price_premium AS price_premium,
            fillfin.product.recommend AS recommend,
            fillfin.product.pre_order AS pre_order,
            fillfin.product.status AS status,
            fillfin.product.clip AS clip,
            fillfin.product.hasImage AS hasImage,
            fillfin.product.store_id AS store_id,
            fillfin.product.priority AS priority,
            fillfin.product.createdAt AS createdAt,
            fillfin.product.updatedAt AS updatedAt,
            GROUP_CONCAT(
                product_image.path_img SEPARATOR ','
            ) AS product_img
        FROM
            (
                fillfin.product
            LEFT JOIN(
                SELECT
                    fillfin.product_image.id AS id,
                    fillfin.product_image.product_id AS product_id,
                    fillfin.product_image.path_img AS path_img,
                    fillfin.product_image.hover AS hover,
                    fillfin.product_image.premium AS premium,
                    fillfin.product_image.display AS display,
                    fillfin.product_image.member_type AS member_type,
                    fillfin.product_image.createdAt AS createdAt,
                    fillfin.product_image.updatedAt AS updatedAt
                FROM
                    fillfin.product_image
                WHERE
                    (
                        fillfin.product_image.premium = 'no'
                    )
            ) product_image
        ON
            (
                (
                    fillfin.product.id = product_image.product_id
                )
            )
            )
        WHERE
            (
                fillfin.product.status = 'active'
            )
        GROUP BY
            fillfin.product.id
    ) products
ON
    (
        (
            fillfin.store.id = products.store_id
        )
    )
    )
ORDER BY
    products.pre_order) all_store
    WHERE
        (all_store.storeStatus = 'active')
    ORDER BY
        all_store.lastUpdate
    DESC
        ,
        all_store.updatedAt
    DESC
        