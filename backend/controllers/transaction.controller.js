const Transaction = require("../models/Transaction");

// ✅ CREATE
exports.create = async (req, res) => {
  try {
    const data = await Transaction.create(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL
exports.getAll = async (req, res) => {
  try {
    const data = await Transaction.find()
      .populate("product")
      .populate("user");

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET BY ID
exports.getById = async (req, res) => {
  try {
    const data = await Transaction.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE
exports.update = async (req, res) => {
  try {
    const data = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE
exports.remove = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 THỐNG KÊ DOANH THU
exports.getRevenue = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: { type: "export", status: "completed" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    res.json(result[0] || { totalRevenue: 0, totalQuantity: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};