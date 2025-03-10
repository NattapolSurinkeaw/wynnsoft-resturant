import React, { useEffect, useRef, useState } from "react";
import { cate } from "../../components/mockData/foodMenu";
import { Checkbox } from "@mui/material";
import Switch, { switchClasses } from "@mui/joy/Switch";
import { NumericFormat } from "react-number-format";

const EditFood = ({ onClickClose, selectedRow }) => {
  const [editData, setEditData] = useState(selectedRow);
  const [image, setImage] = useState(null);
  const [checked, setChecked] = useState(editData.bestSeller || false); //สินค้าขายดี
  const [nameFood, setNameFood] = useState(editData.name || ""); //ชื่อสินค้า
  const [text, setText] = useState(editData.detail || ""); //รายละเอียด
  const [price, setPrice] = useState(editData.price || ""); //ราคา
  const [specialPrice, setSpecialPrice] = useState(editData.specialPrice || ""); //ราคาพิเศษ

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); //สถานะ
  const menuStatus = useRef(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // console.log("selectedRow", editData);

  const handleCategoryChange = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuStatus.current && !menuStatus.current.contains(event.target)) {
        setShowStatusMenu(false);
      }
    };
    if (showStatusMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusMenu]);

  useEffect(() => {
    if (selectedStatus === null) {
      setShowStatusMenu(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    setSelectedStatus(editData.status);
  }, [editData.status]);
  console.log("selectedStatus", selectedStatus);

  return (
    <div className="flex lg:flex-row flex-col lg:gap-2 gap-6 w-full h-full">
      <div className="flex lg:flex-col flex-row gap-3 w-full lg:max-w-[300px] ">
        <div className="relative w-full h-[300px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center shadow-md overflow-hidden">
          {image || editData.images ? (
            <img
              src={image || editData.images} // ใช้ค่าจาก state หรือ editData
              alt="Uploaded or Existing"
              className="w-full h-full object-cover rounded-lg "
            />
          ) : (
            <div className="text-white text-lg text-center">
              เลือกรูปภาพ <br />
              <span className="text-[12px] text-center">(ขนาด 200*200 px)</span>
            </div>
          )}

          <label
            htmlFor="fileInput1"
            className="absolute bottom-0 bg-[#00537B]/70  transition duration-100 flex justify-center items-center gap-2 w-full h-[40px] shadow-1 cursor-pointer"
          >
            <figure className="w-[25px] h-[25px]">
              <img src="/icons/edit.png" alt="" className="w-full h-full" />
            </figure>

            <span className="text-white">อัปรูปอาหาร</span>
          </label>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="fileInput1"
            onChange={(e) => handleImageChange(e, setImage)}
          />
        </div>

        <div className="flex w-full flex-col gap-2 max-lg:h-[300px]">
          <span className="text-[#00537B] lg:text-2xl text-xl font-medium">
            หมวดเมนู
          </span>
          <div className="border border-[#D9D9D9] lg:p-3 rounded-lg shadow h-[300px] overflow-y-auto">
            {cate.map((category) => (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-x-3">
                  <Checkbox
                    checked={
                      selectedCategories.includes(category.id) ||
                      editData.cateID === category.id
                    }
                    onChange={() => handleCategoryChange(category.id)}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                    color="default"
                  />
                  <span className="text-[#313131] lg:text-xl text-lg">
                    {category.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 w-full rounded-lg">
        <div className="flex flex-col  gap-4 h-full">
          <div className="flex flex-row items-center  gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              ชื่อเมนู
            </span>
            <input
              type="text"
              className="w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4 lg:h-[45px]"
              value={nameFood}
              onChange={(e) => setNameFood(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center  gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              สถานะ
            </span>

            <div className="relative" ref={menuStatus}>
              <div
                className="bg-white cursor-pointer flex justify-between items-center border border-[#D9D9D9] gap-2 py-1.5 px-2 rounded-lg w-[245px] lg:h-[45px] max-w-full"
                onClick={() => setShowStatusMenu((prevState) => !prevState)}
              >
                <p className="text-[#313131] xl:text-lg text-base font-[400]">
                  {selectedStatus === 1
                    ? "พร้อมบริการ"
                    : selectedStatus === 0
                    ? "สินค้าหมด"
                    : "สถานะเมนู"}
                </p>
                <figure
                  className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                    showStatusMenu ? "rotate-180" : ""
                  }`}
                >
                  <img
                    src="/icons/Group 949.png"
                    alt="Dropdown Icon"
                    className="w-full h-full"
                  />
                </figure>
              </div>

              <div
                className={`absolute w-full h-full ${
                  showStatusMenu ? "z-99" : "z-0"
                } `}
              >
                {showStatusMenu && (
                  <div className="absolute w-full z-99 mt-1">
                    <div className="bg-white flex flex-col gap-1 p-2 rounded-b-lg border border-[#D9D9D9]">
                      <div
                        className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedStatus === 1 ? "bg-[#F5A100] text-white" : ""
                        }`}
                        onClick={() => {
                          setSelectedStatus(1);
                          setShowStatusMenu(false);
                        }}
                      >
                        พร้อมบริการ
                      </div>
                      <div
                        className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                          selectedStatus === 0 ? "bg-[#F5A100] text-white" : ""
                        }`}
                        onClick={() => {
                          setSelectedStatus(0);
                          setShowStatusMenu(false);
                        }}
                      >
                        สินค้าหมด
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-start items-center gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              ราคา
            </span>

            <NumericFormat
              className="z-50 w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4 lg:h-[45px]"
              value={price}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              allowLeadingZeros={false}
              onValueChange={(values) => {
                setPrice(values.value);
              }}
            />

            <span className="w-[140px] flex-shrink-0 text-left text-[#00537B] text-2xl">
              บาท
            </span>
          </div>

          <div className="flex flex-row items-center gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              ราคาพิเศษ
            </span>
            <NumericFormat
              className="z-50 w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4 lg:h-[45px]"
              value={specialPrice}
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              allowLeadingZeros={false}
              onValueChange={(values) => {
                setSpecialPrice(values.value);
              }}
            />
            <span className="w-[140px] flex-shrink-0 text-left text-[#00537B] text-2xl">
              บาท
            </span>
          </div>
          <div className="flex flex-row items-center gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              สินค้าขายดี
            </span>
            <Switch
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)} // ตรงนี้เก็บค่าเป็น Boolean
              sx={(theme) => ({
                "--Switch-thumbShadow": "0 3px 7px 0 rgba(0 0 0 / 0.12)",
                "--Switch-thumbSize": "27px",
                "--Switch-trackWidth": "51px",
                "--Switch-trackHeight": "31px",
                "--Switch-trackBackground":
                  theme.vars.palette.background.level3,
                [`& .${switchClasses.thumb}`]: {
                  transition: "width 0.05s, left 0.05s",
                },
                "&:hover": {
                  "--Switch-trackBackground":
                    theme.vars.palette.background.level3,
                },
                "&:active": {
                  "--Switch-thumbWidth": "32px",
                },
                [`&.${switchClasses.checked}`]: {
                  "--Switch-trackBackground": "rgb(48 209 88)",
                  "&:hover": {
                    "--Switch-trackBackground": "rgb(48 209 88)",
                  },
                },
              })}
            />
          </div>

          <div className="flex flex-row gap-3">
            <span className="w-[140px] flex-shrink-0 text-right text-[#00537B] text-2xl">
              รายละเอียด
            </span>
            <textarea
              id="message"
              className="w-full border border-[#D9D9D9] rounded-lg outline-none py-1 px-4 lg:h-40 h-20 text-xl"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="รายละเอียด..."
            />
          </div>
        </div>

        <div className="flex flex-row justify-center gap-4">
          <button className="bg-[#FFBA41] hover:bg-[#00537B] cursor-pointer  transition-all ease-in-out duration-200 text-white rounded-lg w-[220px] text-center py-1.5 font-bold text-xl">
            บันทึก
          </button>
          <button
            onClick={() => {
              onClickClose(false);
            }}
            className="bg-[#F44D4D] hover:bg-[#00537B] cursor-pointer transition-all ease-in-out duration-200 text-white rounded-lg w-[220px] text-center py-1.5 font-bold text-xl"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFood;
