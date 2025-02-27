import { AdminManageController } from './../controllers/AdminManageController';
import { ContentController } from './../controllers/ContentController';
import { BannerController } from './../controllers/BannerController';
import { Router } from 'express'
import { check } from 'express-validator'
import { AdsController } from '../controllers/AdsController'
import * as multerUpload from '../util/multerUpload'
import { AuthenticateAdmin } from '../middleware/AuthAdmin';

const upload = multerUpload.uploadImage()
const router = Router()
const adsController = new AdsController()
const bannerController = new BannerController()
const contentController = new ContentController()
const adminManageController = new AdminManageController()

router.get('/api/website/getSlide/:page', adsController.OnGetAds)
router.post('/api/website/getBanner', [
    check('page').isString().notEmpty(),
    check('gender').isString().notEmpty()
], bannerController.OnGetBanner)
router.get('/api/website/content/:type', contentController.OnGetContent)
router.get('/api/website/getsetting/:type', contentController.OnGetSetting)
router.get('/api/website/getReservedWord', adminManageController.OnGetReservedWord)
router.get('/api/getunderwear/:slug', contentController.OnCheckSlug)
router.get('/api/getDynamic', contentController.getDynamicPage)

export const websiteRouter = router