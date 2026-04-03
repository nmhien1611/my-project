/** Các key mặc định — chỉ insert khi chưa tồn tại (upsert $setOnInsert) */
module.exports = [
  { key: 'site_name', value: 'TMHDshop', group: 'general', description: 'Tên website / cửa hàng' },
  { key: 'site_description', value: 'Cửa hàng trực tuyến — giao hàng nhanh, uy tín.', group: 'general', description: 'Giới thiệu ngắn' },
  { key: 'contact_email', value: 'support@example.com', group: 'contact', description: 'Email liên hệ' },
  { key: 'hotline', value: '1900 0000', group: 'contact', description: 'Hotline' },
  { key: 'address', value: 'Việt Nam', group: 'contact', description: 'Địa chỉ' },
  { key: 'working_hours', value: '8:00 – 22:00 hằng ngày', group: 'contact', description: 'Giờ làm việc' },
  { key: 'facebook_url', value: '', group: 'social', description: 'Link Facebook (tuỳ chọn)' },
  { key: 'zalo', value: '', group: 'social', description: 'Zalo / SĐT Zalo (tuỳ chọn)' }
];
