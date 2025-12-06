import { Router } from "express";
import {
  addAddress,
  addToWishlist,
  deleteAddress,
  getAddresses,
  getWishlist,
  removeFromWishlist,
  updateAddress,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute); // Protect all routes below

// Address management routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// Wishlist management routes
router.post("/wishlist", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);
router.get("/wishlist", getWishlist);

export default router;
