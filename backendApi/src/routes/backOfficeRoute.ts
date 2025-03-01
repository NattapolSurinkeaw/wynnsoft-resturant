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
router.post('/api/backoffice/catefood', manageDataController.OnCreateCategoryFood);


export const backOfficeRoute = router