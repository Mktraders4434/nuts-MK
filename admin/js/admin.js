/**
 * MK SPICEPOD TRADERS - Admin Panel Script
 * Interactive Dashboard, Product Management, Live Chat Inbox & Zero-Data-Loss Customer CRM
 */

// Initial Seed Data
const defaultProducts = [
  { id: 1, name: "Turmeric Powder", category: "Spices", price: "240", priceFormatted: "₹240/kg", stock: "1200", grade: "Grade A Salem", img: "images/products/turmeric-powder.jpg", status: "Active" },
  { id: 2, name: "Red Chilli", category: "Spices", price: "280", priceFormatted: "₹280/kg", stock: "850", grade: "Guntur Sannam", img: "images/products/red-chilli.jpg", status: "Active" },
  { id: 3, name: "Black Pepper", category: "Spices", price: "650", priceFormatted: "₹650/kg", stock: "600", grade: "Tellicherry Bold", img: "images/products/black-pepper.jpg", status: "Active" },
  { id: 4, name: "Coriander Seeds", category: "Spices", price: "160", priceFormatted: "₹160/kg", stock: "1500", grade: "Green Bold", img: "images/products/coriander-seeds.jpg", status: "Active" },
  { id: 5, name: "Raisins", category: "Dry Fruits", price: "320", priceFormatted: "₹320/kg", stock: "900", grade: "Golden Kismis", img: "images/products/raisins.jpg", status: "Active" },
  { id: 6, name: "Dates", category: "Dry Fruits", price: "450", priceFormatted: "₹450/kg", stock: "750", grade: "Medjool & Kimia", img: "images/products/dates.jpg", status: "Active" },
  { id: 7, name: "Apricots", category: "Dry Fruits", price: "580", priceFormatted: "₹580/kg", stock: "400", grade: "Turkish Jumbo", img: "images/products/apricots.jpg", status: "Active" },
  { id: 8, name: "Figs", category: "Dry Fruits", price: "850", priceFormatted: "₹850/kg", stock: "500", grade: "Anjeer Extra Bold", img: "images/products/figs.jpg", status: "Active" },
  { id: 9, name: "Almonds", category: "Nuts", price: "720", priceFormatted: "₹720/kg", stock: "2000", grade: "California Independence", img: "images/products/almonds.jpg", status: "Active" },
  { id: 10, name: "Cashews", category: "Nuts", price: "820", priceFormatted: "₹820/kg", stock: "1400", grade: "W240 King", img: "images/products/cashews.jpg", status: "Active" },
  { id: 11, name: "Pistachios", category: "Nuts", price: "1150", priceFormatted: "₹1,150/kg", stock: "650", grade: "Iranian Salted", img: "images/products/pistachios.jpg", status: "Active" },
  { id: 12, name: "Walnuts", category: "Nuts", price: "950", priceFormatted: "₹950/kg", stock: "450", grade: "Kashmir Extra Light", img: "images/products/walnuts.jpg", status: "Active" },
  { id: 13, name: "Cinnamon", category: "Whole Spices", price: "480", priceFormatted: "₹480/kg", stock: "350", grade: "Ceylon Quills", img: "images/products/cinnamon.jpg", status: "Active" },
  { id: 14, name: "Cardamom", category: "Whole Spices", price: "2600", priceFormatted: "₹2,600/kg", stock: "250", grade: "8mm Bold Green", img: "images/products/cardamom.jpg", status: "Active" },
  { id: 15, name: "Cloves", category: "Whole Spices", price: "950", priceFormatted: "₹950/kg", stock: "300", grade: "Madagascar Handpicked", img: "images/products/cloves.jpg", status: "Active" },
  { id: 16, name: "Star Anise", category: "Whole Spices", price: "780", priceFormatted: "₹780/kg", stock: "220", grade: "Whole Star Autumn", img: "images/products/star-anise.jpg", status: "Active" }
];

const defaultOrders = [
  { id: "MK-ORD-20261006-8942", order_number: "MK-ORD-20261006-8942", customer: "Ramesh Traders", customer_name: "Ramesh Traders", customer_phone: "9843112233", customer_email: "ramesh@traders.com", customer_city: "Chennai", delivery_address: "No. 45 Wholesale Market Road, Koyambedu, Chennai", product: "California Almonds", product_name: "California Almonds", quantity: "200 kg", quantity_kg: 200, unit_price: 720, amount: "₹1,44,000", total_amount: 144000, payment_mode: "Bank Transfer (NEFT / RTGS)", transaction_id: "HDFC98210384910", payment_proof_url: "images/products/almonds.jpg", payment_status: "Payment Received", order_status: "Confirmed", status: "Confirmed", date: "2026-10-06", created_at: "2026-10-06 10:20:00" },
  { id: "MK-ORD-20261006-8941", order_number: "MK-ORD-20261006-8941", customer: "Sri Balaji Store", customer_name: "Sri Balaji Store", customer_phone: "9843223344", customer_email: "balaji@store.com", customer_city: "Madurai", delivery_address: "12 South Masi Street, Madurai", product: "Turmeric Powder", product_name: "Turmeric Powder", quantity: "500 kg", quantity_kg: 500, unit_price: 240, amount: "₹1,20,000", total_amount: 120000, payment_mode: "UPI (GPay / PhonePe / Paytm)", transaction_id: "428910382910", payment_proof_url: "images/products/turmeric-powder.jpg", payment_status: "Pending Verification", order_status: "Pending", status: "Pending", date: "2026-10-06", created_at: "2026-10-06 09:45:00" },
  { id: "MK-ORD-20261005-7832", order_number: "MK-ORD-20261005-7832", customer: "Elite Foods", customer_name: "Elite Foods", customer_phone: "9843334455", customer_email: "orders@elitefoods.com", customer_city: "Coimbatore", delivery_address: "88 Avinashi Road, Coimbatore", product: "Cashews", product_name: "Cashews", quantity: "150 kg", quantity_kg: 150, unit_price: 820, amount: "₹1,23,000", total_amount: 123000, payment_mode: "Bank Transfer (NEFT / RTGS)", transaction_id: "SBIN0048291038", payment_proof_url: "images/products/cashews.jpg", payment_status: "Payment Received", order_status: "Shipped", status: "Shipped", date: "2026-10-05", created_at: "2026-10-05 15:30:00" },
  { id: "MK-ORD-20261004-6721", order_number: "MK-ORD-20261004-6721", customer: "Kumar & Co", customer_name: "Kumar & Co", customer_phone: "9843445566", customer_email: "kumar@co.in", customer_city: "Salem", delivery_address: "54 Junction Main Road, Salem", product: "Red Chilli", product_name: "Red Chilli", quantity: "300 kg", quantity_kg: 300, unit_price: 280, amount: "₹84,000", total_amount: 84000, payment_mode: "UPI (GPay / PhonePe / Paytm)", transaction_id: "UPI-4289901234", payment_proof_url: "images/products/red-chilli.jpg", payment_status: "Payment Received", order_status: "Delivered", status: "Delivered", date: "2026-10-04", created_at: "2026-10-04 11:15:00" },
  { id: "MK-ORD-20261003-5610", order_number: "MK-ORD-20261003-5610", customer: "Johnson Mart", customer_name: "Johnson Mart", customer_phone: "9843556677", customer_email: "johnson@mart.com", customer_city: "Bengaluru", delivery_address: "Commercial Street, Bengaluru", product: "Cardamom", product_name: "Cardamom", quantity: "25 kg", quantity_kg: 25, unit_price: 2600, amount: "₹65,000", total_amount: 65000, payment_mode: "IMPS Immediate Transfer", transaction_id: "IMPS8920194820", payment_proof_url: "images/products/cardamom.jpg", payment_status: "Payment Received", order_status: "Confirmed", status: "Confirmed", date: "2026-10-03", created_at: "2026-10-03 14:00:00" }
];

const defaultCustomers = [
  { id: "cust_1", name: "Ramesh Traders", phone: "9843112233", email: "ramesh@traders.com", city: "Chennai", orders: 6, spent: "₹8,40,000", last_active: "2025-06-12 10:20:00" },
  { id: "cust_2", name: "Sri Balaji Store", phone: "9843223344", email: "balaji@store.com", city: "Madurai", orders: 12, spent: "₹14,50,000", last_active: "2025-06-11 11:35:00" },
  { id: "cust_3", name: "Elite Foods", phone: "9843334455", email: "orders@elitefoods.com", city: "Coimbatore", orders: 8, spent: "₹11,20,000", last_active: "2025-06-10 18:22:00" },
  { id: "cust_4", name: "Kumar & Co", phone: "9843445566", email: "kumar@co.in", city: "Salem", orders: 4, spent: "₹4,80,000", last_active: "2025-06-09 12:05:00" },
  { id: "cust_5", name: "Johnson Mart", phone: "9843556677", email: "johnson@mart.com", city: "Bengaluru", orders: 9, spent: "₹13,90,000", last_active: "2025-06-08 17:30:00" }
];

const defaultEnquiries = [
  { id: 1, name: "Kavitha Provisions", phone: "9843998877", email: "kavitha@provisions.com", product: "Cardamom & Cashews", quantity: "100 kg", message: "Need bulk wholesale quote for upcoming wedding season.", date: "2025-06-12" },
  { id: 2, name: "Metro Spice Mill", phone: "9843887766", email: "metro@spicemill.com", product: "Turmeric Powder Grade A", quantity: "2 Tons", message: "Export quality certificate needed with quotation.", date: "2025-06-11" },
  { id: 3, name: "Sunrise Bakery", phone: "9843776655", email: "sunrise@bakery.com", product: "Almonds & Raisins", quantity: "300 kg", message: "Monthly recurring order requirement.", date: "2025-06-10" },
  { id: 4, name: "Deepak Wholesale", phone: "9843665544", email: "deepak@wholesale.com", product: "Red Chilli Guntur", quantity: "500 kg", message: "Immediate delivery required to Tirupur warehouse.", date: "2025-06-09" }
];

const defaultInvoices = [
  {
    id: "inv_1",
    doc_type: "quotation",
    doc_number: "MK-QT-2025-001",
    customer_id: "cust_1",
    customer_name: "Ramesh Traders",
    customer_phone: "9843112233",
    customer_email: "ramesh@traders.com",
    customer_gstin: "33AABCR1234F1Z1",
    customer_city: "Chennai",
    billing_address: "No. 45 Wholesale Market Road, Koyambedu, Chennai - 600107",
    doc_date: "2025-06-12",
    due_date: "2025-06-19",
    payment_terms: "100% Advance before Dispatch",
    delivery_terms: "SafeXpress / VRL Logistics Door Delivery",
    items_json: JSON.stringify([
      { product: "California Almonds", grade: "California Independence Bold", qty: 200, rate: 720, gst_rate: 5, amount: 144000 },
      { product: "W240 King Cashews", grade: "W240 King Jumbo", qty: 50, rate: 820, gst_rate: 5, amount: 41000 }
    ]),
    subtotal: 185000,
    discount: 2000,
    gst_amount: 9150,
    freight: 1200,
    grand_total: 193350,
    notes: "Wholesale bulk rates valid for 7 days. Export lab moisture certified packaging.",
    bank_details: "Bank: INDIAN BANK\nA/C Name: SRI MK SPICEPOD TRADERS\nA/C No: 8391488082\nIFSC: IDBI000A235\nBranch: AVINASHI ROAD\nUPI ID: 9843672274@upi",
    status: "Sent",
    created_at: "2025-06-12 10:30:00",
    updated_at: "2025-06-12 10:30:00"
  },
  {
    id: "inv_2",
    doc_type: "invoice",
    doc_number: "MK-INV-2025-101",
    customer_id: "cust_2",
    customer_name: "Sri Balaji Store",
    customer_phone: "9843223344",
    customer_email: "balaji@store.com",
    customer_gstin: "33AABCS5678G1Z2",
    customer_city: "Madurai",
    billing_address: "12 South Masi Street, Madurai - 625001",
    doc_date: "2025-06-11",
    due_date: "2025-06-18",
    payment_terms: "NEFT / RTGS Transfer Received",
    delivery_terms: "Private Transport Goods Carrier",
    items_json: JSON.stringify([
      { product: "Salem Turmeric Powder", grade: "Grade A High Curcumin", qty: 500, rate: 240, gst_rate: 5, amount: 120000 },
      { product: "Tellicherry Black Pepper", grade: "Tellicherry Bold 550g/l", qty: 80, rate: 650, gst_rate: 5, amount: 52000 }
    ]),
    subtotal: 172000,
    discount: 1500,
    gst_amount: 8525,
    freight: 1500,
    grand_total: 180525,
    notes: "Goods dispatched via LR #88492. All taxes included as per GST rules.",
    bank_details: "Bank: INDIAN BANK\nA/C Name: SRI MK SPICEPOD TRADERS\nA/C No: 8391488082\nIFSC: IDBI000A235\nBranch: AVINASHI ROAD\nUPI ID: 9843672274@upi",
    status: "Paid",
    created_at: "2025-06-11 11:45:00",
    updated_at: "2025-06-11 11:45:00"
  }
];

const defaultChats = [
  { id: "chat_1", customer_id: "cust_1", sender: "customer", sender_name: "Ramesh Traders", message: "Hello MK Traders, what is today's bulk rate for California Almonds 200kg?", timestamp: "2025-06-12 10:15:00", is_read: 1 },
  { id: "chat_2", customer_id: "cust_1", sender: "admin", sender_name: "MK Spicepod Support", message: "Hello Mr. Ramesh! Today's rate for California Almonds is ₹720/kg for orders above 100kg. Free shipping to Chennai included.", timestamp: "2025-06-12 10:18:00", is_read: 1 },
  { id: "chat_3", customer_id: "cust_1", sender: "customer", sender_name: "Ramesh Traders", message: "Great! Please book 200kg. Dispatch invoice on WhatsApp.", timestamp: "2025-06-12 10:20:00", is_read: 1 },
  { id: "chat_4", customer_id: "cust_2", sender: "customer", sender_name: "Sri Balaji Store", message: "Do you have Salem Grade A Turmeric Powder in 50kg gunny bags?", timestamp: "2025-06-11 11:30:00", is_read: 1 },
  { id: "chat_5", customer_id: "cust_2", sender: "admin", sender_name: "MK Spicepod Support", message: "Yes sir, ready stock available with export lab certification. Rate is ₹240/kg.", timestamp: "2025-06-11 11:35:00", is_read: 1 }
];

// Resilient LocalStorage Helper to prevent QuotaExceededError on mobile/desktop
function safeSetItem(key, value) {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (err) {
    console.warn(`[Admin Storage] Quota notice for ${key}, optimizing storage:`, err);
    try {
      if (key === 'mk_admin_orders' || key === 'mk_admin_all_chats') {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (Array.isArray(parsed)) {
          // Sanitize out any bulky multi-MB base64 images to prevent quota crash
          const sanitized = parsed.map(item => {
            const clone = Object.assign({}, item);
            if (clone.payment_proof_url && clone.payment_proof_url.startsWith('data:image') && clone.payment_proof_url.length > 50000) {
              clone.payment_proof_url = 'images/products/turmeric-powder.jpg';
            }
            if (clone.image_url && clone.image_url.startsWith('data:image') && clone.image_url.length > 50000) {
              clone.image_url = 'images/products/turmeric-powder.jpg';
            }
            return clone;
          });
          localStorage.setItem(key, JSON.stringify(sanitized.slice(0, 60)));
        }
      }
    } catch (e2) {
      console.warn('[Admin Storage] Safe fallback storage note:', e2);
    }
  }
}

// App State Management
let products = [];
let orders = [];
let customers = [];
let enquiries = [];
let invoices = [];
let allChats = [];

try { products = JSON.parse(localStorage.getItem('mk_admin_products')) || defaultProducts; } catch(e) { products = defaultProducts; }
try { orders = JSON.parse(localStorage.getItem('mk_admin_orders')) || defaultOrders; } catch(e) { orders = defaultOrders; }
try { customers = JSON.parse(localStorage.getItem('mk_admin_customers')) || defaultCustomers; } catch(e) { customers = defaultCustomers; }
try { enquiries = JSON.parse(localStorage.getItem('mk_admin_enquiries')) || defaultEnquiries; } catch(e) { enquiries = defaultEnquiries; }
try { invoices = JSON.parse(localStorage.getItem('mk_admin_invoices')) || defaultInvoices; } catch(e) { invoices = defaultInvoices; }
try { allChats = JSON.parse(localStorage.getItem('mk_admin_all_chats')) || defaultChats; } catch(e) { allChats = defaultChats; }

// Initial Sanitize: Strip any bulky legacy base64 strings currently in memory to free quota immediately
if (Array.isArray(orders)) {
  orders.forEach(o => {
    if (o.payment_proof_url && o.payment_proof_url.startsWith('data:image') && o.payment_proof_url.length > 50000) {
      o.payment_proof_url = 'images/products/turmeric-powder.jpg';
    }
  });
}
if (Array.isArray(allChats)) {
  allChats.forEach(m => {
    if (m.image_url && m.image_url.startsWith('data:image') && m.image_url.length > 50000) {
      m.image_url = 'images/products/turmeric-powder.jpg';
    }
  });
}

const defaultAutoConfig = {
  teaserText: "👋 Need Wholesale Rates? Chat with us",
  welcomeMsg1: "Namaste! 🙏 Welcome to **SRI MK SPICEPOD TRADERS** – Wholesale Supplier of Premium Spices, Dry Fruits & Nuts.",
  welcomeMsg2: "How can we help your business today? You can select a quick topic below or type your requirement:",
  ratecardReply: "📊 **SRI MK SPICEPOD Daily Wholesale Rates (Indicative Bulk Rates/kg):**\n• Turmeric Salem Grade A: ₹240/kg\n• Red Chilli Guntur Sannam: ₹280/kg\n• Tellicherry Black Pepper: ₹650/kg\n• California Almonds: ₹720/kg\n• W240 King Cashews: ₹820/kg\n• Iranian Salted Pistachios: ₹1,150/kg\n• Green Cardamom 8mm: ₹2,600/kg\n\nFor bulk orders above 500kg, special discounted rates apply. Would you like a formal proforma quotation?",
  spicesReply: "🌶️ **Bulk Spices Supply:**\nWe supply standard 25kg / 50kg gunny bags with moisture-proof liner and food-grade lab certification. Please specify your required quantity (e.g. 200kg, 1 Ton) and destination city for freight estimation.",
  nutsReply: "🥜 **Nuts & Dry Fruits:**\nWe offer vacuum-packed 10kg & 20kg wholesale cartons of California Almonds, W240/W320 Cashews, Jumbo Pistachios, Afghan Figs, and Medjool Dates. Ready dispatch available across India.",
  deliveryReply: "🚚 **MOQ & Delivery Info:**\n• Minimum Order: 25 kg per item (or 100 kg mixed wholesale consignment).\n• Delivery: Dispatch within 24 hours via reputed transport / VRL / SafeXpress.\n• Payment: Bank Transfer (NEFT/RTGS/IMPS), UPI & Cash on Dispatch.",
  enableSmartBot: true
};
let autoConfig = defaultAutoConfig;
try {
  autoConfig = JSON.parse(localStorage.getItem('mk_chat_auto_config')) || defaultAutoConfig;
} catch(e) {
  autoConfig = defaultAutoConfig;
}

let activeChatCustomerId = null;
let broadcastChannel = null;

// Global Image Upload Variables
let newProductImageData = "images/products/turmeric-powder.jpg";
let editProductImageData = "";

function saveState() {
  safeSetItem('mk_admin_products', products);
  safeSetItem('mk_admin_orders', orders);
  safeSetItem('mk_admin_customers', customers);
  safeSetItem('mk_admin_enquiries', enquiries);
  safeSetItem('mk_admin_invoices', invoices);
  safeSetItem('mk_admin_all_chats', allChats);
  safeSetItem('mk_chat_auto_config', autoConfig);
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initNavigation();
  renderDashboard();
  renderProductsTable();
  renderOrdersTable();
  renderInvoicesTable();
  renderCustomersTable();
  renderEnquiriesTable();
  renderCategoriesTable();
  initSalesChart();
  initImageUploadHandlers();
  initForms();
  initAdminLiveChat();
  loadAutoConfig();
  loadSettings();
  fetchDataFromBackend();
});

// 1. Navigation & Tab Switching
function initNavigation() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabSections = document.querySelectorAll('.admin-tab-section');
  const pageTitle = document.getElementById('pageTitle');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');

  // Create backdrop if not existing
  let backdrop = document.querySelector('.admin-sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'admin-sidebar-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', () => {
      if (sidebar) sidebar.classList.remove('open');
      backdrop.classList.remove('active');
    });
  }

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');

      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      tabSections.forEach(sec => sec.classList.remove('active'));
      const activeSec = document.getElementById(`tab-${targetTab}`);
      if (activeSec) activeSec.classList.add('active');

      if (pageTitle) {
        const textSpan = link.querySelector('span:not(.badge-count)');
        pageTitle.textContent = textSpan ? textSpan.textContent.trim() : link.innerText.trim();
      }

      if (targetTab === 'chat') {
        renderAdminChatInbox();
      } else if (targetTab === 'customers') {
        renderCustomersTable();
      } else if (targetTab === 'invoices') {
        renderInvoicesTable();
      } else if (targetTab === 'settings') {
        loadSettings();
      }

      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
      }
    });
  });

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
      if (backdrop) backdrop.classList.toggle('active', sidebar.classList.contains('open'));
    });
  }
}

// 2. Render Dashboard Overview
function renderDashboard() {
  const statProducts = document.getElementById('statProducts');
  const statOrders = document.getElementById('statOrders');
  const statCustomers = document.getElementById('statCustomers');
  const statEnquiries = document.getElementById('statEnquiries');

  if (statProducts) statProducts.textContent = products.length.toString();
  if (statOrders) statOrders.textContent = orders.length.toString();
  if (statCustomers) statCustomers.textContent = customers.length.toString();
  if (statEnquiries) statEnquiries.textContent = enquiries.length.toString();

  const prodBadge = document.querySelector('.sidebar-link[data-tab="products"] .badge-count');
  if (prodBadge) prodBadge.textContent = products.length.toString();

  const recentOrdersTbody = document.getElementById('recentOrdersTbody');
  if (recentOrdersTbody) {
    const top5Orders = orders.slice(0, 5);
    recentOrdersTbody.innerHTML = top5Orders.map(order => {
      const ordNum = order.order_number || (typeof order.id === 'string' && order.id.startsWith('MK') ? order.id : `#${order.id || 1}`);
      const cust = order.customer_name || order.customer || 'Customer';
      const prod = order.product_name || order.product || 'Wholesale Goods';
      const status = order.order_status || order.status || 'Pending';
      const date = order.created_at ? order.created_at.split('T')[0].split(' ')[0] : (order.date || '2026-10-06');
      return `
        <tr>
          <td style="font-weight:700; color:#0b4328; font-size:0.85rem;">${ordNum}</td>
          <td style="font-weight:700;">${cust}</td>
          <td>${prod}</td>
          <td><span class="badge-status status-${status.toLowerCase()}">${status}</span></td>
          <td style="font-size:0.82rem; color:#64748b;">${date}</td>
        </tr>
      `;
    }).join('');
  }
}

// 3. Render Full Products Table
let currentProductSearchTerm = '';
let currentProductCategoryFilter = 'All';

window.filterProductsSearch = function(searchTerm) {
  currentProductSearchTerm = (searchTerm || '').toLowerCase().trim();
  applyProductFilters();
};

window.filterProductsCategory = function(category) {
  currentProductCategoryFilter = category || 'All';
  applyProductFilters();
};

function applyProductFilters() {
  let filtered = products;
  if (currentProductCategoryFilter && currentProductCategoryFilter !== 'All') {
    filtered = filtered.filter(p => (p.category || '') === currentProductCategoryFilter);
  }
  if (currentProductSearchTerm) {
    filtered = filtered.filter(p => 
      (p.name || '').toLowerCase().includes(currentProductSearchTerm) ||
      (p.grade || '').toLowerCase().includes(currentProductSearchTerm) ||
      (p.category || '').toLowerCase().includes(currentProductSearchTerm)
    );
  }
  renderProductsTable(filtered);
}

function renderProductsTable(filteredList = null) {
  const tbody = document.getElementById('productsTableTbody');
  if (!tbody) return;

  const listToRender = filteredList || products;

  if (listToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">No products found matching filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = listToRender.map((prod, idx) => `
    <tr>
      <td style="font-weight:700; color:#64748b;" title="${prod.id}">#${idx + 1}</td>
      <td>
        <div style="position:relative; width:48px; height:48px; border-radius:8px; overflow:hidden; border:1px solid #e2e8f0; background:#f8fafc;">
          <img src="${prod.img}" alt="${prod.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/products/turmeric-powder.jpg'">
        </div>
      </td>
      <td><strong>${prod.name}</strong><br><small style="color:#64748b;">${prod.grade || 'Standard Grade'}</small></td>
      <td><span class="badge-status status-confirmed" style="background:#edf7f0; color:#166534;">${prod.category}</span></td>
      <td style="font-weight:700; color:#0b4328;">₹${prod.price}/kg</td>
      <td>${prod.stock} kg</td>
      <td><span class="badge-status status-confirmed">${prod.status || 'Active'}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-action-icon btn-edit" title="Edit Product & Image" onclick="openEditProductModal('${prod.id}')">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn-action-icon btn-delete" title="Delete Product" onclick="deleteProduct('${prod.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 4. Client-side Image Compression & Upload Handler
function compressAndReadImage(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 800;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      callback(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function initImageUploadHandlers() {
  const newImgInput = document.getElementById('newProdImageInput');
  const newImgPreview = document.getElementById('newProdImagePreview');

  if (newImgInput) {
    newImgInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        compressAndReadImage(file, (dataUrl) => {
          newProductImageData = dataUrl;
          if (newImgPreview) {
            newImgPreview.src = dataUrl;
            newImgPreview.style.display = 'block';
          }
        });

        // Supabase Storage direct upload
        if (window.MKSupabase && window.MKSupabase.Storage) {
          try {
            const { data, error } = await window.MKSupabase.Storage.uploadImage(file, 'product-images', 'products');
            if (data && data.publicUrl) {
              newProductImageData = data.publicUrl;
              showToast("Image uploaded to Supabase Storage!");
            }
          } catch (err) {
            console.warn('Storage upload error:', err);
          }
        }
      }
    });
  }

  const editImgInput = document.getElementById('editProdImageInput');
  const editImgPreview = document.getElementById('editProdImagePreview');

  if (editImgInput) {
    editImgInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        compressAndReadImage(file, (dataUrl) => {
          editProductImageData = dataUrl;
          if (editImgPreview) {
            editImgPreview.src = dataUrl;
            editImgPreview.style.display = 'block';
          }
        });

        // Supabase Storage direct upload
        if (window.MKSupabase && window.MKSupabase.Storage) {
          try {
            const { data, error } = await window.MKSupabase.Storage.uploadImage(file, 'product-images', 'products');
            if (data && data.publicUrl) {
              editProductImageData = data.publicUrl;
              showToast("New image uploaded to Supabase Storage!");
            }
          } catch (err) {
            console.warn('Storage upload error:', err);
          }
        }
      }
    });
  }
}

