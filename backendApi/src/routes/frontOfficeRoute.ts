import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { FrontendController } from '../controllers/FrontendController'

const upload = multerUpload.uploadImage()
const uploadFileManual = multerUpload.uploadFileManual();
const router = Router()
const frontendController = new FrontendController();

router.get('/front', (req: any, res: any) => {
  res.status(200).json({message: "ok"}) 
})
router.get('/catefoods', frontendController.OngetCategoryAndFood)

export const frontOfficeRoute = router