import React, { useEffect, useRef, useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ReplyIcon from "@mui/icons-material/Reply";
import Swal from "sweetalert2";
import {
  getFood,
  getCategoryFoods,
} from "../../../services/manageData.services";
import { api_path } from "../../../store/setting";
import { getAddOrderFood } from "../../../services/table_manage.service";

function AdditemModal({ isOpen, closeModal, itemId, tableDetail }) {
  const [quantities, setQuantities] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const categoryMenuRef = useRef(null);
  const [foods, setFoods] = useState([]);
  const [cateFood, setCateFood] = useState([]);
  const [intNote, setIntNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodRes = await getFood();
        setFoods(foodRes.foods || []);
        const cateRes = await getCategoryFoods();
        setCateFood(cateRes.cateFood || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("ข้อมูลโต๊ะ : ", tableDetail);
  console.log("itemId : ", selectedFood);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target)
      ) {
        setShowCategoryMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredFood = foods.filter(
    (item) =>
      (selectedCategory
        ? item.cate_id.split(",").map(Number).includes(selectedCategory)
        : true) && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันเพิ่มจำนวน
  const handleIncrease = () => {
    setQuantities((prev) => prev + 1);
  };

  // ฟังก์ชันลดจำนวน
  const handleDecrease = () => {
    setQuantities((prev) => Math.max(prev - 1, 1));
  };

  const handleAddItem = () => {
    console.log(selectedFood)
    const params = {
      token: tableDetail.qrcode,
      food: [
        {
          id: selectedFood.id,
          count: quantities,
          note: intNote,
          price: selectedFood.special_price || selectedFood.price
        },
      ],
    };

    getAddOrderFood(params).then((res) => {
      if (res.status) {
        Swal.fire({
          title: "เพิ่มรายการสำเร็จ!",
          text: "คุณได้เพิ่มเมนูลงในรายการสั่งซื้อแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
          timer: 1200,
          timerProgressBar: true,
        });
        setIsSecondModalOpen(false);
      }
    });
  };

  const openSecondModal = (id) => {
    const foodItem = filteredFood.find((food) => food.id === id);
    setSelectedFood(foodItem);
    setIsSecondModalOpen(true);
  };

  const closeSecondModal = () => {
    setIsSecondModalOpen(false);
  };

  // console.log("filteredFood", filteredFood);
  // console.log("selectedCategory", selectedCategory);

  return (
    <>
      {isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center max-2xl:px-6 max-sm:px-4 z-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" relative bg-[#ffefc6] py-8 xl:px-[4rem] px-[1rem] rounded-lg shadow-lg 2xl:w-[80%] w-full h-[90%] overflow-hidden overflow-y-auto"
          >
            {/* <button
            onClick={closeModal}
            className=" absolute -top-8 -right-8 cursor-pointer"
          >
            <CancelOutlinedIcon
              sx={{ fontSize: 35 }}
              className="text-white hover:text-red-500"
            />
          </button> */}

            <div className="flex xl:flex-row flex-col gap-4 justify-between xl:items-center items-end ">
              <div className="flex w-full items-center gap-2">
                <AddToPhotosOutlinedIcon
                  sx={{ fontSize: 25 }}
                  className="text-[#00537B]"
                />
                <p className="text-[25px] font-[600] text-[#00537B]">
                  เพิ่มรายการอาหาร โต๊ะ : {itemId}
                </p>
              </div>
              {/* cate */}
              <div className="flex items-center gap-4">
                <div className="relative" ref={categoryMenuRef}>
                  <div className="flex flex-shrink-0 gap-2 items-center">
                    <p className="max-sm:hidden text-[#313131] xl:text-lg text-base font-[600] flex-shrink-0">
                      หมวดเมนู
                    </p>
                    <div
                      className="bg-white cursor-pointer flex justify-between items-center gap-2 p-1.5 px-2 rounded-lg shadow  lg:w-[250px] w-[170px] max-w-full"
                      onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                    >
                      <p className="text-[#313131] xl:text-lg text-base font-[400] line-clamp-1">
                        {selectedCategory
                          ? cateFood.find((c) => c.id === selectedCategory)
                              ?.title
                          : "เลือกหมวดหมู่"}
                      </p>
                      <figure
                        className={`lg:w-[30px] w-[25px] lg:h-[30px] h-[25px] transition-all duration-300 ${
                          !showCategoryMenu ? "" : "rotate-180"
                        }`}
                      >
                        <img
                          src="/icons/Group 949.png"
                          alt=""
                          className="w-full h-full"
                        />
                      </figure>
                    </div>
                  </div>

                  {/* เมนูหมวดหมู่ */}
                  <div className="absolute right-0 w-[232px] h-full z-99">
                    {showCategoryMenu && (
                      <div className="bg-white flex flex-col gap-2 p-2 mt-2 rounded-lg shadow max-h-[400px] overflow-y-auto">
                        <div
                          className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                            selectedCategory === null
                              ? "bg-[#F5A100] text-white"
                              : ""
                          }`}
                          onClick={() => setSelectedCategory(null)}
                        >
                          ทั้งหมด
                        </div>
                        <div className="border-t border-[#e6e6e6] rounded-full w-full"></div>
                        {cateFood.map((category) => (
                          <div
                            key={category.id}
                            className={`py-2 px-4 cursor-pointer hover:bg-[#00537B] hover:text-white text-black rounded-lg ${
                              selectedCategory === category.id
                                ? "bg-[#F5A100] text-white"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedCategory(category.id);
                              setShowCategoryMenu(false);
                            }}
                          >
                            {category.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Search */}
                <div className="bg-white md:px-4 px-1 py-1.5 rounded-lg 2xl:w-[240px] w-[180px] mx-auto h-[40px] text-[#8F8F8F] flex items-center border border-gray-300 justify-between">
                  <input
                    type="text"
                    placeholder="ค้นหาเมนู"
                    className="outline-none bg-transparent text-[#313131] w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon sx={{ color: "#00537B", fontSize: 25 }} />
                </div>
                <button
                  onClick={closeModal}
                  className="flex items-center justify-center gap-1 xl:min-w-[130px] w-[120px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[16px] duration-200 transition bg-[#005179] hover:bg-[#F5A100]"
                >
                  <ReplyIcon sx={{ fontSize: 23 }} className="text-white" />
                  ย้อนกลับ
                </button>
              </div>
            </div>
            {/* ส่วนล่าง */}
            <div className="grid 2xl:grid-cols-5 sm:grid-cols-3 grid-cols-2 2xl:gap-5 gap-3 w-full h-auto mt-6 max-sm:px-1 overflow-y-auto">
              {filteredFood.map((food) => (
                <div
                  key={food.id}
                  className="flex flex-col justify-between w-full h-[250px] bg-white shadow-sm rounded-lg p-3"
                >
                  <div className="flex gap-3">
                    <figure className="w-1/2 h-[114px] rounded-lg shadow-sm">
                      <img
                        className="w-full h-full object-cover rounded-lg"
                        src={
                          food.thumbnail_link
                            ? `${api_path}${food.thumbnail_link}`
                            : "/images/default.png"
                        }
                        alt={food.name}
                      />
                    </figure>
                    <div className="flex flex-col justify-between w-1/2">
                      <div>
                        {food.special_price && (
                          <p className="text-end text-[#8F8F8F] text-[16px] line-through">
                            {food.price} บาท
                          </p>
                        )}
                        <p className="text-end text-[#00537B] text-[23px] font-[600]">
                          {food.special_price ? food.special_price : food.price}{" "}
                          บาท
                        </p>
                      </div>
                      <button
                        onClick={() => openSecondModal(food.id)}
                        className="flex items-center justify-center gap-2 w-full shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[18px] font-[500] duration-200 transition bg-[#005179] hover:bg-[#F5A100]"
                      >
                        <AddOutlinedIcon sx={{ color: "#fff", fontSize: 25 }} />
                        เพิ่ม
                      </button>
                    </div>
                  </div>
                  {/* cat */}

                  <div className="flex items-center gap-2 mt-3">
                    <DiscountOutlinedIcon
                      sx={{ fontSize: 20 }}
                      className="text-gray-500"
                    />
                    <p className="text-[15px] font-[300] overflow-x-hidden">
                      {food.cate_id
                        .split(",")
                        .map(
                          (id) =>
                            cateFood.find((c) => c.id === parseInt(id))?.title
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  <p className="h-[60px] text-[#313131] text-[20px] font-[600] line-clamp-2 ">
                    {food.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal ที่สอง */}
      {isSecondModalOpen && selectedFood && (
        <div
          onClick={closeSecondModal}
          className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center max-2xl:px-6 max-sm:px-4 z-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white p-4 rounded-lg shadow-lg sm:w-[530px] w-full h-auto"
          >
            <div className="flex gap-4 justify-between">
              <figure className="w-1/2 h-[210px] shadow-sm rounded-lg">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={`${api_path}${selectedFood.thumbnail_link}`}
                  alt={selectedFood?.name || "อาหาร"}
                />
              </figure>
              <div className="flex flex-col w-1/2">
                <p className="h-[60px] text-[20px] font-[600] text-[#313131] line-clamp-2">
                  {selectedFood.name}
                </p>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <p className="text-[20px] font-[500] text-[#313131] line-clamp-2">
                    ราคา
                  </p>
                  <p className="text-[25px] font-[600] text-[#000000] line-clamp-2">
                    {selectedFood.special_price
                      ? selectedFood.special_price
                      : selectedFood.price}
                  </p>
                  <p className="text-[20px] font-[500] text-[#313131] line-clamp-2">
                    บาท
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-3 mt-5">
                  <button
                    onClick={handleDecrease}
                    className="flex items-center justify-center w-9 h-9 rounded-sm bg-[#00537B] hover:bg-[#F5A100] cursor-pointer"
                  >
                    <RemoveOutlinedIcon
                      sx={{ fontSize: 22 }}
                      className="text-white"
                    />
                  </button>
                  <span className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-sm text-center text-gray-500 text-xl font-semibold">
                    {quantities}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="flex items-center justify-center w-9 h-9 rounded-sm bg-[#00537B] hover:bg-[#F5A100] cursor-pointer"
                  >
                    <AddOutlinedIcon
                      sx={{ fontSize: 22 }}
                      className="text-white"
                    />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[16px] text-[#00537B] font-[500] mt-4">
              รายละเอียด
            </p>
            <p className="text-[16px] text-[#313131] font-[300] ">
              {selectedFood.cate_id
                .split(",")
                .map((id) => cateFood.find((c) => c.id === parseInt(id))?.title)
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="text-[16px] text-[#00537B] font-[500] mt-4">
              หมายเหตุ
            </p>
            <textarea
              onChange={(e) => setIntNote(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full h-[90px] mt-1"
              placeholder="หมายเหตุ..."
            >
              {intNote}
            </textarea>
            <div className="flex items-center justify-center gap-4 w-full mt-6">
              <button
                onClick={closeSecondModal}
                className="flex items-center justify-center gap-2 w-[130px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[18px] font-[500] duration-200 transition bg-[#F44D4D] hover:bg-[#da2c2c]"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddItem}
                className="flex items-center justify-center gap-2 w-[130px] shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[18px] font-[500] duration-200 transition bg-[#005179] hover:bg-[#003f5f]"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdditemModal;
