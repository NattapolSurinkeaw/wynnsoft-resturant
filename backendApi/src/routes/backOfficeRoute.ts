import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { AuthenticateAdmin } from './../middleware/AuthAdmin' 
import { ManageDataController } from '../controllers/ManageDataController'
import { WebSettingController } from '../controllers/WebSettingController'
import { TableManageController } from '../controllers/TableManageController'
import { KitchenManageController } from '../controllers/KitchenManageController'
import { OrderFoodController } from '../controllers/OrderFoodController'

const upload = multerUpload.uploadImage()
const uploadFileManual = multerUpload.uploadFileManual();
const router = Router()
const manageDataController = new ManageDataController();
const websettingController = new WebSettingController();
const tableManageController = new TableManageController();
const kitchenManageController = new KitchenManageController();
const orderFoodController = new OrderFoodController();

// จัดการออเดอร์
router.get('/api/backoffice/orderall', AuthenticateAdmin, orderFoodController.OngetAllOrderFoods);
router.get('/api/backoffice/orderallCurrent', AuthenticateAdmin, orderFoodController.OngetAllOrderFoodsCurrent);
router.get('/api/backoffice/order/:id', AuthenticateAdmin, orderFoodController.OngetOrderFoodById);
router.post('/api/backoffice/checkbillOrder', AuthenticateAdmin, upload.single("slip_image"), orderFoodController.OnCheckBillOrder);
// จัดการโต๊ะ
router.get('/api/backoffice/alltables', AuthenticateAdmin, tableManageController.OngetAllTable);
router.get('/api/backoffice/onlyTable', AuthenticateAdmin, tableManageController.OngetOnlyTable);
router.post('/api/backoffice/createtable', AuthenticateAdmin, tableManageController.OnCreateTable);
router.post('/api/backoffice/edittable/:id', AuthenticateAdmin, tableManageController.OnEditTable);
router.post('/api/backoffice/changeTable', AuthenticateAdmin, tableManageController.OnChangeTable);
router.get('/api/backoffice/generate-qrcode/:id', AuthenticateAdmin, tableManageController.OngetGenerateQrcode);
router.get('/api/backoffice/verifyqr/:token', tableManageController.OnverifyQrCode);
// จองโต๊ะ
router.post('/api/backoffice/bookingtable', AuthenticateAdmin, tableManageController.OnCreateBookingTable);

// ห้องครัว
router.get('/api/backoffice/new-menufood', AuthenticateAdmin, kitchenManageController.OngetAllNewMenuFood);
router.post('/api/backoffice/update-statusOrderList', AuthenticateAdmin, kitchenManageController.OnUpdateOrderListStatus);
router.get('/api/backoffice/outfoodAll', AuthenticateAdmin, kitchenManageController.OngetAllOutFoods);
router.post('/api/backoffice/status-outfood/:id', AuthenticateAdmin, kitchenManageController.OnChangeStatusOutFood); //ปุ่มแจ้งสินค้าหมด
router.post('/api/backoffice/updatenote-outfood/:id', AuthenticateAdmin, kitchenManageController.OnUpdateNoteOutfood); //เพิ่มเหตุผลสินค้าหมด
router.post('/api/backoffice/changestatusOrderlist', AuthenticateAdmin, kitchenManageController.OnChangeStatusOrderList) //แจ้งสินค้าหมด หน้าสถานะ
router.get('/api/backoffice/canceloutfood/:id', AuthenticateAdmin, kitchenManageController.OnCancelOutFood);
router.post('/api/backoffice/deleteorderlist/:id', AuthenticateAdmin, kitchenManageController.OnDeleteOrderList);
router.post('/api/backoffice/deleteOrder', AuthenticateAdmin, kitchenManageController.OnDeleteOrder);

