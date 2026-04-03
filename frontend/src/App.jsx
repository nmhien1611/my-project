import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authAPI, categoryAPI, productAPI, orderAPI, blogAPI, contactAPI, reviewAPI, settingsAPI, uploadAPI, mediaUrl, formatVnd } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar user={user} logout={logout} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/settings" element={<ClientSettings />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          {user?.role === 'admin' && (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/blogs" element={<AdminBlogs />} />
              <Route path="/admin/contacts" element={<AdminContacts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Navbar({ user, logout }) {
  const location = useLocation();
  const inAdmin = user?.role === 'admin' && location.pathname.startsWith('/admin');

  if (inAdmin) {
    return (
      <nav className="navbar navbar-admin">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/" className="navbar-logo">TMHD<span>shop</span></Link>
            <span style={{ color: 'var(--gray-500)' }}>|</span>
            <Link to="/admin" style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', textDecoration: 'none' }}>Quản trị</Link>
            <span style={{ color: '#64748b' }}>|</span>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '14px' }}>
              <Link to="/admin/categories" style={{ color: '#cbd5e1' }}>Danh mục</Link>
              <Link to="/admin/products" style={{ color: '#cbd5e1' }}>Sản phẩm</Link>
              <Link to="/admin/orders" style={{ color: '#cbd5e1' }}>Đơn hàng</Link>
              <Link to="/admin/blogs" style={{ color: '#cbd5e1' }}>Blog</Link>
              <Link to="/admin/contacts" style={{ color: '#cbd5e1' }}>Liên hệ</Link>
              <Link to="/admin/users" style={{ color: '#cbd5e1' }}>Users</Link>
              <Link to="/admin/settings" style={{ color: '#cbd5e1' }}>Cài đặt</Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/" className="btn btn-primary" style={{ background: '#2563eb' }}>← Cửa hàng (khách)</Link>
            <button type="button" onClick={logout} className="btn btn-secondary">Đăng xuất</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="navbar-logo">TMHD<span>shop</span></Link>
          <div className="nav-links">
            <Link to="/products">Sản phẩm</Link>
            <Link to="/blogs">Tin tức</Link>
            <Link to="/contact">Liên hệ</Link>
            <Link to="/settings">Thông tin</Link>
            {user ? (
              <>
                <Link to="/cart">Giỏ hàng</Link>
                <Link to="/orders">Đơn của tôi</Link>
                <Link to="/profile">Tài khoản</Link>
                {user.role === 'admin' && <Link to="/admin">Quản trị</Link>}
                <button type="button" onClick={logout} className="btn btn-secondary">Đăng xuất</button>
              </>
            ) : (
              <>
                <Link to="/login">Đăng nhập</Link>
                <Link to="/register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {user?.role === 'admin' && (
        <div className="admin-warning">
          Bạn đang đăng nhập <strong>Admin</strong>. Mua hàng ở đây sẽ gắn với tài khoản quản trị.
          Để mua như khách, hãy{' '}
          <button type="button" onClick={logout} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 600 }}>đăng xuất</button>{' '}
          rồi đăng nhập tài khoản thường.
        </div>
      )}
    </>
  );
}

