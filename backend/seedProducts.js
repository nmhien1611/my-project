require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/your-database';

const generateSlug = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const generateProductsByCategory = (categories) => {
  const products = [];
  
  categories.forEach(category => {
    const catName = category.name.toLowerCase();
    
    // Tạo 3-5 sản phẩm cho mỗi category
    const numProducts = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 1; i <= numProducts; i++) {
      const productNames = getProductNamesForCategory(catName, i);
      const slugBase = generateSlug(productNames.name) || 'san-pham';
      const slug = `${slugBase}-${String(category._id).slice(-6)}-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      products.push({
        name: productNames.name,
        slug,
        description: productNames.description,
        price: Math.floor(Math.random() * 500000) + 50000,
        salePrice: Math.random() > 0.5 ? Math.floor(Math.random() * 400000) + 30000 : undefined,
        stock: Math.floor(Math.random() * 100) + 10,
        category: category._id,
        sku: `${catName.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`,
        featured: Math.random() > 0.7,
        images: [`https://picsum.photos/seed/${catName}${i}/400/400`],
        isActive: true
      });
    }
  });
  
  return products;
};

const getProductNamesForCategory = (categoryName, index) => {
  const productTemplates = {
    'ao': { name: `Áo Thun ${index}`, description: `Áo thun phong cách, chất liệu cotton 100%, thoáng mát và thoải mái. Phù hợp cho mọi hoàn cảnh.` },
    'quan': { name: `Quần Jean ${index}`, description: `Quần jean nam nữ phong cách, form chuẩn, bền đẹp và dễ phối đồ.` },
    'giay': { name: `Giày Thể Thao ${index}`, description: `Giày thể thao nam nữ, thiết kế trẻ trung, êm chân và bền bỉ.` },
    'tui': { name: `Túi Xách ${index}`, description: `Túi xách thời trang, chất liệu da cao cấp, phù hợp công sở và đi chơi.` },
    'phu-kien': { name: `Phụ Kiện ${index}`, description: `Phụ kiện thời trang đa dạng, phong cách hiện đại, giá hợp lý.` },
    'dien-thoai': { name: `Điện Thoại ${index}`, description: `Điện thoại smartphone chính hãng, cấu hình mạnh, camera chất lượng cao.` },
    'laptop': { name: `Laptop ${index}`, description: `Laptop văn phòng, gaming, mỏng nhẹ, hiệu năng tốt.` },
    'may-tinh-bang': { name: `Máy Tính Bảng ${index}`, description: `Máy tính bảng tiện lợi, màn hình sắc nét, pin trâu.` },
    'smartwatch': { name: `Smartwatch ${index}`, description: `Đồng hồ thông minh, theo dõi sức khỏe, nhận thông báo tiện lợi.` },
    'am-thanh': { name: `Tai Nghe ${index}`, description: `Tai nghe không dây, chất lượng âm thanh tuyệt vời, pin lâu.` },
    'sac': { name: `Sạc Dự Phòng ${index}`, description: `Sạc dự phòng pin trâu, sạc nhanh, an toàn khi sử dụng.` },
    'my-pham': { name: `Mỹ Phẩm ${index}`, description: `Mỹ phẩm chính hãng, chăm sóc da hiệu quả, an toàn cho sức khỏe.` },
    'son': { name: `Son Môi ${index}`, description: `Son môi nhiều màu sắc, lên màu đẹp, dưỡng môi mềm mịn.` },
    'kem-duong': { name: `Kem Dưỡng ${index}`, description: `Kem dưỡng ẩm, chống lão hóa, phù hợp mọi loại da.` },
    'sua-rua-mat': { name: `Sữa Rửa Mặt ${index}`, description: `Sữa rửa mặt làm sạch sâu, không khô da, thích hợp hàng ngày.` },
    'nuoc-hoa': { name: `Nước Hoa ${index}`, description: `Nước hoa nam/nữ, hương thơm quyến rũ, lưu hương lâu.` },
    'do-an': { name: `Đồ Ăn ${index}`, description: `Đồ ăn vặt ngon, đa dạng, giao hàng nhanh.` },
    'thuc-uong': { name: `Thức Uống ${index}`, description: `Thức uống giải khát, nước ép trái cây tươi, trà sữa ngon.` },
    'trai-cay': { name: `Trái Cây ${index}`, description: `Trái cây tươi sạch, nhập khẩu và trong nước, giao tận nơi.` },
    'ruou': { name: `Rượu ${index}`, description: `Rượu nhập khẩu, rượu vang, rượu vodka chính hãng.` },
    'sach': { name: `Sách ${index}`, description: `Sách văn học, sách kỹ năng, sách thiếu nhi, sách ngoại ngữ.` },
    'tap-chi': { name: `Tạp Chí ${index}`, description: `Tạp chí thời trang, công nghệ, kinh tế cập nhật hàng ngày.` },
    'van-phong-pham': { name: `Văn Phòng Phẩm ${index}`, description: `Văn phòng phẩm đầy đủ, bút, vở, giấy chất lượng tốt.` },
    'do-choi': { name: `Đồ Chơi ${index}`, description: `Đồ chơi trẻ em an toàn, phát triển trí tuệ, giáo dục sớm.` },
    'game': { name: `Game ${index}`, description: `Game console, game PC, game mobile, voucher game giá rẻ.` },
    'the-loai-khac': { name: `Sản Phẩm ${index}`, description: `Sản phẩm đa dạng, chất lượng tốt, giá cả hợp lý.` },
  };
  
  // Tìm template phù hợp với category name
  const templateKey = Object.keys(productTemplates).find(key => categoryName.includes(key));
  
  if (templateKey) {
    return productTemplates[templateKey];
  }
  
  // Default fallback
  return {
    name: `Sản phẩm ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} ${index}`,
    description: `Sản phẩm chất lượng cao, giá tốt thuộc danh mục ${categoryName}. Đảm bảo uy tín và chất lượng.`
  };
};

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');
    
    // Lấy tất cả categories đang active
    const categories = await Category.find({ isActive: true });
    
    if (categories.length === 0) {
      console.log('⚠ Không có categories nào! Hãy tạo categories trước.');
      process.exit(0);
    }
    
    console.log(`Tìm thấy ${categories.length} categories:`);
    categories.forEach(cat => console.log(`  - ${cat.name}`));
    
    // Xóa các sản phẩm cũ (tùy chọn)
    const deleteOld = process.argv.includes('--delete-old');
    if (deleteOld) {
      await Product.deleteMany({});
      console.log('✓ Đã xóa sản phẩm cũ');
    }
    
    // Tạo sản phẩm mới
    const products = generateProductsByCategory(categories);
    const insertedProducts = await Product.insertMany(products);
    
    console.log(`\n✓ Đã tạo thành công ${insertedProducts.length} sản phẩm!`);
    
    // Hiển thị thống kê theo category
    console.log('\n📊 Thống kê sản phẩm theo danh mục:');
    const stats = {};
    insertedProducts.forEach(p => {
      const catName = categories.find(c => c._id.toString() === p.category.toString())?.name || 'Unknown';
      stats[catName] = (stats[catName] || 0) + 1;
    });
    Object.entries(stats).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} sản phẩm`);
    });
    
    await mongoose.disconnect();
    console.log('\n✓ Hoàn thành! Đóng kết nối MongoDB.');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
};

seedProducts();
