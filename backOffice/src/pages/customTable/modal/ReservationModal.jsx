import React, { useState } from "react";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Select, MenuItem } from "@mui/material";
import dayjs from "dayjs";
import { getBookingTable } from "../../../services/table_manage.service";
import Swal from "sweetalert2";

function ReservationModal({ isReservation, closeModal, customTable }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tableBooking, setTableBooking] = useState("");
  const [nameBooking, setNameBooking] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [people, setPeople] = useState("");

  const onSubmit = () => {
    const params = {
      name_booking: nameBooking,
      phone_booking: phone,
      email_booking: email,
      table_booking: tableBooking,
      date_booking: dayjs(selectedDate).format('YYYY-MM-DD'), // ✅ ใช้ selectedDate ตรงๆ
      time_booking: dayjs(selectedTime).format('HH:mm:ss'),   // ✅ ใช้ selectedTime ตรงๆ
      people: people
    };

    if(!params.name_booking || !params.phone_booking || !params.email_booking) {
      return false;
    }
  
    getBookingTable(params).then((res) => {
      console.log(res)
      if(res.status) {
        Swal.fire({
          position: "center",
          text: "เพิ่มโต๊ะสำเร็จ!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => closeModal())
      }
    })
  };

  return (
    isReservation && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-20">
        <div className=" relative bg-white p-8 rounded-lg shadow-lg w-[480px]">
          <div className="flex w-full items-center gap-2">
            <InsertInvitationIcon
              sx={{ fontSize: 25 }}
              className="text-[#00537B]"
            />
            <p className="text-[25px] font-[600] text-[#00537B]">
              จองโต๊ะอาหาร
            </p>
          </div>

          <div className="w-full space-y-3 mt-6">
            <div className="flex flex-col gap-2 items-start">
              <p className="min-w-[90px] text-[#313131] font-[400]">
                ชื่อผู้จอง
              </p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[15px] font-[500] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#0064d6] w-full"
                placeholder="กรอกชื่อผู้จอง..."
                onChange={(e) => setNameBooking(e.target.value)}
                value={nameBooking}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <p className="min-w-[90px] text-[#313131] font-[400]">
                เบอร์ติดต่อ
              </p>
              <input
                type="text"
                className="border border-gray-300 text-gray-600 text-[15px] font-[500] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#0064d6] w-full"
                placeholder="กรอกเบอร์..."
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <p className="min-w-[90px] text-[#313131] font-[400]">E-mail</p>
              <input
                type="email"
                className="border border-gray-300 text-gray-600 text-[15px] font-[500] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#0064d6] w-full"
                placeholder="กรอกอีเมล..."
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex flex-col items-start">
                <p className="min-w-[90px] text-[#313131] font-[400] mb-2">
                  วันที่จอง
                </p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate)}
                    slotProps={{
                      textField: {
                        sx: {
                          height: "40px",
                          "& input": { padding: 1, fontSize: 14 },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="flex flex-col items-start">
                <p className="min-w-[90px] text-[#313131] font-[400]">
                  เวลาจอง
                </p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      value={selectedTime}
                      onChange={(newTime) => setSelectedTime(newTime)}
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

            <div className="flex gap-4 items-center">
              <div className="flex flex-col w-1/2 items-start">
                <p className="min-w-[90px] text-[#313131] font-[400] mb-2">
                  จำนวนคน
                </p>
                <input
                  type="number"
                  className="border border-gray-300 text-gray-600 text-[15px] font-[500] rounded-sm h-[37px] px-2 focus:outline-none focus:ring-2 focus:ring-[#0064d6] w-full"
                  placeholder="กรอกจำนวน..."
                  onChange={(e) => setPeople(e.target.value)}
                  value={people}
                />
              </div>
              <div className="flex flex-col w-1/2 gap-2 items-start">
                <p className="min-w-[90px] text-[#313131] font-[400]">
                  โต๊ะที่
                </p>
                <Select
                  value={tableBooking}
                  onChange={(e) => setTableBooking(e.target.value)}
                  className="w-full h-[37px] text-[14px]"
                >
                  {
                    customTable.map((table) => (
                      <MenuItem key={table.id} value={table.id}>{table.title}</MenuItem>
                    ))
                  }
                  {/* <MenuItem value={20}>2</MenuItem> */}
                  {/* <MenuItem value={30}>3</MenuItem> */}
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-5 mt-8">
            <button
              onClick={closeModal}
              className="w-[100px] py-1.5 bg-[#FFBA41] hover:bg-[#ffa203] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
            >
              ยกเลิก
            </button>
            <button className="w-[100px] py-1.5 bg-[#013D59] hover:bg-[#002b3f] hover:scale-105 transition duration-300 text-white rounded-lg cursor-pointer shadow-1"
             onClick={onSubmit}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ReservationModal;
