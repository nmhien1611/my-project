const Blog = require('../models/Blog');

const generateSlug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

exports.create = async (req, res) => {
  try {
    const { title, content, excerpt, thumbnail, category, tags, isPublished } = req.body;
    const slug = generateSlug(title);
    const blog = await Blog.create({
      title, slug, content, excerpt, thumbnail, category, tags, isPublished,
      author: req.user._id
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { category, isPublished, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    const blogs = await Blog.find(filter).populate('author', 'name').sort('-createdAt');
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true })
      .populate('author', 'name avatar');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, content, excerpt, thumbnail, category, tags, isPublished } = req.body;
    const slug = title ? generateSlug(title) : undefined;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, slug, content, excerpt, thumbnail, category, tags, isPublished },
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
