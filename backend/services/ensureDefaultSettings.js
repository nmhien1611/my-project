const Settings = require('../models/Settings');
const defaults = require('../config/defaultSettings');

async function ensureDefaultSettings() {
  for (const d of defaults) {
    await Settings.updateOne(
      { key: d.key },
      { $setOnInsert: { key: d.key, value: d.value, group: d.group, description: d.description } },
      { upsert: true }
    );
  }
}

module.exports = ensureDefaultSettings;