// 5. Initialize Forms
function initForms() {
  const addProductForm = document.getElementById('addProductForm');
  if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('newProdName').value.trim();
      const category = document.getElementById('newProdCategory').value;
      const price = document.getElementById('newProdPrice').value.trim();
      const stock = document.getElementById('newProdStock').value.trim();
      const grade = document.getElementById('newProdGrade').value.trim();
      const hsnCode = document.getElementById('newProdHSN')?.value.trim() || detectHSNCode(name);

      let finalImg = newProductImageData;
      if (!finalImg || finalImg === "") {
        if (category === "Spices") finalImg = "images/products/turmeric-powder.jpg";
        else if (category === "Dry Fruits") finalImg = "images/products/raisins.jpg";
        else if (category === "Nuts") finalImg = "images/products/almonds.jpg";
        else finalImg = "images/products/cinnamon.jpg";
      }

      const nextId = products.length > 0 ? (typeof products[0].id === 'number' ? Math.max(...products.filter(p => typeof p.id === 'number').map(p => p.id), 0) + 1 : Date.now()) : 1;
      const newProduct = {
        id: nextId,
        name,
        category,
        price,
        priceFormatted: `₹${price}/kg`,
        stock,
        grade,
        hsn_code: hsnCode,
        img: finalImg,
        status: 'Active'
      };

      products.unshift(newProduct);
      saveState();
      renderProductsTable();
      renderDashboard();
      closeModal('addProductModal');
      showToast(`Product "${name}" (HSN: ${hsnCode}) added successfully!`);
      addProductForm.reset();
      newProductImageData = "images/products/turmeric-powder.jpg";
      const preview = document.getElementById('newProdImagePreview');
      if (preview) preview.src = newProductImageData;

      // 1. Supabase PostgreSQL Upsert
      if (window.MKSupabase && window.MKSupabase.Products) {
        try {
          const { data: supaProd } = await window.MKSupabase.Products.upsert({
            name,
            category,
            price: Number(price) || 0,
            stock_kg: Number(stock) || 0,
            grade,
            image_url: finalImg,
            status: 'Active'
          });
          if (supaProd && supaProd.id) {
            newProduct.id = supaProd.id;
            saveState();
          }
        } catch (err) {
          console.warn('Supabase product add error:', err);
        }
      }

      // 2. Fallback REST API
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      }).catch(() => {});
    });
  }

  const editProductForm = document.getElementById('editProductForm');
  if (editProductForm) {
    editProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idRaw = document.getElementById('editProdId').value;
      const id = isNaN(Number(idRaw)) ? idRaw : parseInt(idRaw, 10);
      const name = document.getElementById('editProdName').value.trim();
      const category = document.getElementById('editProdCategory').value;
      const price = document.getElementById('editProdPrice').value.trim();
      const stock = document.getElementById('editProdStock').value.trim();
      const grade = document.getElementById('editProdGrade').value.trim();
      const hsnCode = document.getElementById('editProdHSN')?.value.trim() || detectHSNCode(name);
      const status = document.getElementById('editProdStatus').value;

      const prodIndex = products.findIndex(p => String(p.id) === String(id));
      if (prodIndex !== -1) {
        products[prodIndex].name = name;
        products[prodIndex].category = category;
        products[prodIndex].price = price;
        products[prodIndex].priceFormatted = `₹${price}/kg`;
        products[prodIndex].stock = stock;
        products[prodIndex].grade = grade;
        products[prodIndex].hsn_code = hsnCode;
        products[prodIndex].status = status;

        if (editProductImageData && editProductImageData !== "") {
          products[prodIndex].img = editProductImageData;
        }

        saveState();
        renderProductsTable();
        renderDashboard();
        closeModal('editProductModal');
        showToast(`Product "${name}" (HSN: ${hsnCode}) updated successfully!`);

        // 1. Supabase PostgreSQL Upsert
        if (window.MKSupabase && window.MKSupabase.Products) {
          try {
            await window.MKSupabase.Products.upsert({
              id: (typeof id === 'string' && id.length > 10) ? id : undefined,
              name,
              category,
              price: Number(price) || 0,
              stock_kg: Number(stock) || 0,
              grade,
              image_url: products[prodIndex].img,
              status
            });
          } catch (err) {
            console.warn('Supabase product edit error:', err);
          }
        }

        // 2. Fallback REST API
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(products[prodIndex])
        }).catch(() => {});
      }
    });
  }
}

// 6. Open Edit Modal
window.openEditProductModal = function(id) {
  const prod = products.find(p => String(p.id) === String(id));
  if (!prod) return;

  document.getElementById('editProdId').value = prod.id;
  document.getElementById('editProdName').value = prod.name;
  document.getElementById('editProdCategory').value = prod.category;
  document.getElementById('editProdPrice').value = prod.price;
  document.getElementById('editProdStock').value = prod.stock;
  document.getElementById('editProdGrade').value = prod.grade || '';
  const editHsnEl = document.getElementById('editProdHSN');
  if (editHsnEl) {
    editHsnEl.value = prod.hsn_code || detectHSNCode(prod.name);
  }
  document.getElementById('editProdStatus').value = prod.status || 'Active';

  editProductImageData = prod.img;
  const preview = document.getElementById('editProdImagePreview');
  if (preview) {
    preview.src = prod.img;
    preview.style.display = 'block';
  }

  openModal('editProductModal');
};

// Delete Product
window.deleteProduct = async function(id) {
  const prod = products.find(p => String(p.id) === String(id));
  const prodName = prod ? prod.name : 'Product';

  if (!confirm(`Are you sure you want to delete "${prodName}" permanently?`)) return;

  // 1. Remove from local array
  products = products.filter(p => String(p.id) !== String(id));
  saveState();
  renderProductsTable();
  renderCategoriesTable();
  renderDashboard();

  // 2. Delete from Supabase PostgreSQL Database
  if (window.MKSupabase && window.MKSupabase.Products) {
    try {
      const { error } = await window.MKSupabase.Products.delete(String(id));
      if (error) {
        console.warn('Supabase product delete warning:', error);
      }
    } catch (err) {
      console.warn('Supabase product delete error:', err);
    }
  }

  // 3. Fallback REST API
  fetch('/api/products/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  }).catch(() => {});

  showToast(`Product "${prodName}" deleted successfully.`);
};

// =========================================================================
// 7. WHOLESALE ORDERS & PAYMENT VERIFICATION CRM
// (ஆர்டர்கள் மற்றும் கட்டண சரிபார்ப்பு மேலாண்மை)
// =========================================================================

let currentOrdersSearchTerm = '';
let currentOrdersPaymentFilter = 'All';
let currentOrdersDeliveryFilter = 'All';
let activeViewingProofOrderId = null;

window.filterOrdersSearch = function(searchTerm) {
  currentOrdersSearchTerm = (searchTerm || '').toLowerCase().trim();
  renderOrdersTable();
};

window.filterOrdersPaymentStatus = function(status) {
  currentOrdersPaymentFilter = status;
  renderOrdersTable();
};

window.filterOrdersDeliveryStatus = function(status) {
  currentOrdersDeliveryFilter = status;
  renderOrdersTable();
};

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableTbody');
  if (!tbody) return;

  // 1. Calculate Summary Stats
  const statCount = document.getElementById('statOrdersCount');
  const statPending = document.getElementById('statOrdersPendingVerify');
  const statPaid = document.getElementById('statOrdersPaidCount');
  const statRev = document.getElementById('statOrdersRevenue');
  const dashStat = document.getElementById('statOrders');

  const totalOrders = orders.length;
  const pendingVerifyCount = orders.filter(o => (o.payment_status || 'Pending Verification') === 'Pending Verification').length;
  const approvedCount = orders.filter(o => o.payment_status === 'Payment Received').length;
  
  const totalRevenueVal = orders.reduce((sum, o) => {
    if (o.payment_status === 'Payment Received') {
      const num = typeof o.total_amount === 'number' ? o.total_amount : parseFloat(String(o.amount || '0').replace(/[^\d.]/g, '')) || 0;
      return sum + num;
    }
    return sum;
  }, 0);

  if (statCount) statCount.textContent = totalOrders;
  if (statPending) statPending.textContent = pendingVerifyCount;
  if (statPaid) statPaid.textContent = approvedCount;
  if (statRev) statRev.textContent = `₹${totalRevenueVal.toLocaleString('en-IN')}`;
  if (dashStat) dashStat.textContent = totalOrders;

  // 2. Filter Orders
  let filtered = [...orders];

  if (currentOrdersSearchTerm) {
    filtered = filtered.filter(o => {
      const orderNum = String(o.order_number || o.id || '').toLowerCase();
      const cust = String(o.customer_name || o.customer || '').toLowerCase();
      const phone = String(o.customer_phone || '').toLowerCase();
      const gst = String(o.customer_gst || o.customer_gstin || o.gst || '').toLowerCase();
      const utr = String(o.transaction_id || '').toLowerCase();
      const prod = String(o.product_name || o.product || '').toLowerCase();
      const city = String(o.customer_city || '').toLowerCase();
      const notes = String(o.notes || '').toLowerCase();
      return orderNum.includes(currentOrdersSearchTerm) ||
             cust.includes(currentOrdersSearchTerm) ||
             phone.includes(currentOrdersSearchTerm) ||
             gst.includes(currentOrdersSearchTerm) ||
             notes.includes(currentOrdersSearchTerm) ||
             utr.includes(currentOrdersSearchTerm) ||
             prod.includes(currentOrdersSearchTerm) ||
             city.includes(currentOrdersSearchTerm);
    });
  }

  if (currentOrdersPaymentFilter !== 'All') {
    filtered = filtered.filter(o => (o.payment_status || 'Pending Verification') === currentOrdersPaymentFilter);
  }

  if (currentOrdersDeliveryFilter !== 'All') {
    filtered = filtered.filter(o => (o.order_status || o.status || 'Pending') === currentOrdersDeliveryFilter);
  }

  // Sort by created_at / date descending (newest order first)
  filtered.sort((a, b) => {
    const timeA = new Date(a.created_at || a.order_date || a.date || 0).getTime();
    const timeB = new Date(b.created_at || b.order_date || b.date || 0).getTime();
    return timeB - timeA;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:#94a3b8;">
          <i class="fas fa-inbox" style="font-size:2rem; margin-bottom:8px; display:block;"></i>
          No wholesale orders found matching criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(ord => {
    const orderId = ord.order_number || ord.id;
    const custName = ord.customer_name || ord.customer || 'Customer';
    const custPhone = ord.customer_phone || '';
    const custCity = ord.customer_city || '';
    const custAddr = ord.delivery_address || ord.notes || '';
    let custGST = ord.customer_gst || ord.customer_gstin || ord.gst || '';
    if (!custGST && ord.notes && ord.notes.includes('GSTIN:')) {
      const match = ord.notes.match(/GSTIN:\s*([A-Z0-9]+)/i);
      if (match) custGST = match[1];
    }
    const prodName = ord.product_name || ord.product || 'Wholesale Goods';
    const qty = ord.quantity_kg ? `${ord.quantity_kg} kg` : (ord.quantity || '50 kg');
    const rawAmt = ord.total_amount ? `₹${Number(ord.total_amount).toLocaleString('en-IN')}` : (ord.amount || '₹0');
    const paymentMode = ord.payment_mode || 'UPI Transfer';
    const utr = ord.transaction_id || 'N/A';
    const proofUrl = ord.payment_proof_url || '';
    const payStatus = ord.payment_status || 'Pending Verification';
    const orderStatus = ord.order_status || ord.status || 'Pending';
    const dateStr = ord.created_at ? ord.created_at.split(' ')[0] : (ord.date || '2026-10-06');

    // Payment Status Badge (Directly tappable on mobile & desktop to open payment proof)
    let payStatusBadge = '';
    if (payStatus === 'Payment Received') {
      payStatusBadge = `<span class="badge-status" style="cursor:pointer; background:#d1fae5; color:#065f46; font-weight:700; border:1px solid #a7f3d0;" onclick="openPaymentProofModal('${orderId}')" title="Click to view payment proof"><i class="fas fa-check-double"></i> Payment Received</span>`;
    } else if (payStatus === 'Rejected') {
      payStatusBadge = `<span class="badge-status" style="cursor:pointer; background:#fee2e2; color:#991b1b; font-weight:700; border:1px solid #fecaca;" onclick="openPaymentProofModal('${orderId}')" title="Click to view payment proof"><i class="fas fa-circle-xmark"></i> Rejected</span>`;
    } else {
      payStatusBadge = `<span class="badge-status" style="cursor:pointer; background:#fef3c7; color:#92400e; font-weight:700; border:1px solid #fde68a; animation: pulse 2s infinite;" onclick="openPaymentProofModal('${orderId}')" title="Click to verify payment proof & approve"><i class="fas fa-clock"></i> Pending Verify</span>`;
    }

    // Has proof screenshot button
    const hasProof = proofUrl && proofUrl.length > 5;

    return `
      <tr style="${payStatus === 'Pending Verification' ? 'background:#fffbeb;' : ''}">
        <td>
          <strong style="color:#0b4328; font-size:0.88rem;">${typeof orderId === 'string' && orderId.length > 18 ? orderId.substring(0, 18) : orderId}</strong>
          <div style="font-size:0.78rem; color:#64748b; margin-top:2px;"><i class="fas fa-calendar-alt"></i> ${dateStr}</div>
        </td>
        <td>
          <strong>${custName}</strong>
          ${custGST ? `<div style="font-size:0.75rem; color:#0b4328; font-weight:700; margin-top:2px; font-family:monospace;"><i class="fas fa-file-invoice"></i> GSTIN: ${custGST}</div>` : ''}
          ${custPhone ? `<div style="margin-top:2px;"><a href="tel:${custPhone}" style="color:#2563eb; font-size:0.82rem; font-weight:600;"><i class="fas fa-phone"></i> ${custPhone}</a></div>` : ''}
          ${custCity ? `<div style="font-size:0.78rem; color:#64748b;"><i class="fas fa-location-dot"></i> ${custCity}</div>` : ''}
        </td>
        <td>
          <strong>${prodName}</strong>
          <div style="font-size:0.82rem; color:#475569;"><i class="fas fa-box"></i> ${qty}</div>
        </td>
        <td style="font-weight:800; color:#059669; font-size:0.95rem;">
          ${rawAmt}
        </td>
        <td>
          <div style="font-size:0.8rem; font-weight:600; color:#1e293b;">${paymentMode}</div>
          <div style="display:flex; align-items:center; gap:4px; margin-top:3px;">
            <code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:0.78rem; color:#0284c7; font-weight:700;">${utr}</code>
            ${utr !== 'N/A' ? `<button type="button" onclick="copyRawText('${utr}')" class="btn-copy-chip" style="padding:1px 5px; font-size:0.7rem;" title="Copy UTR"><i class="fas fa-copy"></i></button>` : ''}
          </div>
          ${hasProof ? `
            <button type="button" onclick="openPaymentProofModal('${orderId}')" class="btn-chat-action" style="margin-top:4px; padding:2px 8px; font-size:0.75rem; background:#e0f2fe; color:#0369a1; border-color:#bae6fd;">
              <i class="fas fa-image"></i> View Receipt Proof
            </button>
          ` : `
            <button type="button" onclick="openPaymentProofModal('${orderId}')" class="btn-chat-action" style="margin-top:4px; padding:2px 8px; font-size:0.75rem; background:#f8fafc; color:#64748b;">
              <i class="fas fa-eye"></i> View Details
            </button>
          `}
        </td>
        <td>
          ${payStatusBadge}
        </td>
        <td>
          <select class="form-control-admin" style="padding:4px 8px; font-size:0.82rem; font-weight:600;" onchange="updateOrderStatus('${orderId}', this.value)">
            <option value="Pending" ${orderStatus === 'Pending' || orderStatus === 'Pending Verification' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Shipped" ${orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-action-icon" style="background:#fef3c7; color:#b45309;" title="Create / Edit Tax Invoice with Custom HSN & GST" onclick="openCreateDocFromOrder('${orderId}')">
              <i class="fas fa-file-invoice"></i>
            </button>
            <button type="button" class="btn-action-icon" style="background:#e0f2fe; color:#0284c7;" title="Download PDF Tax Invoice / Receipt" onclick="downloadOrderInvoicePDF('${orderId}')">
              <i class="fas fa-file-pdf"></i>
            </button>
            ${payStatus !== 'Payment Received' ? `
              <button type="button" class="btn-action-icon" style="background:#d1fae5; color:#065f46;" title="Approve Payment (பணம் பெறப்பட்டது)" onclick="approveOrderPayment('${orderId}')">
                <i class="fas fa-check"></i>
              </button>
            ` : ''}
            ${payStatus === 'Pending Verification' ? `
              <button type="button" class="btn-action-icon" style="background:#fee2e2; color:#991b1b;" title="Reject Payment" onclick="rejectOrderPayment('${orderId}')">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
            ${custPhone ? `
              <a href="https://wa.me/91${custPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(custName)},%20regarding%20your%20Wholesale%20Order%20%23${encodeURIComponent(orderId)}%20for%20${encodeURIComponent(prodName)}%20(${encodeURIComponent(qty)})..." target="_blank" class="btn-action-icon btn-whatsapp-sm" title="WhatsApp Customer">
                <i class="fab fa-whatsapp"></i>
              </a>
            ` : ''}
            <button type="button" class="btn-action-icon" style="background:#f1f5f9; color:#dc2626;" title="Delete Order" onclick="deleteOrder('${orderId}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Copy Helper for UTR
window.copyRawText = function(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(`Copied "${text}"`));
  } else {
    showToast(`Copied "${text}"`);
  }
};

// Open Payment Proof & Verification Modal
window.openPaymentProofModal = function(orderId) {
  const ord = orders.find(o => String(o.order_number || o.id) === String(orderId) || String(o.id) === String(orderId) || String(o.order_number) === String(orderId));
  if (!ord) return;

  const actualId = ord.order_number || ord.id || orderId;
  activeViewingProofOrderId = actualId;

  const sub = document.getElementById('proofModalOrderSub');
  const cust = document.getElementById('proofModalCustomer');
  const phone = document.getElementById('proofModalPhone');
  const gstEl = document.getElementById('proofModalGST');
  const cityEl = document.getElementById('proofModalCity');
  const prod = document.getElementById('proofModalProduct');
  const amt = document.getElementById('proofModalAmount');
  const mode = document.getElementById('proofModalMode');
  const utr = document.getElementById('proofModalUTR');
  const img = document.getElementById('proofModalImg');
  const noImg = document.getElementById('proofModalNoImg');
  const btnApprove = document.getElementById('proofModalBtnApprove');
  const btnReject = document.getElementById('proofModalBtnReject');

  const custName = ord.customer_name || ord.customer || 'Customer';
  const prodName = ord.product_name || ord.product || 'Product';
  const qty = ord.quantity_kg ? `${ord.quantity_kg} kg` : (ord.quantity || '50 kg');
  const rawAmt = ord.total_amount ? `₹${Number(ord.total_amount).toLocaleString('en-IN')}` : (ord.amount || '₹0');

  let custGST = ord.customer_gst || ord.customer_gstin || ord.gst || '';
  if (!custGST && ord.notes && ord.notes.includes('GSTIN:')) {
    const match = ord.notes.match(/GSTIN:\s*([A-Z0-9]+)/i);
    if (match) custGST = match[1];
  }

  if (sub) sub.textContent = `Order #${actualId} • ${ord.created_at || ord.date || ''}`;
  if (cust) cust.textContent = custName;
  if (phone) phone.textContent = ord.customer_phone || 'N/A';
  if (gstEl) gstEl.textContent = custGST || 'Not Provided (Unregistered Buyer)';
  if (cityEl) cityEl.textContent = ord.customer_city || 'Tamil Nadu';
  if (prod) prod.textContent = `${prodName} (${qty})`;
  if (amt) amt.textContent = rawAmt;
  if (mode) mode.textContent = ord.payment_mode || 'UPI';
  if (utr) utr.textContent = ord.transaction_id || 'N/A';

  const proofUrl = ord.payment_proof_url || '';
  if (proofUrl && proofUrl.length > 5 && !proofUrl.startsWith('file_upload:')) {
    if (img) {
      img.src = proofUrl;
      img.style.display = 'block';
    }
    if (noImg) noImg.style.display = 'none';
  } else {
    if (img) img.style.display = 'none';
    if (noImg) {
      noImg.style.display = 'block';
      if (proofUrl.startsWith('file_upload:')) {
        noImg.innerHTML = `<i class="fas fa-file-pdf" style="font-size:2rem; color:#ef4444; margin-bottom:8px; display:block;"></i> Document Uploaded: <strong>${proofUrl.replace('file_upload:', '')}</strong><br><small style="color:#94a3b8;">Verified via Bank UTR Reference</small>`;
      } else {
        noImg.innerHTML = `<i class="fas fa-receipt" style="font-size:2rem; margin-bottom:8px; display:block;"></i> No screenshot uploaded.<br><small style="color:#94a3b8;">Verified via Bank Current A/C UTR: <strong>${ord.transaction_id || 'N/A'}</strong></small>`;
      }
    }
  }

  const hsnInput = document.getElementById('proofModalHSNInput');
  const gstSelect = document.getElementById('proofModalGSTSelect');
  if (hsnInput) {
    hsnInput.value = ord.hsn_code || detectHSNCode(prodName);
  }
  if (gstSelect) {
    const defaultGst = ord.gst_rate !== undefined ? String(ord.gst_rate) : (custGST ? '5' : '0');
    gstSelect.value = defaultGst;
  }

  if (btnApprove) {
    btnApprove.onclick = () => approveOrderPayment(actualId);
  }
  if (btnReject) {
    btnReject.onclick = () => rejectOrderPayment(actualId);
  }

  openModal('viewPaymentProofModal');
};

// Approve Payment (கட்டணம் அங்கீகரிப்பு)
window.approveOrderPayment = function(orderId) {
  try {
    const ord = orders.find(o => String(o.order_number || o.id) === String(orderId) || String(o.id) === String(orderId) || String(o.order_number) === String(orderId));
    if (!ord) {
      showToast(`Order #${orderId} not found.`);
      return;
    }

    const actualId = ord.order_number || ord.id || orderId;
    ord.payment_status = 'Payment Received';
    ord.order_status = 'Confirmed';
    ord.status = 'Confirmed';

    saveState();
    safeSetItem('mk_orders_cache', orders);
    safeSetItem('mk_order_status_sync', { id: actualId, order_number: actualId, payment_status: 'Payment Received', order_status: 'Confirmed', t: Date.now() });

    // Multi-Tab & Customer Storefront Broadcast
    try {
      const ordBc = new BroadcastChannel('mk_spicepod_orders');
      ordBc.postMessage({ type: 'ORDER_STATUS_UPDATED', orderId: actualId, order_id: actualId, payment_status: 'Payment Received', order_status: 'Confirmed' });
    } catch(e) {}
    try {
      const chatBc = new BroadcastChannel('mk_spicepod_live_chat');
      chatBc.postMessage({ type: 'ORDER_STATUS_UPDATED', orderId: actualId, order_id: actualId, payment_status: 'Payment Received', order_status: 'Confirmed' });
    } catch(e) {}

    renderOrdersTable();
    renderDashboard();
    closeModal('viewPaymentProofModal');

    showToast(`✔ Payment approved for Order #${actualId}! Status updated to "Payment Received".`);

    // 1. Sync to local backend SQLite & trigger Live Chat notice
    fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, ord, {
        id: actualId,
        order_number: actualId,
        payment_status: 'Payment Received',
        order_status: 'Confirmed'
      }))
    }).catch(err => console.warn('Backend order update warning:', err));

    // 2. Sync to Supabase PostgreSQL Database
    if (window.MKSupabase && window.MKSupabase.Orders) {
      window.MKSupabase.Orders.updateStatus(actualId, 'Confirmed', 'Payment Received').catch(err => console.warn('Supabase update status warning:', err));
    }
  } catch (err) {
    console.error('Error approving payment:', err);
    showToast(`Payment status updated!`);
    renderOrdersTable();
    renderDashboard();
    closeModal('viewPaymentProofModal');
  }
};

// Reject Payment
window.rejectOrderPayment = function(orderId) {
  try {
    if (!confirm(`Are you sure you want to flag/reject payment for Order #${orderId}?`)) return;

    const ord = orders.find(o => String(o.order_number || o.id) === String(orderId) || String(o.id) === String(orderId) || String(o.order_number) === String(orderId));
    if (!ord) return;

    const actualId = ord.order_number || ord.id || orderId;
    ord.payment_status = 'Rejected';
    ord.order_status = 'Cancelled';
    ord.status = 'Cancelled';

    saveState();
    safeSetItem('mk_orders_cache', orders);
    safeSetItem('mk_order_status_sync', { id: actualId, order_number: actualId, payment_status: 'Rejected', order_status: 'Cancelled', t: Date.now() });

    try {
      const ordBc = new BroadcastChannel('mk_spicepod_orders');
      ordBc.postMessage({ type: 'ORDER_STATUS_UPDATED', orderId: actualId, order_id: actualId, payment_status: 'Rejected', order_status: 'Cancelled' });
    } catch(e) {}

    renderOrdersTable();
    renderDashboard();
    closeModal('viewPaymentProofModal');

    showToast(`Order #${actualId} payment marked as Rejected.`);

    fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, ord, {
        id: actualId,
        order_number: actualId,
        payment_status: 'Rejected',
        order_status: 'Cancelled'
      }))
    }).catch(err => console.warn('Order reject update notice:', err));

    if (window.MKSupabase && window.MKSupabase.Orders) {
      window.MKSupabase.Orders.updateStatus(actualId, 'Cancelled', 'Rejected').catch(() => {});
    }
  } catch (err) {
    console.error('Error rejecting order payment:', err);
    renderOrdersTable();
    closeModal('viewPaymentProofModal');
  }
};

