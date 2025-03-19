import React, {useState, useEffect} from 'react'
import { QRCodeCanvas } from "qrcode.react";
import { getGenerateQr } from '../../services/table_manage.service';
import { front_path } from '../../store/setting';
import { getOrderList } from '../../services/kitchen.service';

export default function TestPage() {
  const [text, setText] = useState('');
  const [orderList, setOrderList] = useState([]);

  const getQrcode = (tableId) => {
    getGenerateQr(tableId).then((res) => {
      setText(front_path+res.token)
    })
  }

  useEffect(() => {
    getOrderList().then((res) => {
      console.log(res)
      setOrderList(res.orderList);
    })
  }, [])

  return (
    <div>
      <h1>TestPage</h1>
      <div>
        <QRCodeCanvas value={text} size={200} />
        <button
          onClick={() => getQrcode(2)}
        >โต๊ะ 1</button>
      </div>

      <div>
        <ul>
          {
            orderList.map((list) => (
              <li key={list.id}>{list.id} {list.food.name}</li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}
