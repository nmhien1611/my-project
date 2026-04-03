# TMHDshop

Cửa hàng trực tuyến MERN Stack (MongoDB, Express, React, Node.js).

## Cấu trúc

```
my-project/
├── backend/          # API Express + MongoDB
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/         # React (Vite)
│   └── src/
│       ├── App.jsx
│       └── api.js
└── README.md
```

## Cài đặt & Chạy

### Backend

```bash
cd backend
npm install
# Tạo file .env với:
#   MONGODB_URI=mongodb://localhost:27017/your-database
#   JWT_SECRET=your-secret-key
npm run dev
```

### Frontend (dev)

```bash
cd frontend
npm install
npm run dev
```

### Build production

```bash
# Build frontend
cd frontend && npm run build

# Frontend sẽ tự copy vào backend/public
# Chạy production:
cd backend && npm start
```

## Tài khoản mặc định

- **Admin**: `admin@tmhd.vn` / `admin123`
- **User**: `user@tmhd.vn` / `user123`

## Tính năng

- Quản lý sản phẩm, danh mục, đơn hàng
- Đăng nhập / Đăng ký (JWT)
- Blog & Tin tức
- Liên hệ
- Cài đặt website
- Reviews sản phẩm
- Giỏ hàng & Đặt hàng
- Dashboard quản trị
