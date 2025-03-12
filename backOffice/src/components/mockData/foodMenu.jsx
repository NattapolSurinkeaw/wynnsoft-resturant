export const foodDetail = [
  {
    id: 1,
    name: "ไก่ทอด",
    price: 150, //ราคาอาหาร
    specialPrice: 100, //ส่วนลด
    cateID: 1, //หมวดหมู่
    count: 2, //จำนวน
    detail: "ไม่ใส่หอม ไม่ใสเผ็ด ไม่เค็ม ผัดน้ำแทนน้ำมัน", //รายละเอียด
    images: "/images/img/Rectangle 912.png", //รูป
    status: " ", //สถานะ
    bestSeller: 0, //สินค้าขายดี
  },
  {
    id: 2,
    name: "สเต็กเนื้อสันไหล่วากิวแองกัส",
    price: 1500,
    specialPrice: 1200,
    cateID: 2,
    count: 2,
    detail:
      "Lorem ipsum dolor sit amet consectetur. Quis quisque bibendum tortor massa eget nunc.",
    images: "/images/img/Rectangle 1131.png",
    status: 1,
    bestSeller: 0,
  },
  {
    id: 3,
    name: "สลัดผัก",
    price: 1150,
    specialPrice: 1100,
    cateID: 3,
    count: 1,
    detail: "",
    images: "/images/img/Rectangle 1141.png",
    status: 1,
    bestSeller: 1,
  },
  {
    id: 4,
    name: "ผัดกระเทียมพริกไทย",
    price: 250,
    specialPrice: 200,
    cateID: 4,
    count: 2,
    detail:
      "Lorem ipsum dolor sit amet consectetur. Quis quisque bibendum tortor massa eget nunc.",
    images: "/images/img/Rectangle 1136.png",
    status: 0,
    bestSeller: 1,
  },
  {
    id: 5,
    name: "ข้าวหมูแดง",
    price: 150, //ราคาอาหาร
    specialPrice: 100, //ส่วนลด
    cateID: 1, //หมวดหมู่
    count: 2, //จำนวน
    detail: "ไม่ใส่หอม ไม่ใสเผ็ด ไม่เค็ม ผัดน้ำแทนน้ำมัน", //รายละเอียด
    images: "/images/img/moo-deng.jpg", //รูป
    status: 1, //สถานะ
    bestSeller: 1, //สินค้าขายดี
  },
  {
    id: 6,
    name: "ผัดกะเพรา",
    price: 1000,
    specialPrice: 800,
    cateID: 2,
    count: 2,
    detail: "",
    images: "/images/img/Pad-Kra-Pao.jpg",
    status: 0,
    bestSeller: 1,
  },
  {
    id: 7,
    name: "ผัดไทย",
    price: 1150,
    specialPrice: 950,
    cateID: 2,
    count: 1,
    detail: "",
    images: "/images/img/pad-thai.jpg",
    status: 0,
    bestSeller: 0,
  },
  {
    id: 8,
    name: "ต้มยำกุ้ง",
    price: 250,
    specialPrice: 150,
    cateID: 3,
    count: 2,
    detail:
      "Lorem ipsum dolor sit amet consectetur. Quis quisque bibendum tortor massa eget nunc.",
    images: "/images/img/tomyum.jpg",
    status: 1,
    bestSeller: 1,
  },
  {
    id: 9,
    name: "น้ำแข็งใส",
    price: 50,
    specialPrice: "",
    cateID: 5,
    count: 2,
    detail:
      "Lorem ipsum dolor sit amet consectetur. Quis quisque bibendum tortor massa eget nunc.",
    images: "/images/img/ice-sweet.jpg",
    status: 0,
    bestSeller: 0,
  },
  {
    id: 10,
    name: "ผัดกระเทียมพริกไทย",
    price: 250,
    specialPrice: 200,
    cateID: 4,
    count: 2,
    detail:
      "Lorem ipsum dolor sit amet consectetur. Quis quisque bibendum tortor massa eget nunc.",
    images: "/images/img/Rectangle 1136.png",
    status: 1,
    bestSeller: 0,
  },
  {
    id: 11,
    name: "ข้าวหมูแดง",
    price: 150, //ราคาอาหาร
    specialPrice: 120, //ส่วนลด
    cateID: 1, //หมวดหมู่
    count: 2, //จำนวน
    detail: "ไม่ใส่หอม ไม่ใสเผ็ด ไม่เค็ม ผัดน้ำแทนน้ำมัน", //รายละเอียด
    images: "/images/img/moo-deng.jpg", //รูป
    status: 1, //สถานะ
    bestSeller: 1, //สินค้าขายดี
  },
  {
    id: 12,
    name: "ผัดกะเพรา",
    price: 1000,
    specialPrice: 700,
    cateID: 2,
    count: 2,
    detail:
      "Lorem ipsum dolor sit amet consectetur. Quis quisque bibendum tortor massa eget nunc.",
    images: "/images/img/Pad-Kra-Pao.jpg",
    status: 1,
    bestSeller: 0,
  },
].map((item, index) => ({ ...item, count: index + 1 }));

export const cate = [
  {
    id: 1,
    name: "ของทอด",
    status: "1",
    images: "/images/icon/cate/cooking-pot 2.png",
  },
  {
    id: 2,
    name: "ของผัด",
    status: "1",
    images: "/images/icon/cate/cooking-pot 2 (1).png",
  },
  {
    id: 3,
    name: "ต้ม/แกง",
    status: "1",
    images: "/images/icon/cate/cooking-pot 1.png",
  },
  {
    id: 4,
    name: "สลัด",
    status: "1",
    images: "/images/icon/cate/cooking-pot 2 (2).png",
  },
  {
    id: 5,
    name: "ของหวาน",
    status: "1",
    images: "/images/icon/cate/cooking-pot 2 (3).png",
  },
  {
    id: 6,
    name: "เครื่องดื่ม",
    status: "1",
    images: "/images/icon/cate/coke.png",
  },
  {
    id: 7,
    name: "แอลกอฮอล์",
    status: "1",
    images: "/images/icon/cate/alcohol.png",
  },
  { id: 8, name: "ส้มตำ", status: "1", images: "/images/icon/cate/salad.png" },
  { id: 9, name: "a1", status: "1", images: "/images/icon/cate/alcohol.png" },
  { id: 10, name: "a2", status: "1", images: "/images/icon/cate/salad.png" },
];
