import React, { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { getBankAccount } from "../../../services/setting.service";
import { api_path } from "../../../store/setting";
import { getUpdateBank } from "../../../services/setting.service";

function Account() {
  const [bankAccount, setBankAccount] = useState([]);
  const [imageFile, setImageFile] = useState(null); // เก็บไฟล์จริง
  const [previewUrl, setPreviewUrl] = useState(null); // เก็บ URL สำหรับพรีวิว
  const [provider, setProvider] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [bankId, setBankId] = useState(null);

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const res = await getBankAccount();
        setBankAccount(res.bank);
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };

    fetchBankAccounts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // เก็บไฟล์ไว้ใช้งานใน FormData

      // สร้าง URL สำหรับพรีวิว
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleEdit = (bank) => {
    setBankId(bank.id)
    setProvider(bank.bank_provider)
    setBankName(bank.name)
    setBankNumber(bank.bank_number)
    setPreviewUrl(api_path + bank.qrcode)
  }

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('bank_provider', provider);
    formData.append('name', bankName);
    formData.append('bank_number', bankNumber);
    formData.append('qrcode', imageFile);
    
    getUpdateBank(bankId, formData).then((res) => {
      console.log(res);
    })
  }
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
              {bankAccount.map((bank, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-[#F3F4F6]"}
                >
                  <td className="px-2 py-3">{bank.bank_provider}</td>
                  <td className="px-2 py-3">{bank.name}</td>
                  <td className="px-2 py-3">{bank.bank_number}</td>
                  <td className="px-2 py-3">
                    <img
                      src={api_path + bank.qrcode}
                      alt="QR Code"
                      className="w-[90px] h-[90px] rounded-md"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-center items-center w-[35px] h-[35px] rounded-lg bg-[#F5A100] group hover:bg-[#013D59] transition duration-100 shadow-1 cursor-pointer"
                      onClick={() => handleEdit(bank)}
                    >
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
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
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
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="flex items-center ">
              <p className="min-w-[80px] text-[#313131] font-[400]">เลขบัญชี</p>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
                placeholder="กรอกเลขบัญชี..."
                value={bankNumber}
                onChange={(e) => setBankNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center w-1/2 ">
            <div className="relative min-w-[190px] max-w-[190px] h-[190px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center shadow-md overflow-hidden">
              {previewUrl  ? (
                <img
                  src={previewUrl}
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
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="button-1 mt-10 mb-2"
            onClick={onSubmit}
          >บันทึก</button>
        </div>
      </div>
    </>
  );
}

export default Account;
