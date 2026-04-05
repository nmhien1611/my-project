const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["import", "export"], // nhập / bán
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number, // giá tại thời điểm giao dịch
      required: true,
    },

    totalAmount: {
      type: Number,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "momo"],
      default: "cash",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);


// 👉 tự động tính tổng tiền
transactionSchema.pre("save", function (next) {
  this.totalAmount = this.quantity * this.price;
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
