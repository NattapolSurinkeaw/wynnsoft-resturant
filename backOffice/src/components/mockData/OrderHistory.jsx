export const order_history = [
  {
    id: 1,
    order_number: "000000001",
    tableID: 1, //โต๊ะ
    images: "", //รูป
    createdAt: "04-02-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    // menuID: [1, 2, 4],
    note: "ไม่ใสต้นหอม ไม่ใส่หัวกุ้ง ไม่ใสต้นหอม ไม่ใส่หัวกุ้ง ไม่ใส่ต้นหอม ไม่ใส่หัวกุ้ง ไม่ใส่ต้นหอม ไม่ใส่หัวกุ้ง ไม่ใส่ต้นหอม ไม่ใส่หัวกุ้ง ",
  },
  {
    id: 2,
    order_number: "000000002",
    tableID: 2, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "05-02-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 2, 4],
    note: "ไม่ใสต้นหอม ไม่ใส่หัวกุ้ง ไม่ใสต้นหอม ไม่ใส่หัวกุ้ง ไม่ใส่ต้นหอม ไม่ใส่หัวกุ้ง",
  },
  {
    id: 3,
    order_number: "000000003",
    tableID: 3, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "06-02-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 0, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 2, 3, 9, 7, 2],
    note: "In viverra ex urna. felis, amet, vehicula, ex. elit vitae eget eget libero, Quisque amet, amet, dui. vitae Nam leo. nisl.  dui id tincidunt Nunc Nunc ipsum dolor enim. Nullam risus tincidunt odio dignissim",
  },
  {
    id: 4,
    order_number: "000000004",
    // netprice: 150, //ราคาสุทธิ
    // specialPrice: 100, //ราคารวม
    tableID: 4, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "10-03-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 0, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 3, 5, 4],
    note: "",
  },
  {
    id: 5,
    order_number: "000000005",
    tableID: 5, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "12-03-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 3, 5, 6],
    note: "",
  },
  {
    id: 6,
    order_number: "000000001",
    tableID: 1, //หมวดหมู่
    images: "", //รูป
    createdAt: "04-02-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [2, 4, 5],
    note: "",
  },
  {
    id: 7,
    order_number: "000000002",
    tableID: 2, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "05-02-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 2, 4],
    note: "",
  },
  {
    id: 8,
    order_number: "000000003",
    tableID: 3, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "06-02-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 0, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 2, 3],
    note: "In viverra ex urna. felis, amet, vehicula, ex. elit vitae eget eget libero, Quisque amet, amet, dui. vitae Nam leo. nisl.  dui id tincidunt Nunc Nunc ipsum dolor enim. Nullam risus tincidunt odio dignissim",
  },
  {
    id: 9,
    order_number: "000000004",
    // netprice: 150, //ราคาสุทธิ
    // specialPrice: 100, //ราคารวม
    tableID: 4, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "10-03-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 0, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 3, 5, 4],
    note: "In viverra ex urna. felis, amet, vehicula, ex. elit vitae eget eget libero, Quisque amet, amet, dui. vitae Nam leo. nisl.  dui id tincidunt Nunc Nunc ipsum dolor enim. Nullam risus tincidunt odio dignissim",
  },
  {
    id: 10,
    order_number: "000000005",
    tableID: 5, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "12-03-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 3, 5, 6],
    note: "In viverra ex urna. felis,",
  },
  {
    id: 11,
    order_number: "000000005",
    tableID: 5, //หมวดหมู่
    images: "/images/img/ex-sl.jpg", //รูป
    createdAt: "12-03-2025",
    time: "12.35 น.", //จำนวน
    payment_status: 1, //สถานะ 1 ชำระผ่าน QR | 0 ชำระเงินสด
    menuID: [1, 3, 5, 6],
    note: "In viverra ex urna. felis,",
  },
];