// Update Order Delivery Status
window.updateOrderStatus = function(id, newStatus) {
  try {
    const order = orders.find(o => String(o.order_number || o.id) === String(id) || String(o.id) === String(id) || String(o.order_number) === String(id));
    if (order) {
      const actualId = order.order_number || order.id || id;
      order.order_status = newStatus;
      order.status = newStatus;
      if (newStatus === 'Confirmed' || newStatus === 'Shipped' || newStatus === 'Delivered') {
        order.payment_status = 'Payment Received';
      }

      saveState();
      safeSetItem('mk_orders_cache', orders);
      safeSetItem('mk_order_status_sync', { id: actualId, order_number: actualId, payment_status: order.payment_status, order_status: newStatus, t: Date.now() });

      try {
        const ordBc = new BroadcastChannel('mk_spicepod_orders');
        ordBc.postMessage({ type: 'ORDER_STATUS_UPDATED', orderId: actualId, order_id: actualId, payment_status: order.payment_status, order_status: newStatus });
      } catch(e) {}
      try {
        const chatBc = new BroadcastChannel('mk_spicepod_live_chat');
        chatBc.postMessage({ type: 'ORDER_STATUS_UPDATED', orderId: actualId, order_id: actualId, payment_status: order.payment_status, order_status: newStatus });
      } catch(e) {}

      renderOrdersTable();
      renderDashboard();

      fetch('/api/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({}, order, {
          id: actualId,
          order_number: actualId,
          order_status: newStatus,
          payment_status: order.payment_status
        }))
      }).catch(err => console.warn('Order status update notice:', err));

      if (window.MKSupabase && window.MKSupabase.Orders) {
        window.MKSupabase.Orders.updateStatus(actualId, newStatus, order.payment_status).catch(() => {});
      }

      showToast(`Order #${actualId} status updated to "${newStatus}"!`);
    }
  } catch (err) {
    console.error('Error updating order status:', err);
    renderOrdersTable();
  }
};

// Delete Order (ஆர்டர் நிரந்தரமாக நீக்குதல்)
window.deleteOrder = function(orderId) {
  try {
    if (!orderId) return;
    if (!confirm(`Are you sure you want to delete Order #${orderId} permanently? (ஆர்டர் #${orderId} ஐ நிரந்தரமாக நீக்க விரும்புகிறீர்களா?)`)) return;

    // Filter out order from in-memory array by checking all variations
    orders = orders.filter(o => 
      String(o.order_number || o.id) !== String(orderId) && 
      String(o.id) !== String(orderId) && 
      String(o.order_number) !== String(orderId)
    );

    saveState();
    renderOrdersTable();
    renderDashboard();

    // 1. Delete from local SQLite database
    fetch('/api/orders/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, order_number: orderId })
    }).catch(err => console.warn('Backend order delete error:', err));

    // 2. Delete from Supabase PostgreSQL if configured
    if (window.MKSupabase && window.MKSupabase.Orders) {
      window.MKSupabase.Orders.delete(orderId).catch(err => console.warn('Supabase order delete error:', err));
    }

    showToast(`Order #${orderId} deleted successfully.`);
  } catch (err) {
    console.error('Error deleting order:', err);
    showToast(`Order #${orderId} deleted.`);
    renderOrdersTable();
    renderDashboard();
  }
};

// Export Orders to CSV
window.exportOrdersToCSV = function() {
  if (orders.length === 0) {
    showToast('No wholesale orders available to export.');
    return;
  }

  const headers = ['Order Number', 'Date', 'Customer Name', 'GSTIN', 'Phone', 'Email', 'City', 'Delivery Address', 'Product Item', 'Quantity (kg)', 'Total Amount (INR)', 'Payment Mode', 'UTR / Txn ID', 'Payment Status', 'Order Status'];
  
  const rows = orders.map(o => {
    let custGST = o.customer_gst || o.customer_gstin || o.gst || '';
    if (!custGST && o.notes && o.notes.includes('GSTIN:')) {
      const match = o.notes.match(/GSTIN:\s*([A-Z0-9]+)/i);
      if (match) custGST = match[1];
    }
    return [
      `"${o.order_number || o.id || ''}"`,
      `"${o.created_at || o.date || ''}"`,
      `"${(o.customer_name || o.customer || '').replace(/"/g, '""')}"`,
      `"${custGST}"`,
      `"${o.customer_phone || ''}"`,
      `"${o.customer_email || ''}"`,
      `"${(o.customer_city || '').replace(/"/g, '""')}"`,
      `"${(o.delivery_address || o.notes || '').replace(/"/g, '""')}"`,
      `"${(o.product_name || o.product || '').replace(/"/g, '""')}"`,
      `"${o.quantity_kg || o.quantity || ''}"`,
      `"${o.total_amount || (o.amount ? String(o.amount).replace(/[^\d.]/g, '') : '')}"`,
      `"${(o.payment_mode || '').replace(/"/g, '""')}"`,
      `"${o.transaction_id || ''}"`,
      `"${o.payment_status || 'Pending Verification'}"`,
      `"${o.order_status || o.status || 'Pending'}"`
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `mk_wholesale_orders_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Wholesale Orders CSV Exported Successfully!');
};

// 8. Customers Table (Permanent Zero Data Loss CRM)
function renderCustomersTable() {
  const tbody = document.getElementById('customersTableTbody');
  if (!tbody) return;

  tbody.innerHTML = customers.map((cust, index) => `
    <tr>
      <td style="font-weight:700; color:#64748b;">#${index + 1}</td>
      <td>
        <strong>${cust.name}</strong>
        ${cust.business_name && cust.business_name !== cust.name ? `<br><small style="color:#64748b;">${cust.business_name}</small>` : ''}
      </td>
      <td><a href="tel:${cust.phone}" style="color:#2563eb; font-weight:600;"><i class="fas fa-phone"></i> ${cust.phone}</a></td>
      <td>${cust.city || 'Tamil Nadu'}</td>
      <td><span class="badge-status status-confirmed" style="background:#e0f2fe; color:#0369a1;">${cust.orders || cust.total_messages || 1} Orders/Chats</span></td>
      <td style="font-weight:700; color:#0b4328;">${cust.spent || 'Active Buyer'}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <a href="https://wa.me/91${cust.phone}" target="_blank" class="btn-action-icon btn-whatsapp-sm" title="WhatsApp"><i class="fab fa-whatsapp"></i></a>
          <button class="btn-action-icon" style="background:#e0f2fe; color:#0284c7;" title="Open Live Chat" onclick="openChatWithCustomer('${cust.id}')"><i class="fas fa-comment-dots"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// 9. Enquiries Table
function renderEnquiriesTable() {
  const tbody = document.getElementById('enquiriesTableTbody');
  if (!tbody) return;

  tbody.innerHTML = enquiries.map(enq => `
    <tr>
      <td style="font-weight:700; color:#64748b;">#${enq.id}</td>
      <td><strong>${enq.name}</strong><br><small style="color:#64748b;">${enq.email || ''}</small></td>
      <td><a href="tel:${enq.phone}" style="color:#059669; font-weight:600;"><i class="fas fa-phone"></i> ${enq.phone}</a></td>
      <td><strong>${enq.product}</strong> (${enq.quantity || 'Wholesale'})</td>
      <td style="max-width:240px; font-size:0.85rem; color:#475569;">${enq.message || 'Bulk quote inquiry'}</td>
      <td>${enq.date}</td>
      <td>
        <a href="https://wa.me/91${enq.phone}?text=Hello%20${encodeURIComponent(enq.name)},%20regarding%20your%20wholesale%20enquiry%20for%20${encodeURIComponent(enq.product)}..." target="_blank" class="btn-action-icon btn-whatsapp-sm" title="Reply on WhatsApp"><i class="fab fa-whatsapp"></i></a>
      </td>
    </tr>
  `).join('');
}

function renderCategoriesTable() {
  const tbody = document.getElementById('categoriesTableTbody');
  if (!tbody) return;

  const cats = [
    { id: 1, name: "Spices", items: products.filter(p => p.category === 'Spices').length, status: "Active" },
    { id: 2, name: "Dry Fruits", items: products.filter(p => p.category === 'Dry Fruits').length, status: "Active" },
    { id: 3, name: "Nuts", items: products.filter(p => p.category === 'Nuts').length, status: "Active" },
    { id: 4, name: "Whole Spices", items: products.filter(p => p.category === 'Whole Spices').length, status: "Active" }
  ];

  tbody.innerHTML = cats.map(c => `
    <tr>
      <td style="font-weight:700; color:#64748b;">#${c.id}</td>
      <td><strong>${c.name}</strong></td>
      <td>${c.items} Products</td>
      <td><span class="badge-status status-confirmed">${c.status}</span></td>
    </tr>
  `).join('');
}

// 10. Sales Chart
function initSalesChart() {
  const canvas = document.getElementById('salesChartCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const points = [
    { x: 30, y: 180, label: 'Jan', val: '2' },
    { x: 90, y: 150, label: 'Feb', val: '5' },
    { x: 150, y: 130, label: 'Mar', val: '8' },
    { x: 210, y: 80, label: 'Apr', val: '14' },
    { x: 270, y: 110, label: 'May', val: '11' },
    { x: 330, y: 50, label: 'Jun', val: '18' }
  ];

  const grad = ctx.createLinearGradient(0, 0, 0, 200);
  grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
  grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[points.length - 1].x, 200);
  ctx.lineTo(points[0].x, 200);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.stroke();

  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.label, p.x, 210);
  });
}

// ===================================================================
// 11. ADMIN LIVE CHAT & INBOX WORKSPACE SYSTEM
// ===================================================================

let adminLivePollInterval = null;

function initAdminLiveChat() {
  try {
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel('mk_spicepod_live_chat');
      broadcastChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_MESSAGE') {
          handleIncomingLiveChatMessage(event.data);
        } else if (event.data && event.data.type === 'NEW_ORDER' && event.data.order) {
          handleIncomingWholesaleOrder(event.data.order);
        }
      };

      const ordersChannel = new BroadcastChannel('mk_spicepod_orders');
      ordersChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'NEW_ORDER' && event.data.order) {
          handleIncomingWholesaleOrder(event.data.order);
        }
      };
    }
  } catch (e) {
    console.warn('BroadcastChannel error:', e);
  }

  // Real-time live chat & orders polling every 3 seconds
  if (!adminLivePollInterval) {
    adminLivePollInterval = setInterval(pollAdminLiveChats, 3000);
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'mk_chat_messages' || e.key === 'mk_admin_all_chats') {
      fetchDataFromBackend();
    } else if (e.key === 'mk_admin_orders' || e.key === 'mk_orders_cache') {
      try {
        const cached = JSON.parse(localStorage.getItem('mk_admin_orders') || '[]');
        if (Array.isArray(cached) && cached.length > 0) {
          cached.forEach(co => {
            const ordId = co.order_number || co.id;
            const idx = orders.findIndex(o => (o.order_number || o.id) === ordId);
            if (idx === -1) {
              orders.unshift(co);
            } else {
              orders[idx] = Object.assign({}, orders[idx], co);
            }
          });
          renderOrdersTable();
          renderDashboard();
        }
      } catch (err) {}
    }
  });

  const searchInput = document.getElementById('adminChatSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      renderChatCustomerList(term);
    });
  }

  const replyInput = document.getElementById('adminChatReplyInput');
  const sendReplyBtn = document.getElementById('adminChatSendReplyBtn');

  if (sendReplyBtn) {
    sendReplyBtn.addEventListener('click', sendAdminReply);
  }

  if (replyInput) {
    replyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAdminReply();
      }
    });
  }
}

function handleIncomingWholesaleOrder(newOrder) {
  if (!newOrder) return;
  const ordId = newOrder.order_number || newOrder.id;
  const existingIdx = orders.findIndex(o => (o.order_number || o.id) === ordId);
  if (existingIdx === -1) {
    orders.unshift(newOrder);
  } else {
    orders[existingIdx] = Object.assign({}, orders[existingIdx], newOrder);
  }
  saveState();
  renderOrdersTable();
  renderDashboard();
  showToast(`🔔 New Wholesale Order #${ordId} received from ${newOrder.customer_name || 'Customer'}!`);
}

function deduplicateAdminChats(msgList) {
  if (!Array.isArray(msgList)) return [];
  const seenIds = new Set();
  const result = [];

  for (let i = 0; i < msgList.length; i++) {
    const msg = msgList[i];
    if (!msg) continue;

    if (msg.id && seenIds.has(msg.id)) {
      continue;
    }

    const isDup = result.some(existing => {
      if (existing.customer_id === msg.customer_id &&
          existing.message === msg.message &&
          (existing.image_url || '') === (msg.image_url || '') &&
          (existing.sender === msg.sender || (existing.sender === 'agent' && msg.sender === 'bot') || (existing.sender === 'bot' && msg.sender === 'agent'))) {
        if (existing.timestamp && msg.timestamp) {
          const t1 = new Date(existing.timestamp).getTime();
          const t2 = new Date(msg.timestamp).getTime();
          if (!isNaN(t1) && !isNaN(t2) && Math.abs(t1 - t2) < 45000) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    });

    if (!isDup) {
      if (msg.id) seenIds.add(msg.id);
      result.push(msg);
    }
  }
  return result;
}

function pollAdminLiveChats() {
  // 1. Check Supabase Chats if available
  if (window.MKSupabase && window.MKSupabase.Chats && typeof window.MKSupabase.Chats.getAll === 'function') {
    window.MKSupabase.Chats.getAll().then(({ data }) => {
      if (Array.isArray(data) && data.length > 0) {
        const formattedList = data.map(remoteMsg => ({
          id: remoteMsg.id,
          customer_id: remoteMsg.customer_id,
          sender: remoteMsg.sender,
          sender_name: remoteMsg.sender_name,
          message: remoteMsg.message,
          image_url: remoteMsg.image_url || '',
          timestamp: remoteMsg.timestamp || remoteMsg.created_at,
          is_read: remoteMsg.is_read ? 1 : 0
        }));
        const prevJson = JSON.stringify(allChats);
        allChats = deduplicateAdminChats([...allChats, ...formattedList]);
        if (JSON.stringify(allChats) !== prevJson) {
          saveState();
          renderChatCustomerList();
          if (activeChatCustomerId) renderActiveConversation();
        }
      }
    }).catch(() => {});
  }

  // 2. Fetch REST API chats
  fetch('/api/chats')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.chats) && data.chats.length > 0) {
        const formattedList = data.chats.map(remoteMsg => ({
          id: remoteMsg.id,
          customer_id: remoteMsg.customer_id,
          sender: remoteMsg.sender,
          sender_name: remoteMsg.sender_name,
          message: remoteMsg.message,
          image_url: remoteMsg.image_url || '',
          timestamp: remoteMsg.timestamp,
          is_read: remoteMsg.is_read ? 1 : 0
        }));
        const prevJson = JSON.stringify(allChats);
        allChats = deduplicateAdminChats([...allChats, ...formattedList]);
        if (JSON.stringify(allChats) !== prevJson) {
          saveState();
          renderChatCustomerList();
          if (activeChatCustomerId) {
            renderActiveConversation();
          }
        }
      }
    })
    .catch(() => {});

  // 3. Real-time REST API Orders Sync
  fetch('/api/orders')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.orders) && data.orders.length > 0) {
        let hasNewOrders = false;
        data.orders.forEach(remoteOrder => {
          const ordId = remoteOrder.order_number || remoteOrder.id;
          const idx = orders.findIndex(o => (o.order_number || o.id) === ordId);
          if (idx === -1) {
            orders.unshift(remoteOrder);
            hasNewOrders = true;
          } else {
            if (orders[idx].payment_status !== remoteOrder.payment_status || orders[idx].order_status !== remoteOrder.order_status) {
              orders[idx] = Object.assign({}, orders[idx], remoteOrder);
              hasNewOrders = true;
            }
          }
        });
        if (hasNewOrders) {
          saveState();
          renderOrdersTable();
          renderDashboard();
        }
      }
    })
    .catch(() => {});

  // 4. Fetch REST API customers to ensure any newly added visitor appears
  fetch('/api/customers')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.customers)) {
        let hasNewCust = false;
        data.customers.forEach(remoteCust => {
          const exists = customers.some(c => c.id === remoteCust.id);
          if (!exists) {
            customers.unshift(remoteCust);
            hasNewCust = true;
          }
        });
        if (hasNewCust) {
          saveState();
          renderChatCustomerList();
          renderCustomersTable();
          renderDashboard();
        }
      }
    })
    .catch(() => {});
}

function handleIncomingLiveChatMessage(data) {
  const msg = data.message;
  const cust = data.customer;

  if (cust && cust.id) {
    const existingCust = customers.find(c => c.id === cust.id || (cust.phone && c.phone === cust.phone));
    if (!existingCust) {
      customers.unshift({
        id: cust.id,
        name: cust.name || 'Live Visitor',
        phone: cust.phone || '',
        email: cust.email || '',
        city: cust.city || 'Tamil Nadu',
        orders: 1,
        spent: 'Live Inquiry',
        last_active: new Date().toISOString()
      });
    } else {
      existingCust.last_active = new Date().toISOString();
      if (cust.name && cust.name !== 'Wholesale Buyer' && cust.name !== 'Guest Buyer') existingCust.name = cust.name;
      if (cust.phone) existingCust.phone = cust.phone;
    }
  }

  if (msg) {
    const formatted = {
      id: msg.id,
      customer_id: msg.customer_id,
      sender: msg.sender,
      sender_name: msg.sender_name,
      message: msg.message,
      image_url: msg.image_url || '',
      timestamp: msg.timestamp || new Date().toISOString(),
      is_read: activeChatCustomerId === msg.customer_id ? 1 : 0
    };
    allChats = deduplicateAdminChats([...allChats, formatted]);
  }

  saveState();
  renderChatCustomerList();
  if (activeChatCustomerId && msg && (activeChatCustomerId === msg.customer_id)) {
    renderActiveConversation();
  } else if (!activeChatCustomerId && msg && msg.customer_id) {
    selectChatCustomer(msg.customer_id);
  }

  if (msg && msg.sender !== 'admin') {
    showToast(`🔔 New message from ${msg.sender_name || 'Customer'}: "${(msg.message || 'Payment Proof / Attachment').substring(0, 30)}..."`);
  }
}

function renderAdminChatInbox() {
  allChats = deduplicateAdminChats(allChats);
  saveState();
  renderChatCustomerList();

  if (!activeChatCustomerId) {
    const allKnownCustMap = new Map();
    customers.forEach(c => allKnownCustMap.set(c.id, Object.assign({}, c)));
    allChats.forEach(m => {
      if (m.customer_id && !allKnownCustMap.has(m.customer_id)) {
        allKnownCustMap.set(m.customer_id, {
          id: m.customer_id,
          name: m.sender_name || 'Live Visitor',
          phone: '',
          city: 'Tamil Nadu',
          orders: 0,
          spent: 'Live Inquiry',
          last_active: m.timestamp || new Date().toISOString()
        });
      }
    });

    const sorted = Array.from(allKnownCustMap.values()).sort((a, b) => {
      const msgsA = allChats.filter(m => m.customer_id === a.id);
      const msgsB = allChats.filter(m => m.customer_id === b.id);
      const lastA = msgsA.length > 0 ? new Date(msgsA[msgsA.length - 1].timestamp).getTime() : 0;
      const lastB = msgsB.length > 0 ? new Date(msgsB[msgsB.length - 1].timestamp).getTime() : 0;
      return lastB - lastA;
    });

    if (sorted.length > 0) {
      selectChatCustomer(sorted[0].id);
    }
  } else {
    renderActiveConversation();
  }
}

function renderChatCustomerList(filterTerm = '') {
  const listEl = document.getElementById('adminChatCustomerList');
  if (!listEl) return;

  // Unified list of customers including any active chat threads
  const allKnownCustMap = new Map();
  customers.forEach(c => allKnownCustMap.set(c.id, Object.assign({}, c)));
  allChats.forEach(m => {
    if (m.customer_id && !allKnownCustMap.has(m.customer_id)) {
      allKnownCustMap.set(m.customer_id, {
        id: m.customer_id,
        name: m.sender_name || 'Live Visitor',
        phone: '',
        city: 'Tamil Nadu',
        orders: 0,
        spent: 'Live Inquiry',
        last_active: m.timestamp || new Date().toISOString()
      });
    }
  });

  let filtered = Array.from(allKnownCustMap.values());
  if (filterTerm) {
    filtered = filtered.filter(c => 
      (c.name && c.name.toLowerCase().includes(filterTerm)) ||
      (c.phone && c.phone.includes(filterTerm)) ||
      (c.city && c.city.toLowerCase().includes(filterTerm))
    );
  }

  // Sort customers: ones with latest chat messages first
  filtered.sort((a, b) => {
    const msgsA = allChats.filter(m => m.customer_id === a.id);
    const msgsB = allChats.filter(m => m.customer_id === b.id);
    const lastA = msgsA.length > 0 ? new Date(msgsA[msgsA.length - 1].timestamp).getTime() : (new Date(a.last_active || 0).getTime());
    const lastB = msgsB.length > 0 ? new Date(msgsB[msgsB.length - 1].timestamp).getTime() : (new Date(b.last_active || 0).getTime());
    return lastB - lastA;
  });

  if (filtered.length === 0) {
    listEl.innerHTML = `<li style="padding:20px; text-align:center; color:#94a3b8; font-size:0.85rem;">No customer chats match search.</li>`;
    return;
  }

  listEl.innerHTML = filtered.map(cust => {
    const custMsgs = allChats.filter(m => m.customer_id === cust.id);
    const lastMsg = custMsgs.length > 0 ? custMsgs[custMsgs.length - 1] : null;
    const snippet = lastMsg ? (lastMsg.image_url ? '📷 Payment Proof / Photo' : escapeHtml(lastMsg.message)) : 'No messages yet';
    const time = lastMsg ? formatTimeAgo(lastMsg.timestamp) : 'Recent';
    const unreadCount = custMsgs.filter(m => m.sender === 'customer' && !m.is_read).length;
    const isActive = activeChatCustomerId === cust.id ? 'active' : '';

    return `
      <li class="admin-chat-cust-item ${isActive}" onclick="selectChatCustomer('${cust.id}')">
        <div class="admin-chat-avatar">${(cust.name || 'G').substring(0, 2).toUpperCase()}</div>
        <div class="admin-chat-cust-info">
          <div class="admin-chat-cust-top">
            <span class="admin-chat-cust-name">${escapeHtml(cust.name || 'Visitor')}</span>
            <span class="admin-chat-cust-time">${time}</span>
          </div>
          <div class="admin-chat-cust-snippet">${snippet}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <small style="color:#059669; font-size:0.7rem;"><i class="fas fa-phone"></i> ${cust.phone || 'Live Chat Visitor'}</small>
            ${unreadCount > 0 ? `<span class="admin-chat-badge-unread">${unreadCount} New</span>` : ''}
          </div>
        </div>
      </li>
    `;
  }).join('');
}

window.selectChatCustomer = function(custId) {
  activeChatCustomerId = custId;
  renderChatCustomerList();

  const chatLayout = document.querySelector('.admin-chat-layout');
  if (chatLayout) chatLayout.classList.add('chat-active');

  let cust = customers.find(c => c.id === custId);
  if (!cust) {
    const chatMsg = allChats.find(m => m.customer_id === custId);
    cust = {
      id: custId,
      name: chatMsg ? (chatMsg.sender_name || 'Live Visitor') : 'Live Visitor',
      phone: '',
      city: 'Tamil Nadu',
      orders: 0,
      spent: 'Live Inquiry',
      last_active: new Date().toISOString()
    };
    customers.unshift(cust);
    saveState();
  }

  const headerAvatar = document.getElementById('adminChatHeaderAvatar');
  const headerName = document.getElementById('adminChatHeaderName');
  const headerSub = document.getElementById('adminChatHeaderSub');
  const headerActions = document.getElementById('adminChatHeaderActions');
  const cannedBar = document.getElementById('adminChatCannedBar');
  const inputArea = document.getElementById('adminChatInputArea');
  const waBtn = document.getElementById('adminChatWaBtn');
  const callBtn = document.getElementById('adminChatCallBtn');

  if (headerAvatar) headerAvatar.textContent = (cust.name || 'G').substring(0, 2).toUpperCase();
  if (headerName) headerName.textContent = cust.name || 'Visitor';
  if (headerSub) headerSub.textContent = `Phone: ${cust.phone || 'Online Guest'} | Location: ${cust.city || 'Tamil Nadu'} | Status: Active`;
  if (headerActions) headerActions.style.display = 'flex';
  if (cannedBar) cannedBar.style.display = 'flex';
  if (inputArea) inputArea.style.display = 'flex';

  if (waBtn) {
    if (cust.phone && cust.phone.length >= 10) {
      waBtn.style.display = 'inline-flex';
      waBtn.href = `https://wa.me/91${cust.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(cust.name || 'Sir')},%20this%20is%20MK%20SPICEPOD%20TRADERS%20Wholesale%20Support.`;
    } else {
      waBtn.style.display = 'none';
    }
  }
  if (callBtn) {
    if (cust.phone && cust.phone.length >= 10) {
      callBtn.style.display = 'inline-flex';
      callBtn.href = `tel:${cust.phone}`;
    } else {
      callBtn.style.display = 'none';
    }
  }

  allChats.forEach(m => {
    if (m.customer_id === custId) m.is_read = 1;
  });
  saveState();

  // Mark read on backend
  fetch('/api/chats/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer_id: custId })
  }).catch(() => {});

  renderActiveConversation();
};

window.backToCustomerList = function() {
  const chatLayout = document.querySelector('.admin-chat-layout');
  if (chatLayout) chatLayout.classList.remove('chat-active');
};

window.openChatWithCustomer = function(custId) {
  const chatTabBtn = document.querySelector('.sidebar-link[data-tab="chat"]');
  if (chatTabBtn) chatTabBtn.click();
  setTimeout(() => {
    selectChatCustomer(custId);
  }, 100);
};

let selectedAdminAttachment = null;

window.handleAdminFileInput = function(input) {
  if (input && input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      selectedAdminAttachment = {
        dataUrl: e.target.result,
        name: file.name
      };
      const preview = document.getElementById('adminChatAttachPreview');
      const previewImg = document.getElementById('adminChatPreviewImg');
      const filenameEl = document.getElementById('adminChatPreviewFilename');
      const replyInp = document.getElementById('adminChatReplyInput');
      if (preview && previewImg && filenameEl) {
        previewImg.src = e.target.result;
        filenameEl.textContent = file.name;
        preview.style.display = 'flex';
      }
      if (replyInp && !replyInp.value.trim()) {
        replyInp.value = '📄 Attached invoice / proforma details for your wholesale order.';
        replyInp.focus();
      }
    };
    reader.readAsDataURL(file);
  }
};

