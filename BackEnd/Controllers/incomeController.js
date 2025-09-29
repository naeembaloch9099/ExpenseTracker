import Income from "../Models/Income.js";

export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const addIncome = async (req, res) => {
  try {
    const { title, amount, date, icon, iconElement } = req.body;
    const income = await Income.create({
      user: req.user.id,
      title,
      amount,
      date,
      icon,
      iconElement,
    });
    res.status(201).json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json(income);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const income = await Income.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
