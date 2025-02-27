const axios = require('axios');
import { LineURLNotify, LineNotifyToken } from './config';

export const LineNotify = async (Message: string) => {
    // console.log(LineURLNotify);
    // console.log(LineNotifyToken);

    const result = await axios({
        method: "post",
        url: LineURLNotify,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer "+LineNotifyToken,

        },
        data: `message=${Message}`
    })
        .then((response: any) => {
            // console.log(response);
        })
        .catch((err: any) => {
            console.log(err);
        });
}


export const LineMessageCreateOrder = (_dataMessage:any, _type:string = "") => {
    let _message =  `
    === มีคำสั่งซื้อ${_type}ใหม่ ===
    ${_dataMessage.proList}
    ลูกค้า : ${_dataMessage.member}
    จำนวนเงิน : ${_dataMessage.totalPrice} บาท
    `;

    return _message;
}

export const LineMessageCreateMember = (_dataMessage:any) => {
    let _message =  `
    === สมาชิกลงทะเบียนใหม่ ===
    ลูกค้า : ${_dataMessage.member}
    `;

    return _message;
}

export const LineMessageCreateStore = (_dataMessage:any) => {
    let _message =  `
    === ร้านค้าลงทะเบียนใหม่ ===
    ลูกค้า : ${_dataMessage.store}
    `;

    return _message;
}