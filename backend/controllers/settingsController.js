const Settings = require('../models/Settings');
const ensureDefaultSettings = require('../services/ensureDefaultSettings');

exports.seedDefaults = async (req, res) => {
  try {
    await ensureDefaultSettings();
    const settings = await Settings.find().sort({ group: 1, key: 1 });
    res.json({ success: true, message: 'Đã đồng bộ cài đặt mặc định', data: settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.get = async (req, res) => {
  try {
    const { key, group } = req.query;
    const filter = {};
    if (key) filter.key = key;
    if (group) filter.group = group;
    const settings = await Settings.find(filter);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.upsert = async (req, res) => {
  try {
    const { key, value, group, description } = req.body;
    const settings = await Settings.findOneAndUpdate(
      { key },
      { value, group, description },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const settings = await Settings.findOneAndDelete({ key: req.params.key });
    if (!settings) return res.status(404).json({ message: 'Setting not found' });
    res.json({ success: true, message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