// หมวดหมู่เมนู
router.get('/api/backoffice/catefood', AuthenticateAdmin, manageDataController.OngetCategoryFood);
router.post('/api/backoffice/catefood', AuthenticateAdmin, upload.single("image"), [
  check('title').isString().notEmpty(),
  check('priority').isString().notEmpty(),
  check('status').isString().notEmpty(),
], manageDataController.OnCreateCategoryFood);
router.post('/api/backoffice/catefood/:id', AuthenticateAdmin, upload.single("image"), [
  check('title').isString().notEmpty(),
  check('priority').isString().notEmpty(),
  check('status').isString().notEmpty(),
], manageDataController.OnUpdateCategoryFood);
router.delete('/api/backoffice/catefood/:id', AuthenticateAdmin, manageDataController.OnDeleteCategoryFood);
router.put('/api/backoffice/catefood-status/:id', AuthenticateAdmin, manageDataController.OnUpdateDisplay);
router.get('/api/backoffice/getOrderHistory', AuthenticateAdmin, manageDataController.OngetOrderHistory);

// เมนูอาหาร
router.get('/api/backoffice/foods', AuthenticateAdmin, manageDataController.OnGetfoodAll);
router.post('/api/backoffice/food', AuthenticateAdmin, upload.single("thumbnail_link"),[
  check('cate_id').isString().notEmpty(),
  check('name').isString().notEmpty(),
  check('price').isNumeric().notEmpty(),
], manageDataController.OnCreateFood);
router.post('/api/backoffice/food/:id', AuthenticateAdmin, upload.single("thumbnail_link"),[
  check('cate_id').isString().notEmpty(),
  check('name').isString().notEmpty(),
  check('price').isNumeric().notEmpty(),
], manageDataController.OnUpdateFood);
router.delete('/api/backoffice/food/:id', AuthenticateAdmin, manageDataController.OnDeleteFood);
router.put('/api/backoffice/food-status/:id', AuthenticateAdmin, manageDataController.OnUpdateBestSeller)

// ภาษา
router.get('/api/backoffice/language', AuthenticateAdmin, manageDataController.OngetAllLanguage);
router.post('/api/backoffice/language', AuthenticateAdmin, upload.single("flag"), [
  check('language').isString().notEmpty(),
  check('title').isString().notEmpty(),
], manageDataController.OnCreateLanguage)
router.post('/api/backoffice/language/:id', AuthenticateAdmin, upload.single("flag"), [
  check('language').isString().notEmpty(),
  check('title').isString().notEmpty(),
], manageDataController.OnUpdateLanguage)
router.delete('/api/backoffice/language/:id', AuthenticateAdmin, manageDataController.OnDeleteLanguage);

// การตั้งค่า
router.get('/api/backoffice/webinfo', AuthenticateAdmin, websettingController.OngetWebinfos)
router.post('/api/backoffice/updateProfile', AuthenticateAdmin, upload.fields([{name: 'web_logo', maxCount: 1}, {name: 'web_bg', maxCount: 1}]), websettingController.OnUpdateProfileShop);
router.post('/api/backoffice/editshopdata', AuthenticateAdmin, websettingController.OnEditDataShop)
router.post('/api/backoffice/edittaxservice', AuthenticateAdmin, websettingController.OnUpdateTaxService)
router.get('/abi/backoffice/getbank', AuthenticateAdmin, websettingController.OngetAllBankAccount)
router.post('/api/backoffice/updatebank/:id', AuthenticateAdmin, upload.single("qrcode"), websettingController.OnUpdateBank)
router.post('/api/backoffice/createUser', AuthenticateAdmin, [
  check('username').isString(),
  check('password').isString(),
  check('email').isString(),
  check('displayName').isString(),
], websettingController.OnCreateNewUser);
router.post('/api/backoffice/updateUser', AuthenticateAdmin, websettingController.OnUpdateDataUser);
router.delete('/api/backoffice/deleteUser/:code', AuthenticateAdmin, websettingController.OnDeleteUser);
// router.get('/api/backoffice/users', AuthenticateAdmin, websettingController.OnsettingUser);



export const backOfficeRoute = router