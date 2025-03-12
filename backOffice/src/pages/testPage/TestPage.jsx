import React, {useState} from 'react'
import { QRCodeCanvas } from "qrcode.react";
import { getGenerateQr } from '../../services/table_manage.service';

export default function TestPage() {
  const [text, setText] = useState('');

  const getQrcode = (tableId) => {
    getGenerateQr(tableId).then((res) => {
      setText('http://localhost:5173/testpage/'+res.token)
    })
  }

  return (
    <div>
      <h1>TestPage</h1>
      <QRCodeCanvas value={text} size={200} />
    <button
      onClick={() => getQrcode(1)}
    >โต๊ะ 1</button>
    </div>
  )
}
