import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    icon: { type: String },
    iconElement: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", ExpenseSchema);