window.clearAdminChatAttachment = function() {
  selectedAdminAttachment = null;
  const preview = document.getElementById('adminChatAttachPreview');
  const fileInput = document.getElementById('adminChatFileInput');
  if (preview) preview.style.display = 'none';
  if (fileInput) fileInput.value = '';
};

window.openAdminImageLightbox = function(url, title = 'Payment Proof / Attachment') {
  const modal = document.getElementById('adminChatLightboxModal');
  const img = document.getElementById('adminLightboxImg');
  const titleEl = document.getElementById('adminLightboxTitle');
  const dlBtn = document.getElementById('adminLightboxDownloadBtn');
  if (modal && img) {
    img.src = url;
    if (titleEl) titleEl.innerHTML = `<i class="fas fa-receipt"></i> ${escapeHtml(title)}`;
    if (dlBtn) dlBtn.href = url;
    modal.style.display = 'flex';
  }
};

window.closeAdminImageLightbox = function() {
  const modal = document.getElementById('adminChatLightboxModal');
  if (modal) modal.style.display = 'none';
};

function renderActiveConversation() {
  const container = document.getElementById('adminChatMessagesContainer');
  if (!container || !activeChatCustomerId) return;

  const msgs = allChats.filter(m => m.customer_id === activeChatCustomerId);

  if (msgs.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px; color:#94a3b8;">
        <i class="fas fa-comments" style="font-size:2rem; margin-bottom:8px;"></i>
        <p>No chat history yet with this customer. Type a message below to start wholesale conversation.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = msgs.map(msg => {
    const isSenderAdmin = msg.sender === 'admin';
    const roleClass = isSenderAdmin ? 'admin' : (msg.sender === 'bot' ? 'bot' : 'customer');
    const senderTitle = isSenderAdmin ? 'Admin (You)' : (msg.sender_name || 'Customer');
    const timeFormatted = formatTime(msg.timestamp);

    let proofCardHtml = '';
    if (msg.image_url && msg.image_url.trim().length > 5) {
      proofCardHtml = `
        <div class="admin-chat-proof-card">
          <div class="admin-proof-header">
            <span><i class="fas fa-receipt"></i> Payment Proof / Receipt</span>
            <span style="color:#94a3b8; font-size:0.65rem;">Click to Zoom</span>
          </div>
          <div class="admin-proof-img-container" onclick="openAdminImageLightbox('${escapeHtml(msg.image_url)}', 'Payment Proof - ${escapeHtml(senderTitle)}')">
            <img src="${escapeHtml(msg.image_url)}" alt="Payment Proof" loading="lazy" onerror="this.src='images/products/turmeric-powder.jpg'">
            <div class="admin-proof-overlay">
              <i class="fas fa-search-plus"></i> View Full Size
            </div>
          </div>
          <div class="admin-proof-footer-actions">
            <button type="button" class="admin-btn-proof-action" onclick="openAdminImageLightbox('${escapeHtml(msg.image_url)}', 'Payment Proof - ${escapeHtml(senderTitle)}')">
              <i class="fas fa-expand"></i> Full View
            </button>
            <a href="${escapeHtml(msg.image_url)}" download="payment_proof_${msg.customer_id || 'receipt'}.jpg" target="_blank" class="admin-btn-proof-action" style="background:#0369a1;">
              <i class="fas fa-download"></i> Download
            </a>
          </div>
        </div>
      `;
    }

    return `
      <div class="admin-msg-bubble-row ${roleClass}">
        <div class="admin-msg-bubble">
          ${proofCardHtml}
          ${msg.message ? `<div>${escapeHtml(msg.message).replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        <div class="admin-msg-meta">
          <strong>${senderTitle}</strong> • ${timeFormatted}
        </div>
      </div>
    `;
  }).join('');

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

async function sendAdminReply() {
  const input = document.getElementById('adminChatReplyInput');
  if (!input || !activeChatCustomerId) return;

  const text = input.value.trim();
  const hasAttach = selectedAdminAttachment && selectedAdminAttachment.dataUrl;

  if (!text && !hasAttach) return;

  let imageUrl = '';
  if (hasAttach) {
    const attachData = selectedAdminAttachment.dataUrl;
    const attachName = selectedAdminAttachment.name;
    clearAdminChatAttachment();

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: attachData,
          filename: attachName,
          folder: 'receipts'
        })
      });
      const data = await res.json();
      if (data && data.status === 'success' && data.file_url) {
        imageUrl = data.file_url;
      }
    } catch (e) {
      console.warn('Admin upload error:', e);
    }
    if (!imageUrl) {
      imageUrl = attachData;
    }
  }

  const msgText = text || (imageUrl ? '📄 Payment Proof / Document Sent' : '');
  const now = new Date().toISOString();
  const replyMsg = {
    id: `chat_admin_${Date.now()}`,
    customer_id: activeChatCustomerId,
    sender: 'admin',
    sender_name: 'MK Spicepod Admin',
    message: msgText,
    image_url: imageUrl,
    timestamp: now,
    is_read: 1
  };

  allChats = deduplicateAdminChats([...allChats, replyMsg]);
  saveState();
  renderActiveConversation();
  renderChatCustomerList();

  input.value = '';

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'NEW_MESSAGE',
        message: replyMsg
      });
    } catch (e) {
      console.warn('Broadcast error:', e);
    }
  }

  // 1. Supabase PostgreSQL Chat Send
  if (window.MKSupabase && window.MKSupabase.Chats && activeChatCustomerId) {
    window.MKSupabase.Chats.send({
      customer_id: activeChatCustomerId,
      sender: 'admin',
      sender_name: 'MK Spicepod Admin',
      message: msgText,
      image_url: imageUrl
    }).then(({ data }) => {
      if (data && data.id) {
        replyMsg.id = data.id;
        saveState();
      }
    }).catch(err => console.warn('Supabase chat send error:', err));
  }

  // 2. Fallback REST API
  fetch('/api/chats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: replyMsg.id,
      customer_id: activeChatCustomerId,
      sender: 'admin',
      sender_name: 'MK Spicepod Admin',
      message: msgText,
      image_url: imageUrl
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data && data.status === 'success' && data.chat_id) {
      replyMsg.id = data.chat_id;
      if (data.timestamp) replyMsg.timestamp = data.timestamp;
      saveState();
    }
  })
  .catch(err => console.log('Saved to Supabase/LocalStorage:', err));

  showToast("Reply sent to customer!");
}

window.insertCannedReply = function(type) {
  const input = document.getElementById('adminChatReplyInput');
  if (!input) return;

  let text = '';
  switch (type) {
    case 'ratecard':
      text = autoConfig.ratecardReply || "📊 Today's Bulk Rates: Salem Turmeric Grade A: ₹240/kg | Red Chilli Guntur: ₹280/kg | Tellicherry Pepper: ₹650/kg | California Almonds: ₹720/kg | W240 Cashews: ₹820/kg | Green Cardamom: ₹2,600/kg.";
      break;
    case 'turmeric':
      text = autoConfig.spicesReply || "🌶️ We supply Salem Grade A Turmeric Powder with >3.5% Curcumin and moisture below 9%. Export quality lab certified bags ready for immediate dispatch.";
      break;
    case 'almonds':
      text = autoConfig.nutsReply || "🥜 California Extra Bold Almonds available at ₹720/kg for 100kg+ consignments. Vacuum packed 10kg cartons.";
      break;
    case 'delivery':
      text = autoConfig.deliveryReply || "🚚 Free door delivery across Tamil Nadu & Bangalore for bulk orders above 200kg. Dispatched within 24 hours via express logistics.";
      break;
    case 'proforma':
      text = "📝 Please share your GST Number, Company Billing Name, and Delivery Address to generate your Proforma Invoice & Dispatch Challan.";
      break;
    case 'samples':
      text = "📦 We can dispatch a 5kg sample parcel today for your quality verification. Please confirm shipping address.";
      break;
  }

  input.value = text;
  input.focus();
};

// ===================================================================
// 11.1 AUTO-MESSAGE & BOT CONFIGURATION HANDLERS
// ===================================================================

function loadAutoConfig() {
  if (window.MKSupabase && window.MKSupabase.AutoConfig) {
    window.MKSupabase.AutoConfig.get().then(({ data }) => {
      if (data) {
        autoConfig = Object.assign({}, defaultAutoConfig, data);
        localStorage.setItem('mk_chat_auto_config', JSON.stringify(autoConfig));
      }
    }).catch(() => {});
  }

  fetch('/api/auto-config')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && data.config) {
        autoConfig = Object.assign({}, defaultAutoConfig, data.config);
        localStorage.setItem('mk_chat_auto_config', JSON.stringify(autoConfig));
      }
    })
    .catch(() => {});
}

window.openAutoMessageModal = function() {
  const teaserInput = document.getElementById('cfgTeaserText');
  const w1Input = document.getElementById('cfgWelcomeMsg1');
  const w2Input = document.getElementById('cfgWelcomeMsg2');
  const ratesInput = document.getElementById('cfgRatesReply');
  const spicesInput = document.getElementById('cfgSpicesReply');
  const nutsInput = document.getElementById('cfgNutsReply');
  const orderInput = document.getElementById('cfgOrderReply');
  const botInput = document.getElementById('cfgSmartBotEnabled');

  if (teaserInput) teaserInput.value = autoConfig.teaserText || defaultAutoConfig.teaserText;
  if (w1Input) w1Input.value = autoConfig.welcomeMsg1 || defaultAutoConfig.welcomeMsg1;
  if (w2Input) w2Input.value = autoConfig.welcomeMsg2 || defaultAutoConfig.welcomeMsg2;
  if (ratesInput) ratesInput.value = autoConfig.ratecardReply || defaultAutoConfig.ratecardReply;
  if (spicesInput) spicesInput.value = autoConfig.spicesReply || defaultAutoConfig.spicesReply;
  if (nutsInput) nutsInput.value = autoConfig.nutsReply || defaultAutoConfig.nutsReply;
  if (orderInput) orderInput.value = autoConfig.deliveryReply || defaultAutoConfig.deliveryReply;
  if (botInput) botInput.checked = (autoConfig.enableSmartBot !== false);

  openModal('autoMessageModal');
};

window.saveAutoConfigForm = function(e) {
  if (e) e.preventDefault();

  const teaserInput = document.getElementById('cfgTeaserText');
  const w1Input = document.getElementById('cfgWelcomeMsg1');
  const w2Input = document.getElementById('cfgWelcomeMsg2');
  const ratesInput = document.getElementById('cfgRatesReply');
  const spicesInput = document.getElementById('cfgSpicesReply');
  const nutsInput = document.getElementById('cfgNutsReply');
  const orderInput = document.getElementById('cfgOrderReply');
  const botInput = document.getElementById('cfgSmartBotEnabled');

  autoConfig = {
    teaserText: teaserInput ? teaserInput.value.trim() : defaultAutoConfig.teaserText,
    welcomeMsg1: w1Input ? w1Input.value.trim() : defaultAutoConfig.welcomeMsg1,
    welcomeMsg2: w2Input ? w2Input.value.trim() : defaultAutoConfig.welcomeMsg2,
    ratecardReply: ratesInput ? ratesInput.value.trim() : defaultAutoConfig.ratecardReply,
    spicesReply: spicesInput ? spicesInput.value.trim() : defaultAutoConfig.spicesReply,
    nutsReply: nutsInput ? nutsInput.value.trim() : defaultAutoConfig.nutsReply,
    deliveryReply: orderInput ? orderInput.value.trim() : defaultAutoConfig.deliveryReply,
    enableSmartBot: botInput ? botInput.checked : true
  };

  localStorage.setItem('mk_chat_auto_config', JSON.stringify(autoConfig));

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({
        type: 'CONFIG_UPDATED',
        config: autoConfig
      });
    } catch (err) {
      console.warn('Broadcast config error:', err);
    }
  }

  // 1. Supabase AutoConfig Save
  if (window.MKSupabase && window.MKSupabase.AutoConfig) {
    window.MKSupabase.AutoConfig.save(autoConfig).catch(err => console.warn('Supabase autoConfig save error:', err));
  }

  // 2. Fallback REST API
  fetch('/api/auto-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(autoConfig)
  }).catch(err => console.log('Saved config locally:', err));

  closeModal('autoMessageModal');
  showToast('Live Chat Auto-Messages saved & applied across website!');
};

window.resetAutoConfigToDefaults = function() {
  if (confirm('Reset all live chat automated messages and bot settings to default template?')) {
    const teaserInput = document.getElementById('cfgTeaserText');
    const w1Input = document.getElementById('cfgWelcomeMsg1');
    const w2Input = document.getElementById('cfgWelcomeMsg2');
    const ratesInput = document.getElementById('cfgRatesReply');
    const spicesInput = document.getElementById('cfgSpicesReply');
    const nutsInput = document.getElementById('cfgNutsReply');
    const orderInput = document.getElementById('cfgOrderReply');
    const botInput = document.getElementById('cfgSmartBotEnabled');

    if (teaserInput) teaserInput.value = defaultAutoConfig.teaserText;
    if (w1Input) w1Input.value = defaultAutoConfig.welcomeMsg1;
    if (w2Input) w2Input.value = defaultAutoConfig.welcomeMsg2;
    if (ratesInput) ratesInput.value = defaultAutoConfig.ratecardReply;
    if (spicesInput) spicesInput.value = defaultAutoConfig.spicesReply;
    if (nutsInput) nutsInput.value = defaultAutoConfig.nutsReply;
    if (orderInput) orderInput.value = defaultAutoConfig.deliveryReply;
    if (botInput) botInput.checked = defaultAutoConfig.enableSmartBot;
  }
};

// Export Active Customer Chat Transcript
window.exportActiveChatTranscript = function() {
  if (!activeChatCustomerId) return;
  const cust = customers.find(c => c.id === activeChatCustomerId);
  if (!cust) return;

  const msgs = allChats.filter(m => m.customer_id === activeChatCustomerId);
  let transcript = `SRI MK SPICEPOD TRADERS - WHOLESALE CHAT TRANSCRIPT\n`;
  transcript += `Customer: ${cust.name}\nPhone: ${cust.phone}\nEmail: ${cust.email || 'N/A'}\nCity: ${cust.city || 'N/A'}\nDate: ${new Date().toLocaleString()}\n`;
  transcript += `========================================================\n\n`;

  msgs.forEach(m => {
    transcript += `[${m.timestamp}] ${m.sender_name || m.sender.toUpperCase()}: ${m.message}\n\n`;
  });

  downloadFile(`${cust.name.replace(/\s+/g, '_')}_Chat_Transcript.txt`, transcript, 'text/plain');
  showToast("Chat transcript exported successfully!");
};

// Zero-Data-Loss CSV Customer Directory Export
window.exportCustomersToCSV = function() {
  let csv = "ID,Name,Phone,Email,City,Business Name,Orders/Messages,Total Spent,Created Date\n";
  customers.forEach((c, idx) => {
    csv += `"${c.id || idx+1}","${(c.name || '').replace(/"/g, '""')}","${c.phone || ''}","${c.email || ''}","${c.city || ''}","${(c.business_name || c.name || '').replace(/"/g, '""')}","${c.orders || c.total_messages || 1}","${c.spent || 'Active'}","${c.created_at || '2025-06-01'}"\n`;
  });

  downloadFile(`Sri_MK_Spicepod_Customers_${new Date().toISOString().split('T')[0]}.csv`, csv, 'text/csv');
  showToast("Customer database exported to CSV!");
};

// Export All Chats Text Archive
window.exportAllChatsToText = function() {
  let text = `SRI MK SPICEPOD TRADERS - COMPLETE MASTER CHAT ARCHIVE\n`;
  text += `Generated: ${new Date().toLocaleString()}\n`;
  text += `Total Messages: ${allChats.length}\n`;
  text += `Total Customer Threads: ${customers.length}\n`;
  text += `========================================================\n\n`;

  customers.forEach(c => {
    const cMsgs = allChats.filter(m => m.customer_id === c.id);
    text += `\n--- CUSTOMER: ${c.name} (Phone: ${c.phone}, City: ${c.city || 'N/A'}) ---\n`;
    if (cMsgs.length === 0) {
      text += `(No chat messages recorded yet)\n`;
    } else {
      cMsgs.forEach(m => {
        text += `[${m.timestamp}] ${m.sender_name || m.sender}: ${m.message}\n`;
      });
    }
    text += `--------------------------------------------------------\n`;
  });

  downloadFile(`MK_Spicepod_All_Chats_Archive_${new Date().toISOString().split('T')[0]}.txt`, text, 'text/plain');
  showToast("All chat archives downloaded!");
};

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Fetch and Sync with Supabase PostgreSQL Database (Primary) & REST Backend
async function fetchDataFromBackend() {
  // 1. SUPABASE POSTGRESQL PRIMARY FETCH
  if (window.MKSupabase) {
    try {
      // Products
      if (window.MKSupabase.Products) {
        const { data: supaProds } = await window.MKSupabase.Products.getAll();
        if (Array.isArray(supaProds) && supaProds.length > 0) {
          products = supaProds.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: String(p.price || ''),
            priceFormatted: p.price_formatted || (p.price ? `₹${p.price}/kg` : ''),
            stock: String(p.stock_kg || 0),
            grade: p.grade || '',
            img: p.image_url || 'images/products/turmeric-powder.jpg',
            status: p.status || 'Active'
          }));
          saveState();
          renderProductsTable();
          renderCategoriesTable();
          renderDashboard();
        }
      }

      // Customers
      if (window.MKSupabase.Customers) {
        const { data: supaCusts } = await window.MKSupabase.Customers.getAll();
        if (Array.isArray(supaCusts) && supaCusts.length > 0) {
          customers = supaCusts.map((c, i) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            email: c.email || '',
            city: c.city || 'Tamil Nadu',
            business_name: c.business_name || c.name,
            orders: c.total_orders || 1,
            spent: c.total_spent ? `₹${c.total_spent.toLocaleString('en-IN')}` : 'Active Buyer',
            last_active: c.last_active || c.created_at
          }));
          saveState();
          renderCustomersTable();
          renderDashboard();
        }
      }

      // Orders
      if (window.MKSupabase.Orders) {
        const { data: supaOrders } = await window.MKSupabase.Orders.getAll();
        if (Array.isArray(supaOrders) && supaOrders.length > 0) {
          supaOrders.forEach(o => {
            const firstItem = (o.order_items && o.order_items.length > 0) ? o.order_items[0] : {};
            const ordNum = o.order_number || o.id;
            let total = Number(o.total_amount) || 0;
            if (!total && o.order_items && o.order_items.length > 0) {
              total = o.order_items.reduce((acc, it) => acc + (Number(it.total_price) || (Number(it.quantity_kg) * Number(it.unit_price)) || 0), 0);
            }
            if (!total) {
              const defaultVals = {
                'ORD-2026-001': 360000,
                'ORD-2026-002': 24000,
                'ORD-2026-003': 820000,
                'ORD-2026-004': 14000,
                'ORD-2026-005': 65000,
                'MK-ORD-2025-001': 152200,
                'MK-ORD-2025-002': 126450,
                'MK-ORD-2025-003': 130350,
                'MK-ORD-2025-004': 89000,
                'MK-ORD-2025-005': 68325
              };
              total = defaultVals[ordNum] || 48000;
            }

            const pName = firstItem.product_name || o.product_name || 'Wholesale Goods';
            const pQty = firstItem.quantity_kg || o.quantity_kg || (ordNum === 'ORD-2026-001' ? 500 : (ordNum === 'ORD-2026-002' ? 100 : (ordNum === 'ORD-2026-003' ? 1000 : (ordNum === 'ORD-2026-004' ? 50 : 25))));

            const mapped = {
              id: ordNum,
              order_number: ordNum,
              customer_name: o.customer_name || 'Customer',
              customer: o.customer_name || 'Customer',
              customer_phone: o.customer_phone || '',
              customer_email: o.customer_email || '',
              customer_city: o.city || o.customer_city || '',
              delivery_address: o.shipping_address || o.delivery_address || '',
              product_name: pName,
              product: pName,
              quantity_kg: pQty,
              quantity: `${pQty} kg`,
              unit_price: firstItem.unit_price || o.unit_price || Math.round(total / (pQty || 1)),
              total_amount: total,
              amount: `₹${total.toLocaleString('en-IN')}`,
              payment_mode: o.payment_mode || (ordNum.endsWith('1') || ordNum.endsWith('3') ? 'Bank Transfer (NEFT / RTGS)' : 'UPI Transfer'),
              transaction_id: o.transaction_id || `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
              payment_proof_url: o.payment_proof_url || '',
              payment_status: o.payment_status || (o.status === 'Confirmed' || o.status === 'Shipped' || o.status === 'Delivered' ? 'Payment Received' : 'Pending Verification'),
              order_status: o.status || 'Pending',
              status: o.status || 'Pending',
              date: o.order_date || (o.created_at ? o.created_at.split('T')[0] : '2026-10-06'),
              created_at: o.created_at || o.order_date || '2026-10-06'
            };

            const idx = orders.findIndex(x => (x.order_number || x.id) === ordNum);
            if (idx === -1) {
              orders.push(mapped);
            } else {
              orders[idx] = Object.assign({}, orders[idx], mapped);
            }
          });

          // Sort descending by timestamp
          orders.sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());
          saveState();
          renderOrdersTable();
          renderDashboard();
        }
      }

      // Invoices & Quotations
      if (window.MKSupabase.Invoices) {
        const { data: supaInvoices } = await window.MKSupabase.Invoices.getAll();
        if (Array.isArray(supaInvoices) && supaInvoices.length > 0) {
          invoices = supaInvoices.map(inv => ({
            id: inv.id,
            doc_type: inv.doc_type || 'quotation',
            doc_number: inv.doc_number,
            customer_id: inv.customer_id,
            customer_name: inv.customer_name,
            customer_phone: inv.customer_phone,
            customer_email: inv.customer_email || '',
            customer_gstin: inv.customer_gstin || '',
            customer_city: inv.customer_city || '',
            billing_address: inv.billing_address || '',
            doc_date: inv.doc_date,
            due_date: inv.due_date || '',
            payment_terms: inv.payment_terms || '100% Advance before Dispatch',
            delivery_terms: inv.delivery_terms || 'SafeXpress / VRL Logistics Door Delivery',
            items_json: typeof inv.items === 'string' ? inv.items : JSON.stringify(inv.items || []),
            subtotal: inv.subtotal || 0,
            discount: inv.discount || 0,
            gst_amount: inv.gst_amount || 0,
            freight: inv.freight || 0,
            grand_total: inv.grand_total || 0,
            notes: inv.notes || '',
            bank_details: inv.bank_details || '',
            status: inv.status || 'Draft',
            created_at: inv.created_at,
            updated_at: inv.updated_at
          }));
          saveState();
          renderInvoicesTable();
          renderDashboard();
        }
      }

      // Enquiries
      if (window.MKSupabase.Enquiries) {
        const { data: supaEnquiries } = await window.MKSupabase.Enquiries.getAll();
        if (Array.isArray(supaEnquiries) && supaEnquiries.length > 0) {
          enquiries = supaEnquiries.map((e, idx) => ({
            id: idx + 1,
            name: e.name,
            phone: e.phone,
            email: e.email || '',
            product: e.product,
            quantity: e.quantity || 'Wholesale',
            message: e.message || '',
            date: e.created_at ? e.created_at.split('T')[0] : '2025-06-12'
          }));
          saveState();
          renderEnquiriesTable();
          renderDashboard();
        }
      }

      // AutoConfig
      if (window.MKSupabase.AutoConfig) {
        const { data: supaAutoCfg } = await window.MKSupabase.AutoConfig.get();
        if (supaAutoCfg) {
          autoConfig = Object.assign({}, defaultAutoConfig, supaAutoCfg);
          localStorage.setItem('mk_chat_auto_config', JSON.stringify(autoConfig));
        }
      }
    } catch (err) {
      console.warn('[Admin] Supabase initial load error, falling back:', err);
    }
  }

  // 2. FALLBACK REST API SYNC
  fetch('/api/customers')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.customers) && data.customers.length > 0) {
        data.customers.forEach(remoteCust => {
          const exists = customers.some(c => c.id === remoteCust.id || c.phone === remoteCust.phone);
          if (!exists) {
            customers.push(remoteCust);
          }
        });
        saveState();
        renderCustomersTable();
        renderDashboard();
      }
    }).catch(() => {});

  fetch('/api/chats')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.chats) && data.chats.length > 0) {
        data.chats.forEach(remoteMsg => {
          const exists = allChats.some(m => m.id === remoteMsg.id);
          if (!exists) {
            allChats.push(remoteMsg);
          }
        });
        saveState();
        if (activeChatCustomerId) renderActiveConversation();
        renderChatCustomerList();
      }
    }).catch(() => {});

  fetch('/api/products')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.products) && data.products.length > 0 && products.length === 0) {
        products = data.products;
        saveState();
        renderProductsTable();
        renderCategoriesTable();
        renderDashboard();
      }
    }).catch(() => {});

  fetch('/api/enquiries')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.enquiries) && data.enquiries.length > 0 && enquiries.length === 0) {
        enquiries = data.enquiries;
        saveState();
        renderEnquiriesTable();
        renderDashboard();
      }
    }).catch(() => {});

  fetch('/api/invoices')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.invoices) && data.invoices.length > 0 && invoices.length === 0) {
        invoices = data.invoices;
        saveState();
        renderInvoicesTable();
      }
    }).catch(() => {});

  fetch('/api/orders')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.orders) && data.orders.length > 0) {
        data.orders.forEach(remoteOrder => {
          const ordId = remoteOrder.order_number || remoteOrder.id;
          const idx = orders.findIndex(o => (o.order_number || o.id) === ordId);
          if (idx !== -1) {
            orders[idx] = Object.assign({}, orders[idx], remoteOrder);
          } else {
            orders.unshift(remoteOrder);
          }
        });
        saveState();
        renderOrdersTable();
        renderDashboard();
      }
    }).catch(() => {});

  // 3. REALTIME POSTGRESQL SUBSCRIPTION FOR ORDERS (SUPABASE)
  if (window.MKSupabase && window.MKSupabase.Orders && typeof window.MKSupabase.Orders.subscribeToOrders === 'function') {
    try {
      window.MKSupabase.Orders.subscribeToOrders((change) => {
        if (change && (change.eventType === 'INSERT' || change.eventType === 'UPDATE') && change.new) {
          const newOrd = change.new;
          const ordNum = newOrd.order_number || newOrd.id;
          const totalVal = Number(newOrd.total_amount) || (Number(newOrd.quantity_kg || 50) * Number(newOrd.unit_price || 240));
          const pName = newOrd.product_name || 'Wholesale Goods';
          const pQty = Number(newOrd.quantity_kg) || 50;

          const mapped = {
            id: ordNum,
            order_number: ordNum,
            customer_name: newOrd.customer_name || 'Customer',
            customer: newOrd.customer_name || 'Customer',
            customer_phone: newOrd.customer_phone || '',
            customer_email: newOrd.customer_email || '',
            customer_city: newOrd.city || newOrd.customer_city || '',
            delivery_address: newOrd.shipping_address || newOrd.delivery_address || '',
            product_name: pName,
            product: pName,
            quantity_kg: pQty,
            quantity: `${pQty} kg`,
            unit_price: Number(newOrd.unit_price) || Math.round(totalVal / (pQty || 1)),
            total_amount: totalVal,
            amount: `₹${totalVal.toLocaleString('en-IN')}`,
            payment_mode: newOrd.payment_mode || 'UPI Transfer',
            transaction_id: newOrd.transaction_id || 'N/A',
            payment_proof_url: newOrd.payment_proof_url || '',
            payment_status: newOrd.payment_status || (newOrd.status === 'Confirmed' ? 'Payment Received' : 'Pending Verification'),
            order_status: newOrd.status || 'Pending',
            status: newOrd.status || 'Pending',
            date: newOrd.order_date || (newOrd.created_at ? newOrd.created_at.split('T')[0] : '2026-10-06'),
            created_at: newOrd.created_at || '2026-10-06'
          };

          const idx = orders.findIndex(o => (o.order_number || o.id) === ordNum);
          if (idx !== -1) {
            orders[idx] = Object.assign({}, orders[idx], mapped);
          } else {
            orders.unshift(mapped);
            showToast(`🔔 New Order from Supabase: #${ordNum} (${mapped.customer})`);
          }

          saveState();
          renderOrdersTable();
          renderDashboard();
        }
      });
    } catch (rtErr) {
      console.warn('[Admin] Realtime orders listener error:', rtErr);
    }
  }
}

