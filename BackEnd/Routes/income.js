import express from "express";
import {
  getIncomes,
  addIncome,
  updateIncome,
  deleteIncome,
} from "../Controllers/incomeController.js";
import { protect } from "../Middleware/auth.js";

const router = express.Router();

router.get("/", protect, getIncomes);
router.post("/", protect, addIncome);
router.put("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);

export default router;
