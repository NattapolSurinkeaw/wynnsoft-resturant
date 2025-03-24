export const orderToday = [
  {
    id: 6,
    order_number: "000000006",
    table_id: 111, //ไอดีโต๊ะ
    status: "1", //สถานะออเดอร์ รอเสิร์ฟ เรียกพนักงาน ครบแล้ว รอการชำระ ชำระแล้ว
    price: 90, //ราคารวมอาหารดิบ
    payment: "2", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note:
      "In viverra ex urna. felis, amet, vehicula, ex. elit vitae eget eget libero, Quisque amet, amet, dui. vitae Nam leo. nisl.  dui id tincidunt Nunc Nunc ipsum dolor enim. Nullam risus tincidunt odio dignissim.",
    createdAt: "2025-03-11T09:47:46.000Z",
    updatedAt: "2025-03-12T10:05:42.000Z",
    table: {
      id: 111,
      table_token: "6e87770d-3684-47d1-b384-95fd0cf55051",
      title: "VIPP", //ชื่อโต๊ะ
      status: 2, //สถานะโต๊ะ ว่าง จอง บริการ
      call_staff: false, // สถานะการเรียกพนักงาน true false
      priority: 1,
      display: true, //สถานะการแสดงผลโต๊ะ เปิด - ปิดแสดงผล
      createdAt: "2025-03-06T04:55:23.000Z",
      updatedAt: "2025-03-14T02:30:14.000Z",
    },
    orderList: [
      {
        id: 56,
        food_id: 1, //ไอดีอาหาร
        orders_id: 6, // ไอดีออเดอร์
        amount: 3, // จำนวนอาหารที่สั่ง
        status: "2", //สถานะของอาหาร รับออเดอร์ กำลังปรุง รอเสิร์ฟ เสิร์ฟแล้ว ยกเลิก หมด
        note: "", // รายละเอียดเพิ่มเติม เช่น ขอน้ำมันน้อย ไม่หวาน ไม่เค็ม ไม่ใส่มะเขือเทศ
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 1,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก", //ชื่ออาหาร
          price: 40, //ราคาปกติ
          special_price: 10, //ราคาพิเศษ
          best_seller: true, //สถานะอาหารขายดี true false
          details: "ปลาทูแมวทอด 2 ตัว", //รายละเอียดของอาหาร
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1131.png", //รูปอาหาร
          status_food: true, //สถานะแจ้งอาหารหมด
          note: null, // ลายละเอียดเอาไว้แจ้งเวลาอาหารหมด
          display: true, //สถานะแสดงผล
          createdAt: null,
          updatedAt: "2025-03-04T09:32:46.000Z",
        },
      },
      {
        id: 57,
        food_id: 2,
        orders_id: 6,
        amount: 1,
        status: "1",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
      {
        id: 58,
        food_id: 3,
        orders_id: 6,
        amount: 1,
        status: "5", //ยกเลิก
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ข้าวผัด",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
      {
        id: 57,
        food_id: 2,
        orders_id: 6,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 0,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
      {
        id: 58,
        food_id: 10,
        orders_id: 6,
        amount: 2,
        status: "3",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 10,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก ๆ",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
    ],
  },
  {
    id: 15,
    order_number: "0000000216",
    table_id: 2,
    status: "5",
    price: 60,
    payment: "2", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-14T02:31:10.000Z",
    updatedAt: "2025-03-14T02:33:12.000Z",
    table: {
      id: 2,
      table_token: "bf3136cd-2241-4cae-bd7f-62573d0ad41e",
      title: "luxury",
      status: true,
      call_staff: false,
      priority: 2,
      display: true,
      createdAt: "2025-03-06T04:59:53.000Z",
      updatedAt: "2025-03-14T02:32:53.000Z",
    },
    orderList: [
      {
        id: 63,
        food_id: 3,
        orders_id: 15,
        amount: 4,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 1,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก2",
          price: 40,
          special_price: 0,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1131.png", //รูปอาหาร
          status_food: true, //สถานะแจ้งอาหารหมด
          note: null, // ลายละเอียดเอาไว้แจ้งเวลาอาหารหมด
          display: true, //สถานะแสดงผล
          createdAt: null,
          updatedAt: "2025-03-04T09:32:46.000Z",
        },
      },
      {
        id: 64,
        food_id: 2,
        orders_id: 15,
        amount: 1,
        status: "3",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
    ],
  },
  {
    id: 7,
    order_number: "000000007",
    table_id: 1, //ไอดีโต๊ะ
    status: "2", //สถานะออเดอร์ รอเสิร์ฟ เรียกพนักงาน ครบแล้ว
    price: 90, //ราคารวมอาหารดิบ
    payment: "1", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-11T09:47:46.000Z",
    updatedAt: "2025-03-12T10:05:42.000Z",
    table: {
      id: 1,
      table_token: "6e87770d-3684-47d1-b384-95fd0cf55051",
      title: "dinosaur", //ชื่อโต๊ะ
      status: 2, //สถานะโต๊ะ ว่าง จอง บริการ
      call_staff: false, // สถานะการเรียกพนักงาน true false
      priority: 1,
      display: true, //สถานะการแสดงผลโต๊ะ เปิด - ปิดแสดงผล
      createdAt: "2025-03-06T04:55:23.000Z",
      updatedAt: "2025-03-14T02:30:14.000Z",
    },
    orderList: [
      {
        id: 56,
        food_id: 1, //ไอดีอาหาร
        orders_id: 6, // ไอดีออเดอร์
        amount: 1, // จำนวนอาหารที่สั่ง
        status: "3", //สถานะของอาหาร รับออเดอร์ กำลังปรุง รอเสิร์ฟ เสิร์ฟแล้ว ยกเลิก หมด
        note: "", // รายละเอียดเพิ่มเติม เช่น ขอน้ำมันน้อย ไม่หวาน ไม่เค็ม ไม่ใส่มะเขือเทศ
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 45,
          cate_id: "1,2",
          name: "ข้าวผัด", //ชื่ออาหาร
          price: 140, //ราคาปกติ
          special_price: 100, //ราคาพิเศษ
          best_seller: true, //สถานะอาหารขายดี true false
          details: "ปลาทูแมวทอด 2 ตัว", //รายละเอียดของอาหาร
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1131.png", //รูปอาหาร
          status_food: true, //สถานะแจ้งอาหารหมด
          note: null, // ลายละเอียดเอาไว้แจ้งเวลาอาหารหมด
          display: true, //สถานะแสดงผล
          createdAt: null,
          updatedAt: "2025-03-04T09:32:46.000Z",
        },
      },
      {
        id: 57,
        food_id: 2,
        orders_id: 6,
        amount: 1,
        status: "3",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
      {
        id: 58,
        food_id: 3,
        orders_id: 6,
        amount: 1,
        status: "1",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
    ],
  },
  {
    id: 10,
    order_number: "000000010",
    table_id: 12,
    status: "1",
    price: 60,
    payment: "1", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-14T02:31:10.000Z",
    updatedAt: "2025-03-14T02:33:12.000Z",
    table: {
      id: 12,
      table_token: "bf3136cd-2241-4cae-bd7f-62573d0ad41e",
      title: "02",
      status: true,
      call_staff: false,
      priority: 2,
      display: true,
      createdAt: "2025-03-06T04:59:53.000Z",
      updatedAt: "2025-03-14T02:32:53.000Z",
    },
    orderList: [
      {
        id: 63,
        food_id: 3,
        orders_id: 15,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก123",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
      {
        id: 64,
        food_id: 2,
        orders_id: 15,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 45,
          cate_id: "1,2",
          name: "ข้าวผัด", //ชื่ออาหาร
          price: 140, //ราคาปกติ
          special_price: 100, //ราคาพิเศษ
          best_seller: true, //สถานะอาหารขายดี true false
          details: "ปลาทูแมวทอด 2 ตัว", //รายละเอียดของอาหาร
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1131.png", //รูปอาหาร
          status_food: true, //สถานะแจ้งอาหารหมด
          note: null, // ลายละเอียดเอาไว้แจ้งเวลาอาหารหมด
          display: true, //สถานะแสดงผล
          createdAt: null,
          updatedAt: "2025-03-04T09:32:46.000Z",
        },
      },
    ],
  },
  {
    id: 16,
    order_number: "000000016",
    table_id: 11, //ไอดีโต๊ะ
    status: "2", //สถานะออเดอร์ รอเสิร์ฟ เรียกพนักงาน ครบแล้ว
    price: 90, //ราคารวมอาหารดิบ
    payment: "1", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-11T09:47:46.000Z",
    updatedAt: "2025-03-12T10:05:42.000Z",
    table: {
      id: 11,
      table_token: "6e87770d-3684-47d1-b384-95fd0cf55051",
      title: "01", //ชื่อโต๊ะ
      status: 2, //สถานะโต๊ะ ว่าง จอง บริการ
      call_staff: false, // สถานะการเรียกพนักงาน true false
      priority: 1,
      display: true, //สถานะการแสดงผลโต๊ะ เปิด - ปิดแสดงผล
      createdAt: "2025-03-06T04:55:23.000Z",
      updatedAt: "2025-03-14T02:30:14.000Z",
    },
    orderList: [
      {
        id: 56,
        food_id: 1, //ไอดีอาหาร
        orders_id: 6, // ไอดีออเดอร์
        amount: 1, // จำนวนอาหารที่สั่ง
        status: "4", //สถานะของอาหาร รับออเดอร์ กำลังปรุง รอเสิร์ฟ เสิร์ฟแล้ว ยกเลิก หมด
        note: "", // รายละเอียดเพิ่มเติม เช่น ขอน้ำมันน้อย ไม่หวาน ไม่เค็ม ไม่ใส่มะเขือเทศ
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 1,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก", //ชื่ออาหาร
          price: 40, //ราคาปกติ
          special_price: 10, //ราคาพิเศษ
          best_seller: true, //สถานะอาหารขายดี true false
          details: "ปลาทูแมวทอด 2 ตัว", //รายละเอียดของอาหาร
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1131.png", //รูปอาหาร
          status_food: true, //สถานะแจ้งอาหารหมด
          note: null, // ลายละเอียดเอาไว้แจ้งเวลาอาหารหมด
          display: true, //สถานะแสดงผล
          createdAt: null,
          updatedAt: "2025-03-04T09:32:46.000Z",
        },
      },
      {
        id: 57,
        food_id: 2,
        orders_id: 6,
        amount: 1,
        status: "3",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
      {
        id: 58,
        food_id: 3,
        orders_id: 6,
        amount: 1,
        status: "3",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
    ],
  },
  {
    id: 12,
    order_number: "000000215",
    table_id: 22,
    status: "5",
    price: 60,
    payment: "2", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-24T03:31:10.000Z",
    updatedAt: "2025-03-14T02:33:12.000Z",
    table: {
      id: 22,
      table_token: "bf3136cd-2241-4cae-bd7f-62573d0ad41e",
      title: "02",
      status: true,
      call_staff: false,
      priority: 2,
      display: true,
      createdAt: "2025-03-06T04:59:53.000Z",
      updatedAt: "2025-03-14T02:32:53.000Z",
    },
    orderList: [
      {
        id: 63,
        food_id: 3,
        orders_id: 15,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
      {
        id: 64,
        food_id: 2,
        orders_id: 15,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 3,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
    ],
  },
  {
    id: 11,
    order_number: "000000011",
    table_id: 15, //ไอดีโต๊ะ
    status: "5", //สถานะออเดอร์ รอเสิร์ฟ เรียกพนักงาน ครบแล้ว
    price: 90, //ราคารวมอาหารดิบ
    payment: "1", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-24T02:31:10.000Z",
    updatedAt: "2025-03-24T02:31:12.000Z",
    table: {
      id: 15,
      table_token: "6e87770d-3684-47d1-b384-95fd0cf55051",
      title: "01", //ชื่อโต๊ะ
      status: 2, //สถานะโต๊ะ ว่าง จอง บริการ
      call_staff: false, // สถานะการเรียกพนักงาน true false
      priority: 1,
      display: true, //สถานะการแสดงผลโต๊ะ เปิด - ปิดแสดงผล
      createdAt: "2025-03-06T04:55:23.000Z",
      updatedAt: "2025-03-14T02:30:14.000Z",
    },
    orderList: [
      {
        id: 56,
        food_id: 1, //ไอดีอาหาร
        orders_id: 6, // ไอดีออเดอร์
        amount: 1, // จำนวนอาหารที่สั่ง
        status: "4", //สถานะของอาหาร รับออเดอร์ กำลังปรุง รอเสิร์ฟ เสิร์ฟแล้ว ยกเลิก หมด
        note: "", // รายละเอียดเพิ่มเติม เช่น ขอน้ำมันน้อย ไม่หวาน ไม่เค็ม ไม่ใส่มะเขือเทศ
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 1,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก", //ชื่ออาหาร
          price: 40, //ราคาปกติ
          special_price: 0, //ราคาพิเศษ
          best_seller: true, //สถานะอาหารขายดี true false
          details: "ปลาทูแมวทอด 2 ตัว", //รายละเอียดของอาหาร
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1131.png", //รูปอาหาร
          status_food: true, //สถานะแจ้งอาหารหมด
          note: null, // ลายละเอียดเอาไว้แจ้งเวลาอาหารหมด
          display: true, //สถานะแสดงผล
          createdAt: null,
          updatedAt: "2025-03-04T09:32:46.000Z",
        },
      },
      {
        id: 57,
        food_id: 2,
        orders_id: 6,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 0,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
      {
        id: 58,
        food_id: 3,
        orders_id: 6,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-12T09:44:19.000Z",
        updatedAt: "2025-03-12T09:44:19.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก",
          price: 40,
          special_price: 0,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
    ],
  },
  {
    id: 167,
    order_number: "00044516",
    table_id: 31,
    status: "5",
    price: 60,
    payment: "1", // 1.ชำระผ่าน QR  2.ชำระเงินสด
    order_note: "",
    createdAt: "2025-03-24T02:31:10.000Z",
    updatedAt: "2025-03-24T02:31:12.000Z",
    table: {
      id: 31,
      table_token: "bf3136cd-2241-4cae-bd7f-62573d0ad41e",
      title: "03",
      status: true,
      call_staff: false,
      priority: 2,
      display: true,
      createdAt: "2025-03-06T04:59:53.000Z",
      updatedAt: "2025-03-14T02:32:53.000Z",
    },
    orderList: [
      {
        id: 63,
        food_id: 3,
        orders_id: 15,
        amount: 3,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 3,
          cate_id: "1,2",
          name: "ทอดปลาทูตัวเล็ก",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1136.png",
          status_food: true,
          note: null,
          display: true,
          createdAt: "2025-03-04T09:40:28.000Z",
          updatedAt: "2025-03-04T09:40:28.000Z",
        },
      },
      {
        id: 64,
        food_id: 2,
        orders_id: 15,
        amount: 1,
        status: "4",
        note: "",
        createdAt: "2025-03-14T02:33:12.000Z",
        updatedAt: "2025-03-14T02:33:12.000Z",
        food: {
          id: 2,
          cate_id: "11",
          name: "ทอดปลาทู",
          price: 40,
          special_price: 30,
          best_seller: true,
          details: "ปลาทูแมวทอด 2 ตัว",
          thumbnail_title: "",
          thumbnail_link: "/images/img/Rectangle 1141.png",
          status_food: false,
          note: null,
          display: true,
          createdAt: "2025-03-04T08:54:27.000Z",
          updatedAt: "2025-03-13T09:14:45.000Z",
        },
      },
    ],
  },
];
