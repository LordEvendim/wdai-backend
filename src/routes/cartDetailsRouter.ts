import express, { Router } from "express";

import { getAllCartsDetails, getCartDetails, updateCartDetails } from "../controllers/cartDetailsController";

const router:Router = express.Router();

router.get("/", getAllCartsDetails);
router.get("/:cartDetailsId", getCartDetails);
router.put("/:cartId", updateCartDetails);


export { router as cartDetailsRouter };
