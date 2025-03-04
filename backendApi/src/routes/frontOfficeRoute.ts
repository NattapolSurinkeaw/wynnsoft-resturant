import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'

const upload = multerUpload.uploadImage()
const uploadFileManual = multerUpload.uploadFileManual();
const router = Router()

router.get('/front', (req: any, res: any) => {
  res.status(200).json({message: "ok"}) 
})

export const frontOfficeRoute = router