select
    current.pack_id AS pack_id,
    current.package_id AS package_id,
    current.name AS name,
    current.member_gender AS member_gender,
    current.begin,
    current.expire,
    current.status_expire,
    current.mem_id AS mem_id,
    current.isStore AS isStore,
    current.username AS username,
    current.buy_limit AS buy_limit,
    current.premium,
    current.show_img_limit AS show_img_limit,
    current.show_gift AS show_gift,
    current.store_detail_limit AS store_detail_limit,
    current.price_sell AS price_sell,
    current.gross_profit
from
    (
        select
            current_pack.pack_id AS pack_id,
            current_pack.package_id AS package_id,
            current_pack.name AS name,
            current_pack.member_gender AS member_gender,
            current_pack.mem_id AS mem_id,
            current_pack.username AS username,
            current_pack.isStore AS isStore,
            current_pack.package_priority AS package_priority,
            current_pack.premium,
            current_pack.begin,
            current_pack.expire,
            current_pack.gross_profit,
            current_pack.status_expire,
            package_status.buy_limit AS buy_limit,
            package_status.show_img_limit AS show_img_limit,
            package_status.show_gift AS show_gift,
            package_status.store_detail_limit AS store_detail_limit,
            package_status.price_sell AS price_sell,
            row_number() over (
                order by
                    current_pack.package_priority ASC
            ) AS priority
        from
            (
                (
                    select
                        package.pack_id AS pack_id,
                        package.package_id AS package_id,
                        package.name AS name,
                        package.gross_profit,
                        package.premium,
                        members.id AS mem_id,
                        members.username AS username,
                        members.isStore AS isStore,
                        members.gender AS member_gender,
                        package_order.begin,
                        package_order.expire,
                        package_order.status_expire,
                        row_number() over (
                            order by
                                package.priority desc
                        ) AS package_priority
                    from
                        (
                            (
                                (
                                    members
                                    left join store on (members.username = store.username)
                                )
                                join package
                            )
                            left join package_order on(
                                package_order.member_id = members.id
                                and package_order.package_id = package.package_id
                            )
                        )
                    where
                        package_order.member_id = members.id
                        and package_order.status_confirm = 'confirm'
                        and package_order.status_payment = 'confirm'
                        and package_order.status_expire = 'no'
                        and package_order.expire > DATE(now())
                        or members.isStore = 'yes'
                        and package.package_id = 'PACKAGE_EXCLUSIVE'
                        and store.gender = members.gender
                ) current_pack
                join package_status on(
                    current_pack.package_id = package_status.package_id
                )
            )
    ) as current
group by
    current.mem_id,
    current.member_gender;

-- --------------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE VIEW view_member_package AS
SELECT
    current.pack_id AS pack_id,
    current.package_id AS package_id,
    current.name AS name,
    current.member_gender AS member_gender,
    current.begin AS begin,
    current.expire AS expire,
    current.status_expire AS status_expire,
    current.mem_id AS mem_id,
    current.isStore AS isStore,
    current.username AS username,
    current.buy_limit AS buy_limit,
    current.premium AS premium,
    current.show_img_limit AS show_img_limit,
    current.show_gift AS show_gift,
    current.store_detail_limit AS store_detail_limit,
    current.price_sell AS price_sell,
    current.gross_profit AS gross_profit
FROM
    (
        SELECT
            current_pack.pack_id AS pack_id,
            current_pack.package_id AS package_id,
            current_pack.name AS name,
            current_pack.member_gender AS member_gender,
            current_pack.mem_id AS mem_id,
            current_pack.username AS username,
            current_pack.isStore AS isStore,
            current_pack.package_priority AS package_priority,
            current_pack.premium AS premium,
            current_pack.begin AS begin,
            current_pack.expire AS expire,
            current_pack.gross_profit AS gross_profit,
            current_pack.status_expire AS status_expire,
            fillfin.package_status.buy_limit AS buy_limit,
            fillfin.package_status.show_img_limit AS show_img_limit,
            fillfin.package_status.show_gift AS show_gift,
            fillfin.package_status.store_detail_limit AS store_detail_limit,
            fillfin.package_status.price_sell AS price_sell,
            row_number() OVER(
                ORDER BY
                    current_pack.package_priority
            ) AS priority
        FROM
            (
                (
                    SELECT
                        fillfin.package.pack_id AS pack_id,
                        fillfin.package.package_id AS package_id,
                        fillfin.package.name AS name,
                        fillfin.package.gross_profit AS gross_profit,
                        fillfin.package.premium AS premium,
                        fillfin.members.id AS mem_id,
                        fillfin.members.username AS username,
                        fillfin.members.isStore AS isStore,
                        fillfin.members.gender AS member_gender,
                        fillfin.package_order.begin AS begin,
                        fillfin.package_order.expire AS expire,
                        fillfin.package_order.status_expire AS status_expire,
                        row_number() OVER(
                            ORDER BY
                                fillfin.package.priority DESC
                        ) AS package_priority
                    FROM
                        (
                            (
                                (
                                    fillfin.members
                                    LEFT JOIN fillfin.store ON (
                                        (
                                            fillfin.members.username = fillfin.store.username
                                        )
                                    )
                                )
                                JOIN fillfin.package
                            )
                            LEFT JOIN fillfin.package_order ON (
                                (
                                    (
                                        fillfin.package_order.member_id = fillfin.members.id
                                    )
                                    AND(
                                        fillfin.package_order.package_id = fillfin.package.pack_id
                                    )
                                )
                            )
                        )
                    WHERE
                        (
                            (
                                (
                                    fillfin.package_order.member_id = fillfin.members.id
                                )
                                AND(
                                    fillfin.package_order.status_confirm = 'confirm'
                                )
                                AND(
                                    fillfin.package_order.status_payment = 'confirm'
                                )
                                AND(
                                    fillfin.package_order.status_expire = 'no'
                                )
                                AND(
                                    fillfin.package_order.expire > CAST(NOW() AS DATE)
                                )
                            )
                            OR(
                                (fillfin.members.isStore = 'yes')
                                AND(
                                    fillfin.package.package_id = 'PACKAGE_PREMIUM'
                                )
                                AND(
                                    fillfin.store.gender = fillfin.members.gender
                                )
                            )
                        )
                ) current_pack
                JOIN fillfin.package_status ON (
                    (
                        current_pack.package_id = fillfin.package_status.package_id
                    )
                )
            )
    ) current
GROUP BY
    current.mem_id,
    current.member_gender