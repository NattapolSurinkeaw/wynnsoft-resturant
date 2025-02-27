import { Log } from './../models/log';
import { ChatTemp } from './../models/chat_temp';
import { Store } from './../models/store';
import { sequelize } from './../util/database';
import { Orders } from './../models/orders';
import { Members } from './../models/members';
import moment from 'moment'
import fs from 'fs'
const sharp = require('sharp')
import path from 'path'
import ExcelJS from 'exceljs'
import { ReportService } from '../services/Report.service'
import { Op } from 'sequelize';
import { OrderFashion } from '../models/orderFashion';
import { OrdersProduct } from '../models/ordersProduct';
import { ProductFashion } from '../models/productFashion';

export class ReportController extends ReportService {
    OnGetStoreReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportStore(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    gender: (data.gender==='men')?'ชาย':'หญิง',
                    date: data.createdAt,
                    shopName: data.storeName,
                    cusUser: data.username,
                    orderLevel: data.packageLevel,
                    orderItem: data.product_name,
                    amount: data.price?1:null,
                    price: data.price,
                    note: ''
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnExportStoreReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportStore(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    gender: (data.member_gender==='men')?'ชาย':'หญิง',
                    date: data.createdAt?moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss'):"",
                    shopName: data.storeName,
                    cusUser: data.username,
                    orderLevel: data.packageLevel,
                    orderItem: data.product_name,
                    amount: data.price?'1':'',
                    price: data.price?data.price.toString():"",
                    note: ''
                }
            })
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('ReportShop')
            worksheet.columns = [
                {header: 'เพศ', key: 'gender', width: 10},
                {header: 'วันที่', key: 'date', width: 10},
                {header: 'ชื่อร้าน', key: 'shopName', width: 20,},
                {header: 'ชื่อยูสลูกค้า', key: 'cusUser', width: 20,},
                {header: 'ระดับ order', key: 'orderLevel', width: 15,},
                {header: 'รายการสินค้า', key: 'orderItem', width: 40,},
                {header: 'จำนวน', key: 'amount', width: 10,},
                {header: 'ราคา', key: 'price', width: 15,},
                {header: 'หมายเหตุ', key: 'note', width: 15,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path
            var fileFolder = `files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder+fileFolder}`)){
                fs.mkdirSync(newfolder+fileFolder, { recursive: true })
            }
            const filename = `ReportShop${moment().format('YYYYMMDDHH')}.xlsx`
            const pathname = '/'+fileFolder+filename
            workbook.xlsx.writeFile(newfolder+fileFolder+filename).then(() => {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                })
            })
        } catch(error){
            console.log(error)
            return res.status(500).json({
                status: false,
                message: 'error',
                descripion: 'something went wrong.'
            })
        }
    }
    OnGetCustomerReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportCustomer(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    dateRenewal: data.packageBegin,
                    packageLevel: data.packageLevel,
                    cusUser: data.username,
                    totalPrice: data.priceTotal,
                    totalRenewal: data.totalRenewal,
                    totalPackage: data.totalPackage,
                    dataRegister: data.registerDate,
                    note: ''
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnExportCustomerReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportCustomer(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    dateRenewal: data.packageBegin?moment(data.packageBegin).format('YYYY-MM-DD HH:mm:ss'):"",
                    packageLevel: data.packageLevel?data.packageLevel:"",
                    cusUser: data.username,
                    totalPrice: data.priceTotal?data.priceTotal.toString():"",
                    totalRenewal: data.totalRenewal?data.totalRenewal.toString():"",
                    dataRegister: data.registerDate?moment(data.registerDate).format('YYYY-MM-DD HH:mm:ss'):"",
                    note: ''
                }
            })
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('ReportCustomer');
            worksheet.columns = [
                {header: 'วันต่ออายุ Package ล่าสุด', key: 'dateRenewal', width: 20},
                {header: 'ระดับ Package', key: 'packageLevel', width: 15},
                {header: 'ชื่อยูส', key: 'cusUser', width: 20,},
                {header: 'ยอดซื้อสะสม', key: 'totalPrice', width: 20,},
                {header: 'ยอด Package สะสม', key: 'totalRenewal', width: 20,},
                {header: 'วันที่สมัครสมาชิก', key: 'dataRegister', width: 20,},
                {header: 'หมายเหตุ', key: 'note', width: 15,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path
            var fileFolder = `files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder+fileFolder}`)){
                fs.mkdirSync(newfolder+fileFolder, { recursive: true })
            }
            const filename = `ReportCustomer${moment().format('YYYYMMDDHH')}.xlsx`
            const pathname = '/'+fileFolder+filename
            workbook.xlsx.writeFile(newfolder+fileFolder+filename).then(() => {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                })
            })
        } catch(error){
            console.log(error)
            return res.status(500).json({
                status: false,
                message: 'error',
                descripion: 'something went wrong.'
            })
        }
    }
    OnGetOrderReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportOrder(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    orderNumber: data.order_number,
                    cusName: data.member_name,
                    storeName: data.name,
                    store_user: data.username,
                    address: data.address+' '+data.district+' '+data.subdistrict+' '+data.province+' '+data.code,
                    phone: data.phone,
                    totalPrice: data?.payment_type === "COD" ? parseInt(data.totalprice) - 50 : data.totalprice,
                    netPrice: data.price - Math.ceil(data.price * parseInt(data.gross_profit) / 100),
                    slip: data.slip,
                    payment_type: data.payment_type,
                    note: data.note,
                    paymentStatus: data.payment_status,
                    status: data.orders_status,
                    orderDate: data.createdAt,
                    gp_price: Math.ceil(data.price * parseInt(data.gross_profit) / 100)
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.'
            })
        }
    }
    OnGetOrderFashionReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportOrderFashion(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    ...data,
                    orderNumber: data.order_number,
                    cusName: data.member_name,
                    storeName: data.name,
                    store_user: data.username,
                    address: data.address+' '+data.district+' '+data.subdistrict+' '+data.province+' '+data.code,
                    phone: data.phone,
                    totalPrice: data.price,
                    // netprice: data.price - Math.ceil(data.price * 15 / 100),
                    slip: data.slip,
                    payment_type: data.payment_type,
                    note: data.note,
                    paymentStatus: data.payment_status,
                    status: data.orders_status,
                    orderDate: data.createdAt,
                    gross_profit: data.gross_profit,
                }
            })
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get order fashion report success.',
                report: filteredData,
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                description: 'something went wrong.',
                errorMessage: error,
            })
        }
    }
    OnExportOrderFashionReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportOrderFashion(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    // ...data,
                    totalprice : data?.payment_type === "COD" ? parseInt(data.totalprice) - 50 : data.totalprice,
                    gender : data.gender,
                    cate_name : data.cate_name,
                    orderNumber: data.order_number,
                    cusName: data.member_name,
                    storeName: data.name,
                    store_user: data.username,
                    address: data.address+' '+data.district+' '+data.subdistrict+' '+data.province+' '+data.code,
                    phone: data.phone,
                    totalPrice: data.price,
                    netprice: data.netprice,
                    slip: data.slip,
                    payment_type: data.payment_type,
                    note: data.note,
                    paymentStatus: data.payment_status,
                    status: data.orders_status,
                    orderDate: data.createdAt,
                    product_price_gp: data.price - data.netprice,
                }
            })
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('ReportOrderFashion')
            worksheet.columns = [
                {header: 'order NO.', key: 'orderNumber', width: 20},
                {header: 'ชนิดสินค้า', key: 'cate_name', width: 20},
                {header: 'เพศ', key: 'gender', width: 15},
                {header: 'ชื่อร้าน', key: 'storeName', width: 15},
                {header: 'user ร้าน', key: 'store_user', width: 15},
                {header: 'ที่อยู่', key: 'address', width: 40,},
                {header: 'Tel', key: 'phone', width: 20,},
                {header: 'ราคาขาย', key: 'totalprice', width: 20,},
                {header: 'ราคาหลังหัก %GP', key: 'netprice', width: 20,},
                {header: 'ค่าGP', key: 'product_price_gp', width: 20,},
                {header: 'ข้อความ', key: 'note', width: 20,},
                {header: 'สถานะออเดอร์', key: 'status', width: 20,},
                {header: 'สถานะการจ่ายเงิน', key: 'paymentStatus', width: 20,},
                {header: 'การจ่ายเงิน', key: 'payment_type', width: 20,},
                {header: 'วันที่', key: 'orderDate', width: 20,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path
            var fileFolder = `files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder+fileFolder}`)){
                fs.mkdirSync(newfolder+fileFolder, { recursive: true })
            }
            const filename = `ReportOrderFashion${moment().format('YYYYMMDDHH')}.xlsx`
            const pathname = '/'+fileFolder+filename
            workbook.xlsx.writeFile(newfolder+fileFolder+filename).then(() => {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                })
            })
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                descripion: 'something went wrong.'
            })
        }
    }
    OnExportOrderReport = async(req: any, res: any) => {
        try {
            const finding: any = await this.queryReportOrder(req.body.start || new Date(0, 0, 0), req.body.end || new Date())
            const filteredData = finding.map((data: any) => {
                return {
                    orderNumber: data.order_number,
                    cusName: data.member_name,
                    storeName: data.name,
                    store_user: data.username,
                    address: data.address+' '+data.district+' '+data.subdistrict+' '+data.province+' '+data.code,
                    phone: data.phone,
                    totalPrice: data?.payment_type === "COD" ? parseInt(data.totalprice) - 50 : data.totalprice,
                    // totalPrice: data.price?data.price.toString():'',
                    netPrice: (data.price - Math.ceil(data.price * parseInt(data.gross_profit) / 100)).toString(),
                    slip: data.slip,
                    payment_type: data.payment_type,
                    note: data.note,
                    paymentStatus: data.payment_status,
                    status: data.status,
                    orderDate: data.createdAt?moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss'):""
                }
            })
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet('ReportOrder')
            worksheet.columns = [
                {header: 'order NO.', key: 'orderNumber', width: 20},
                {header: 'ชื่อลูกค้า', key: 'cusName', width: 15},
                {header: 'ชื่อร้าน', key: 'storeName', width: 15},
                {header: 'user ร้าน', key: 'store_user', width: 15},
                {header: 'ที่อยู่', key: 'address', width: 40,},
                {header: 'Tel', key: 'phone', width: 20,},
                {header: 'ราคาขาย', key: 'totalPrice', width: 20,},
                {header: 'ราคาหลังหัก %GP', key: 'netPrice', width: 20,},
                {header: 'ข้อความ', key: 'note', width: 20,},
                {header: 'สถานะออเดอร์', key: 'status', width: 20,},
                {header: 'สถานะการจ่ายเงิน', key: 'paymentStatus', width: 20,},
                {header: 'การจ่ายเงิน', key: 'payment_type', width: 20,},
                {header: 'วันที่', key: 'orderDate', width: 20,},
            ];
            worksheet.addRows(filteredData)
            var public_path = path.join(__dirname, '../../dist/public/')
            var newfolder = public_path
            var fileFolder = `files/${moment().format('YYYY')}/${moment().format('MM')}/`
            if(!fs.existsSync(`${newfolder+fileFolder}`)){
                fs.mkdirSync(newfolder+fileFolder, { recursive: true })
            }
            const filename = `ReportOrder${moment().format('YYYYMMDDHH')}.xlsx`
            const pathname = '/'+fileFolder+filename
            workbook.xlsx.writeFile(newfolder+fileFolder+filename).then(() => {
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    filepath: pathname
                })
            });
        } catch(error){
            return res.status(500).json({
                status: false,
                message: 'error',
                descripion: 'something went wrong.'
            })
        }
    }
    OnGetDashboardData = async(req: any, res: any) => {
        const findingMember = await Members.findAll({where: {statusMember: 'active', isStore: 'no'}})
        const allMonth = moment.months()
        const memPerMonth: any = allMonth.map((data: any) => {return {month: data, total: 0}})
        findingMember.forEach((data: any) => {
            memPerMonth.forEach((monthInArr: any, index: any) => {
                if(moment(data.createdAt).format('MMMM') === monthInArr.month){
                    memPerMonth[index].total += 1
                }
            })
        })
        const findingTotalPerPack: any = await this.queryMemberPackage()
        const totalPerPack = findingTotalPerPack.map((data: any) => {
            return {
                packageName: data.NAME,
                totalMember: data.totalMember
            }
        })
        const currentDate = moment().format('YYYY-MM-DD')
        const findingOrderAll: any = await Orders.findAll({where: {
            where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', currentDate)
        }})
        const findingOrderFashionToday: any = await OrderFashion.findAll({where: {
            where: sequelize.where(sequelize.fn('date', sequelize.col('createdAt')), '=', currentDate)
        }})
        const toDayOrder = findingOrderAll.map((data: any) => {
            return {
                orderNumber: data.order_number,
                paymentStatus: data.payment_status,
                status: data.status,
                totalPrice: parseInt(data.totalprice)
            }
        })
        const toDayOrderFashion = findingOrderFashionToday.map((data: any) => {
            return {
                orderNumber: data.order_number,
                paymentStatus: data.payment_status,
                status: data.status,
                totalPrice: parseInt(data.totalprice)
            }
        })
        const findingStoreOrder: any = await this.queryStoreOrder()
        const findingStoreOrderFashion: any = await this.queryStoreOrderFashion()
        const filterStoreOrder = findingStoreOrder.map((data: any) => {
            return {
                name: data.name,
                status: data.status,
                store_id: data.store_id,
                totalPrice: parseInt(data.totalPrice),
                totalProductSold:  data.totalProductSold
            }
        })
        const filterStoreOrderFashion = findingStoreOrderFashion.map((data: any) => {
            return {
                name: data.name,
                status: data.status,
                store_id: data.store_id,
                totalPrice: parseInt(data.totalPrice),
                totalProductSold:  data.totalProductSold
            }
        })
        const newStore = await Store.findAll({where:
            {
                status: 'inactive',
                createdAt: {
                    [Op.eq]: sequelize.col('updatedAt')
                }
            }})
        const newMember: any = await this.queryNewMember()
        const findUpdate = await Log.findAll({where: {status: 'active', section: 'store', details: {[Op.substring]: 'update'}}})
        const checkUpdateProfile = findUpdate?.filter((e: any) => e.details === "update-profile")
        const checkUpdatePost = findUpdate?.filter((e: any) => e.details === "update-post")
        const newOrder = await Orders.findAll({where: {isRead: 0}})
        const newOrderFashion = await OrderFashion.findAll({
            where: {isRead: 0},
            include: [
                {
                  model: OrdersProduct,
                  required: true, // RIGHT JOIN
                  include: {
                    model: ProductFashion,
                    required: true, // RIGHT JOIN
                  },
                },
              ],
        })
        const newChat = await ChatTemp.findAll({where:{isRead: 0, from: 'member'}})
        const dashboardTop = {
            newStore: newStore.length,
            newPost: checkUpdatePost?checkUpdatePost.length:0,
            newProfile: checkUpdateProfile?checkUpdateProfile.length:0,
            newMember: newMember.length,
            newOrder: newOrder.length,
            newOrderFashion: newOrderFashion.length,
            newChat: newChat.length
        }
        return res.status(200).json({
            status: true,
            message: 'ok',
            description: 'get memebr per month success.',
            memberPerMonth: memPerMonth,
            totalPerPack: totalPerPack,
            toDayOrder: toDayOrder,
            toDayOrderFashion: toDayOrderFashion,
            orderAll: filterStoreOrder,
            orderAllFashion: filterStoreOrderFashion,
            forTopDashboard: dashboardTop
        })
    }
}