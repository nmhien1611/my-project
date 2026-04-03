const Product = require('../models/Product');

const generateSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const normalizeCategory = (category) =>
  category && String(category).trim() ? String(category).trim() : undefined;

exports.create = async (req, res) => {
  try {
    const { name, description, salePrice, images, sku, featured } = req.body;
    const category = normalizeCategory(req.body.category);
    const price = Number(req.body.price);
    const stock = req.body.stock !== undefined && req.body.stock !== '' ? Number(req.body.stock) : 0;
    if (Number.isNaN(price) || price < 0) {
      return res.status(400).json({ message: 'Giá không hợp lệ' });
    }
    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Số lượng tồn kho không hợp lệ' });
    }
    const slug = generateSlug(name);
    const product = await Product.create({ name, slug, description, price, salePrice, images, category, stock, sku, featured });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { category, featured, isActive, search, sort, page = 1, limit = 10 } = req.query;
    const filter = { isActive: isActive !== 'false' };
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortOptions = sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };

    const products = await Product.find(filter).populate('category', 'name').sort(sortOptions).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(filter);

    res.json({ success: true, count: total, page: parseInt(page), pages: Math.ceil(total / limit), data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, salePrice, images, sku, featured, isActive } = req.body;
    const category = normalizeCategory(req.body.category);
    const price = req.body.price !== undefined && req.body.price !== '' ? Number(req.body.price) : undefined;
    const stock = req.body.stock !== undefined && req.body.stock !== '' ? Number(req.body.stock) : undefined;
    const slug = name ? generateSlug(name) : undefined;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, slug, description, price, salePrice, images, category, stock, sku, featured, isActive },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
