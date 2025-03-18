import React, { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { getUpdateProfileShop } from "../../../services/setting.service";

function Profile({webinfo}) {
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [timeOpen, setTimeOpen] = useState(null);
  const [timeClose, setTimeClose] = useState(null);

  useEffect(() => {
    console.log(webinfo);
    setPreview1(filterWebinfo(1)?.info_link)
    setPreview2(filterWebinfo(2)?.info_link)
    setTimeOpen(filterWebinfo(5)?.info_value)
    setTimeClose(filterWebinfo(6)?.info_value)
  }, [webinfo])

  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filterWebinfo = (info_id) => {
    return webinfo.filter(info => info.info_id == info_id)[0]
  }

  const getToday = () => {
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const today = new Date().getDay();

    return days[today];
  };

  const onSubmit = () => {
    const formData = new FormData();
    formData.append('web_logo', image1);
    formData.append('web_bg', image2);
    formData.append('time_open', timeOpen);
    formData.append('time_close', timeClose);

    formData.forEach((key, value) => {
      console.log( value + " : " + key)
    });
    getUpdateProfileShop(formData).then((res) => {
      console.log(res)
    })
  }
  console.log(getToday());

  return (
    <>
      <div className="3xl:w-[1000px] w-full p-5 rounded-lg shadow-1 bg-white">
        <p className="text-[22px] text-[#00537B] font-[600] ">โปรไฟล์ร้านค้า</p>
        <div className="flex gap-5 mt-4">
          <div className="relative min-w-[219px] max-w-[219px] h-[219px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center shadow-md overflow-hidden">
            {preview1 ? (
              <img
                src={preview1}
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
              onChange={(e) => handleImageChange(e, setImage1, setPreview1)}
            />
          </div>

          <div className="relative w-full h-[219px] bg-[#616161] rounded-lg shadow-1 flex items-center justify-center overflow-hidden">
            {preview2 ? (
              <img
                src={preview2}
                alt="Uploaded"
                className="w-full h-full object-cover rounded-lg"
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
              htmlFor="fileInput2"
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
              id="fileInput2"
              onChange={(e) => handleImageChange(e, setImage2, setPreview2)}
            />
          </div>
        </div>
      </div>

      <div className="3xl:w-[1000px] w-full p-5 rounded-lg shadow-1 mt-5 bg-white">
        <div className="3xl:w-[650px] w-full space-y-6">
          <div className="flex items-center ">
            <p className="min-w-[70px] text-[#313131] font-[400]">เปิดร้าน</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกวันเปิดร้าน..."
            />
          </div>
          <div className="flex items-center ">
            <p className="min-w-[70px] text-[#313131] font-[400]">หยุดร้าน</p>
            <input
              type="text"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#6db8dd] w-full"
              placeholder="กรอกวันหยุดร้าน..."
            />
          </div>
          <div className="flex w-full gap-6 items-center ">
            <div className="flex w-1/2 items-center">
              <p className="min-w-[70px] text-[#313131] font-[400]">เวลาเปิด</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    value={timeOpen ? dayjs(timeOpen, "HH:mm") : null} // 🛠 แปลง string -> dayjs
                    onChange={(newTime) => {
                      if (newTime) {
                        setTimeOpen(newTime.format("HH:mm")); // ให้เก็บเวลาเป็น string (12:00)
                      }
                    }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    slotProps={{
                      textField: {
                        sx: {
                          height: "40px",
                          "& input": { padding: 1, fontSize: 14 },
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div className="flex w-1/2 items-center">
              <p className="min-w-[70px] text-[#313131] font-[400]">เวลาปิด</p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    value={timeClose ? dayjs(timeClose, "HH:mm") : null} // 🛠 แปลง string -> dayjs
                    onChange={(newTime) => {
                      if (newTime) {
                        setTimeClose(newTime.format("HH:mm")); // ให้เก็บเวลาเป็น string (12:00)
                      }
                    }}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    slotProps={{
                      textField: {
                        sx: {
                          height: "40px",
                          "& input": { padding: 1, fontSize: 14 },
                        },
                      },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
        </div>

        <div className="flex justify-center ">
          <button 
            className="button-1 mt-10"
            onClick={onSubmit}
          >บันทึก</button>
        </div>
      </div>
    </>
  );
}

export default Profile;
