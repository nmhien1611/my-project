const Cart = require("../models/Cart");
const Product = require("../models/Product");

const buildCartResponse = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    return {
      success: true,
      message: "Giỏ hàng trống",
      data: {
        user: userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    };
  }

  return {
    success: true,
    message: "Lấy giỏ hàng thành công",
    data: cart,
  };
};

exports.getMyCart = async (req, res) => {
  try {
    const response = await buildCartResponse(req.user.id);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy giỏ hàng",
      error: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu productId",
      });
    }

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const productPrice = Number(product.price) || 0;
    const productName = product.name || "Sản phẩm";
    const productImage =
      product.image ||
      (Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : "");

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += qty;
      cart.items[existingItemIndex].subtotal =
        cart.items[existingItemIndex].quantity *
        cart.items[existingItemIndex].price;
    } else {
      cart.items.push({
        product: product._id,
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: qty,
        subtotal: productPrice * qty,
      });
    }

    cart.calculateTotals();
    await cart.save();

    const response = await buildCartResponse(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Thêm vào giỏ hàng thành công",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi thêm vào giỏ hàng",
      error: error.message,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!qty || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0",
      });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ hàng",
      });
    }

    item.quantity = qty;
    item.subtotal = item.price * qty;

    cart.calculateTotals();
    await cart.save();

    const response = await buildCartResponse(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật giỏ hàng",
      error: error.message,
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }

    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy item trong giỏ hàng",
      });
    }

    item.deleteOne();

    cart.calculateTotals();
    await cart.save();

    const response = await buildCartResponse(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
      error: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Giỏ hàng đã trống",
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Xóa toàn bộ giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi xóa giỏ hàng",
      error: error.message,
    });
  }
};