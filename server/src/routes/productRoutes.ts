import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
  createProduct,
  deleteProduct,
  fetchAllProductForAdmin,
  getProductById,
  updateProduct,
} from "../controllers/productController";

const router = express.Router();

// * Create New Product
router.post(
  "/create-new-product",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  createProduct
);

// * Get All Product
router.get(
  "/fetch-admin-products",
  authenticateJwt,
  isSuperAdmin,
  fetchAllProductForAdmin
);

// * Get Detail Product
router.get("/:id", authenticateJwt, getProductById);

// * Update Product
router.put(
  "/:id",
  authenticateJwt,
  isSuperAdmin,
  upload.array("images", 5),
  updateProduct
);

// * Delete Product
router.delete("/:id", authenticateJwt, isSuperAdmin, deleteProduct);

export default router;
