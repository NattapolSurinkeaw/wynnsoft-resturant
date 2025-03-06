import React, { useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const mockData = [
  {
    bank: "ธนาคารกรุงไทย",
    accountName: "จิราภรณ์ ชุมภู",
    accountNumber: "098-765-4321",
    qrCode: "/images/QR.jpg",
  },
  {
    bank: "ธนาคารกรุงเทพ",
    accountName: "สมชาย ชุมภู",
    accountNumber: "123-456-7890",
    qrCode: "/images/QR.jpg",
  },
];

function Account() {
  const [image1, setImage1] = useState(null);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="3xl:w-[1207px] w-full p-5 rounded-lg shadow-1 bg-white">
        <p className="text-[22px] text-[#00537B] font-[600]">
          ข้อมูลบัญชีธนาคาร
        </p>
        <div className="mt-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-3 text-left bg-[#F3F4F6] rounded-tl-lg">
                  ธนาคาร
                </th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6]">ชื่อบัญชี</th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6]">เลขบัญชี</th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6]">QR Code</th>
                <th className="px-2 py-3 text-left bg-[#F3F4F6] rounded-tr-lg">
                  แก้ไข
                </th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((data, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-[#F3F4F6]"}
                >
                  <td className="px-2 py-3">{data.bank}</td>
                  <td className="px-2 py-3">{data.accountName}</td>
                  <td className="px-2 py-3">{data.accountNumber}</td>
                  <td className="px-2 py-3">
                    <img
                      src={data.qrCode}
                      alt="QR Code"
                      className="w-[90px] h-[90px] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center items-center w-[35px] h-[35px] rounded-lg bg-[#F5A100] group hover:bg-[#013D59] transition duration-100 shadow-1 cursor-pointer">
                      <BorderColorIcon
                        fontSize="small"
                        className="text-white group-hover:text-white"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="3xl:w-[1207px] w-full p-5 rounded-lg shadow-1 bg-white mt-5">
        <p className="text-[22px] text-[#00537B] font-[600]">ธนาคาร</p>
        <div className="flex justify-between gap-6 w-full">
          <div className="w-1/2 space-y-6 mt-4 ml-12">
            <div className="flex items-center ">
              <p className="min-w-[80px] text-[#313131] font-[400]">ธนาคาร</p>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกชื่อธนาคาร..."
              />
            </div>
            <div className="flex items-center ">
              <p className="min-w-[80px] text-[#313131] font-[400]">
                ชื่อบัญชี
              </p>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกชื่อบัญชี..."
              />
            </div>
            <div className="flex items-center ">
              <p className="min-w-[80px] text-[#313131] font-[400]">เลขบัญชี</p>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกเลขบัญชี..."
              />
            </div>
          </div>

          <div className="flex justify-center w-1/2 ">
            <div className="relative min-w-[190px] max-w-[190px] h-[190px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center shadow-md overflow-hidden">
              {image1 ? (
                <img
                  src={image1}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-lg "
                />
              ) : (
                <div className="text-white text-lg text-center">
                  เลือกรูปภาพ <br />
                  <span className="text-[12px] text-center">
                    (ขนาด 200*200 px)
                  </span>
                </div>
              )}

              <label
                htmlFor="fileInput1"
                className="absolute bottom-2 right-2 bg-[#FFD25B] hover:bg-[#00537B] transition duration-100 flex justify-center items-center w-[30px] h-[30px] rounded-full shadow-1 cursor-pointer"
              >
                <CreateIcon
                  fontSize="small"
                  className="text-white hover:text-white"
                />
              </label>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput1"
                onChange={(e) => handleImageChange(e, setImage1)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="button-1 mt-10 mb-2">บันทึก</button>
        </div>
      </div>
    </>
  );
}

export default Account;
