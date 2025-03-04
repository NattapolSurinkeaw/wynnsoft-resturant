import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { ManageDataController } from '../controllers/ManageDataController'
import { WebSettingController } from '../controllers/WebSettingController'
import { AuthenticateAdmin } from './../middleware/AuthAdmin' 

const upload = multerUpload.uploadImage()
const uploadFileManual = multerUpload.uploadFileManual();
const router = Router()
const manageDataController = new ManageDataController();
const websettingController = new WebSettingController();

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
router.get('/api/backoffice/foods', AuthenticateAdmin, manageDataController.OnGetfoodAll);
router.post('/api/backoffice/food', AuthenticateAdmin, upload.single("thumbnail_link"),[
  check('cate_id').isString().notEmpty(),
  check('name').isString().notEmpty(),
  check('price').isNumeric().notEmpty(),
], manageDataController.OnCreateFood);

//ตั้งค่า user 
// router.get('/api/backoffice/users', AuthenticateAdmin, websettingController.OnsettingUser);


export const backOfficeRoute = router