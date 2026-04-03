const Review = require('../models/Review');

exports.create = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const review = await Review.create({ user: req.user._id, product, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar').sort('-createdAt');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { isApproved } = req.query;
    const filter = isApproved !== undefined ? { isApproved: isApproved === 'true' } : {};
    const reviews = await Review.find(filter).populate('user', 'name avatar').populate('product', 'name').sort('-createdAt');
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