function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-badge">🛍 Cửa hàng trực tuyến</div>
        <h1>Mua sắm thông minh,<br />giao hàng tận nơi</h1>
        <p>Hàng ngàn sản phẩm chính hãng — giá tốt nhất thị trường, đặt hàng chỉ vài giây.</p>
        <div className="hero-actions">
          <Link to="/products" className="btn btn-primary btn-lg">Xem sản phẩm</Link>
          <Link to="/contact" className="btn btn-secondary btn-lg">Liên hệ hỗ trợ</Link>
        </div>
      </section>

      <section className="page" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Vì sao chọn chúng tôi?</h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
            {[
              { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Giao trong 24–48h tại các thành phố lớn' },
              { icon: '✓', title: 'Hàng chính hãng', desc: 'Cam kết 100% sản phẩm chính hãng' },
              { icon: '🔄', title: 'Đổi trả dễ dàng', desc: '7 ngày đổi trả miễn phí nếu không hài lòng' },
              { icon: '💬', title: 'Hỗ trợ 24/7', desc: 'Đội ngũ tư vấn luôn sẵn sàng giúp bạn' },
            ].map((item, i) => (
              <div key={i} className="card-flat" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      setUser(res.data.data.user);
      navigate(res.data.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>🔐</div>
          <h2 className="auth-title">Chào mừng trở lại</h2>
          <p className="auth-subtitle">Đăng nhập để tiếp tục mua sắm</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </form>
        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input type={type} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} placeholder={placeholder} required={key !== 'phone' && key !== 'address'} />
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>📝</div>
          <h2 className="auth-title">Tạo tài khoản mới</h2>
          <p className="auth-subtitle">Đăng ký nhanh — chỉ vài giây</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {field('Họ và tên', 'name', 'text', 'Nguyễn Văn A')}
          {field('Email', 'email', 'email', 'you@example.com')}
          {field('Mật khẩu', 'password', 'password', 'Ít nhất 6 ký tự')}
          {field('Số điện thoại', 'phone', 'tel', '0909 123 456')}
          {field('Địa chỉ', 'address', 'text', '123 Đường ABC, Quận 1, TP.HCM')}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Đang đăng ký…' : 'Tạo tài khoản'}
          </button>
        </form>
        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 200 }),
      categoryAPI.getAll()
    ]).then(([pRes, cRes]) => {
      setProducts(pRes.data.data || []);
      setCategories(cRes.data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getCatId = (cat) => (cat && typeof cat === 'object' ? cat._id : cat);

  const filtered = selectedCategory
    ? products.filter(p => String(getCatId(p.category)) === selectedCategory)
    : products;

  const addToCart = (product) => {
    const img = product.images?.[0];
    const price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      cart.forEach(item => { if (item.name === product.name) item.quantity += 1; });
    } else {
      cart.push({ product: product._id, name: product.name, price, quantity: 1, image: img || '' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ hàng!');
  };

  if (loading) return <div className="loading">Đang tải sản phẩm…</div>;

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Sản phẩm</h1>
        <span className="badge badge-muted">{filtered.length} sản phẩm</span>
      </div>

      <div className="filter-pills">
        <button className={`pill${!selectedCategory ? ' active' : ''}`} onClick={() => setSelectedCategory('')}>Tất cả</button>
        {categories.map(cat => (
          <button key={cat._id} className={`pill${selectedCategory === cat._id ? ' active' : ''}`} onClick={() => setSelectedCategory(cat._id)}>{cat.name}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>Không có sản phẩm nào</h3>
          <p>Thử chọn danh mục khác hoặc quay lại sau.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(product => {
            const img = product.images?.[0];
            const src = mediaUrl(img);
            const hasSale = product.salePrice != null && product.salePrice < product.price;
            return (
              <div key={product._id} className="product-card">
                <div className="product-card-img">
                  {src ? (
                    <img src={src} alt={product.name} />
                  ) : (
                    <div className="img-placeholder">Chưa có ảnh</div>
                  )}
                  {hasSale && <div className="product-card-badge">-{Math.round((1 - product.salePrice / product.price) * 100)}%</div>}
                  {product.stock <= 0 && <div className="product-card-badge" style={{ background: '#64748b' }}>Hết hàng</div>}
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">{product.name}</div>
                  {product.description && <div className="product-card-desc">{product.description}</div>}
                  <div>
                    <span className="product-card-price">
                      {formatVnd(hasSale ? product.salePrice : product.price)}
                    </span>
                    {hasSale && <span className="product-card-price-old">{formatVnd(product.price)}</span>}
                  </div>
                  {product.stock > 0 ? (
                    <span className="badge badge-success">Còn hàng</span>
                  ) : (
                    <span className="badge badge-muted">Hết hàng</span>
                  )}
                  <div className="product-card-actions">
                    <Link to={`/products/${product._id}`} className="btn btn-secondary btn-sm">Chi tiết</Link>
                    {product.stock > 0 && (
                      <button onClick={() => addToCart(product)} className="btn btn-primary btn-sm">🛒 Mua ngay</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getById(id),
      categoryAPI.getAll()
    ]).then(([pRes, cRes]) => {
      setProduct(pRes.data.data);
      setCategories(cRes.data.data);
      setError('');
    }).catch(() => setError('Không tìm thấy sản phẩm'))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      cart.forEach(item => { if (item.name === product.name) item.quantity += 1; });
    } else {
      cart.push({
        product: product._id,
        name: product.name,
        price: product.salePrice && product.salePrice < product.price ? product.salePrice : product.price,
        quantity: 1,
        image: product.images?.[0] || ''
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (loading) return <div className="loading">Đang tải sản phẩm…</div>;
  if (error || !product) return <div className="card" style={{ maxWidth: '720px', margin: '40px auto' }}><p>{error || 'Không có dữ liệu'}</p><Link to="/products">← Về danh sách</Link></div>;

  const imgs = (product.images || []).map(mediaUrl).filter(Boolean);
  const getCatId = (cat) => (cat && typeof cat === 'object' ? cat._id : cat);
  const catName = categories.find(c => String(getCatId(product.category)) === c._id)?.name;
  const hasSale = product.salePrice != null && product.salePrice < product.price;

  return (
    <div className="page" style={{ maxWidth: '800px' }}>
      <Link to="/products" className="btn btn-ghost btn-sm" style={{ marginBottom: '20px', padding: '6px 0' }}>← Sản phẩm</Link>
      {imgs.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {imgs.map((src, i) => (
            <img key={i} src={src} alt={product.name} style={{ maxWidth: '100%', maxHeight: '380px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-surface)' }} />
          ))}
        </div>
      )}
      <div className="card-flat" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>{product.name}</h1>
            {catName && <span className="badge badge-primary">{catName}</span>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {hasSale ? (
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)' }}>{formatVnd(product.salePrice)}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatVnd(product.price)}</div>
                <span className="badge badge-danger" style={{ marginTop: '4px' }}>-{Math.round((1 - product.salePrice / product.price) * 100)}%</span>
              </div>
            ) : (
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-light)' }}>{formatVnd(product.price)}</div>
            )}
          </div>
        </div>
        {product.description && <p style={{ marginTop: '16px', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{product.description}</p>}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {product.stock > 0 ? (
            <>
              <span className="badge badge-success">✓ Còn hàng ({product.stock})</span>
              <button onClick={addToCart} className="btn btn-primary">🛒 Thêm vào giỏ hàng</button>
            </>
          ) : (
            <span className="badge badge-danger">Hết hàng</span>
          )}
        </div>
      </div>
      <Reviews productId={product._id} />
    </div>
  );
}

function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    reviewAPI.getByProduct(productId).then(res => { setReviews(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, [productId]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { alert('Vui lòng đăng nhập để đánh giá'); return; }
    setSubmitting(true);
    try {
      await reviewAPI.create({ product: productId, rating, comment });
      setComment(''); setRating(5);
      const res = await reviewAPI.getByProduct(productId);
      setReviews(res.data.data || []);
    } catch (err) { alert(err.response?.data?.message || 'Gửi đánh giá thất bại'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ margin: 0 }}>Đánh giá sản phẩm</h3>
        {avg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.25rem', color: 'var(--warning)' }}>{'★'.repeat(Math.round(avg))}</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{avg}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>({reviews.length} đánh giá)</span>
          </div>
        )}
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="card-flat" style={{ marginBottom: '24px', background: 'var(--bg-surface)' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Đánh giá của bạn</div>
            <div>
              {[1,2,3,4,5].map(n => (
                <span key={n} onClick={() => setRating(n)} className={`star ${n <= rating ? 'star-filled' : 'star-empty'}`}>★</span>
              ))}
            </div>
          </div>
          <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ cảm nhận của bạn về sản phẩm…" required style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', width: '100%', fontFamily: 'var(--font)', fontSize: '0.9375rem', resize: 'vertical', outline: 'none' }} />
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '12px' }}>{submitting ? 'Đang gửi…' : 'Gửi đánh giá'}</button>
        </form>
      ) : (
        <div className="alert alert-info" style={{ marginBottom: '20px' }}>Hãy <Link to="/login">đăng nhập</Link> để đánh giá sản phẩm này.</div>
      )}

      {loading ? (
        <div className="loading">Đang tải đánh giá…</div>
      ) : reviews.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 0' }}><div className="empty-state-icon">⭐</div><h3>Chưa có đánh giá nào</h3><p>Hãy là người đầu tiên đánh giá sản phẩm này!</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reviews.map(r => (
            <div key={r._id} className="card-flat" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {r.user?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{r.user?.name || 'Khách hàng'}</span>
                </div>
                <span style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{r.comment}</p>
              <small style={{ marginTop: '6px', display: 'block' }}>{new Date(r.createdAt).toLocaleDateString('vi-VN')}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getAll({ isPublished: true }).then(res => { setBlogs(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Đang tải…</div>;

  return (
    <div className="page">
      <div className="section-header"><h1 className="section-title">Tin tức &amp; Blog</h1></div>
      {blogs.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📝</div><h3>Chưa có bài viết nào</h3></div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {blogs.map(blog => (
            <div key={blog._id} className="product-card">
              <div className="product-card-img">
                {blog.thumbnail ? (
                  <img src={mediaUrl(blog.thumbnail)} alt={blog.title} />
                ) : (
                  <div className="img-placeholder">📝</div>
                )}
              </div>
              <div className="product-card-body">
                <div className="product-card-name">{blog.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  👁 {blog.viewCount || 0} · {blog.author?.name || 'Admin'} · {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                </div>
                {blog.excerpt && <div className="product-card-desc">{blog.excerpt}</div>}
                <Link to={`/blogs/${blog._id}`} className="btn btn-secondary btn-sm btn-full" style={{ marginTop: '8px' }}>Đọc tiếp →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getById(id).then(res => { setBlog(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Đang tải…</div>;
  if (!blog) return <div className="card" style={{ maxWidth: '720px', margin: '40px auto' }}><p>Không tìm thấy bài viết.</p><Link to="/blogs">← Tin tức</Link></div>;

  return (
    <div className="page" style={{ maxWidth: '800px' }}>
      <Link to="/blogs" className="btn btn-ghost btn-sm" style={{ marginBottom: '16px', padding: '6px 0' }}>← Tin tức</Link>
      {blog.thumbnail && (
        <img src={mediaUrl(blog.thumbnail)} alt={blog.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }} />
      )}
      <h1 style={{ marginBottom: '12px' }}>{blog.title}</h1>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <span>👁 {blog.viewCount || 0} lượt xem</span>
        <span>✏️ {blog.author?.name || 'Admin'}</span>
        <span>📅 {new Date(blog.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      {blog.tags?.length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {blog.tags.map(tag => <span key={tag} className="badge badge-primary">{tag}</span>)}
        </div>
      )}
      <div className="card-flat" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-secondary)' }}>{blog.content}</div>
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <Link to="/blogs" className="btn btn-secondary">← Quay lại tin tức</Link>
      </div>
    </div>
  );
}

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.create(formData);
      setSuccess('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm nhất có thể.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      alert('Gửi thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Liên hệ hỗ trợ</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="card-flat">
          <h3 style={{ marginBottom: '16px' }}>Gửi tin nhắn</h3>
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Họ và tên</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nguyễn Văn A" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0909 123 456" />
              </div>
              <div className="form-group">
                <label>Chủ đề</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Hỗ trợ đặt hàng" required />
              </div>
            </div>
            <div className="form-group">
              <label>Nội dung</label>
              <textarea rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn…" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang gửi…' : 'Gửi tin nhắn'}</button>
          </form>
        </div>
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ marginBottom: 0 }}>Thông tin liên hệ</h3>
          {[
            { icon: '📍', label: 'Địa chỉ', value: 'Việt Nam' },
            { icon: '📧', label: 'Email', value: 'support@example.com' },
            { icon: '📞', label: 'Hotline', value: '1900 0000' },
            { icon: '🕐', label: 'Giờ làm việc', value: '8:00 – 22:00 hằng ngày' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cart({ user }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
  });
  const [adminOrderConfirm, setAdminOrderConfirm] = useState(false);
  const navigate = useNavigate();

  const saveCart = (items) => { setCart(items); localStorage.setItem('cart', JSON.stringify(items)); };
  const updateQty = (idx, qty) => { if (qty < 1) return; saveCart(cart.map((item, i) => i === idx ? { ...item, quantity: qty } : item)); };
  const removeItem = (idx) => { if (confirm('Xóa sản phẩm này khỏi giỏ?')) saveCart(cart.filter((_, i) => i !== idx)); };
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!user) { navigate('/login'); return; }
    if (cart.length === 0) return;
    if (user.role === 'admin' && !adminOrderConfirm) {
      alert('Bạn đang là Admin. Nếu muốn đặt hàng thử, hãy tích ô xác nhận bên dưới — hoặc đăng xuất và dùng tài khoản khách.');
      return;
    }
    try {
      const items = cart.map(({ product, name, price, quantity, image }) => ({ product: product || undefined, name, price, quantity, image }));
      await orderAPI.create({ items, shippingAddress: { fullName: user.name, phone: user.phone || '', address: user.address || '', city: user.city || '' } });
      alert('Đặt hàng thành công! Cảm ơn bạn.');
      saveCart([]);
      setAdminOrderConfirm(false);
    } catch (err) { alert(err.response?.data?.message || 'Đặt hàng thất bại'); }
  };

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Giỏ hàng của tôi</h1>
        {cart.length > 0 && <span className="badge badge-muted">{cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm</span>}
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Giỏ hàng trống</h3>
          <p>Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Xem sản phẩm</Link>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th style={{ width: '120px' }}>Số lượng</th>
                  <th>Thành tiền</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      {item.image ? (
                        <img src={mediaUrl(item.image)} alt="" className="cart-item-img" />
                      ) : (
                        <div className="cart-item-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>—</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</td>
                    <td>{formatVnd(item.price)}</td>
                    <td>
                      <div className="qty-control">
                        <button onClick={() => updateQty(idx, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQty(idx, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{formatVnd(item.price * item.quantity)}</td>
                    <td>
                      <button onClick={() => removeItem(idx)} className="btn btn-danger btn-sm">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '24px', flexWrap: 'wrap', gap: '20px' }}>
            <Link to="/products" className="btn btn-secondary">← Tiếp tục mua sắm</Link>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '12px' }}>Tổng cộng:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-light)' }}>{formatVnd(total)}</span>
              </div>
              {user?.role === 'admin' && (
                <div className="card-flat" style={{ marginBottom: '12px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', textAlign: 'left' }}>
                  <p style={{ margin: '0 0 10px', color: 'var(--warning)', fontSize: '0.875rem' }}>
                    <strong>Khu vực khách hàng:</strong> đặt hàng ở đây sẽ gắn với <strong>tài khoản admin</strong> của bạn.
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--warning)', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={adminOrderConfirm} onChange={(e) => setAdminOrderConfirm(e.target.checked)} />
                    Tôi hiểu và muốn đặt hàng bằng tài khoản quản trị.
                  </label>
                </div>
              )}
              <button onClick={handleOrder} className="btn btn-success btn-lg" disabled={user?.role === 'admin' && !adminOrderConfirm}>
                Đặt hàng ngay →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Orders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders().then(res => { setOrders(res.data.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusConfig = (s) => ({
    pending:    { label: 'Chờ xử lý', cls: 'badge-warning' },
    processing: { label: 'Đang xử lý', cls: 'badge-info' },
    shipped:    { label: 'Đã gửi', cls: 'badge-primary' },
    delivered:  { label: 'Đã giao', cls: 'badge-success' },
    cancelled:  { label: 'Đã hủy', cls: 'badge-danger' },
  }[s] || { label: s, cls: 'badge-muted' });

  if (loading) return <div className="loading">Đang tải đơn hàng…</div>;

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Đơn hàng của tôi</h1>
        {orders.length > 0 && <span className="badge badge-muted">{orders.length} đơn</span>}
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Bắt đầu mua sắm để tạo đơn hàng đầu tiên.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Mua sắm ngay</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => {
            const sc = statusConfig(order.status);
            return (
              <div key={order._id} className="card-flat" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'Fira Code', monospace", color: 'var(--accent-light)', fontSize: '0.875rem', fontWeight: 600 }}>#{order.orderNumber}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: 'var(--accent-light)' }}>{formatVnd(order.totalAmount)}</span>
                    <span className={`badge ${sc.cls}`}>{sc.label}</span>
                    <span className="badge badge-muted">{order.paymentMethod?.toUpperCase()} · {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                  </div>
                </div>
                <hr className="divider" style={{ margin: '12px 0' }} />
                <details>
                  <summary style={{ cursor: 'pointer', color: 'var(--accent-light)', fontSize: '0.875rem', fontWeight: 600, userSelect: 'none' }}>Xem chi tiết sản phẩm</summary>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      📍 {order.shippingAddress?.fullName} · {order.shippingAddress?.phone} · {order.shippingAddress?.address}, {order.shippingAddress?.city}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatVnd(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    authAPI.getMe().then(res => setProfile(res.data.data));
  }, []);

  if (!profile) return <div className="loading">Đang tải…</div>;

  const profileRows = [
    { label: 'Họ và tên', value: profile.name, icon: '👤' },
    { label: 'Email', value: profile.email, icon: '✉️' },
    { label: 'Số điện thoại', value: profile.phone || '—', icon: '📱' },
    { label: 'Địa chỉ', value: profile.address || '—', icon: '📍' },
  ];

  return (
    <div className="page profile-page">
      <div className="profile-page-inner">
        <header className="profile-page-header">
          <h1 className="section-title profile-page-title">Tài khoản của tôi</h1>
          <p className="profile-page-sub">Thông tin liên hệ và giao hàng của bạn</p>
        </header>
        <div className="card profile-card">
          <div className="profile-card-head">
            <div className="profile-avatar" aria-hidden>
              {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="profile-card-head-text">
              <div className="profile-card-name">{profile.name}</div>
              <div className="profile-card-email">{profile.email}</div>
              {profile.role === 'admin' && (
                <span className="badge badge-primary profile-admin-badge">Quản trị viên</span>
              )}
            </div>
          </div>
          <ul className="profile-details">
            {profileRows.map((item) => (
              <li key={item.label} className="profile-detail-row">
                <span className="profile-detail-icon" aria-hidden>{item.icon}</span>
                <div className="profile-detail-body">
                  <span className="profile-detail-label">{item.label}</span>
                  <span className="profile-detail-value">{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Admin Pages
function AdminDashboard() {
  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Bảng điều khiển</h1>
      </div>
      <div className="stats-grid">
        {[
          { label: 'Danh mục', icon: '📂', to: '/admin/categories', color: 'var(--info-bg)' },
          { label: 'Sản phẩm', icon: '📦', to: '/admin/products', color: 'var(--success-bg)' },
          { label: 'Đơn hàng', icon: '🧾', to: '/admin/orders', color: 'var(--warning-bg)' },
          { label: 'Blog', icon: '📝', to: '/admin/blogs', color: 'var(--danger-bg)' },
          { label: 'Liên hệ', icon: '📧', to: '/admin/contacts', color: 'var(--info-bg)' },
          { label: 'Người dùng', icon: '👤', to: '/admin/users', color: 'var(--success-bg)' },
          { label: 'Cài đặt', icon: '⚙️', to: '/admin/settings', color: 'var(--warning-bg)' },
        ].map((item, i) => (
          <Link key={i} to={item.to} className="stat-card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '10px' }}>{item.icon}</div>
            <div className="stat-label">{item.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-light)', marginTop: '8px' }}>Quản lý →</div>
          </Link>
        ))}
      </div>
      <div className="card-flat" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👋</div>
        <p style={{ margin: 0 }}>Chào mừng bạn quay trở lại trang quản trị.</p>
      </div>
    </div>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadCategories(); }, []);
  const loadCategories = () => { categoryAPI.getAll().then(res => setCategories(res.data.data || [])); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      editingId ? await categoryAPI.update(editingId, form) : await categoryAPI.create(form);
      setForm({ name: '', description: '' });
      setEditingId(null);
      loadCategories();
    } catch (err) { alert('Lưu thất bại'); } finally { setLoading(false); }
  };
  const handleEdit = (cat) => { setForm({ name: cat.name, description: cat.description }); setEditingId(cat._id); };
  const handleDelete = async (id) => { if (confirm('Xóa danh mục này?')) { await categoryAPI.delete(id); loadCategories(); } };

  return (
    <div className="page">
      <div className="section-header"><h2 className="section-title">Quản lý danh mục</h2></div>
      <div className="card-flat" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Tên danh mục</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ví dụ: Thời trang" required /></div>
            <div className="form-group"><label>Mô tả</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả ngắn (tùy chọn)" /></div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Đang lưu…' : editingId ? 'Cập nhật' : 'Tạo mới'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }} className="btn btn-secondary">Hủy</button>}
          </div>
        </form>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Tên danh mục</th><th>Mô tả</th><th style={{ width: '160px' }}>Hành động</th></tr></thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{cat.description || '—'}</td>
                <td>
                  <button onClick={() => handleEdit(cat)} className="btn btn-secondary btn-sm">Sửa</button>
                  <button onClick={() => handleDelete(cat._id)} className="btn btn-danger btn-sm" style={{ marginLeft: '6px' }}>Xóa</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có danh mục nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', salePrice: '', stock: '', category: '', featured: false, images: [] });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);
  const loadData = () => {
    productAPI.getAll().then(res => setProducts(res.data.data || []));
    categoryAPI.getAll().then(res => setCategories(res.data.data || []));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      const res = await uploadAPI.uploadMultiple(fd);
      setForm(f => ({ ...f, images: [...(f.images || []), ...res.data.urls] }));
    } catch (err) { alert(err.response?.data?.message || 'Upload thất bại'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description?.trim() || undefined, price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : undefined, stock: form.stock === '' ? 0 : Number(form.stock), featured: form.featured, images: form.images, ...(form.category ? { category: form.category } : {}) };
      editingId ? await productAPI.update(editingId, payload) : await productAPI.create(payload);
      setForm({ name: '', description: '', price: '', salePrice: '', stock: '', category: '', featured: false, images: [] });
      setEditingId(null);
      loadData();
    } catch (err) { alert(err.response?.data?.message || 'Lưu sản phẩm thất bại'); }
    finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description || '', price: p.price, salePrice: p.salePrice || '', stock: p.stock, category: p.category?._id || '', featured: p.featured || false, images: p.images || [] });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleDelete = async (id) => { if (confirm('Xóa sản phẩm này?')) { await productAPI.delete(id); loadData(); } };
  const clearForm = () => { setEditingId(null); setForm({ name: '', description: '', price: '', salePrice: '', stock: '', category: '', featured: false, images: [] }); };

  return (
    <div className="page">
      <div className="section-header"><h2 className="section-title">Quản lý sản phẩm</h2></div>

      <div className="card-flat" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>{editingId ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Tên sản phẩm</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nhập tên sản phẩm" required /></div>
          <div className="form-group"><label>Mô tả</label><textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả chi tiết sản phẩm" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label>Giá gốc (VNĐ)</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0" required /></div>
            <div className="form-group"><label>Giá khuyến mãi (VNĐ)</label><input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} placeholder="Để trống nếu không giảm" /></div>
            <div className="form-group"><label>Số lượng tồn</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" required /></div>
          </div>
          <div className="form-group"><label>Danh mục</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">— Chọn danh mục —</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Đánh dấu là sản phẩm nổi bật
            </label>
          </div>
          <div className="form-group"><label>Hình ảnh</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} style={{ padding: '8px' }} />
            {uploading && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> Đang upload…</span>}
            {form.images?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {form.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '72px', height: '72px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(248,113,113,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '11px', lineHeight: '18px', textAlign: 'center', padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu…' : editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</button>
            {editingId && <button type="button" onClick={clearForm} className="btn btn-secondary">Hủy sửa</button>}
          </div>
        </form>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead><tr><th style={{ width: '60px' }}>Ảnh</th><th>Tên sản phẩm</th><th>Giá</th><th>Tồn kho</th><th>Danh mục</th><th>Nổi bật</th><th style={{ width: '160px' }}>Hành động</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.images?.length > 0 ? <img src={mediaUrl(p.images[0])} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</td>
                <td>{p.salePrice ? <><span style={{ color: 'var(--danger)', fontWeight: 600 }}>{formatVnd(p.salePrice)}</span> <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatVnd(p.price)}</span></> : formatVnd(p.price)}</td>
                <td><span className={p.stock > 0 ? 'badge badge-success' : 'badge badge-danger'}>{p.stock}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{p.category?.name || '—'}</td>
                <td>{p.featured && <span style={{ color: 'var(--warning)' }}>★</span>}</td>
                <td>
                  <button onClick={() => handleEdit(p)} className="btn btn-secondary btn-sm">Sửa</button>
                  <button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm" style={{ marginLeft: '6px' }}>Xóa</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có sản phẩm nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { orderAPI.getAll().then(res => { setOrders(res.data.data || []); setLoading(false); }); }, []);

  const updateStatus = async (id, status) => {
    await orderAPI.updateStatus(id, { status });
    setOrders(os => os.map(o => o._id === id ? { ...o, status } : o));
  };

  const statusCfg = (s) => ({ pending: { label: 'Chờ xử lý', cls: 'badge-warning' }, processing: { label: 'Đang xử lý', cls: 'badge-info' }, shipped: { label: 'Đã gửi', cls: 'badge-primary' }, delivered: { label: 'Đã giao', cls: 'badge-success' }, cancelled: { label: 'Đã hủy', cls: 'badge-danger' } }[s] || { label: s, cls: 'badge-muted' });

  if (loading) return <div className="loading">Đang tải…</div>;

  return (
    <div className="page">
      <div className="section-header"><h2 className="section-title">Quản lý đơn hàng</h2><span className="badge badge-muted">{orders.length} đơn</span></div>
      {orders.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">🧾</div><h3>Chưa có đơn hàng nào</h3></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Ngày đặt</th><th>Thao tác</th></tr></thead>
            <tbody>
              {orders.map(order => {
                const sc = statusCfg(order.status);
                return (
                  <>
                    <tr key={order._id}>
                      <td style={{ fontFamily: "'Fira Code', monospace", color: 'var(--accent-light)', fontSize: '0.8rem' }}>#{order.orderNumber}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.user?.name || order.shippingAddress?.fullName || '—'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{formatVnd(order.totalAmount)}</td>
                      <td><span className={`badge ${sc.cls}`}>{sc.label}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '4px 8px', fontSize: '0.8125rem', fontFamily: 'var(--font)', cursor: 'pointer' }}>
                          <option value="pending">Chờ xử lý</option><option value="processing">Đang xử lý</option><option value="shipped">Đã gửi</option><option value="delivered">Đã giao</option><option value="cancelled">Đã hủy</option>
                        </select>
                        <button onClick={() => setExpandedId(expandedId === order._id ? null : order._id)} className="btn btn-ghost btn-sm">{expandedId === order._id ? '▲' : '▼'}</button>
                      </td>
                    </tr>
                    {expandedId === order._id && (
                      <tr key={`${order._id}-detail`}>
                        <td colSpan={6} style={{ background: 'var(--bg-surface)', padding: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Địa chỉ giao hàng</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{order.shippingAddress?.fullName} · {order.shippingAddress?.phone}<br />{order.shippingAddress?.address}, {order.shippingAddress?.city}</div>
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Thanh toán</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{order.paymentMethod?.toUpperCase()} · {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '6px' }}>Sản phẩm</div>
                              {order.items?.map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                                  <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                                  <span style={{ fontWeight: 600 }}>{formatVnd(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', isPublished: false, thumbnail: '' });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadBlogs(); }, []);
  const loadBlogs = () => { blogAPI.getAll().then(res => setBlogs(res.data.data || [])); };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('files', file);
      const res = await uploadAPI.uploadMultiple(fd);
      setForm(f => ({ ...f, thumbnail: res.data.urls[0] }));
    } catch (err) { alert(err.response?.data?.message || 'Upload ảnh thất bại'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editingId ? await blogAPI.update(editingId, form) : await blogAPI.create(form);
      setForm({ title: '', content: '', excerpt: '', isPublished: false, thumbnail: '' });
      setEditingId(null);
      loadBlogs();
    } catch (err) { alert(err.response?.data?.message || 'Lưu thất bại'); }
    finally { setSaving(false); }
  };

  const handleEdit = (b) => { setForm({ title: b.title, content: b.content, excerpt: b.excerpt || '', isPublished: b.isPublished, thumbnail: b.thumbnail || '' }); setEditingId(b._id); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = async (id) => { if (confirm('Xóa bài viết này?')) { await blogAPI.delete(id); loadBlogs(); } };

  return (
    <div className="page">
      <div className="section-header"><h2 className="section-title">Quản lý Blog</h2></div>
      <div className="card-flat" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>{editingId ? '✏️ Sửa bài viết' : '➕ Viết bài mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Tiêu đề</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nhập tiêu đề bài viết" required /></div>
          <div className="form-group"><label>Tóm tắt</label><input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Mô tả ngắn hiển thị trên danh sách" /></div>
          <div className="form-group"><label>Nội dung</label><textarea rows="6" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Nội dung bài viết chi tiết…" required /></div>
          <div className="form-group"><label>Ảnh bìa</label>
            <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={uploading} style={{ padding: '8px' }} />
            {uploading && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}> Đang upload…</span>}
            {form.thumbnail && (
              <div style={{ marginTop: '8px', position: 'relative', display: 'inline-block' }}>
                <img src={mediaUrl(form.thumbnail)} alt="" style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                <button type="button" onClick={() => setForm(f => ({ ...f, thumbnail: '' }))} style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--danger)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', lineHeight: '20px', textAlign: 'center', padding: 0 }}>×</button>
              </div>
            )}
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              Xuất bản ngay (hiển thị công khai)
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu…' : editingId ? 'Cập nhật bài viết' : 'Xuất bản bài viết'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', content: '', excerpt: '', isPublished: false, thumbnail: '' }); }} className="btn btn-secondary">Hủy</button>}
          </div>
        </form>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th style={{ width: '80px' }}>Ảnh bìa</th><th>Tiêu đề</th><th style={{ width: '100px' }}>Xuất bản</th><th style={{ width: '80px' }}>Lượt xem</th><th style={{ width: '140px' }}>Hành động</th></tr></thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog._id}>
                <td>{blog.thumbnail ? <img src={mediaUrl(blog.thumbnail)} alt="" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: 'var(--radius-xs)' }} /> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{blog.title}</td>
                <td><span className={`badge ${blog.isPublished ? 'badge-success' : 'badge-muted'}`}>{blog.isPublished ? 'Đã xuất bản' : 'Nháp'}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{blog.viewCount || 0}</td>
                <td>
                  <button onClick={() => handleEdit(blog)} className="btn btn-secondary btn-sm">Sửa</button>
                  <button onClick={() => handleDelete(blog._id)} className="btn btn-danger btn-sm" style={{ marginLeft: '6px' }}>Xóa</button>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có bài viết nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { contactAPI.getAll().then(res => { setContacts(res.data.data || []); setLoading(false); }); }, []);

  const markAsRead = async (id) => { await contactAPI.markAsRead(id); setContacts(cs => cs.map(c => c._id === id ? { ...c, isRead: true } : c)); };
  const handleDelete = async (id) => { if (confirm('Xóa tin nhắn này?')) { await contactAPI.delete(id); setContacts(cs => cs.filter(c => c._id !== id)); } };

  if (loading) return <div className="loading">Đang tải…</div>;

  const unread = contacts.filter(c => !c.isRead).length;

  return (
    <div className="page">
      <div className="section-header">
        <h2 className="section-title">Quản lý liên hệ</h2>
        {unread > 0 && <span className="badge badge-warning">{unread} tin chưa đọc</span>}
      </div>
      {contacts.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📧</div><h3>Chưa có tin nhắn nào</h3></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Người gửi</th><th>Email</th><th>Chủ đề</th><th style={{ width: '100px' }}>Trạng thái</th><th style={{ width: '140px' }}>Ngày gửi</th><th style={{ width: '160px' }}>Hành động</th></tr></thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c._id} style={!c.isRead ? { background: 'rgba(251,191,36,0.04)' } : {}}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.email}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{c.subject}</td>
                  <td><span className={`badge ${c.isRead ? 'badge-muted' : 'badge-warning'}`}>{c.isRead ? 'Đã đọc' : 'Mới'}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(c.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    {!c.isRead && <button onClick={() => markAsRead(c._id)} className="btn btn-secondary btn-sm">Đánh dấu đã đọc</button>}
                    <button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm" style={{ marginLeft: '6px' }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { authAPI.getAllUsers().then(res => { setUsers(res.data.data || []); setLoading(false); }); }, []);

  const handleRoleChange = async (id, role) => {
    await authAPI.updateUser(id, { role });
    setUsers(us => us.map(u => u._id === id ? { ...u, role } : u));
  };
  const handleDelete = async (id) => { if (confirm('Xóa người dùng này?')) { await authAPI.deleteUser(id); setUsers(us => us.filter(u => u._id !== id)); } };

  if (loading) return <div className="loading">Đang tải…</div>;

  return (
    <div className="page">
      <div className="section-header"><h2 className="section-title">Quản lý người dùng</h2><span className="badge badge-muted">{users.length} người dùng</span></div>
      {users.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">👤</div><h3>Chưa có người dùng nào</h3></div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Tên</th><th>Email</th><th style={{ width: '140px' }}>Vai trò</th><th style={{ width: '100px' }}>Trạng thái</th><th style={{ width: '100px' }}>Hành động</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', padding: '4px 8px', fontSize: '0.8125rem', fontFamily: 'var(--font)', cursor: 'pointer' }}>
                      <option value="user">User</option><option value="admin">Admin</option>
                    </select>
                  </td>
                  <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Hoạt động' : 'Bị khóa'}</span></td>
                  <td>
                    <button onClick={() => handleDelete(u._id)} className="btn btn-danger btn-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ClientSettings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        data.sort((a, b) => String(a.group || '').localeCompare(String(b.group || '')) || String(a.key).localeCompare(String(b.key)));
        setItems(data); setError('');
      })
      .catch((err) => { setError(err.response?.data?.message || 'Không tải được cài đặt.'); setItems([]); })
      .finally(() => setLoading(false));
  }, []);

  const groupTitle = (g) => ({ general: 'Thông tin chung', contact: 'Liên hệ', social: 'Mạng xã hội' }[g] || g || 'Khác');
  const groupIcon = (g) => ({ general: '🏢', contact: '📞', social: '📱' }[g] || '⚙️');

  const formatValue = (value) => {
    if (value == null || value === '') return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Chưa cập nhật</span>;
    if (typeof value === 'object') return <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{JSON.stringify(value, null, 2)}</pre>;
    const s = String(value);
    if (/^https?:\/\//i.test(s)) return <a href={s} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-light)', wordBreak: 'break-all' }}>{s}</a>;
    if (/^[\d\s\-\+\(\)]{6,}$/.test(s)) return <a href={`tel:${s}`} style={{ color: 'var(--accent-light)' }}>{s}</a>;
    return s;
  };

  const grouped = items.reduce((acc, s) => {
    const g = s.group || 'general';
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {});
  const groupOrder = ['general', 'contact', 'social'];
  const sortedGroups = [...new Set([...groupOrder, ...Object.keys(grouped)])].filter(g => grouped[g]?.length);

  if (loading) return <div className="loading">Đang tải…</div>;

  return (
    <div className="page" style={{ maxWidth: '800px' }}>
      <div className="section-header">
        <h1 className="section-title">Thông tin cửa hàng</h1>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Thông tin hiển thị do cửa hàng cấu hình. Cần hỗ trợ? <Link to="/contact">Liên hệ ngay</Link>.</p>
      {error && <div className="alert alert-error">{error}</div>}
      {items.length === 0 && !error ? (
        <div className="empty-state"><div className="empty-state-icon">⚙️</div><h3>Không có dữ liệu</h3><p>Admin vào <Link to="/admin/settings">Cài đặt (Admin)</Link> để thêm thông tin.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sortedGroups.map(g => (
            <div key={g} className="card-flat">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.25rem' }}>{groupIcon(g)}</span>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, border: 'none', padding: 0 }}>{groupTitle(g)}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                {grouped[g].map(s => (
                  <div key={s.key}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{s.description || s.key}</div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500, wordBreak: 'break-word' }}>{formatValue(s.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [form, setForm] = useState({ key: '', value: '', group: 'general', description: '' });
  const [editingKey, setEditingKey] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadSettings(); }, []);
  const loadSettings = () => { settingsAPI.get().then(res => setSettings(Array.isArray(res.data?.data) ? res.data.data : [])); };
  const handleSeedDefaults = async () => { try { const res = await settingsAPI.seedDefaults(); setSettings(Array.isArray(res.data?.data) ? res.data.data : []); alert(res.data?.message || 'Đã đồng bộ'); } catch (err) { alert(err.response?.data?.message || 'Thất bại'); } };
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { await settingsAPI.upsert(form); setForm({ key: '', value: '', group: 'general', description: '' }); setEditingKey(null); loadSettings(); } catch (err) { alert(err.response?.data?.message || 'Lưu thất bại'); } finally { setSaving(false); } };
  const handleEdit = (s) => { setForm({ key: s.key, value: typeof s.value === 'object' ? JSON.stringify(s.value) : s.value, group: s.group || 'general', description: s.description || '' }); setEditingKey(s.key); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDelete = async (key) => { if (confirm(`Xóa "${key}"?`)) { await settingsAPI.delete(key); loadSettings(); } };

  return (
    <div className="page">
      <div className="section-header"><h2 className="section-title">Cài đặt website</h2></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-secondary" onClick={handleSeedDefaults}>Thêm key mặc định</button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chỉ tạo key chưa có — không ghi đè dữ liệu hiện tại.</span>
      </div>
      <div className="card-flat" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>{editingKey ? `✏️ Sửa: ${editingKey}` : '➕ Thêm setting mới'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group"><label>Key (khóa)</label><input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required={!editingKey} disabled={!!editingKey} placeholder="Ví dụ: hotline" /></div>
            <div className="form-group"><label>Nhóm</label><select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', width: '100%', fontFamily: 'var(--font)' }}><option value="general">Thông tin chung</option><option value="contact">Liên hệ</option><option value="social">Mạng xã hội</option></select></div>
          </div>
          <div className="form-group"><label>Value (giá trị)</label><textarea rows="3" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Nhập giá trị…" required style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', width: '100%', fontFamily: 'var(--font)', fontSize: '0.9375rem', resize: 'vertical' }} /></div>
          <div className="form-group"><label>Mô tả (hiển thị trên trang công khai)</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ví dụ: Số hotline hỗ trợ" /></div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Đang lưu…' : editingKey ? 'Cập nhật' : 'Tạo mới'}</button>
            {editingKey && <button type="button" onClick={() => { setEditingKey(null); setForm({ key: '', value: '', group: 'general', description: '' }); }} className="btn btn-secondary">Hủy</button>}
          </div>
        </form>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Key</th><th>Value</th><th>Nhóm</th><th>Mô tả</th><th style={{ width: '140px' }}>Hành động</th></tr></thead>
          <tbody>
            {settings.map(s => (
              <tr key={s._id}>
                <td><code>{s.key}</code></td>
                <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{typeof s.value === 'object' ? JSON.stringify(s.value) : String(s.value)}</td>
                <td><span className="badge badge-muted">{s.group}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{s.description || '—'}</td>
                <td>
                  <button onClick={() => handleEdit(s)} className="btn btn-secondary btn-sm">Sửa</button>
                  <button onClick={() => handleDelete(s.key)} className="btn btn-danger btn-sm" style={{ marginLeft: '6px' }}>Xóa</button>
                </td>
              </tr>
            ))}
            {settings.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có setting nào.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
