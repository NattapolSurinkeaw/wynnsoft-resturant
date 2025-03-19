import React, { useState, useEffect } from "react";
import { getEditShopData } from "../../../services/setting.service";
import Swal from "sweetalert2";

function Shop({webinfo, setRefresh}) {
  const [shopName, setShopName] = useState("");
  const [shopOwner, setShopOwner] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [taxNumber, setTaxNumber] = useState("");

  useEffect(() => {
    if (webinfo && Array.isArray(webinfo)) {
      setShopName(webinfo.find((item) => item.info_param === "shop_name")?.info_value || "");
      setShopOwner(webinfo.find((item) => item.info_param === "shop_owner")?.info_value || "");
      setAddress(webinfo.find((item) => item.info_param === "address")?.info_value || "");
      setPhone(webinfo.find((item) => item.info_param === "phone")?.info_value || "");
      setEmail(webinfo.find((item) => item.info_param === "email")?.info_value || "");
      setTaxNumber(webinfo.find((item) => item.info_param === "tax_number")?.info_value || "");
    }
  }, [webinfo]); // ใช้ webinfo เป็น dependency เพื่อให้ effect ทำงานเมื่อข้อมูลเปลี่ยนแปลง

  const submitChangeData = () => {
    const params = {
      shop_name: shopName,
      shop_owner: shopOwner,
      address: address,
      phone: phone,
      email: email,
      tax_number: taxNumber
    }

    getEditShopData(params).then((res) => {
      if(res.status) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "บันทึกข้อมูลเสร็จ",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => setRefresh(prev => !prev))
      }
    })
  }

  return (
    <>
      <div className="xl:w-[680px] w-full p-5 rounded-lg shadow-1 bg-white">
        <p className="text-[22px] text-[#00537B] font-[600] ">ข้อมูลร้านค้า</p>
        <div className="w-full space-y-6 mt-4">
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">ชื่อร้าน</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกชื่อร้าน..."
              onChange={(e) => setShopName(e.target.value)}
              value={shopName}
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">
              เจ้าของร้าน
            </p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกชื่อเจ้าของร้าน..."
              onChange={(e) => setShopOwner(e.target.value)}
              value={shopOwner}
            />
          </div>
          <div className="flex">
            <p className="min-w-[100px] text-[#313131] font-[400]">ที่อยู่</p>
            <textarea
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกที่อยู่..."
              rows="4"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">เบอร์โทร</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกเบอร์โทร..."
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">E-mail</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกอีเมล..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[100px] text-[#313131] font-[400]">
              เลขผู้เสียภาษี
            </p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกเลข..."
              onChange={(e) => setTaxNumber(e.target.value)}
              value={taxNumber}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            className="button-1 mt-10"
            onClick={submitChangeData}
          >บันทึก</button>
        </div>
      </div>
    </>
  );
}

export default Shop;