// =========================================================================
// 8. WHOLESALE QUOTATION & GST TAX INVOICE MANAGEMENT
// =========================================================================

let currentInvoiceSearchTerm = '';
let currentInvoiceTypeFilter = 'All';
let activeViewingInvoiceId = null;

window.filterInvoicesSearch = function(searchTerm) {
  currentInvoiceSearchTerm = (searchTerm || '').toLowerCase().trim();
  applyInvoiceFilters();
};

window.filterInvoicesType = function(type) {
  currentInvoiceTypeFilter = type || 'All';
  applyInvoiceFilters();
};

function applyInvoiceFilters() {
  let filtered = invoices;
  if (currentInvoiceTypeFilter && currentInvoiceTypeFilter !== 'All') {
    if (['quotation', 'invoice'].includes(currentInvoiceTypeFilter.toLowerCase())) {
      filtered = filtered.filter(inv => (inv.doc_type || '').toLowerCase() === currentInvoiceTypeFilter.toLowerCase());
    } else {
      filtered = filtered.filter(inv => (inv.status || '').toLowerCase() === currentInvoiceTypeFilter.toLowerCase());
    }
  }
  if (currentInvoiceSearchTerm) {
    filtered = filtered.filter(inv => 
      (inv.doc_number || '').toLowerCase().includes(currentInvoiceSearchTerm) ||
      (inv.customer_name || '').toLowerCase().includes(currentInvoiceSearchTerm) ||
      (inv.customer_phone || '').toLowerCase().includes(currentInvoiceSearchTerm) ||
      (inv.customer_city || '').toLowerCase().includes(currentInvoiceSearchTerm) ||
      (inv.customer_gstin || '').toLowerCase().includes(currentInvoiceSearchTerm)
    );
  }
  renderInvoicesTable(filtered);
}

function renderInvoicesTable(filteredList = null) {
  // Update stat summary cards
  const qList = invoices.filter(i => (i.doc_type || '').toLowerCase() === 'quotation');
  const iList = invoices.filter(i => (i.doc_type || '').toLowerCase() === 'invoice');

  const statQuotes = document.getElementById('statQuotationsCount');
  const statInvs = document.getElementById('statInvoicesCount');
  const statInvoiced = document.getElementById('statInvoicedValue');
  const statPipeline = document.getElementById('statQuotationPipeline');

  const totalInvoicedSum = iList.reduce((sum, inv) => sum + (parseFloat(inv.grand_total) || 0), 0);
  const activePipelineSum = qList.filter(inv => inv.status !== 'Cancelled').reduce((sum, inv) => sum + (parseFloat(inv.grand_total) || 0), 0);

  if (statQuotes) statQuotes.textContent = qList.length.toString();
  if (statInvs) statInvs.textContent = iList.length.toString();
  if (statInvoiced) statInvoiced.textContent = '₹' + Math.round(totalInvoicedSum).toLocaleString('en-IN');
  if (statPipeline) statPipeline.textContent = '₹' + Math.round(activePipelineSum).toLocaleString('en-IN');

  const sidebarBadge = document.querySelector('.sidebar-link[data-tab="invoices"] .badge-count');
  if (sidebarBadge) sidebarBadge.textContent = invoices.length.toString();

  const tbody = document.getElementById('invoicesTableTbody');
  if (!tbody) return;

  const listToRender = filteredList !== null ? filteredList : invoices;

  if (listToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:35px; color:#94a3b8;"><i class="fas fa-file-invoice" style="font-size:2rem; margin-bottom:8px; display:block; color:#cbd5e1;"></i>No quotations or tax invoices found matching your filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = listToRender.map(inv => {
    let items = [];
    if (typeof inv.items_json === 'string') {
      try { items = JSON.parse(inv.items_json); } catch(e) { items = []; }
    } else if (Array.isArray(inv.items_json)) {
      items = inv.items_json;
    }

    const itemsSummary = items.length > 0 
      ? `<strong>${escapeHtml(items[0].product || 'Wholesale Commodity')}</strong> (${items[0].qty || 0}kg)${items.length > 1 ? ` <span style="color:#0284c7; font-weight:700;">+${items.length - 1} more</span>` : ''}`
      : '<span style="color:#94a3b8;">No items</span>';

    const isQuote = (inv.doc_type || '').toLowerCase() === 'quotation';
    const typeBadge = isQuote 
      ? `<span class="badge-doc badge-quotation"><i class="fas fa-file-invoice-dollar"></i> Quotation</span>`
      : `<span class="badge-doc badge-invoice"><i class="fas fa-file-invoice"></i> Tax Invoice</span>`;

    const statusBadgeClass = `badge-doc-${(inv.status || 'draft').toLowerCase()}`;

    return `
      <tr>
        <td>${typeBadge}</td>
        <td><strong style="color:var(--text-dark);">${escapeHtml(inv.doc_number || '')}</strong></td>
        <td>
          <strong>${escapeHtml(inv.customer_name || 'Walk-in Client')}</strong><br>
          <small style="color:#64748b;">
            <i class="fas fa-phone-alt" style="font-size:0.75rem;"></i> ${escapeHtml(inv.customer_phone || '')} • ${escapeHtml(inv.customer_city || 'India')}
          </small>
        </td>
        <td>
          <div style="font-size:0.85rem;"><small style="color:#64748b;">Date:</small> <strong>${escapeHtml(inv.doc_date || '')}</strong></div>
          ${inv.due_date ? `<div style="font-size:0.78rem; color:#dc2626;"><small>Due:</small> ${escapeHtml(inv.due_date)}</div>` : ''}
        </td>
        <td>${itemsSummary}</td>
        <td><strong style="color:var(--primary); font-size:0.95rem;">₹${(parseFloat(inv.grand_total) || 0).toLocaleString('en-IN')}</strong></td>
        <td><span class="badge-doc ${statusBadgeClass}">${escapeHtml(inv.status || 'Draft')}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action-icon" style="background:#e0f2fe; color:#0284c7;" title="View & Print A4 PDF" onclick="viewInvoicePrintPreview('${inv.id}')">
              <i class="fas fa-print"></i>
            </button>
            <button class="btn-action-icon" style="background:#dcfce7; color:#16a34a;" title="Share Invoice on WhatsApp" onclick="shareInvoiceDirectWa('${inv.id}')">
              <i class="fab fa-whatsapp"></i>
            </button>
            ${isQuote ? `
              <button class="btn-action-icon" style="background:#fef3c7; color:#d97706;" title="Convert Quotation to Official Tax Invoice" onclick="convertQuotationToInvoice('${inv.id}')">
                <i class="fas fa-arrow-right-arrow-left"></i>
              </button>
            ` : ''}
            <button class="btn-action-icon btn-edit" title="Edit Document" onclick="openCreateDocModal('${inv.doc_type}', '${inv.id}')">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn-action-icon btn-delete" title="Delete Document" onclick="deleteInvoiceDoc('${inv.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.populateInvoiceCustomerDropdown = function() {
  const select = document.getElementById('invCustomerSelect');
  if (!select) return;

  let optionsHtml = '<option value="">-- Choose Existing CRM Customer or enter below --</option>';
  customers.forEach(cust => {
    optionsHtml += `<option value="${cust.id}">${escapeHtml(cust.name)} (${escapeHtml(cust.phone)}) - ${escapeHtml(cust.city || 'India')}</option>`;
  });
  select.innerHTML = optionsHtml;
};

window.onInvoiceCustomerSelect = function(customerId) {
  if (!customerId) return;
  const cust = customers.find(c => c.id === customerId);
  if (cust) {
    document.getElementById('invCustomerName').value = cust.name || '';
    document.getElementById('invCustomerPhone').value = cust.phone || '';
    document.getElementById('invCustomerEmail').value = cust.email || '';
    if (cust.gstin) {
      const gstinInput = document.getElementById('invCustomerGSTIN');
      if (gstinInput) gstinInput.value = cust.gstin;
    }
    const addrInput = document.getElementById('invBillingAddress');
    if (addrInput) {
      addrInput.value = cust.city ? `${cust.business_name ? cust.business_name + ', ' : ''}${cust.city}` : '';
    }
  }
};

// Smart Intelligent HSN Code Helper with Fallback (மேனுவலாக எடிட் செய்யவும் உதவும்)
window.detectHSNCode = function(productName) {
  if (!productName) return '0910';
  const p = String(productName).toLowerCase();
  if (p.includes('almond') || p.includes('cashew') || p.includes('nut') || p.includes('pista') || p.includes('walnut') || p.includes('badam') || p.includes('kaju') || p.includes('akhrot') || p.includes('pistachio')) {
    return '0801';
  }
  if (p.includes('raisin') || p.includes('date') || p.includes('fig') || p.includes('apricot') || p.includes('kishmish') || p.includes('anjeer') || p.includes('khajoor')) {
    return '0806';
  }
  if (p.includes('cardamom') || p.includes('pepper') || p.includes('clove') || p.includes('cinnamon') || p.includes('elachi') || p.includes('elaichi') || p.includes('lavang') || p.includes('dalchini') || p.includes('kali mirch')) {
    return '0908';
  }
  if (p.includes('tea') || p.includes('coffee') || p.includes('mate')) {
    return '0902';
  }
  if (p.includes('mustard') || p.includes('sesame') || p.includes('seed')) {
    return '1207';
  }
  return '0910'; // Default wholesale spices HSN
};

// Open Create Invoice Modal directly from an Incoming Order (with editable HSN code & tax)
window.openCreateDocFromOrder = function(orderId) {
  const ord = orders.find(o => String(o.order_number || o.id) === String(orderId));
  if (!ord) return;

  populateInvoiceCustomerDropdown();
  const form = document.getElementById('invoiceBuilderForm');
  if (form) form.reset();

  const tbody = document.getElementById('invoiceItemsTbody');
  if (tbody) tbody.innerHTML = '';

  const modalTitle = document.getElementById('invoiceBuilderModalTitle');
  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fas fa-file-invoice-dollar" style="color:var(--accent-green);"></i> Generate Tax Invoice for Order #${escapeHtml(orderId)}`;
  }

  document.getElementById('invDocId').value = '';
  document.getElementById('invDocType').value = 'invoice';

  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  document.getElementById('invDocNumber').value = `MK-INV-${year}-${rand}`;
  document.getElementById('invCustomerName').value = ord.customer_name || ord.customer || '';
  document.getElementById('invCustomerPhone').value = ord.customer_phone || '';
  document.getElementById('invCustomerEmail').value = ord.customer_email || '';
  
  let custGST = ord.customer_gst || ord.customer_gstin || ord.gst || '';
  if (!custGST && ord.notes && ord.notes.includes('GSTIN:')) {
    const match = ord.notes.match(/GSTIN:\s*([A-Z0-9]+)/i);
    if (match) custGST = match[1];
  }
  document.getElementById('invCustomerGSTIN').value = custGST;
  document.getElementById('invBillingAddress').value = ord.delivery_address || (ord.customer_city ? `Delivery Address, ${ord.customer_city}` : 'Consignee Address');
  document.getElementById('invDocDate').value = ord.created_at ? ord.created_at.split(' ')[0] : new Date().toISOString().split('T')[0];

  const d = new Date();
  d.setDate(d.getDate() + 7);
  document.getElementById('invDueDate').value = d.toISOString().split('T')[0];

  document.getElementById('invPaymentTerms').value = `${ord.payment_mode || 'UPI'} - ${ord.transaction_id ? `UTR: ${ord.transaction_id}` : 'Verified'}`;
  document.getElementById('invDeliveryTerms').value = 'SafeXpress / VRL Logistics Door Delivery';
  document.getElementById('invNotes').value = `Generated against Order #${orderId}. Payment Mode: ${ord.payment_mode || 'UPI'} (Ref: ${ord.transaction_id || 'Verified'}). Goods dispatched under GST Regular Scheme.`;

  const primaryB = (adminBankAccountsList && adminBankAccountsList[0]) || JSON.parse(localStorage.getItem('mk_current_account_details') || '{}');
  document.getElementById('invBankDetails').value = `Bank: ${primaryB.bank_name || 'INDIAN BANK'}\nA/C Name: ${primaryB.bank_account_name || 'SRI MK SPICEPOD TRADERS'}\nA/C No: ${primaryB.bank_account_no || '8391488082'}\nIFSC: ${primaryB.bank_ifsc || 'IDBI000A235'}\nBranch: ${primaryB.bank_branch || 'AVINASHI ROAD'}\nUPI ID: ${primaryB.bank_upi || '9843672274@upi'}`;

  document.getElementById('invStatus').value = 'Confirmed';
  document.getElementById('calcDiscountInput').value = 0;
  document.getElementById('calcFreightInput').value = 0;

  const prodName = ord.product_name || ord.product || 'Turmeric Powder';
  const qty = ord.quantity_kg ? Number(ord.quantity_kg) : (parseInt(ord.quantity) || 50);
  const totalAmount = Number(ord.total_amount) || (Number(String(ord.amount).replace(/[^\d.]/g, '')) || 12000);
  const unitRate = Number(ord.unit_price) || Math.round(totalAmount / (qty || 1));
  const proofHsn = document.getElementById('proofModalHSNInput')?.value.trim();
  const proofGst = document.getElementById('proofModalGSTSelect') ? Number(document.getElementById('proofModalGSTSelect').value) : null;
  const orderHsn = proofHsn || ord.hsn_code || detectHSNCode(prodName);
  const orderGst = proofGst !== null && !isNaN(proofGst) ? proofGst : (ord.gst_rate !== undefined ? Number(ord.gst_rate) : (custGST ? 5 : 0));

  addInvoiceItemRow({
    product: prodName,
    grade: 'Premium Wholesale Grade',
    hsn: orderHsn,
    qty: qty,
    rate: unitRate,
    gst_rate: orderGst
  });

  recalculateInvoiceTotals();
  closeModal('viewPaymentProofModal');
  openModal('invoiceBuilderModal');
};

window.openCreateDocModal = function(docType = 'quotation', existingId = null) {
  populateInvoiceCustomerDropdown();
  const form = document.getElementById('invoiceBuilderForm');
  if (form) form.reset();

  const tbody = document.getElementById('invoiceItemsTbody');
  if (tbody) tbody.innerHTML = '';

  const modalTitle = document.getElementById('invoiceBuilderModalTitle');

  if (existingId) {
    const doc = invoices.find(i => i.id === existingId);
    if (!doc) return;

    document.getElementById('invDocId').value = doc.id;
    document.getElementById('invDocType').value = doc.doc_type || docType;
    document.getElementById('invDocNumber').value = doc.doc_number || '';
    document.getElementById('invCustomerSelect').value = doc.customer_id || '';
    document.getElementById('invCustomerName').value = doc.customer_name || '';
    document.getElementById('invCustomerPhone').value = doc.customer_phone || '';
    document.getElementById('invCustomerEmail').value = doc.customer_email || '';
    document.getElementById('invCustomerGSTIN').value = doc.customer_gstin || '';
    document.getElementById('invBillingAddress').value = doc.billing_address || '';
    document.getElementById('invDocDate').value = doc.doc_date || new Date().toISOString().split('T')[0];
    document.getElementById('invDueDate').value = doc.due_date || '';
    document.getElementById('invPaymentTerms').value = doc.payment_terms || '100% Advance before Dispatch';
    document.getElementById('invDeliveryTerms').value = doc.delivery_terms || 'SafeXpress / VRL Logistics Door Delivery';
    document.getElementById('invNotes').value = doc.notes || '';
    document.getElementById('invBankDetails').value = doc.bank_details || 'Bank: INDIAN BANK\nA/C Name: SRI MK SPICEPOD TRADERS\nA/C No: 8391488082\nIFSC: IDBI000A235\nBranch: AVINASHI ROAD\nUPI ID: 9843672274@upi';
    document.getElementById('invStatus').value = doc.status || 'Draft';
    document.getElementById('calcDiscountInput').value = doc.discount || 0;
    document.getElementById('calcFreightInput').value = doc.freight || 0;

    if (modalTitle) {
      modalTitle.innerHTML = `<i class="fas fa-file-invoice" style="color:var(--accent-green);"></i> Edit ${doc.doc_type === 'quotation' ? 'Wholesale Quotation' : 'GST Tax Invoice'} #${escapeHtml(doc.doc_number)}`;
    }

    let items = [];
    if (typeof doc.items_json === 'string') {
      try { items = JSON.parse(doc.items_json); } catch(e) { items = []; }
    } else if (Array.isArray(doc.items_json)) {
      items = doc.items_json;
    }

    if (items.length > 0) {
      items.forEach(it => addInvoiceItemRow(it));
    } else {
      addInvoiceItemRow();
    }
  } else {
    // New Document
    document.getElementById('invDocId').value = '';
    document.getElementById('invDocType').value = docType;
    
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    const prefix = docType === 'invoice' ? 'MK-INV' : 'MK-QT';
    document.getElementById('invDocNumber').value = `${prefix}-${year}-${rand}`;
    document.getElementById('invDocDate').value = new Date().toISOString().split('T')[0];

    const d = new Date();
    d.setDate(d.getDate() + 7);
    document.getElementById('invDueDate').value = d.toISOString().split('T')[0];

    document.getElementById('invPaymentTerms').value = '100% Advance before Dispatch';
    document.getElementById('invDeliveryTerms').value = 'SafeXpress / VRL Logistics Door Delivery';
    document.getElementById('invNotes').value = 'Wholesale bulk rates valid for 7 days. Export lab moisture certified packaging. Goods dispatched under GST Regular Scheme.';
    
    const primaryB = (adminBankAccountsList && adminBankAccountsList[0]) || JSON.parse(localStorage.getItem('mk_current_account_details') || '{}');
    document.getElementById('invBankDetails').value = `Bank: ${primaryB.bank_name || 'INDIAN BANK'}\nA/C Name: ${primaryB.bank_account_name || 'SRI MK SPICEPOD TRADERS'}\nA/C No: ${primaryB.bank_account_no || '8391488082'}\nIFSC: ${primaryB.bank_ifsc || 'IDBI000A235'}\nBranch: ${primaryB.bank_branch || 'AVINASHI ROAD'}\nUPI ID: ${primaryB.bank_upi || '9843672274@upi'}`;
    
    document.getElementById('invStatus').value = docType === 'invoice' ? 'Confirmed' : 'Draft';
    document.getElementById('calcDiscountInput').value = 0;
    document.getElementById('calcFreightInput').value = 0;

    if (modalTitle) {
      modalTitle.innerHTML = `<i class="fas fa-file-invoice-dollar" style="color:var(--accent-green);"></i> Create New ${docType === 'quotation' ? 'Wholesale Quotation' : 'GST Tax Invoice'}`;
    }

    addInvoiceItemRow();
  }

  recalculateInvoiceTotals();
  openModal('invoiceBuilderModal');
};

window.onDocTypeChange = function(type) {
  const docId = document.getElementById('invDocId').value;
  if (!docId) {
    const year = new Date().getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    const prefix = type === 'invoice' ? 'MK-INV' : 'MK-QT';
    document.getElementById('invDocNumber').value = `${prefix}-${year}-${rand}`;
  }
  const modalTitle = document.getElementById('invoiceBuilderModalTitle');
  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fas fa-file-invoice-dollar" style="color:var(--accent-green);"></i> ${docId ? 'Edit' : 'Create New'} ${type === 'quotation' ? 'Wholesale Quotation' : 'GST Tax Invoice'}`;
  }
};

window.addInvoiceItemRow = function(itemData = null) {
  const tbody = document.getElementById('invoiceItemsTbody');
  if (!tbody) return;

  const row = document.createElement('tr');
  row.className = 'invoice-item-row';

  const firstProd = products[0] || {};
  const firstPrice = firstProd.price || (firstProd.price_wholesale ? firstProd.price_wholesale.replace(/[^\d.]/g, '') : '240') || '240';
  const firstGrade = firstProd.grade || firstProd.badge_tag || 'Standard Wholesale Grade';
  const firstHsn = firstProd.hsn_code || detectHSNCode(firstProd.name);

  const selectedProd = itemData ? itemData.product : (firstProd.name || '');
  const foundProd = products.find(p => p.name === selectedProd);
  const hsnCode = itemData ? (itemData.hsn || itemData.hsn_code || (foundProd ? foundProd.hsn_code : null) || detectHSNCode(selectedProd)) : (foundProd ? (foundProd.hsn_code || detectHSNCode(foundProd.name)) : firstHsn);
  const grade = itemData ? itemData.grade : firstGrade;
  const qty = itemData ? itemData.qty : 50;
  const rate = itemData ? itemData.rate : firstPrice;
  const gstRate = itemData ? (itemData.gst_rate !== undefined ? itemData.gst_rate : 0) : 0;

  let prodOptions = `<option value="">-- Select Product --</option>`;
  products.forEach(p => {
    const isSel = p.name === selectedProd ? 'selected' : '';
    const pPrice = p.price || (p.price_wholesale ? p.price_wholesale.replace(/[^\d.]/g, '') : '240') || '240';
    const pGrade = p.grade || p.badge_tag || 'Standard Wholesale Grade';
    const pHsn = p.hsn_code || detectHSNCode(p.name);
    prodOptions += `<option value="${escapeHtml(p.name)}" data-grade="${escapeHtml(pGrade)}" data-price="${pPrice}" data-hsn="${escapeHtml(pHsn)}" ${isSel}>${escapeHtml(p.name)} (₹${pPrice}/kg)</option>`;
  });

  row.innerHTML = `
    <td>
      <select class="form-control-admin item-prod-select" onchange="onInvoiceItemProductChange(this)" style="padding:6px 6px; font-size:0.85rem; font-weight:700;">
        ${prodOptions}
      </select>
      <input type="text" class="form-control-admin item-prod-custom" placeholder="Or custom item name" value="${escapeHtml(selectedProd || '')}" style="margin-top:4px; padding:4px 8px; font-size:0.8rem; display:${selectedProd && !products.some(p => p.name === selectedProd) ? 'block' : 'none'};">
    </td>
    <td>
      <input type="text" class="form-control-admin item-hsn" value="${escapeHtml(hsnCode || '0910')}" placeholder="e.g. 0910, 0801" title="Editable HSN Code (மேனுவலாக எடிட் செய்யலாம்)" style="padding:6px 4px; font-size:0.85rem; font-family:monospace; text-align:center; font-weight:700; color:#0b4328; background:#f0fdf4; border-color:#86efac;">
    </td>
    <td>
      <input type="text" class="form-control-admin item-grade" value="${escapeHtml(grade || '')}" placeholder="e.g. Grade A Salem" style="padding:6px 6px; font-size:0.85rem;">
    </td>
    <td>
      <input type="number" class="form-control-admin item-qty" value="${qty}" min="0.1" step="any" oninput="recalculateInvoiceTotals()" style="padding:6px 4px; font-size:0.85rem; text-align:right;">
    </td>
    <td>
      <input type="number" class="form-control-admin item-rate" value="${rate}" min="0" step="any" oninput="recalculateInvoiceTotals()" style="padding:6px 4px; font-size:0.85rem; text-align:right;">
    </td>
    <td>
      <select class="form-control-admin item-gst" onchange="recalculateInvoiceTotals()" style="padding:6px 2px; font-size:0.83rem; font-weight:700;">
        <option value="0" ${Number(gstRate) === 0 ? 'selected' : ''}>0% (Nil)</option>
        <option value="5" ${Number(gstRate) === 5 ? 'selected' : ''}>5% (GST)</option>
        <option value="12" ${Number(gstRate) === 12 ? 'selected' : ''}>12%</option>
        <option value="18" ${Number(gstRate) === 18 ? 'selected' : ''}>18%</option>
        <option value="28" ${Number(gstRate) === 28 ? 'selected' : ''}>28%</option>
      </select>
    </td>
    <td style="text-align:right; font-weight:700; color:var(--primary); font-size:0.88rem;" class="item-total-disp">
      ₹0.00
    </td>
    <td style="text-align:center;">
      <button type="button" class="btn-action-icon btn-delete" title="Remove Row" onclick="deleteInvoiceItemRow(this)" style="padding:4px 6px;">
        <i class="fas fa-trash" style="font-size:0.8rem;"></i>
      </button>
    </td>
  `;

  tbody.appendChild(row);
  recalculateInvoiceTotals();
};

window.deleteInvoiceItemRow = function(btn) {
  const row = btn.closest('tr');
  const tbody = document.getElementById('invoiceItemsTbody');
  if (tbody && tbody.children.length <= 1) {
    showToast("At least one product item is required.");
    return;
  }
  if (row) {
    row.remove();
    recalculateInvoiceTotals();
  }
};

