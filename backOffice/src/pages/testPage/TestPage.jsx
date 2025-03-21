import React, {useState, useEffect} from 'react'
import { getOrderList } from '../../services/kitchen.service';
import { io } from 'socket.io-client';
import { socketPath } from '../../store/setting';

const socket = io(socketPath);

export default function TestPage() {
  const [orderList, setOrderList] = useState([]);

  // ฟังก์ชันดึงข้อมูลออเดอร์
  const fetchOrders = async () => {
    const res = await getOrderList();
    console.log("📦 ดึงข้อมูลออเดอร์:", res);
    setOrderList(res.orderList);
  };

  useEffect(() => {
    fetchOrders(); // โหลดข้อมูลครั้งแรก

    // ฟัง Event เมื่อมีออเดอร์ใหม่
    socket.on("newOrder", () => {
      console.log(socket);
      fetchOrders(); // ดึงข้อมูลใหม่
    });

    return () => {
      socket.off("newOrder"); // ปิด Event เมื่อ Component Unmount
    };
  }, []);

  return (
    <div>
      <h1>TestPage</h1>

      <div>
        <ul>
          {
            orderList.map((list) => (
              <li key={list.id}>{list.id} {list.food?.name}</li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}
