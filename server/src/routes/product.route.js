const { Router } = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();

router.get("/", productController.get);
router.post("/buy", authMiddleware.verify, productController.buy);

module.exports = router;