window.onInvoiceItemProductChange = function(selectEl) {
  const row = selectEl.closest('tr');
  if (!row) return;

  const customInput = row.querySelector('.item-prod-custom');
  const hsnInput = row.querySelector('.item-hsn');
  const gradeInput = row.querySelector('.item-grade');
  const rateInput = row.querySelector('.item-rate');

  if (selectEl.value === '') {
    if (customInput) customInput.style.display = 'block';
    return;
  }

  if (customInput) customInput.style.display = 'none';

  const opt = selectEl.selectedOptions[0];
  if (opt) {
    if (gradeInput && opt.dataset.grade) gradeInput.value = opt.dataset.grade;
    if (rateInput && opt.dataset.price) rateInput.value = opt.dataset.price;
    if (hsnInput && opt.dataset.hsn) hsnInput.value = opt.dataset.hsn;
    else if (hsnInput) hsnInput.value = detectHSNCode(selectEl.value);
  }
  recalculateInvoiceTotals();
};

window.recalculateInvoiceTotals = function() {
  const rows = document.querySelectorAll('#invoiceItemsTbody tr');
  let subtotal = 0;
  let totalGst = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.item-qty')?.value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate')?.value) || 0;
    const gstRate = parseFloat(row.querySelector('.item-gst')?.value) || 0;

    const lineTotal = qty * rate;
    const lineGst = lineTotal * (gstRate / 100);

    const totalDisp = row.querySelector('.item-total-disp');
    if (totalDisp) {
      totalDisp.textContent = '₹' + lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    subtotal += lineTotal;
    totalGst += lineGst;
  });

  const discount = parseFloat(document.getElementById('calcDiscountInput')?.value) || 0;
  const freight = parseFloat(document.getElementById('calcFreightInput')?.value) || 0;

  const grandTotal = Math.max(0, subtotal - discount + freight + totalGst);

  const subtotalEl = document.getElementById('calcSubtotalDisplay');
  const gstEl = document.getElementById('calcGSTDisplay');
  const grandTotalEl = document.getElementById('calcGrandTotalDisplay');

  if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (gstEl) gstEl.textContent = '₹' + totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (grandTotalEl) grandTotalEl.textContent = '₹' + grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

window.saveInvoiceDoc = function(e) {
  if (e) e.preventDefault();

  const docId = document.getElementById('invDocId').value || `inv_${Date.now()}`;
  const docType = document.getElementById('invDocType').value;
  const docNumber = document.getElementById('invDocNumber').value.trim();
  const customerId = document.getElementById('invCustomerSelect').value;
  const customerName = document.getElementById('invCustomerName').value.trim();
  const customerPhone = document.getElementById('invCustomerPhone').value.trim();
  const customerEmail = document.getElementById('invCustomerEmail').value.trim();
  const customerGSTIN = document.getElementById('invCustomerGSTIN').value.trim();
  const billingAddress = document.getElementById('invBillingAddress').value.trim();
  const docDate = document.getElementById('invDocDate').value;
  const dueDate = document.getElementById('invDueDate').value;
  const paymentTerms = document.getElementById('invPaymentTerms').value.trim();
  const deliveryTerms = document.getElementById('invDeliveryTerms').value.trim();
  const notes = document.getElementById('invNotes').value.trim();
  const bankDetails = document.getElementById('invBankDetails').value.trim();
  const status = document.getElementById('invStatus').value;

  const discount = parseFloat(document.getElementById('calcDiscountInput').value) || 0;
  const freight = parseFloat(document.getElementById('calcFreightInput').value) || 0;

  const rows = document.querySelectorAll('#invoiceItemsTbody tr');
  const items = [];
  let subtotal = 0;
  let totalGst = 0;

  rows.forEach(row => {
    const select = row.querySelector('.item-prod-select');
    const custom = row.querySelector('.item-prod-custom');
    const prodName = (select.value === '' && custom.value ? custom.value : select.value) || 'Wholesale Commodity';
    const hsn = row.querySelector('.item-hsn')?.value.trim() || detectHSNCode(prodName);
    const grade = row.querySelector('.item-grade').value.trim();
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
    const gstRate = parseFloat(row.querySelector('.item-gst').value) || 0;
    const amount = qty * rate;

    items.push({
      product: prodName,
      hsn: hsn,
      hsn_code: hsn,
      grade: grade,
      qty: qty,
      rate: rate,
      gst_rate: gstRate,
      amount: amount
    });

    subtotal += amount;
    totalGst += amount * (gstRate / 100);
  });

  if (items.length === 0) {
    showToast("Please add at least one line item.");
    return;
  }

  const grandTotal = Math.max(0, subtotal - discount + freight + totalGst);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const invoicePayload = {
    id: docId,
    doc_type: docType,
    doc_number: docNumber,
    customer_id: customerId,
    customer_name: customerName,
    customer_phone: customerPhone,
    customer_email: customerEmail,
    customer_gstin: customerGSTIN,
    customer_city: customerId ? (customers.find(c => c.id === customerId)?.city || '') : '',
    billing_address: billingAddress,
    doc_date: docDate,
    due_date: dueDate,
    payment_terms: paymentTerms,
    delivery_terms: deliveryTerms,
    items_json: items,
    subtotal: subtotal,
    discount: discount,
    gst_amount: totalGst,
    freight: freight,
    grand_total: grandTotal,
    notes: notes,
    bank_details: bankDetails,
    status: status,
    created_at: now,
    updated_at: now
  };

  // 1. Supabase PostgreSQL Upsert
  if (window.MKSupabase && window.MKSupabase.Invoices) {
    try {
      window.MKSupabase.Invoices.upsert({
        id: typeof docId === 'string' && docId.length > 10 ? docId : undefined,
        doc_type: docType,
        doc_number: docNumber,
        customer_id: customerId && customerId.length > 10 ? customerId : undefined,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_gstin: customerGSTIN,
        customer_city: customerId ? (customers.find(c => c.id === customerId)?.city || '') : '',
        billing_address: billingAddress,
        doc_date: docDate,
        due_date: dueDate || null,
        payment_terms: paymentTerms,
        delivery_terms: deliveryTerms,
        items: items,
        subtotal: subtotal,
        discount: discount,
        gst_amount: totalGst,
        freight: freight,
        grand_total: grandTotal,
        notes: notes,
        bank_details: bankDetails,
        status: status
      }).then(res => {
        if (res.data && res.data.id) {
          invoicePayload.id = res.data.id;
          saveState();
        }
      }).catch(err => console.warn('Supabase invoice save error:', err));
    } catch (e) {
      console.warn('Supabase invoice error:', e);
    }
  }

  // 2. Fallback REST API
  fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoicePayload)
  }).then(r => r.json()).catch(() => {});

  // Update local state
  const existingIndex = invoices.findIndex(i => i.id === docId);
  if (existingIndex >= 0) {
    invoicePayload.created_at = invoices[existingIndex].created_at;
    invoices[existingIndex] = invoicePayload;
  } else {
    invoices.unshift(invoicePayload);
  }

  // If customer doesn't exist in CRM, auto-register customer
  if (customerPhone && !customers.some(c => c.phone === customerPhone)) {
    const newCust = {
      id: `cust_${Date.now()}`,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      city: billingAddress ? billingAddress.split(',').pop().trim() : 'India',
      orders: 1,
      spent: '₹' + Math.round(grandTotal).toLocaleString('en-IN'),
      last_active: now
    };
    customers.unshift(newCust);

    if (window.MKSupabase && window.MKSupabase.Customers) {
      window.MKSupabase.Customers.upsert(newCust).catch(() => {});
    }
  }

  saveState();
  renderInvoicesTable();
  renderCustomersTable();
  renderDashboard();

  closeModal('invoiceBuilderModal');
  showToast(`${docType === 'quotation' ? 'Wholesale Quotation' : 'GST Tax Invoice'} #${docNumber} saved!`);
};

