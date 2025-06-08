const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const ProductController = require("../controllers/ProductController");
const { requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, ProductController.index);
router.get('/create', requireAuth, ProductController.showCreate);

router.post("/", upload.single("image"), ProductController.create);
router.post("/:id", upload.single("image"), ProductController.update);

module.exports = router;
