import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { ManageDataController } from '../controllers/ManageDataController'
import { AuthenticateAdmin } from './../middleware/AuthAdmin' 

const upload = multerUpload.uploadImage()
const uploadFileManual = multerUpload.uploadFileManual();
const router = Router()
const manageDataController = new ManageDataController();

router.get('/api/backoffice/catefood', AuthenticateAdmin, manageDataController.OngetCategoryFood);
// router.post('/api/backoffice/catefood', upload.single("image"), manageDataController.OnCreateCategoryFood);
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



export const backOfficeRoute = router