window.viewInvoicePrintPreview = function(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  activeViewingInvoiceId = id;

  let items = [];
  if (typeof inv.items_json === 'string') {
    try { items = JSON.parse(inv.items_json); } catch(e) { items = []; }
  } else if (Array.isArray(inv.items_json)) {
    items = inv.items_json;
  }

  const isQuote = (inv.doc_type || '').toLowerCase() === 'quotation';
  const docTitle = isQuote ? 'WHOLESALE PROFORMA QUOTATION' : 'TAX INVOICE (GST REGULAR)';
  const docBadgeClass = isQuote ? 'badge-quotation' : 'badge-invoice';

  const container = document.getElementById('invoicePrintPaperContainer');
  if (!container) return;

  const words = numberToWordsINR(inv.grand_total);

  let itemsRowsHtml = '';
  items.forEach((it, idx) => {
    const hsn = it.hsn || it.hsn_code || detectHSNCode(it.product);

    const itemTotal = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
    const itemGst = (it.gst_rate !== undefined && it.gst_rate !== null && it.gst_rate !== '') ? Number(it.gst_rate) : 0;

    itemsRowsHtml += `
      <tr>
        <td style="text-align:center;">${idx + 1}</td>
        <td>
          <strong style="color:#0f172a;">${escapeHtml(it.product || 'Wholesale Commodity')}</strong>
          ${it.grade ? `<br><small style="color:#64748b;">Grade: ${escapeHtml(it.grade)}</small>` : ''}
        </td>
        <td style="text-align:center; font-family:monospace; color:#475569;">${hsn}</td>
        <td style="text-align:right; font-weight:700;">${it.qty} kg</td>
        <td style="text-align:right;">₹${(parseFloat(it.rate) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td style="text-align:center;">${itemGst}%</td>
        <td style="text-align:right; font-weight:700; color:#0b4328;">₹${itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="invoice-paper-wrapper" id="printableInvoiceDocument">
      
      <!-- Letterhead Header -->
      <div class="invoice-paper-header">
        <div style="display:flex; align-items:center; gap:16px;">
          <div class="invoice-logo-badge">MK</div>
          <div>
            <h1 class="invoice-company-name">SRI MK SPICEPOD TRADERS</h1>
            <div class="invoice-company-sub">Wholesale Direct Supplier • Premium Spices, Dry Fruits &amp; Gourmet Nuts</div>
            <div class="invoice-company-meta">
              <strong>Proprietor:</strong> MANIKAMOORTHY RAYAPPAN &nbsp;|&nbsp; <strong>Constitution:</strong> Proprietorship<br>
              <strong>GSTIN:</strong> 33AUJPM5853C1ZP &nbsp;|&nbsp; <strong>PAN:</strong> AUJPM5853C &nbsp;|&nbsp; <strong>State:</strong> Tamil Nadu (33)<br>
              No.148 D5, TTP Mill Road, Nataraja Layout, Karipparayan Kovil Street, Saminathapuram, 15 Velampalayam, Thirumuruganpoondi, Tiruppur, Tamil Nadu - 641652<br>
              Phone: +91 98436 72274 &nbsp;|&nbsp; Email: mktraders4434@gmail.com
            </div>
          </div>
        </div>

        <div style="text-align:right;">
          <div class="badge-doc ${docBadgeClass}" style="font-size:0.95rem; padding:6px 14px; text-transform:uppercase; letter-spacing:0.5px; display:inline-block; margin-bottom:6px;">
            ${docTitle}
          </div>
          <div style="font-size:1.15rem; font-weight:800; color:var(--text-dark);">${escapeHtml(inv.doc_number)}</div>
          <div style="font-size:0.82rem; color:#64748b;">Original for Consignee</div>
        </div>
      </div>

      <!-- Meta Grid: Billed To & Document Details -->
      <div class="invoice-meta-grid">
        <div class="invoice-meta-box">
          <div class="invoice-meta-title"><i class="fas fa-user-check"></i> BILLED TO / BUYER (CONSIGNEE)</div>
          <div style="font-size:1.05rem; font-weight:800; color:#0f172a; margin-bottom:4px;">${escapeHtml(inv.customer_name || 'Wholesale Client')}</div>
          ${inv.customer_gstin ? `<div style="font-size:0.85rem; color:#1e293b; margin-bottom:2px;"><strong>GSTIN:</strong> ${escapeHtml(inv.customer_gstin)}</div>` : '<div style="font-size:0.85rem; color:#64748b;"><strong>GST Status:</strong> Unregistered / Regular Wholesale</div>'}
          <div style="font-size:0.85rem; color:#475569; margin-bottom:2px;"><strong>Phone / WA:</strong> +91 ${escapeHtml(inv.customer_phone || '')}</div>
          ${inv.customer_email ? `<div style="font-size:0.85rem; color:#475569; margin-bottom:2px;"><strong>Email:</strong> ${escapeHtml(inv.customer_email)}</div>` : ''}
          <div style="font-size:0.85rem; color:#475569; margin-top:4px;"><strong>Delivery Address:</strong> ${escapeHtml(inv.billing_address || 'As per transporter consignment note')}</div>
        </div>

        <div class="invoice-meta-box">
          <div class="invoice-meta-title"><i class="fas fa-file-lines"></i> DISPATCH &amp; TERMS INFO</div>
          <table style="width:100%; font-size:0.85rem; border-collapse:collapse;">
            <tr>
              <td style="color:#64748b; padding:3px 0;">Document Date:</td>
              <td style="font-weight:700; text-align:right;">${escapeHtml(inv.doc_date || '')}</td>
            </tr>
            <tr>
              <td style="color:#64748b; padding:3px 0;">Due / Validity Date:</td>
              <td style="font-weight:700; text-align:right; color:#dc2626;">${escapeHtml(inv.due_date || 'Within 7 Days')}</td>
            </tr>
            <tr>
              <td style="color:#64748b; padding:3px 0;">Place of Supply:</td>
              <td style="font-weight:700; text-align:right;">${escapeHtml(inv.customer_city || 'Tamil Nadu (33)')}</td>
            </tr>
            <tr>
              <td style="color:#64748b; padding:3px 0;">Payment Terms:</td>
              <td style="font-weight:700; text-align:right;">${escapeHtml(inv.payment_terms || '100% Advance')}</td>
            </tr>
            <tr>
              <td style="color:#64748b; padding:3px 0;">Transport / Dispatch:</td>
              <td style="font-weight:700; text-align:right;">${escapeHtml(inv.delivery_terms || 'Transport Door Delivery')}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Line Items Table -->
      <table class="print-table">
        <thead>
          <tr>
            <th style="width:5%; text-align:center;">#</th>
            <th style="width:38%;">Description of Goods &amp; Grade</th>
            <th style="width:10%; text-align:center;">HSN Code</th>
            <th style="width:12%; text-align:right;">Quantity</th>
            <th style="width:13%; text-align:right;">Rate (₹/kg)</th>
            <th style="width:8%; text-align:center;">GST</th>
            <th style="width:14%; text-align:right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      <!-- Calculation Breakdown -->
      <div style="display:grid; grid-template-columns: 1.2fr 1fr; gap:20px; margin-top:16px;">
        <div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:12px;">
            <div style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:4px;">Amount Chargeable in Words:</div>
            <div style="font-size:0.95rem; font-weight:800; color:#0b4328; font-style:italic;">${words}</div>
          </div>

          <!-- Bank Account Details Card -->
          <div class="invoice-bank-card">
            <div style="font-size:0.85rem; font-weight:800; color:#0b4328; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
              <i class="fas fa-building-columns"></i> Official Bank Remittance Account
            </div>
            <div style="font-size:0.82rem; color:#1e293b; line-height:1.5; white-space:pre-line;">
              ${escapeHtml(inv.bank_details || 'Bank: INDIAN BANK\nA/C Name: SRI MK SPICEPOD TRADERS\nA/C No: 8391488082\nIFSC: IDBI000A235\nBranch: AVINASHI ROAD\nUPI ID: 9843672274@upi')}
            </div>
          </div>
        </div>

        <div>
          <table style="width:100%; font-size:0.88rem; border-collapse:collapse;">
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 0; color:#64748b;">Subtotal (Taxable Value):</td>
              <td style="padding:6px 0; text-align:right; font-weight:700;">₹${(parseFloat(inv.subtotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            ${inv.discount > 0 ? `
              <tr style="border-bottom:1px solid #e2e8f0; color:#16a34a;">
                <td style="padding:6px 0;">Wholesale Trade Discount:</td>
                <td style="padding:6px 0; text-align:right; font-weight:700;">- ₹${(parseFloat(inv.discount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 0; color:#64748b;">GST Output Tax (CGST+SGST / IGST):</td>
              <td style="padding:6px 0; text-align:right; font-weight:700;">₹${(parseFloat(inv.gst_amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            ${inv.freight > 0 ? `
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 0; color:#64748b;">Freight / Forwarding Charges:</td>
                <td style="padding:6px 0; text-align:right; font-weight:700;">₹${(parseFloat(inv.freight) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ` : ''}
            <tr style="background:#edf7f0; border-top:2px solid #0b4328;">
              <td style="padding:10px 8px; font-size:1.05rem; font-weight:800; color:#0b4328;">TOTAL AMOUNT:</td>
              <td style="padding:10px 8px; font-size:1.25rem; font-weight:900; text-align:right; color:#0b4328;">₹${(parseFloat(inv.grand_total) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Notes & Terms -->
      ${inv.notes ? `
        <div style="margin-top:14px; font-size:0.8rem; color:#64748b; background:#f8fafc; padding:8px 12px; border-radius:6px; border-left:3px solid #0b4328;">
          <strong>Terms &amp; Notes:</strong> ${escapeHtml(inv.notes)}
        </div>
      ` : ''}

      <!-- Authorized Signature Footer -->
      <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:30px; padding-top:14px; border-top:1px dashed #cbd5e1;">
        <div style="font-size:0.75rem; color:#94a3b8; line-height:1.5;">
          This is a computer generated official document.<br>
          Jurisdictional Office: GANDHI NAGAR, Tiruppur.<br>
          Subject to Tiruppur Jurisdiction.
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700; font-size:0.85rem; color:#0f172a; margin-bottom:4px;">For SRI MK SPICEPOD TRADERS</div>
          <div style="font-size:0.8rem; color:#475569; margin-bottom:32px;">MANIKAMOORTHY RAYAPPAN</div>
          <div style="font-size:0.8rem; color:#64748b; border-top:1px solid #94a3b8; display:inline-block; padding-top:4px;">
            Proprietor / Authorized Signatory
          </div>
        </div>
      </div>

    </div>
  `;

  // Set WhatsApp button click handler
  const waBtn = document.getElementById('printModalWaBtn');
  if (waBtn) {
    waBtn.onclick = () => shareActiveInvoiceOnWhatsApp(inv.id);
  }

  openModal('invoicePrintModal');
};

/// =========================================================================
// PDF INVOICE DOWNLOAD & PRINT CONTROLLERS (இன்வாய்ஸ் பதிவிறக்கம் & அச்சிடுதல்)
// =========================================================================

// Standalone Isolated A4 PDF Generator (Guarantees zero clipping, perfect alignment on all devices)
window.exportHTMLToA4PDF = function(htmlContent, filename) {
  return new Promise((resolve) => {
    // 1. Clean up any stale render host
    const oldHost = document.getElementById('mk-pdf-render-host');
    if (oldHost) oldHost.remove();

    // 2. Create isolated render host
    const host = document.createElement('div');
    host.id = 'mk-pdf-render-host';
    host.style.cssText = 'position: absolute; left: 0; top: 0; width: 750px; min-width: 750px; max-width: 750px; background: #ffffff; z-index: 99999999; margin: 0; padding: 0; box-sizing: border-box; pointer-events: none;';
    host.innerHTML = htmlContent;
    document.body.appendChild(host);

    setTimeout(async () => {
      try {
        if (typeof html2pdf !== 'undefined') {
          const targetEl = host.querySelector('#pdf-root') || host;
          const opt = {
            margin: [6, 6, 6, 6],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              logging: false,
              scrollY: 0,
              scrollX: 0,
              backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          const worker = html2pdf().set(opt).from(targetEl);
          const pdfBlob = await worker.outputPdf('blob');
          host.remove();

          // Native browser anchor download
          const blobUrl = URL.createObjectURL(pdfBlob);
          const dl = document.createElement('a');
          dl.href = blobUrl;
          dl.download = filename;
          document.body.appendChild(dl);
          dl.click();
          setTimeout(() => {
            dl.remove();
            URL.revokeObjectURL(blobUrl);
          }, 3000);

          if (typeof showToast === 'function') showToast(`Downloaded: ${filename}`);
          resolve(true);
        } else {
          host.remove();
          openPrintWindow(htmlContent);
          resolve(false);
        }
      } catch (err) {
        console.warn('PDF export fallback:', err);
        host.remove();
        openPrintWindow(htmlContent);
        resolve(false);
      }
    }, 150);
  });
};

function openPrintWindow(htmlContent) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  } else {
    window.print();
  }
}

window.downloadActiveInvoicePDF = async function(id = null) {
  const targetId = id || activeViewingInvoiceId;
  const inv = invoices.find(i => i.id === targetId);
  
  if (!inv) {
    showToast('No active invoice found to download.');
    return;
  }

  const docType = inv.doc_type || 'invoice';
  const docNumber = inv.doc_number || 'MK-DOC';
  const filename = `${docType === 'invoice' ? 'MK_Tax_Invoice' : 'MK_Quotation'}_${docNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  const isQuote = (docType).toLowerCase() === 'quotation';
  const docTitle = isQuote ? 'WHOLESALE PROFORMA QUOTATION' : 'TAX INVOICE (GST REGULAR)';

  let items = [];
  if (typeof inv.items_json === 'string') {
    try { items = JSON.parse(inv.items_json); } catch(e) { items = []; }
  } else if (Array.isArray(inv.items_json)) {
    items = inv.items_json;
  }

  const words = numberToWordsINR(inv.grand_total);

  let itemsRowsHtml = '';
  items.forEach((it, idx) => {
    const hsn = it.hsn || it.hsn_code || detectHSNCode(it.product);
    const itemTotal = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
    const itemGst = (it.gst_rate !== undefined && it.gst_rate !== null && it.gst_rate !== '') ? Number(it.gst_rate) : 0;

    itemsRowsHtml += `
      <tr>
        <td style="padding: 7px 4px; text-align: center; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${idx + 1}</td>
        <td style="padding: 7px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">
          <strong style="color: #0f172a;">${escapeHtml(it.product || 'Wholesale Commodity')}</strong>
          ${it.grade ? `<br><small style="color: #64748b;">Grade: ${escapeHtml(it.grade)}</small>` : ''}
        </td>
        <td style="padding: 7px 4px; text-align: center; font-family: monospace; color: #475569; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${hsn}</td>
        <td style="padding: 7px 6px; text-align: right; font-weight: 700; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${it.qty} kg</td>
        <td style="padding: 7px 6px; text-align: right; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">₹${(parseFloat(it.rate) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td style="padding: 7px 4px; text-align: center; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${itemGst}%</td>
        <td style="padding: 7px 8px; text-align: right; font-weight: 800; color: #0b4328; border-bottom: 1px solid #e2e8f0; font-size: 10px;">₹${itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  });

  showToast(`Generating PDF: ${filename}...`);

  const htmlDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=794">
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            width: 750px !important;
            min-width: 750px !important;
            max-width: 750px !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 10px !important;
            color: #0f172a !important;
            line-height: 1.35 !important;
          }
          #pdf-root {
            width: 750px !important;
            min-width: 750px !important;
            max-width: 750px !important;
            margin: 0 auto !important;
            padding: 16px 18px !important;
            background: #ffffff !important;
            border: 2px solid #0b4328 !important;
            border-radius: 8px !important;
            box-sizing: border-box !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            border-spacing: 0 !important;
            table-layout: fixed !important;
          }
          th, td {
            box-sizing: border-box !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
          }
        </style>
      </head>
      <body>
        <div id="pdf-root">
          <!-- HEADER -->
          <table style="width: 100%; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 10px;">
            <tr>
              <td style="width: 52px; vertical-align: middle; padding: 0;">
                <div style="width: 44px; height: 44px; background-color: #0b4328; color: #ffffff; border-radius: 6px; text-align: center; line-height: 44px; font-size: 20px; font-weight: 900;">MK</div>
              </td>
              <td style="vertical-align: middle; padding-left: 10px;">
                <div style="font-size: 17px; font-weight: 900; color: #0b4328; line-height: 1.15;">SRI MK SPICEPOD TRADERS</div>
                <div style="font-size: 9.5px; color: #059669; font-weight: 700; text-transform: uppercase; margin-top: 1px;">Wholesale Direct Supplier • Spices, Dry Fruits &amp; Gourmet Nuts</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 2px; line-height: 1.3;">
                  <strong>Proprietor:</strong> MANIKAMOORTHY RAYAPPAN &bull; <strong>GSTIN:</strong> 33AUJPM5853C1ZP &bull; <strong>PAN:</strong> AUJPM5853C<br>
                  No.148 D5, TTP Mill Road, Nataraja Layout, Thirumuruganpoondi, Tiruppur, TN - 641652<br>
                  Phone: +91 98436 72274 &bull; Email: mktraders4434@gmail.com
                </div>
              </td>
              <td style="width: 190px; text-align: right; vertical-align: top; padding: 0;">
                <div style="background-color: #059669; color: #ffffff; font-weight: 800; font-size: 9px; padding: 3px 8px; border-radius: 10px; display: inline-block;">${docTitle}</div>
                <div style="font-size: 13px; font-weight: 900; margin-top: 3px; color: #0f172a;">${escapeHtml(inv.doc_number)}</div>
                <div style="font-size: 8.5px; color: #64748b; margin-top: 1px;">Original for Consignee</div>
              </td>
            </tr>
          </table>

          <!-- CUSTOMER & TERMS INFO (2 COLUMNS) -->
          <table style="width: 100%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 10px;">
            <tr>
              <td style="width: 52%; padding: 8px 10px; border-right: 1px solid #e2e8f0; font-size: 9.5px; vertical-align: top;">
                <strong style="color: #059669; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;">BILLED TO / BUYER (CONSIGNEE):</strong><br>
                <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px;">${escapeHtml(inv.customer_name || 'Wholesale Client')}</div>
                ${inv.customer_gstin ? `<div style="color: #1e293b; font-size: 9.5px; margin-top: 1px;"><strong>GSTIN:</strong> <span style="font-family: monospace; font-weight: 700; color: #0b4328;">${escapeHtml(inv.customer_gstin)}</span></div>` : '<div style="color: #64748b; font-size: 8.5px; margin-top: 1px;"><strong>GST Status:</strong> Regular Wholesale Consignee</div>'}
                <div style="color: #475569; margin-top: 1px; font-size: 9px;">Phone: +91 ${escapeHtml(inv.customer_phone || '')} ${inv.customer_email ? `&bull; Email: ${escapeHtml(inv.customer_email)}` : ''}</div>
                <div style="margin-top: 1px; color: #334155; font-size: 9px; line-height: 1.3;"><strong>Delivery Address:</strong> ${escapeHtml(inv.billing_address || 'As per consignment note')}</div>
              </td>
              <td style="width: 48%; padding: 8px 10px; font-size: 9px; vertical-align: top;">
                <strong style="color: #059669; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;">DISPATCH &amp; TERMS INFO:</strong>
                <table style="width: 100%; margin-top: 2px; font-size: 9px;">
                  <tr><td style="color: #64748b; padding: 1px 0;">Document Date:</td><td style="text-align: right; font-weight: 700; padding: 1px 0;">${escapeHtml(inv.doc_date || '')}</td></tr>
                  <tr><td style="color: #64748b; padding: 1px 0;">Due / Validity:</td><td style="text-align: right; font-weight: 700; color: #dc2626; padding: 1px 0;">${escapeHtml(inv.due_date || 'Within 7 Days')}</td></tr>
                  <tr><td style="color: #64748b; padding: 1px 0;">Place of Supply:</td><td style="text-align: right; font-weight: 700; padding: 1px 0;">${escapeHtml(inv.customer_city || 'Tamil Nadu (33)')}</td></tr>
                  <tr><td style="color: #64748b; padding: 1px 0;">Payment Terms:</td><td style="text-align: right; font-weight: 700; padding: 1px 0;">${escapeHtml(inv.payment_terms || '100% Advance')}</td></tr>
                  <tr><td style="color: #64748b; padding: 1px 0;">Dispatch Mode:</td><td style="text-align: right; font-weight: 700; padding: 1px 0;">${escapeHtml(inv.delivery_terms || 'Transport Express')}</td></tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- ITEMS TABLE -->
          <table style="width: 100%; border: 1px solid #cbd5e1; margin-bottom: 10px;">
            <thead>
              <tr style="background-color: #0b4328; color: #ffffff;">
                <th style="width: 5%; text-align: center; background-color: #0b4328; color: #ffffff; padding: 6px 4px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">#</th>
                <th style="width: 38%; text-align: left; background-color: #0b4328; color: #ffffff; padding: 6px 8px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">Description of Goods &amp; Grade</th>
                <th style="width: 11%; text-align: center; background-color: #0b4328; color: #ffffff; padding: 6px 4px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">HSN</th>
                <th style="width: 12%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 6px 6px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">Quantity</th>
                <th style="width: 13%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 6px 6px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">Rate (₹/kg)</th>
                <th style="width: 8%; text-align: center; background-color: #0b4328; color: #ffffff; padding: 6px 4px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">GST</th>
                <th style="width: 13%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 6px 8px; font-size: 9px;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <!-- BANK ACCOUNT & TOTALS SUMMARY (2 COLUMNS) -->
          <table style="width: 100%; margin-bottom: 8px;">
            <tr>
              <td style="width: 54%; vertical-align: top; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 7px 9px;">
                <strong style="color: #166534; font-size: 9px; text-transform: uppercase;">Amount in Words:</strong>
                <div style="font-size: 10px; font-weight: 800; color: #0f172a; margin-top: 1px;">${words}</div>
                <div style="margin-top: 4px; border-top: 1px dashed #bbf7d0; padding-top: 3px;">
                  <strong style="color: #0b4328; font-size: 8.5px; text-transform: uppercase;">Official Bank Current Account Remittance:</strong>
                  <div style="color: #1e293b; line-height: 1.35; margin-top: 1px; font-size: 8.5px; white-space: pre-line;">
                    ${escapeHtml(inv.bank_details || 'Bank: INDIAN BANK\nA/C Name: SRI MK SPICEPOD TRADERS\nA/C No: 8391488082\nIFSC: IDBI000A235\nBranch: AVINASHI ROAD\nUPI ID: 9843672274@upi')}
                  </div>
                </div>
              </td>
              <td style="width: 3%;"></td>
              <td style="width: 43%; vertical-align: top;">
                <table style="width: 100%; font-size: 9px;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 2px 0; color: #64748b;">Subtotal (Taxable Value):</td>
                    <td style="padding: 2px 0; text-align: right; font-weight: 700;">₹${(parseFloat(inv.subtotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  ${inv.discount > 0 ? `
                    <tr style="border-bottom: 1px solid #e2e8f0; color: #16a34a;">
                      <td style="padding: 2px 0;">Wholesale Trade Discount:</td>
                      <td style="padding: 2px 0; text-align: right; font-weight: 700;">- ₹${(parseFloat(inv.discount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ` : ''}
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 2px 0; color: #64748b;">GST Output (CGST+SGST / IGST):</td>
                    <td style="padding: 2px 0; text-align: right; font-weight: 700;">₹${(parseFloat(inv.gst_amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  ${inv.freight > 0 ? `
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 2px 0; color: #64748b;">Freight / Forwarding Charges:</td>
                      <td style="padding: 2px 0; text-align: right; font-weight: 700;">₹${(parseFloat(inv.freight) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ` : ''}
                  <tr style="background-color: #edf7f0; border-top: 2px solid #0b4328;">
                    <td style="padding: 4px 5px; font-size: 10px; font-weight: 800; color: #0b4328;">TOTAL AMOUNT:</td>
                    <td style="padding: 4px 5px; font-size: 12px; font-weight: 900; text-align: right; color: #0b4328;">₹${(parseFloat(inv.grand_total) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          ${inv.notes ? `
            <div style="margin-bottom: 8px; font-size: 8.5px; color: #475569; background-color: #f8fafc; padding: 5px 8px; border-radius: 4px; border-left: 3px solid #0b4328;">
              <strong>Terms &amp; Notes:</strong> ${escapeHtml(inv.notes)}
            </div>
          ` : ''}

          <!-- FOOTER -->
          <table style="width: 100%; border-top: 1px dashed #cbd5e1; padding-top: 4px; margin-top: 4px;">
            <tr>
              <td style="width: 60%; vertical-align: bottom; font-size: 8px; color: #64748b; line-height: 1.3;">
                This is a computer generated official document &bull; Subject to Tiruppur Jurisdiction.<br>
                Jurisdictional Office: GANDHI NAGAR, Tiruppur &bull; Phone: +91 98436 72274
              </td>
              <td style="width: 40%; vertical-align: bottom; text-align: right;">
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 12px; font-size: 9px;">For SRI MK SPICEPOD TRADERS</div>
                <div style="border-top: 1px solid #94a3b8; display: inline-block; padding-top: 1px; font-size: 8.5px; color: #334155;">MANIKAMOORTHY RAYAPPAN (Proprietor)</div>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;

  await exportHTMLToA4PDF(htmlDoc, filename);
};

window.downloadOrderInvoicePDF = async function(orderId) {
  if (!orderId) return;
  const ord = orders.find(o => String(o.order_number || o.id) === String(orderId) || String(o.id) === String(orderId) || String(o.order_number) === String(orderId));
  if (!ord) {
    showToast(`Order #${orderId} not found.`);
    return;
  }

  const actualOrderId = ord.order_number || ord.id || orderId;
  const custName = ord.customer_name || ord.customer || 'Wholesale Client';
  const custPhone = ord.customer_phone || '';
  const custEmail = ord.customer_email || '';
  let custGST = ord.customer_gst || ord.customer_gstin || ord.gst || '';
  if (!custGST && ord.notes && ord.notes.includes('GSTIN:')) {
    const match = ord.notes.match(/GSTIN:\s*([A-Z0-9]+)/i);
    if (match) custGST = match[1];
  }
  const custCity = ord.customer_city || ord.delivery_city || 'Tamil Nadu';
  const deliveryAddress = ord.delivery_address || ord.notes || 'Consignment Dispatch Address';
  const prodName = ord.product_name || ord.product || 'Wholesale Commodity';
  const qty = Number(ord.quantity_kg) || (parseInt(ord.quantity) || 50);
  const totalAmount = Number(ord.total_amount) || (Number(String(ord.total_estimated || ord.amount).replace(/[^\d.]/g, '')) || 12000);
  const unitRate = Number(ord.unit_price) || (qty > 0 ? (totalAmount / qty) : 240);
  const customHsn = (activeViewingProofOrderId === orderId && document.getElementById('proofModalHSNInput')) ? document.getElementById('proofModalHSNInput').value.trim() : null;
  const customGst = (activeViewingProofOrderId === orderId && document.getElementById('proofModalGSTSelect')) ? Number(document.getElementById('proofModalGSTSelect').value) : null;
  const defaultHsn = customHsn || ord.hsn_code || detectHSNCode(prodName);
  const orderGstRate = customGst !== null && !isNaN(customGst) ? customGst : (ord.gst_rate !== undefined ? Number(ord.gst_rate) : (custGST ? 5 : 0));
  const subtotal = orderGstRate > 0 ? Math.round(totalAmount / (1 + (orderGstRate / 100))) : totalAmount;
  const gstAmount = totalAmount - subtotal;
  const payMode = ord.payment_mode || 'UPI Transfer';
  const utr = ord.transaction_id || 'N/A';
  const payStatus = ord.payment_status || 'Payment Received';
  const orderDate = ord.created_at ? ord.created_at.split(' ')[0] : (ord.date || new Date().toISOString().split('T')[0]);
  const words = numberToWordsINR(totalAmount);

  // Handle multi-item orders or single item
  let orderItems = [];
  if (ord.items && Array.isArray(ord.items) && ord.items.length > 0) {
    orderItems = ord.items;
  } else if (typeof ord.items_json === 'string') {
    try { orderItems = JSON.parse(ord.items_json); } catch(e) { orderItems = []; }
  } else if (Array.isArray(ord.items_json)) {
    orderItems = ord.items_json;
  }

  if (!orderItems || orderItems.length === 0) {
    orderItems = [{
      product: prodName,
      grade: ord.product_grade || 'Wholesale Farm Consignment • Export Certified Quality',
      hsn: defaultHsn,
      qty: qty,
      rate: unitRate,
      amount: totalAmount
    }];
  }

  const itemsRowsHtml = orderItems.map((it, idx) => {
    const itName = it.name || it.product || prodName;
    const itGrade = it.grade || 'Wholesale Farm Consignment • Export Certified Quality';
    const itHsn = it.hsn_code || it.hsn || defaultHsn;
    const itQty = Number(it.quantity_kg || it.qty) || qty;
    const itRate = Number(it.price || it.rate || it.unit_price) || unitRate;
    const itAmount = Number(it.amount || it.total_amount) || (itQty * itRate) || totalAmount;

    return `
      <tr>
        <td style="padding: 7px 4px; text-align: center; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${idx + 1}</td>
        <td style="padding: 7px 8px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">
          <strong style="color: #0f172a;">${escapeHtml(itName)}</strong><br>
          <small style="color: #64748b;">${escapeHtml(itGrade)}</small>
        </td>
        <td style="padding: 7px 4px; text-align: center; font-family: monospace; color: #475569; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${escapeHtml(itHsn)}</td>
        <td style="padding: 7px 6px; text-align: right; font-weight: 700; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">${itQty} kg</td>
        <td style="padding: 7px 6px; text-align: right; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; font-size: 9.5px;">₹${itRate.toFixed(2)}</td>
        <td style="padding: 7px 8px; text-align: right; font-weight: 800; color: #0b4328; border-bottom: 1px solid #e2e8f0; font-size: 10px;">₹${itAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  }).join('');

  const filename = `MK_Invoice_${actualOrderId}.pdf`;
  showToast(`Generating Invoice PDF for #${actualOrderId}...`);

  const htmlDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=794">
        <style>
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            width: 750px !important;
            min-width: 750px !important;
            max-width: 750px !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            font-size: 10px !important;
            color: #0f172a !important;
            line-height: 1.35 !important;
          }
          #pdf-root {
            width: 750px !important;
            min-width: 750px !important;
            max-width: 750px !important;
            margin: 0 auto !important;
            padding: 16px 18px !important;
            background: #ffffff !important;
            border: 2px solid #0b4328 !important;
            border-radius: 8px !important;
            box-sizing: border-box !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            border-spacing: 0 !important;
            table-layout: fixed !important;
          }
          th, td {
            box-sizing: border-box !important;
            vertical-align: top !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
          }
        </style>
      </head>
      <body>
        <div id="pdf-root">
          <!-- HEADER -->
          <table style="width: 100%; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 10px;">
            <tr>
              <td style="width: 52px; vertical-align: middle; padding: 0;">
                <div style="width: 44px; height: 44px; background-color: #0b4328; color: #ffffff; border-radius: 6px; text-align: center; line-height: 44px; font-size: 20px; font-weight: 900;">MK</div>
              </td>
              <td style="vertical-align: middle; padding-left: 10px;">
                <div style="font-size: 17px; font-weight: 900; color: #0b4328; line-height: 1.15;">SRI MK SPICEPOD TRADERS</div>
                <div style="font-size: 9.5px; color: #059669; font-weight: 700; text-transform: uppercase; margin-top: 1px;">Wholesale Direct Supplier • Spices, Dry Fruits &amp; Gourmet Nuts</div>
                <div style="font-size: 8.5px; color: #475569; margin-top: 2px; line-height: 1.3;">
                  <strong>Proprietor:</strong> MANIKAMOORTHY RAYAPPAN &bull; <strong>GSTIN:</strong> 33AUJPM5853C1ZP &bull; <strong>PAN:</strong> AUJPM5853C<br>
                  No.148 D5, TTP Mill Road, Nataraja Layout, Thirumuruganpoondi, Tiruppur, TN - 641652<br>
                  Phone: +91 98436 72274 &bull; Email: mktraders4434@gmail.com
                </div>
              </td>
              <td style="width: 190px; text-align: right; vertical-align: top; padding: 0;">
                <div style="background-color: #059669; color: #ffffff; font-weight: 800; font-size: 9px; padding: 3px 8px; border-radius: 10px; display: inline-block;">TAX INVOICE / ORDER MEMO</div>
                <div style="font-size: 13px; font-weight: 900; margin-top: 3px; color: #0f172a;">#${actualOrderId}</div>
                <div style="font-size: 8.5px; color: #64748b; margin-top: 1px;">Date: ${orderDate} &bull; Original</div>
              </td>
            </tr>
          </table>

          <!-- CUSTOMER & DISPATCH INFO (2 COLUMNS) -->
          <table style="width: 100%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 10px;">
            <tr>
              <td style="width: 52%; padding: 8px 10px; border-right: 1px solid #e2e8f0; font-size: 9.5px; vertical-align: top;">
                <strong style="color: #059669; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;">BILLED TO / BUYER (CONSIGNEE):</strong><br>
                <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px;">${escapeHtml(custName)}</div>
                ${custGST ? `<div style="color: #1e293b; font-size: 9.5px; margin-top: 1px;"><strong>GSTIN:</strong> <span style="font-family: monospace; font-weight: 700; color: #0b4328;">${escapeHtml(custGST)}</span></div>` : '<div style="color: #64748b; font-size: 8.5px; margin-top: 1px;"><strong>GST Status:</strong> Regular Wholesale Consignee</div>'}
                <div style="color: #475569; margin-top: 1px; font-size: 9px;">Phone / WhatsApp: +91 ${escapeHtml(custPhone)} ${custEmail ? `&bull; Email: ${escapeHtml(custEmail)}` : ''}</div>
                <div style="margin-top: 1px; color: #334155; font-size: 9px;">Place of Supply: ${escapeHtml(custCity)} (State Code: 33)</div>
              </td>
              <td style="width: 48%; padding: 8px 10px; font-size: 9px; vertical-align: top;">
                <strong style="color: #059669; font-size: 9px; text-transform: uppercase; letter-spacing: 0.3px;">DISPATCH &amp; PAYMENT INFO:</strong><br>
                <div style="color: #334155; margin-top: 2px; line-height: 1.3;"><strong>Address:</strong> ${escapeHtml(deliveryAddress)}</div>
                <div style="margin-top: 3px; color: #1e293b;"><strong>Mode:</strong> ${escapeHtml(payMode)} &bull; <strong>UTR:</strong> <span style="font-family: monospace; font-weight: 700; color: #0284c7;">${escapeHtml(utr)}</span></div>
                <div style="margin-top: 3px;">
                  <span style="background-color: ${payStatus === 'Payment Received' ? '#dcfce7' : '#fef3c7'}; color: ${payStatus === 'Payment Received' ? '#166534' : '#92400e'}; font-weight: 700; font-size: 8.5px; padding: 2px 6px; border-radius: 4px; display: inline-block;">
                    ✔ Payment Status: ${escapeHtml(payStatus)}
                  </span>
                </div>
              </td>
            </tr>
          </table>

          <!-- ITEMS TABLE -->
          <table style="width: 100%; border: 1px solid #cbd5e1; margin-bottom: 10px;">
            <thead>
              <tr style="background-color: #0b4328; color: #ffffff;">
                <th style="width: 5%; text-align: center; background-color: #0b4328; color: #ffffff; padding: 6px 4px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">#</th>
                <th style="width: 41%; text-align: left; background-color: #0b4328; color: #ffffff; padding: 6px 8px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">Description of Goods</th>
                <th style="width: 12%; text-align: center; background-color: #0b4328; color: #ffffff; padding: 6px 4px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">HSN Code</th>
                <th style="width: 13%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 6px 6px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">Quantity</th>
                <th style="width: 14%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 6px 6px; font-size: 9px; border-right: 1px solid rgba(255,255,255,0.2);">Rate (₹/kg)</th>
                <th style="width: 15%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 6px 8px; font-size: 9px;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <!-- BANK ACCOUNT & TOTALS SUMMARY (2 COLUMNS) -->
          <table style="width: 100%; margin-bottom: 8px;">
            <tr>
              <td style="width: 54%; vertical-align: top; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 7px 9px;">
                <strong style="color: #166534; font-size: 9px; text-transform: uppercase;">Amount in Words:</strong>
                <div style="font-size: 10px; font-weight: 800; color: #0f172a; margin-top: 1px;">${words}</div>
                <div style="margin-top: 4px; border-top: 1px dashed #bbf7d0; padding-top: 3px;">
                  <strong style="color: #0b4328; font-size: 8.5px; text-transform: uppercase;">Official Bank Current Account Remittance:</strong>
                  <div style="color: #1e293b; line-height: 1.35; margin-top: 1px; font-size: 8.5px;">
                    Bank: <strong>INDIAN BANK</strong> &bull; Current A/C: <strong style="color: #0b4328;">8391488082</strong><br>
                    A/C Name: <strong>SRI MK SPICEPOD TRADERS</strong> &bull; IFSC: <strong>IDBI000A235</strong><br>
                    Branch: AVINASHI ROAD &bull; UPI ID: <strong>9843672274@upi</strong>
                  </div>
                </div>
              </td>
              <td style="width: 3%;"></td>
              <td style="width: 43%; vertical-align: top;">
                <table style="width: 100%; font-size: 9px;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 2px 0; color: #64748b;">Taxable Subtotal:</td>
                    <td style="padding: 2px 0; text-align: right; font-weight: 700;">₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 2px 0; color: #64748b;">GST Output (${orderGstRate}%):</td>
                    <td style="padding: 2px 0; text-align: right; font-weight: 700;">₹${gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  <tr style="background-color: #edf7f0; border-top: 2px solid #0b4328;">
                    <td style="padding: 4px 5px; font-size: 10px; font-weight: 800; color: #0b4328;">TOTAL AMOUNT:</td>
                    <td style="padding: 4px 5px; font-size: 12px; font-weight: 900; text-align: right; color: #0b4328;">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- FOOTER -->
          <table style="width: 100%; border-top: 1px dashed #cbd5e1; padding-top: 4px; margin-top: 4px;">
            <tr>
              <td style="width: 60%; vertical-align: bottom; font-size: 8px; color: #64748b; line-height: 1.3;">
                Computer Generated Wholesale Tax Invoice &bull; Subject to Tiruppur Jurisdiction.<br>
                Official Support &amp; Order Helpline: +91 98436 72274 &bull; GSTIN: 33AUJPM5853C1ZP
              </td>
              <td style="width: 40%; vertical-align: bottom; text-align: right;">
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 12px; font-size: 9px;">For SRI MK SPICEPOD TRADERS</div>
                <div style="border-top: 1px solid #94a3b8; display: inline-block; padding-top: 1px; font-size: 8.5px; color: #334155;">MANIKAMOORTHY RAYAPPAN (Proprietor)</div>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;

  await exportHTMLToA4PDF(htmlDoc, filename);
};

window.printActiveInvoiceDoc = function() {
  window.print();
};

window.shareActiveInvoiceOnWhatsApp = function(id = null) {
  const targetId = id || activeViewingInvoiceId;
  if (!targetId) return;
  shareInvoiceDirectWa(targetId);
};

window.shareInvoiceDirectWa = function(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  let items = [];
  if (typeof inv.items_json === 'string') {
    try { items = JSON.parse(inv.items_json); } catch(e) { items = []; }
  } else if (Array.isArray(inv.items_json)) {
    items = inv.items_json;
  }

  const isQuote = (inv.doc_type || '').toLowerCase() === 'quotation';
  const docTitle = isQuote ? 'Wholesale Proforma Quotation' : 'GST Tax Invoice';

  let itemsText = items.map((it, idx) => 
    `• *${it.product}* (${it.grade || 'Standard'}) - ${it.qty}kg @ ₹${it.rate}/kg = ₹${((it.qty||0)*(it.rate||0)).toLocaleString('en-IN')}`
  ).join('\n');

  const waMessage = 
`*SRI MK SPICEPOD TRADERS - Wholesale Order Document*
━━━━━━━━━━━━━━━━━━━━━━━
📄 *Document:* ${docTitle}
🔢 *Number:* ${inv.doc_number}
📅 *Date:* ${inv.doc_date}
👤 *Billed To:* ${inv.customer_name}

📦 *Items Ordered:*
${itemsText}

💰 *Subtotal:* ₹${(parseFloat(inv.subtotal) || 0).toLocaleString('en-IN')}
💵 *GST Tax:* ₹${(parseFloat(inv.gst_amount) || 0).toLocaleString('en-IN')}
🚚 *Freight:* ₹${(parseFloat(inv.freight) || 0).toLocaleString('en-IN')}
⭐ *GRAND TOTAL:* ₹${(parseFloat(inv.grand_total) || 0).toLocaleString('en-IN')}

💳 *Payment Terms:* ${inv.payment_terms || '100% Advance'}
🚚 *Delivery:* ${inv.delivery_terms || 'Transport Door Delivery'}

🏦 *Bank Account Details:*
SRI MK SPICEPOD TRADERS
INDIAN BANK (AVINASHI ROAD) | A/C: 8391488082
IFSC: IDBI000A235 | UPI: 9843672274@upi

Thank you for your business! 🙏
_Sri MK Spicepod Traders - Premium Spices & Nuts Supplier_`;

  const phone = (inv.customer_phone || '').replace(/\D/g, '');
  const cleanPhone = phone.startsWith('91') && phone.length === 12 ? phone : `91${phone}`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
  window.open(waUrl, '_blank');
};

window.convertQuotationToInvoice = function(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;

  const year = new Date().getFullYear();
  const rand = Math.floor(100 + Math.random() * 900);
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  inv.doc_type = 'invoice';
  inv.doc_number = `MK-INV-${year}-${rand}`;
  inv.status = 'Confirmed';
  inv.updated_at = now;

  // Supabase PostgreSQL Upsert
  if (window.MKSupabase && window.MKSupabase.Invoices) {
    window.MKSupabase.Invoices.upsert(inv).catch(err => console.warn('Supabase convert invoice error:', err));
  }

  fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inv)
  }).then(r => r.json()).catch(() => {});

  saveState();
  renderInvoicesTable();
  renderDashboard();

  showToast(`Quotation converted to Official Tax Invoice #${inv.doc_number}!`);
  viewInvoicePrintPreview(inv.id);
};

window.deleteInvoiceDoc = function(id) {
  if (!confirm("Are you sure you want to delete this document permanently?")) return;

  // Supabase PostgreSQL Delete
  if (window.MKSupabase && window.MKSupabase.Invoices && typeof id === 'string' && id.length > 10) {
    window.MKSupabase.Invoices.delete(id).catch(err => console.warn('Supabase delete invoice error:', err));
  }

  fetch('/api/invoices/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  }).then(r => r.json()).catch(() => {});

  invoices = invoices.filter(i => i.id !== id);
  saveState();
  renderInvoicesTable();
  renderDashboard();

  showToast("Document deleted successfully.");
};

window.exportInvoicesToCSV = function() {
  if (invoices.length === 0) {
    showToast("No invoices to export.");
    return;
  }

  const headers = ["Doc Type", "Doc Number", "Customer Name", "Phone", "Email", "GSTIN", "City", "Date", "Due Date", "Subtotal", "Discount", "GST Amount", "Freight", "Grand Total", "Status"];
  const rows = invoices.map(inv => [
    `"${inv.doc_type}"`,
    `"${inv.doc_number}"`,
    `"${inv.customer_name}"`,
    `"${inv.customer_phone}"`,
    `"${inv.customer_email || ''}"`,
    `"${inv.customer_gstin || ''}"`,
    `"${inv.customer_city || ''}"`,
    `"${inv.doc_date}"`,
    `"${inv.due_date || ''}"`,
    inv.subtotal,
    inv.discount,
    inv.gst_amount,
    inv.freight,
    inv.grand_total,
    `"${inv.status}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `MK_Spicepod_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function numberToWordsINR(num) {
  if (isNaN(num) || num === null || num === undefined) return '';
  num = Math.round(Number(num));
  if (num === 0) return 'Zero Rupees Only';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(num).trim() + ' Rupees Only';
}

// Helpers
window.openModal = function(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
};

window.closeModal = function(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
};

// =========================================================================
// 12. 4 MULTI-BANK CURRENT ACCOUNTS & COMPANY SETTINGS CONTROLLERS
// =========================================================================

const DEFAULT_ADMIN_BANK_ACCOUNTS = [
  {
    id: "bank_1",
    bank_name: "INDIAN BANK",
    bank_account_name: "SRI MK SPICEPOD TRADERS",
    bank_account_no: "8391488082",
    bank_ifsc: "IDBI000A235",
    bank_branch: "AVINASHI ROAD",
    bank_upi: "9843672274@upi",
    account_type: "Current Account",
    is_active: true,
    is_default: true
  },
  {
    id: "bank_2",
    bank_name: "HDFC BANK",
    bank_account_name: "SRI MK SPICEPOD TRADERS",
    bank_account_no: "50200084367227",
    bank_ifsc: "HDFC0001234",
    bank_branch: "TIRUPPUR MAIN BRANCH",
    bank_upi: "9843672274@hdfcbank",
    account_type: "Current Account",
    is_active: true,
    is_default: false
  },
  {
    id: "bank_3",
    bank_name: "ICICI BANK",
    bank_account_name: "SRI MK SPICEPOD TRADERS",
    bank_account_no: "004505012345",
    bank_ifsc: "ICIC0000045",
    bank_branch: "KUMARAN ROAD BRANCH",
    bank_upi: "9843672274@icici",
    account_type: "Current Account",
    is_active: true,
    is_default: false
  },
  {
    id: "bank_4",
    bank_name: "STATE BANK OF INDIA (SBI)",
    bank_account_name: "SRI MK SPICEPOD TRADERS",
    bank_account_no: "39485720194",
    bank_ifsc: "SBIN0001234",
    bank_branch: "TIRUPPUR BAZAAR BRANCH",
    bank_upi: "9843672274@sbi",
    account_type: "Current Account",
    is_active: true,
    is_default: false
  }
];

let adminBankAccountsList = [...DEFAULT_ADMIN_BANK_ACCOUNTS];

// Switch Bank Tab in Admin Panel (0, 1, 2, 3)
window.switchAdminBankTab = function(tabIndex) {
  for (let i = 0; i < 4; i++) {
    const btn = document.getElementById(`btnBankTab_${i}`);
    const panel = document.getElementById(`bankPanel_${i}`);
    if (btn) btn.classList.toggle('active', i === tabIndex);
    if (panel) panel.classList.toggle('active', i === tabIndex);
  }
  renderAdminBankPreview();
};

// Update Bank Tab Button Text dynamically when admin types Bank Name
window.updateAdminBankTabLabels = function() {
  for (let i = 0; i < 4; i++) {
    const nameInput = document.getElementById(`settingBankName_${i}`);
    const labelSpan = document.getElementById(`tabLabel_${i}`);
    if (nameInput && labelSpan) {
      const val = nameInput.value.trim() || `Bank #${i + 1}`;
      labelSpan.textContent = i === 0 ? `${val} (Default)` : val;
    }
  }
  renderAdminBankPreview();
};

// Render 4-Bank Quick Preview Cards at bottom of settings
window.renderAdminBankPreview = function() {
  const container = document.getElementById('adminBankPreviewGrid');
  if (!container) return;

  const banks = getBankAccountsFromForm();
  container.innerHTML = banks.map((b, idx) => {
    const isActive = b.is_active;
    return `
      <div class="admin-bank-mini-card" onclick="switchAdminBankTab(${idx})">
        <div class="admin-bank-mini-title">
          <i class="fas fa-building-columns" style="color:${isActive ? '#059669' : '#94a3b8'};"></i>
          <span>${escapeHtml(b.bank_name || `Bank #${idx + 1}`)}</span>
        </div>
        <div class="admin-bank-mini-acc">${escapeHtml(b.bank_account_no || 'N/A')}</div>
        <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">IFSC: ${escapeHtml(b.bank_ifsc || 'N/A')}</div>
        <div class="admin-bank-mini-status" style="color:${isActive ? '#059669' : '#dc2626'};">
          <i class="fas fa-${isActive ? 'circle-check' : 'circle-xmark'}"></i>
          ${isActive ? (idx === 0 ? 'Active (Default)' : 'Active') : 'Disabled'}
        </div>
      </div>
    `;
  }).join('');
};

// Extract Bank Accounts Array from Form Inputs
function getBankAccountsFromForm() {
  const list = [];
  for (let i = 0; i < 4; i++) {
    const bankName = document.getElementById(`settingBankName_${i}`)?.value.trim() || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_name;
    const accName = document.getElementById(`settingBankAccountName_${i}`)?.value.trim() || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_account_name;
    const accNo = document.getElementById(`settingBankAccountNo_${i}`)?.value.trim() || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_account_no;
    const ifsc = document.getElementById(`settingBankIFSC_${i}`)?.value.trim() || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_ifsc;
    const branch = document.getElementById(`settingBankBranch_${i}`)?.value.trim() || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_branch;
    const upi = document.getElementById(`settingBankUPI_${i}`)?.value.trim() || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_upi;
    const active = document.getElementById(`settingBankActive_${i}`) ? document.getElementById(`settingBankActive_${i}`).checked : true;

    list.push({
      id: `bank_${i + 1}`,
      bank_name: bankName,
      bank_account_name: accName,
      bank_account_no: accNo,
      bank_ifsc: ifsc,
      bank_branch: branch,
      bank_upi: upi,
      account_type: 'Current Account',
      is_active: active,
      is_default: (i === 0)
    });
  }
  return list;
}

// Populate 4-Bank Account Form from Array
function applyBankAccountsToForm(banks) {
  if (!Array.isArray(banks) || banks.length === 0) banks = DEFAULT_ADMIN_BANK_ACCOUNTS;
  adminBankAccountsList = banks;

  for (let i = 0; i < 4; i++) {
    const b = banks[i] || DEFAULT_ADMIN_BANK_ACCOUNTS[i];
    const nameEl = document.getElementById(`settingBankName_${i}`);
    const accNameEl = document.getElementById(`settingBankAccountName_${i}`);
    const accNoEl = document.getElementById(`settingBankAccountNo_${i}`);
    const ifscEl = document.getElementById(`settingBankIFSC_${i}`);
    const branchEl = document.getElementById(`settingBankBranch_${i}`);
    const upiEl = document.getElementById(`settingBankUPI_${i}`);
    const activeEl = document.getElementById(`settingBankActive_${i}`);
    const tabLabel = document.getElementById(`tabLabel_${i}`);

    if (nameEl) nameEl.value = b.bank_name || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_name;
    if (accNameEl) accNameEl.value = b.bank_account_name || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_account_name;
    if (accNoEl) accNoEl.value = b.bank_account_no || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_account_no;
    if (ifscEl) ifscEl.value = b.bank_ifsc || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_ifsc;
    if (branchEl) branchEl.value = b.bank_branch || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_branch;
    if (upiEl) upiEl.value = b.bank_upi || DEFAULT_ADMIN_BANK_ACCOUNTS[i].bank_upi;
    if (activeEl) activeEl.checked = b.is_active !== false;
    if (tabLabel) tabLabel.textContent = i === 0 ? `${b.bank_name || 'INDIAN BANK'} (Default)` : (b.bank_name || `Bank #${i+1}`);
  }

  // Update legacy hidden fields
  const primary = banks[0] || DEFAULT_ADMIN_BANK_ACCOUNTS[0];
  const legBank = document.getElementById('settingBankName');
  const legAccName = document.getElementById('settingBankAccountName');
  const legAccNo = document.getElementById('settingBankAccountNo');
  const legIFSC = document.getElementById('settingBankIFSC');
  const legBranch = document.getElementById('settingBankBranch');
  const legUPI = document.getElementById('settingBankUPI');
  if (legBank) legBank.value = primary.bank_name;
  if (legAccName) legAccName.value = primary.bank_account_name;
  if (legAccNo) legAccNo.value = primary.bank_account_no;
  if (legIFSC) legIFSC.value = primary.bank_ifsc;
  if (legBranch) legBranch.value = primary.bank_branch;
  if (legUPI) legUPI.value = primary.bank_upi;

  // Cache in LocalStorage
  localStorage.setItem('mk_all_bank_accounts', JSON.stringify(banks));
  localStorage.setItem('mk_current_account_details', JSON.stringify(primary));

  renderAdminBankPreview();
}

// Settings Management (Company & 4-Bank Current Account Details)
window.loadSettings = async function() {
  const applySettingsToForm = (s) => {
    if (!s) return;
    const tradeEl = document.getElementById('settingTradeName');
    const legalEl = document.getElementById('settingLegalName');
    const gstinEl = document.getElementById('settingGSTIN');
    const panEl = document.getElementById('settingPAN');
    const addrEl = document.getElementById('settingAddress');
    const phoneEl = document.getElementById('settingPhone');
    const emailEl = document.getElementById('settingEmail');
    const tagEl = document.getElementById('settingTagline');

    if (tradeEl && s.business_name) tradeEl.value = s.business_name;
    if (legalEl && s.legal_name) legalEl.value = s.legal_name;
    if (gstinEl && s.gstin) gstinEl.value = s.gstin;
    if (panEl && s.pan) panEl.value = s.pan;
    if (addrEl && s.address) addrEl.value = s.address;
    if (phoneEl && s.phone) phoneEl.value = s.phone;
    if (emailEl && s.email) emailEl.value = s.email;
    const instaEl = document.getElementById('settingInstagram');
    if (tagEl && s.tagline) tagEl.value = s.tagline;
    if (instaEl && s.instagram_url) instaEl.value = s.instagram_url;

    if (s.bank_accounts && Array.isArray(s.bank_accounts) && s.bank_accounts.length > 0) {
      applyBankAccountsToForm(s.bank_accounts);
    } else if (s.bank_accounts_json) {
      try {
        const parsed = JSON.parse(s.bank_accounts_json);
        applyBankAccountsToForm(parsed);
      } catch (e) {
        applyBankAccountsToForm(DEFAULT_ADMIN_BANK_ACCOUNTS);
      }
    } else {
      applyBankAccountsToForm(DEFAULT_ADMIN_BANK_ACCOUNTS);
    }
  };

  // 1. Initial cached render
  try {
    const cachedBanks = localStorage.getItem('mk_all_bank_accounts');
    if (cachedBanks) {
      applyBankAccountsToForm(JSON.parse(cachedBanks));
    }
  } catch (e) {}

  // 2. Fetch from Local Backend API
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.settings) {
        applySettingsToForm(json.settings);
        return;
      }
    }
  } catch (e) {}

  // 3. Direct fetch from /api/bank-accounts
  try {
    const res = await fetch('/api/bank-accounts');
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && Array.isArray(json.bank_accounts)) {
        applyBankAccountsToForm(json.bank_accounts);
      }
    }
  } catch (e) {}

  // 4. Fetch from Supabase Database
  if (window.MKSupabase && window.MKSupabase.Settings) {
    try {
      const { data } = await window.MKSupabase.Settings.get();
      if (data) applySettingsToForm(data);
    } catch (e) {}
  }
};

window.saveSettings = async function(e) {
  if (e) e.preventDefault();

  const allBanks = getBankAccountsFromForm();
  const primaryBank = allBanks[0] || DEFAULT_ADMIN_BANK_ACCOUNTS[0];

  const payload = {
    business_name: document.getElementById('settingTradeName')?.value || 'SRI MK SPICEPOD TRADERS',
    legal_name: document.getElementById('settingLegalName')?.value || 'MANIKAMOORTHY RAYAPPAN',
    gstin: document.getElementById('settingGSTIN')?.value || '33AUJPM5853C1ZP',
    pan: document.getElementById('settingPAN')?.value || 'AUJPM5853C',
    address: document.getElementById('settingAddress')?.value || '',
    jurisdiction: document.getElementById('settingJurisdiction')?.value || 'GANDHI NAGAR, Tiruppur',
    constitution: document.getElementById('settingConstitution')?.value || 'Proprietorship',
    phone: document.getElementById('settingPhone')?.value || '9843672274',
    email: document.getElementById('settingEmail')?.value || 'mktraders4434@gmail.com',
    tagline: document.getElementById('settingTagline')?.value || '',
    instagram_url: document.getElementById('settingInstagram')?.value || 'https://www.instagram.com/sri_mk_spicepodtraders?stkn=bXY5MHg4ZGJoOWI2&utm_source=qr',
    bank_name: primaryBank.bank_name,
    bank_account_name: primaryBank.bank_account_name,
    bank_account_no: primaryBank.bank_account_no,
    bank_ifsc: primaryBank.bank_ifsc,
    bank_branch: primaryBank.bank_branch,
    bank_upi: primaryBank.bank_upi,
    bank_accounts: allBanks,
    bank_accounts_json: JSON.stringify(allBanks)
  };

  // 1. Save to Local Backend API
  fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});

  fetch('/api/bank-accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bank_accounts: allBanks })
  }).catch(() => {});

  // 2. Save to Supabase Database
  if (window.MKSupabase && window.MKSupabase.Settings) {
    window.MKSupabase.Settings.save(payload).catch(err => console.warn('Supabase settings error:', err));
  }

  // 3. Cache in LocalStorage
  localStorage.setItem('mk_all_bank_accounts', JSON.stringify(allBanks));
  localStorage.setItem('mk_current_account_details', JSON.stringify(primaryBank));

  renderAdminBankPreview();
  showToast("Company & 4 Bank Accounts saved successfully!");
};

window.saveBankSettings = async function(e) {
  if (e) e.preventDefault();

  const allBanks = getBankAccountsFromForm();
  const primaryBank = allBanks[0] || DEFAULT_ADMIN_BANK_ACCOUNTS[0];

  const payload = {
    business_name: document.getElementById('settingTradeName')?.value || 'SRI MK SPICEPOD TRADERS',
    phone: document.getElementById('settingPhone')?.value || '9843672274',
    email: document.getElementById('settingEmail')?.value || 'mktraders4434@gmail.com',
    bank_name: primaryBank.bank_name,
    bank_account_name: primaryBank.bank_account_name,
    bank_account_no: primaryBank.bank_account_no,
    bank_ifsc: primaryBank.bank_ifsc,
    bank_branch: primaryBank.bank_branch,
    bank_upi: primaryBank.bank_upi,
    bank_accounts: allBanks,
    bank_accounts_json: JSON.stringify(allBanks)
  };

  // 1. Save to Local Backend API
  try {
    await fetch('/api/bank-accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bank_accounts: allBanks })
    });
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {}

  // 2. Save to Supabase Database
  if (window.MKSupabase && window.MKSupabase.Settings) {
    try {
      await window.MKSupabase.Settings.save(payload);
    } catch (err) {}
  }

  // 3. Cache in LocalStorage for instant storefront synchronization
  localStorage.setItem('mk_all_bank_accounts', JSON.stringify(allBanks));
  localStorage.setItem('mk_current_account_details', JSON.stringify(primaryBank));

  renderAdminBankPreview();

  const statusEl = document.getElementById('bankSaveStatus');
  if (statusEl) {
    statusEl.innerHTML = '<i class="fas fa-circle-check"></i> All 4 Banks Saved &amp; Live on Website!';
    setTimeout(() => { if (statusEl) statusEl.innerHTML = ''; }, 4000);
  }

  showToast("All 4 Bank Accounts saved and instantly synchronized to website!");
};

function showToast(message) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0b4328;color:#ffffff;padding:12px 24px;border-radius:8px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,0.25);z-index:9999;transition:all 0.3s ease;display:flex;align-items:center;gap:10px;border-left:4px solid #10b981;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;"></i> ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
  }, 3500);
}

function formatTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return isoString;
  }
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Just now';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    const now = new Date();
    const diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ===================================================================
   ADMIN AUTHENTICATION & PASSWORD MANAGEMENT
=================================================================== */

// 1. Initialize Auth on page load
window.initAdminAuth = function() {
  const isLoggedIn = sessionStorage.getItem('mk_admin_logged_in') === 'true' || localStorage.getItem('mk_admin_remember_login') === 'true';
  const overlay = document.getElementById('adminLoginOverlay');
  const storedUser = localStorage.getItem('mk_admin_username') || sessionStorage.getItem('mk_admin_username') || 'admin';

  updateAdminUserUI(storedUser);

  if (overlay) {
    if (isLoggedIn) {
      overlay.classList.add('hidden');
    } else {
      overlay.classList.remove('hidden');
      const pwdInput = document.getElementById('loginPassword');
      if (pwdInput) setTimeout(() => pwdInput.focus(), 200);
    }
  }

  // Load current username into Settings Security Form
  const usernameInput = document.getElementById('adminUsernameInput');
  if (usernameInput) {
    usernameInput.value = storedUser;
  }

  // Global click to close profile dropdown
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('adminProfileDropdown');
    const pill = document.getElementById('adminProfilePill');
    if (dropdown && dropdown.classList.contains('show')) {
      if (pill && !pill.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    }
  });
};

function updateAdminUserUI(username) {
  const nameEl = document.getElementById('topbarAdminName');
  const avatarEl = document.getElementById('topbarAdminAvatar');
  const dropUser = document.getElementById('dropdownAdminUser');

  if (nameEl) nameEl.textContent = username || 'Admin';
  if (dropUser) dropUser.textContent = username || 'admin';
  if (avatarEl) {
    avatarEl.textContent = (username && username.length > 0) ? username.charAt(0).toUpperCase() : 'A';
  }
}

// 2. Handle Admin Login
window.handleAdminLogin = async function(e) {
  if (e) e.preventDefault();

  const userEl = document.getElementById('loginUsername');
  const passEl = document.getElementById('loginPassword');
  const rememberEl = document.getElementById('loginRememberMe');
  const errorBox = document.getElementById('loginErrorMessage');
  const errorText = document.getElementById('loginErrorText');
  const submitBtn = document.getElementById('btnLoginSubmit');

  const username = userEl ? userEl.value.trim() : 'admin';
  const password = passEl ? passEl.value : '';
  const remember = rememberEl ? rememberEl.checked : false;

  if (!username || !password) {
    if (errorBox && errorText) {
      errorText.textContent = 'தயவுசெய்து Username மற்றும் Password உள்ளிடவும்.';
      errorBox.style.display = 'block';
    }
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
  }
  if (errorBox) errorBox.style.display = 'none';

  let isAuthenticated = false;
  let verifiedUsername = username;

  // 1. Check with Supabase Cloud
  if (window.MKSupabase && window.MKSupabase.Settings) {
    try {
      const res = await window.MKSupabase.Settings.verifyAdminLogin(username, password);
      if (res && res.success) {
        isAuthenticated = true;
        if (res.username) verifiedUsername = res.username;
      }
    } catch (err) {
      console.warn('Supabase auth attempt:', err);
    }
  }

  // 2. Fallback to Local REST API
  if (!isAuthenticated) {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await resp.json();
      if (data && data.status === 'success' && data.authenticated) {
        isAuthenticated = true;
        if (data.username) verifiedUsername = data.username;
      }
    } catch (err) {
      console.warn('Local REST auth attempt:', err);
    }
  }

  // 3. Fallback to LocalStorage / Default credentials
  if (!isAuthenticated) {
    const savedUser = localStorage.getItem('mk_admin_username') || 'admin';
    const savedPass = localStorage.getItem('mk_admin_password') || 'admin123';
    const isUserMatch = username.toLowerCase() === savedUser.toLowerCase() || username.toLowerCase() === 'mktraders4434@gmail.com';
    if (isUserMatch && password === savedPass) {
      isAuthenticated = true;
      verifiedUsername = savedUser;
    }
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-right-to-bracket"></i> Login to Admin Panel';
  }

  if (isAuthenticated) {
    sessionStorage.setItem('mk_admin_logged_in', 'true');
    sessionStorage.setItem('mk_admin_username', verifiedUsername);
    localStorage.setItem('mk_admin_username', verifiedUsername);

    if (remember) {
      localStorage.setItem('mk_admin_remember_login', 'true');
    } else {
      localStorage.removeItem('mk_admin_remember_login');
    }

    updateAdminUserUI(verifiedUsername);

    const overlay = document.getElementById('adminLoginOverlay');
    if (overlay) overlay.classList.add('hidden');

    if (passEl) passEl.value = '';
    showToast(`Welcome back, ${verifiedUsername}! Logged into Admin Portal.`);
  } else {
    if (errorBox && errorText) {
      errorText.textContent = 'தவறான Password அல்லது Username. தயவுசெய்து சரிபார்க்கவும்.';
      errorBox.style.display = 'block';
    }
  }
};

// 3. Handle Password Change
window.handleAdminPasswordChange = async function(e) {
  if (e) e.preventDefault();

  const userEl = document.getElementById('adminUsernameInput');
  const curPassEl = document.getElementById('currentAdminPassword');
  const newPassEl = document.getElementById('newAdminPassword');
  const confPassEl = document.getElementById('confirmAdminPassword');
  const statusMsg = document.getElementById('pwdChangeStatusMessage');
  const submitBtn = document.getElementById('btnUpdatePassword');

  const newUsername = userEl ? userEl.value.trim() : 'admin';
  const currentPassword = curPassEl ? curPassEl.value : '';
  const newPassword = newPassEl ? newPassEl.value : '';
  const confirmPassword = confPassEl ? confPassEl.value : '';

  if (statusMsg) {
    statusMsg.style.display = 'none';
    statusMsg.className = '';
  }

  // Validations
  if (!currentPassword || !newPassword || !confirmPassword) {
    displayPwdStatus('error', 'தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும் (Please fill all fields).');
    return;
  }

  if (newPassword.length < 4) {
    displayPwdStatus('error', 'புதிய கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும் (Minimum 4 characters required).');
    return;
  }

  if (newPassword !== confirmPassword) {
    displayPwdStatus('error', 'புதிய கடவுச்சொல் மற்றும் உறுதிப்படுத்தல் கடவுச்சொல் பொருந்தவில்லை (Passwords do not match).');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating Password...';
  }

  let updateSuccess = false;
  let errorDetail = '';

  // 1. Update in Supabase Cloud
  if (window.MKSupabase && window.MKSupabase.Settings) {
    try {
      const res = await window.MKSupabase.Settings.updateAdminPassword(currentPassword, newPassword, newUsername);
      if (res && res.success) {
        updateSuccess = true;
      } else if (res && res.error) {
        errorDetail = res.error.message || 'Current password incorrect';
      }
    } catch (err) {
      console.warn('Supabase password update notice:', err);
    }
  }

  // 2. Update in Local Python Server
  try {
    const resp = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_username: newUsername
      })
    });
    const data = await resp.json();
    if (data && data.status === 'success') {
      updateSuccess = true;
    } else if (data && data.message && !updateSuccess) {
      errorDetail = data.message;
    }
  } catch (err) {
    console.warn('Local REST password change notice:', err);
  }

  // 3. Fallback to LocalStorage sync
  const savedPass = localStorage.getItem('mk_admin_password') || 'admin123';
  if (!updateSuccess && currentPassword === savedPass) {
    updateSuccess = true;
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-shield-halved"></i> Update Admin Password';
  }

  if (updateSuccess) {
    localStorage.setItem('mk_admin_password', newPassword);
    localStorage.setItem('mk_admin_username', newUsername);
    sessionStorage.setItem('mk_admin_username', newUsername);

    updateAdminUserUI(newUsername);

    // Clear password input fields
    if (curPassEl) curPassEl.value = '';
    if (newPassEl) newPassEl.value = '';
    if (confPassEl) confPassEl.value = '';

    checkPasswordStrength('');

    displayPwdStatus('success', `✅ நிர்வாகி கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது! (Admin password updated successfully for ${newUsername}).`);
    showToast(`Admin Password updated successfully!`);
  } else {
    displayPwdStatus('error', `❌ ${errorDetail || 'தற்போதைய கடவுச்சொல் தவறானது (Current password is incorrect)'}.`);
  }
};

function displayPwdStatus(type, msg) {
  const statusMsg = document.getElementById('pwdChangeStatusMessage');
  if (!statusMsg) return;
  statusMsg.style.display = 'block';
  if (type === 'success') {
    statusMsg.style.background = '#ecfdf5';
    statusMsg.style.color = '#065f46';
    statusMsg.style.border = '1px solid #a7f3d0';
  } else {
    statusMsg.style.background = '#fef2f2';
    statusMsg.style.color = '#b91c1c';
    statusMsg.style.border = '1px solid #fecaca';
  }
  statusMsg.innerHTML = msg;
}

// 4. Toggle Show / Hide Password
window.togglePasswordVisibility = function(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    if (btn) btn.innerHTML = '<i class="fas fa-eye-slash" style="color:var(--primary);"></i>';
  } else {
    input.type = 'password';
    if (btn) btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
};

// 5. Password Strength Meter
window.checkPasswordStrength = function(pwd) {
  const fill = document.getElementById('pwdStrengthFill');
  const label = document.getElementById('pwdStrengthLabel');
  if (!fill || !label) return;

  if (!pwd || pwd.length === 0) {
    fill.style.width = '0%';
    label.textContent = 'Strength: None';
    label.style.color = '#64748b';
    return;
  }

  let score = 0;
  if (pwd.length >= 4) score += 1;
  if (pwd.length >= 8) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score += 1;

  if (score <= 1) {
    fill.style.width = '25%';
    fill.style.backgroundColor = '#ef4444';
    label.textContent = 'Strength: Weak (எளியது)';
    label.style.color = '#ef4444';
  } else if (score === 2 || score === 3) {
    fill.style.width = '65%';
    fill.style.backgroundColor = '#f59e0b';
    label.textContent = 'Strength: Medium (நடுத்தரமானது)';
    label.style.color = '#f59e0b';
  } else {
    fill.style.width = '100%';
    fill.style.backgroundColor = '#10b981';
    label.textContent = 'Strength: Strong (வலுவானது) 🔒';
    label.style.color = '#10b981';
  }
};

// 6. Topbar Profile Dropdown
window.toggleProfileDropdown = function(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('adminProfileDropdown');
  if (dropdown) dropdown.classList.toggle('show');
};

window.openSettingsSecurityTab = function(e) {
  if (e) e.preventDefault();
  const dropdown = document.getElementById('adminProfileDropdown');
  if (dropdown) dropdown.classList.remove('show');

  const settingsTabBtn = document.querySelector('.sidebar-link[data-tab="settings"]');
  if (settingsTabBtn) {
    settingsTabBtn.click();
    setTimeout(() => {
      const card = document.getElementById('adminSecurityCard');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const curPass = document.getElementById('currentAdminPassword');
        if (curPass) curPass.focus();
      }
    }, 150);
  }
};

// 7. Admin Logout
window.handleAdminLogout = function() {
  if (!confirm('Are you sure you want to log out of Admin Panel?')) return;

  sessionStorage.removeItem('mk_admin_logged_in');
  localStorage.removeItem('mk_admin_remember_login');

  const overlay = document.getElementById('adminLoginOverlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    const pwdInput = document.getElementById('loginPassword');
    if (pwdInput) {
      pwdInput.value = '';
      setTimeout(() => pwdInput.focus(), 200);
    }
  }

  const dropdown = document.getElementById('adminProfileDropdown');
  if (dropdown) dropdown.classList.remove('show');

  showToast('Logged out of Admin Portal successfully.');
};

