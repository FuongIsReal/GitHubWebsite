// ===== DỮ LIỆU SẢN PHẨM =====
// Muốn có ảnh thật: thêm image: "images/ten-anh.jpg" vào từng sản phẩm
const products = [
  { id: 1,  name: "Áo thun nam cotton basic form rộng", price: 129000, oldPrice: 199000, category: "quan-ao",  sold: 1200 },
  { id: 2,  name: "Quần jean nữ ống rộng lưng cao",     price: 259000, oldPrice: 350000, category: "quan-ao",  sold: 860 },
  { id: 3,  name: "Váy hoa nhí dáng xòe đi biển",       price: 189000, oldPrice: 290000, category: "quan-ao",  sold: 540 },
  { id: 4,  name: "Áo sơ mi công sở tay dài",           price: 219000, oldPrice: 279000, category: "quan-ao",  sold: 330 },
  { id: 5,  name: "Giày sneaker trắng unisex",          price: 399000, oldPrice: 599000, category: "giay-dep", sold: 2100 },
  { id: 6,  name: "Giày cao gót mũi nhọn 7cm",          price: 289000, oldPrice: 390000, category: "giay-dep", sold: 410 },
  { id: 7,  name: "Dép quai ngang đế êm chống trượt",   price: 79000,  oldPrice: 120000, category: "giay-dep", sold: 3400 },
  { id: 8,  name: "Boot da cổ ngắn phong cách Hàn",     price: 459000, oldPrice: 650000, category: "giay-dep", sold: 220 },
  { id: 9,  name: "Túi xách nữ đeo vai thời trang",     price: 239000, oldPrice: 320000, category: "phu-kien", sold: 780 },
  { id: 10, name: "Mũ lưỡi trai thêu chữ",              price: 69000,  oldPrice: 99000,  category: "phu-kien", sold: 1500 },
  { id: 11, name: "Kính mát chống tia UV",              price: 149000, oldPrice: 250000, category: "phu-kien", sold: 640 },
  { id: 12, name: "Balo laptop chống nước",             price: 329000, oldPrice: 450000, category: "phu-kien", sold: 910 },
];

// ===== GIỎ HÀNG (LƯU BẰNG localStorage) =====
// Giỏ hàng là một mảng: [{ id: 1, qty: 2 }, { id: 5, qty: 1 }]
const CART_KEY = "modashop_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  const total = getCart().reduce((sum, item) => sum + item.qty, 0);
  el.textContent = total;
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  saveCart(cart);
  showToast("Đã thêm vào giỏ hàng!");
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCart();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1200);
}

// ===== BIẾN TRẠNG THÁI (trang chủ) =====
let currentCategory = "all";
let searchText = "";

// ===== LẤY CÁC PHẦN TỬ HTML =====
const productGrid = document.getElementById("productGrid");
const searchForm  = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const categoryBtns = document.querySelectorAll(".category");

// ===== HÀM TIỆN ÍCH =====
function formatPrice(number) {
  return "₫" + number.toLocaleString("vi-VN");
}

// Có ảnh thì hiện ảnh, chưa có thì hiện ô chữ "Ảnh sản phẩm"
function productImage(p) {
  return p.image
    ? `<img src="${p.image}" alt="${p.name}">`
    : `<span class="no-img">Ảnh sản phẩm</span>`;
}

function formatSold(number) {
  return number >= 1000 ? (number / 1000).toFixed(1) + "k" : number;
}

// ===== HIỂN THỊ SẢN PHẨM =====
function renderProducts() {
  if (!productGrid) return; // không phải trang chủ thì bỏ qua
  const list = products.filter(p =>
    (currentCategory === "all" || p.category === currentCategory) &&
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (list.length === 0) {
    productGrid.innerHTML = `<p class="empty">Không tìm thấy sản phẩm nào.</p>`;
    return;
  }

  productGrid.innerHTML = list.map(p => {
    const discount = Math.round((1 - p.price / p.oldPrice) * 100);
    return `
      <div class="product-card">
        <div class="product-img">
          ${productImage(p)}
          <span class="discount">-${discount}%</span>
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div>
            <span class="product-price">${formatPrice(p.price)}</span>
            <span class="old-price">${formatPrice(p.oldPrice)}</span>
          </div>
          <div class="product-meta">
            <span> 4.8</span>
            <span>Đã bán ${formatSold(p.sold)}</span>
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
        </div>
      </div>
    `;
  }).join("");
}

// ===== HIỂN THỊ TRANG GIỎ HÀNG =====
function renderCart() {
  const cartList = document.getElementById("cartList");
  if (!cartList) return; // không phải trang giỏ hàng thì bỏ qua

  const cart = getCart();
  const summary = document.getElementById("cartSummary");

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        <p>Giỏ hàng của bạn đang trống</p>
        <a href="index.html" class="btn-main">Mua sắm ngay</a>
      </div>`;
    summary.style.display = "none";
    return;
  }

  let totalQty = 0;
  let totalPrice = 0;

  cartList.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";
    const lineTotal = p.price * item.qty;
    totalQty += item.qty;
    totalPrice += lineTotal;
    return `
      <div class="cart-row">
        <div class="cart-product">
          <div class="cart-thumb">${productImage(p)}</div>
          <span>${p.name}</span>
        </div>
        <div class="cart-unit">${formatPrice(p.price)}</div>
        <div class="qty-box">
          <button onclick="changeQty(${p.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${p.id}, 1)">+</button>
        </div>
        <div class="cart-line-total">${formatPrice(lineTotal)}</div>
        <button class="remove-btn" onclick="removeFromCart(${p.id})">Xóa</button>
      </div>`;
  }).join("");

  summary.style.display = "flex";
  document.getElementById("totalQty").textContent = totalQty;
  document.getElementById("totalPrice").textContent = formatPrice(totalPrice);
}

function checkout() {
  if (getCart().length === 0) return;
  alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại ModaShop.");
  saveCart([]);
  renderCart();
}

// ===== LỌC THEO DANH MỤC =====
categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    renderProducts();
  });
});

// ===== TÌM KIẾM =====
if (searchForm) {
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    // Đang ở trang khác thì quay về trang chủ kèm từ khóa
    if (!productGrid) {
      location.href = "index.html?q=" + encodeURIComponent(searchInput.value.trim());
      return;
    }
    searchText = searchInput.value.trim();
    renderProducts();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });
}

// Nhận từ khóa tìm kiếm từ trang khác (index.html?q=...)
const urlQuery = new URLSearchParams(location.search).get("q");
if (urlQuery && searchInput) {
  searchText = urlQuery;
  searchInput.value = urlQuery;
}

// Chạy lần đầu khi mở trang
updateCartCount();
renderProducts();
renderCart();
