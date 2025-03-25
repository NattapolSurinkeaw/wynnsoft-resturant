import React, { useEffect, useRef, useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
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

function AdditemModal({ isOpen, closeModal, itemId }) {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const categoryMenuRef = useRef(null);
  const [foods, setFoods] = useState([]);
  const [cateFood, setCateFood] = useState([]);
  const api_path = "http://localhost:8003";

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
  const handleIncrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  // ฟังก์ชันลดจำนวน
  const handleDecrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  const handleAddItem = () => {
    Swal.fire({
      title: "เพิ่มรายการสำเร็จ!",
      text: "คุณได้เพิ่มเมนูลงในรายการสั่งซื้อแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
      timer: 1200,
      timerProgressBar: true,
    });
  };

  console.log("filteredFood", filteredFood);
  console.log("selectedCategory", selectedCategory);

  return (
    isOpen && (
      <div
        onClick={closeModal}
        className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center max-2xl:px-6 max-sm:px-4 z-20"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" relative bg-[#ffefc6] py-8 xl:px-[4rem] px-[1rem] rounded-lg shadow-lg 2xl:w-[80%] w-full h-[90%] "
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
                        ? cateFood.find((c) => c.id === selectedCategory)?.title
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
          <div className="grid 2xl:grid-cols-5 sm:grid-cols-3 grid-cols-2 2xl:gap-5 gap-2 w-full sm:h-auto h-[660px] mt-6 max-sm:px-1 overflow-y-auto">
            {filteredFood.map((food) => (
              <div
                key={food.id}
                className="flex flex-col justify-between w-full h-[280px] bg-white shadow-sm rounded-lg p-3"
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
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecrease(food.id)}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-400 hover:bg-[#F5A100] cursor-pointer"
                      >
                        <RemoveOutlinedIcon
                          sx={{ fontSize: 22 }}
                          className="text-white"
                        />
                      </button>
                      <span className="w-6 text-center text-gray-500 text-lg font-semibold">
                        {quantities[food.id] || 1}
                      </span>
                      <button
                        onClick={() => handleIncrease(food.id)}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-400 hover:bg-[#F5A100] cursor-pointer"
                      >
                        <AddOutlinedIcon
                          sx={{ fontSize: 22 }}
                          className="text-white"
                        />
                      </button>
                    </div>
                  </div>
                </div>
                {/* cat */}

                <div className="flex items-center gap-2 mt-3">
                  <CategoryOutlinedIcon
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
                <button
                  onClick={handleAddItem}
                  className="flex items-center justify-center gap-2 w-full shadow-1 py-1.5 rounded-lg cursor-pointer text-white text-[18px] font-[500] duration-200 transition bg-[#005179] hover:bg-[#F5A100]"
                >
                  เพิ่ม
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
}

export default AdditemModal;
