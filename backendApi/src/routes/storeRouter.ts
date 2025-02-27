import { OrderController } from './../controllers/OrderController';
import { ProductController } from './../controllers/ProductController';
import { StoreController } from './../controllers/StoreController';
import { PostController } from './../controllers/PostController'
import { AuthenticateStore } from './../middleware/AuthStore';
import { Router } from 'express'
import { check } from 'express-validator'
import * as multerUpload from '../util/multerUpload'
import { ProductFashionController } from '../controllers/ProductFashionController';

const upload = multerUpload.uploadImage()
const router = Router()
const storeController = new StoreController()
const postController = new PostController()
const productController = new ProductController()
const productFashionController = new ProductFashionController()
const orderController = new OrderController()

router.get('/api/store/getDataAll', AuthenticateStore, storeController.OnGetDataAll)
router.post('/api/store/signin', [
    check('username').isString().notEmpty(),
    check('password').isString().notEmpty()
], storeController.OnSingin)
router.post('/api/store/register', upload.single('image'), [
    check('name').isString(),
    check('username').isString(),
    check('password').isString(),
    check('age').isString(),
    check('gender').isString(),
], storeController.OnRegister)
router.post('/api/store/updateProfile', AuthenticateStore, upload.single('image'), [
    check('storeCode').isString(),
    check('name').isString(),
    check('age').isString(),
    check('weight').isString(),
    check('height').isString(),
    check('bwh').isString(),
], storeController.OnUpdateProfile)
router.post('/api/store/product/create', AuthenticateStore, upload.fields([{name: 'standard', maxCount: 2}, {name: 'premium', maxCount: 2}]), [
    check('name_member').isString(),
    check('content_member').isString(),
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_standard').isNumeric(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], productController.OnCreateProduct)
router.post('/api/store/productPre/create', AuthenticateStore, upload.fields([{name: 'premium', maxCount: 2}]), [
    check('name_premium').isString(),
    check('content_premium').isString(),
    check('price_premium').isNumeric(),
    check('clip').isString(),
], productController.OnCreateProductPre)
router.post('/api/store/post/create', AuthenticateStore, upload.array('image'), postController.OnCreatePostStore)
router.get('/api/store/post/delete/:code', AuthenticateStore, postController.OnDeletePost)
router.get('/api/store/product/delete/:code', AuthenticateStore, productController.OnDeleteProduct)
router.post('/api/store/updateConcept', AuthenticateStore, [
    check('concept').isString()
], storeController.OnUpdateConcept)
router.get('/api/store/orders/get', AuthenticateStore, orderController.OnGetOrderStore)
router.post('/api/store/orders/updatehasimage', upload.single('image'), [
    check('order_number').isString().notEmpty(),
], AuthenticateStore, orderController.OnUpdateHasImageOrder)
router.get('/api/store/orders/amount', AuthenticateStore, storeController.OnCheckTotalOrder)

/** For fashion product */
router.get('/api/store/productcate', storeController.OnGetCateFashion) // cate no auth
router.get('/api/store/getStoreFashionData', AuthenticateStore, storeController.OnGetStoreFashionData)
router.post('/api/store/fashion/create', AuthenticateStore, upload.array('image'), [
    check('cate_id').isNumeric().notEmpty(),
    check('price').isNumeric().notEmpty(),
    check('product_name').isString().notEmpty(),
    check('details').isString(),
    check('defect').isString(),
], productFashionController.OnCreateFashionProduct)
router.get('/api/store/orderfashion', AuthenticateStore, storeController.OnGetOrderFashion)
router.delete('/api/store/productfashion/delete/:code', AuthenticateStore, productFashionController.OnDeleteProductFashion)

export const storeRouter = router