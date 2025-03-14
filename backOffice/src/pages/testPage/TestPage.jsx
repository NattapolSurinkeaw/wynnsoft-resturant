import React, {useState} from 'react'
import { QRCodeCanvas } from "qrcode.react";
import { getGenerateQr } from '../../services/table_manage.service';
import { front_path } from '../../store/setting';

export default function TestPage() {
  const [text, setText] = useState('');

  const getQrcode = (tableId) => {
    getGenerateQr(tableId).then((res) => {
      setText(front_path+res.token)
    })
  }

  return (
    <div>
      <h1>TestPage</h1>
      <QRCodeCanvas value={text} size={200} />
    <button
      onClick={() => getQrcode(2)}
    >โต๊ะ 1</button>
    </div>
  )
}
