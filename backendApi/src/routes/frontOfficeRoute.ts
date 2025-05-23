import { Router } from "express";
import { check } from "express-validator";
import * as multerUpload from "../util/multerUpload";
import { FrontendController } from "../controllers/FrontendController";
import { OrderFoodController } from "../controllers/OrderFoodController";

const upload = multerUpload.uploadImage();
const uploadFileManual = multerUpload.uploadFileManual();
const router = Router();
const frontendController = new FrontendController();
const orderFoodController = new OrderFoodController();

router.get("/front", (req: any, res: any) => {
  res.status(200).json({ message: "ok" });
});
router.get("/catefoods", frontendController.OngetCategoryAndFood);
router.post("/api/frontoffice/orderfood", orderFoodController.OnAddOrderFood);
router.get(
  "/api/frontoffice/status-food-orders",
  frontendController.OngetStatusFoodOrders
);
router.get("/api/frontoffice/webinfo", frontendController.OngetWebInfoData);
router.patch("/api/frontoffice/call-staff", frontendController.OnCallStaff);

export const frontOfficeRoute = router;
