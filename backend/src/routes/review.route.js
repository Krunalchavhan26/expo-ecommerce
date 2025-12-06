import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/", createReview);

// we did not implement this functionality yet in mobile app - in the frontend
// if in future we decide to implement it, we can use this route
router.delete("/:reviewId", deleteReview);

export default router;
