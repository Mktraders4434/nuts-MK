/**
 * MK SPICEPOD TRADERS
 * Main Interactive Application Script with Dynamic Admin Product Sync
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer & Backdrop Overlay
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    // Create backdrop overlay if not existing
    let navBackdrop = document.querySelector('.nav-backdrop');
    if (!navBackdrop) {
      navBackdrop = document.createElement('div');
      navBackdrop.className = 'nav-backdrop';
      document.body.appendChild(navBackdrop);
    }

    const closeDrawer = () => {
      navMenu.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times', 'fa-xmark');
        icon.classList.add('fa-bars');
      }
    };

    const openDrawer = () => {
      navMenu.classList.add('active');
      navBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    navBackdrop.addEventListener('click', closeDrawer);

    // Auto-close when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // 2. Active Nav Link Auto-Highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Dynamic Products Sync from Admin LocalStorage
  syncProductsFromAdmin();

  // 4. Product Page Category Filter & Search
  initProductFiltersAndSearch();

  // 5. Enquiry Modal Logic
  initEnquiryModal();

  // 6. Lightbox Modal for Gallery
  initGalleryLightbox();

  // 7. Contact Form Handling
  initContactForm();

  // 8. Dynamic Bank Current Account Details Sync
  loadCurrentAccountDetails();
});

// Load Current Account Details from Backend / Supabase / LocalStorage
async function loadCurrentAccountDetails() {
  const applyBankDetails = (data) => {
    if (!data) return;
    const accName = data.bank_account_name || 'SRI MK SPICEPOD TRADERS';
    const accNo = data.bank_account_no || '8391488082';
    const bankName = data.bank_name || 'INDIAN BANK';
    const ifsc = data.bank_ifsc || 'IDBI000A235';
    const branch = data.bank_branch || 'AVINASHI ROAD';
    const upi = data.bank_upi || '9843672274@upi';

    // Store in localStorage for fast offline rendering
    localStorage.setItem('mk_current_account_details', JSON.stringify({
      bank_account_name: accName,
      bank_account_no: accNo,
      bank_name: bankName,
      bank_ifsc: ifsc,
      bank_branch: branch,
      bank_upi: upi,
      account_type: 'Current Account'
    }));

    // Update all matching elements on the current page
    const nameEl = document.getElementById('displayAccountName');
    const noEl = document.getElementById('displayAccountNo');
    const bankEl = document.getElementById('displayBankName');
    const bankHeaderEl = document.getElementById('displayBankNameHeader');
    const ifscEl = document.getElementById('displayIFSC');
    const branchEl = document.getElementById('displayBranch');
    const upiEl = document.getElementById('displayUPI');

    // Checkout Modal Step 2 Elements
    const modalAccNameEl = document.getElementById('modalBankAccNameDisplay');
    const modalAccNoEl = document.getElementById('modalBankAccNoDisplay');
    const modalBankBranchEl = document.getElementById('modalBankNameBranchDisplay');
    const modalIfscEl = document.getElementById('modalBankIFSCDisplay');
    const modalUpiEl = document.getElementById('modalBankUPIDisplay');
    const directUpiBtn = document.getElementById('modalDirectUPIBtn');

    if (nameEl) nameEl.textContent = accName;
    if (noEl) noEl.textContent = accNo;
    if (bankEl) bankEl.textContent = bankName;
    if (bankHeaderEl) bankHeaderEl.textContent = `${bankName} - Current Account`;
    if (ifscEl) ifscEl.textContent = ifsc;
    if (branchEl) branchEl.textContent = branch;
    if (upiEl) upiEl.textContent = upi;

    if (modalAccNameEl) modalAccNameEl.textContent = accName;
    if (modalAccNoEl) modalAccNoEl.textContent = accNo;
    if (modalBankBranchEl) modalBankBranchEl.textContent = `${bankName} (${branch})`;
    if (modalIfscEl) modalIfscEl.textContent = ifsc;
    if (modalUpiEl) modalUpiEl.textContent = upi;
    if (directUpiBtn) {
      const payableAmt = currentCheckoutOrder.totalAmount || 12000;
      directUpiBtn.href = `upi://pay?pa=${encodeURIComponent(upi)}&pn=SRI%20MK%20SPICEPOD%20TRADERS&am=${payableAmt}&cu=INR`;
    }
  };

  // 1. Initial cached render
  try {
    const cached = localStorage.getItem('mk_current_account_details');
    if (cached) applyBankDetails(JSON.parse(cached));
  } catch (e) {}

  // 2. Fetch from backend API
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.settings) {
        applyBankDetails(json.settings);
        return;
      }
    }
  } catch (e) {}

  // 3. Fallback to Supabase
  if (window.MKSupabase && window.MKSupabase.Settings) {
    try {
      const { data } = await window.MKSupabase.Settings.get();
      if (data) applyBankDetails(data);
    } catch (e) {}
  }
}

// Global Copy Helper with Toast
window.copyText = function(elementId, successMsg) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.textContent || el.innerText || '';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || `Copied "${text}" to clipboard!`);
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, msg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(msg || `Copied to clipboard!`);
  } catch (err) {}
  document.body.removeChild(ta);
}

// Calculate Modal Total Price
window.calculateModalTotal = function() {
  const qtySelect = document.getElementById('enquiryQty');
  const customQtyContainer = document.getElementById('customQtyContainer');
  const customQtyInput = document.getElementById('enquiryCustomQty');
  const priceHidden = document.getElementById('modalHiddenUnitPrice');
  const totalDisplay = document.getElementById('modalCalculatedTotal');

  if (!qtySelect || !priceHidden || !totalDisplay) return;

  let qty = 50;
  if (qtySelect.value === 'custom') {
    if (customQtyContainer) customQtyContainer.style.display = 'block';
    if (customQtyInput) {
      const val = parseFloat(customQtyInput.value);
      qty = (!isNaN(val) && val > 0) ? val : 0;
    }
  } else {
    if (customQtyContainer) customQtyContainer.style.display = 'none';
    qty = parseFloat(qtySelect.value) || 50;
  }

  const unitPrice = parseFloat(priceHidden.value) || 240;
  const total = Math.round(qty * unitPrice);

  totalDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
};

// Handle Quantity Dropdown Change
window.handleQtySelectChange = function() {
  const qtySelect = document.getElementById('enquiryQty');
  const customQtyContainer = document.getElementById('customQtyContainer');
  const customQtyInput = document.getElementById('enquiryCustomQty');

  if (qtySelect && qtySelect.value === 'custom') {
    if (customQtyContainer) customQtyContainer.style.display = 'block';
    if (customQtyInput) {
      if (!customQtyInput.value) customQtyInput.value = '50';
      customQtyInput.focus();
      customQtyInput.select();
    }
  } else {
    if (customQtyContainer) customQtyContainer.style.display = 'none';
  }
  calculateModalTotal();
};

// Dynamic Products Sync from Supabase Database & Backend
async function syncProductsFromAdmin() {
  const renderProductContainers = (products) => {
    if (!Array.isArray(products) || products.length === 0) return;

    const spicesContainer = document.querySelector('#spices .products-grid-4');
    const dryfruitsContainer = document.querySelector('#dry-fruits .products-grid-4');
    const nutsContainer = document.querySelector('#nuts .products-grid-4');
    const wholespicesContainer = document.querySelector('#whole-spices .products-grid-4');

    if (spicesContainer && dryfruitsContainer && nutsContainer && wholespicesContainer) {
      const renderCard = (prod) => {
        const rawPrice = prod.price || prod.price_wholesale || '240';
        const cleanPrice = String(rawPrice).replace(/[^\d.]/g, '') || '240';

        return `
        <div class="product-card" data-category="${(prod.category || 'spices').toLowerCase().replace(/\s+/g, '-')}">
          <div class="product-img-box">
            <img src="${prod.image_url || prod.img || 'images/products/turmeric-powder.jpg'}" alt="${prod.name}" loading="lazy" onerror="this.src='images/products/turmeric-powder.jpg'">
            <span class="product-badge-tag">${prod.grade || prod.badge_tag || 'Grade A'}</span>
          </div>
          <div class="product-info">
            <h3 class="product-name">${prod.name}</h3>
            <div class="product-price-tag">
              <span class="price-currency">₹</span>
              <span class="price-amount">${cleanPrice}</span>
              <span class="price-unit">/ kg</span>
              <span class="wholesale-pill">Wholesale</span>
            </div>
            <button class="btn-buy-now btn-open-enquiry" data-name="${prod.name}" data-category="${prod.category || 'Spices'}" data-price="${cleanPrice}" data-img="${prod.image_url || prod.img || 'images/products/turmeric-powder.jpg'}">
              Buy Now <i class="fas fa-bolt"></i>
            </button>
          </div>
        </div>
      `;
      };

      const spices = products.filter(p => (p.category || p.category_slug || '').toLowerCase().includes('spice') && !(p.category || p.category_slug || '').toLowerCase().includes('whole') && p.status !== 'Inactive');
      const dryfruits = products.filter(p => (p.category || p.category_slug || '').toLowerCase().includes('fruit') && p.status !== 'Inactive');
      const nuts = products.filter(p => (p.category || p.category_slug || '').toLowerCase().includes('nut') && p.status !== 'Inactive');
      const wholespices = products.filter(p => (p.category || p.category_slug || '').toLowerCase().includes('whole') && p.status !== 'Inactive');

      if (spices.length > 0) spicesContainer.innerHTML = spices.map(renderCard).join('');
      if (dryfruits.length > 0) dryfruitsContainer.innerHTML = dryfruits.map(renderCard).join('');
      if (nuts.length > 0) nutsContainer.innerHTML = nuts.map(renderCard).join('');
      if (wholespices.length > 0) wholespicesContainer.innerHTML = wholespices.map(renderCard).join('');
    }
  };

  // 1. Fetch from Supabase PostgreSQL Database (Primary Source of Truth)
  if (window.MKSupabase && window.MKSupabase.Products) {
    const { data: supabaseProds } = await window.MKSupabase.Products.getAll({ status: 'Active' });
    if (Array.isArray(supabaseProds) && supabaseProds.length > 0) {
      renderProductContainers(supabaseProds);
      return;
    }
  }

  // 2. Fetch from backend / fallback
  fetch('/api/products')
    .then(r => r.json())
    .then(data => {
      if (data.status === 'success' && Array.isArray(data.products) && data.products.length > 0) {
        renderProductContainers(data.products);
      }
    })
    .catch(() => {});
}

// Product Filters & Live Search
function initProductFiltersAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const productSections = document.querySelectorAll('.product-category-group');
  const searchInput = document.getElementById('productSearchInput');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetCategory = btn.getAttribute('data-category');

        if (targetCategory === 'all') {
          productSections.forEach(sec => sec.style.display = 'block');
          document.querySelectorAll('.product-card').forEach(card => card.style.display = 'flex');
        } else {
          productSections.forEach(sec => {
            if (sec.getAttribute('data-category') === targetCategory) {
              sec.style.display = 'block';
            } else {
              sec.style.display = 'none';
            }
          });
        }
      });
    });
  }

  // Search input live filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const productCards = document.querySelectorAll('.product-card');

      productCards.forEach(card => {
        const title = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const category = card.getAttribute('data-category')?.toLowerCase() || '';

        if (title.includes(term) || category.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      productSections.forEach(sec => {
        const visibleCards = sec.querySelectorAll('.product-card[style*="display: flex"], .product-card:not([style*="display: none"])');
        if (visibleCards.length === 0 && term !== '') {
          sec.style.display = 'none';
        } else if (term !== '') {
          sec.style.display = 'block';
        }
      });
    });
  }
}

// =========================================================================
// 3-STEP WHOLESALE CHECKOUT & PAYMENT SUBMISSION FLOW
// (ஆர்டர் பதிவு, வங்கி விவரங்கள் & பணம் செலுத்திய ரசீது சரிபார்ப்பு)
// =========================================================================

let currentCheckoutOrder = {
  product: 'Turmeric Powder',
  category: 'Spices',
  img: 'images/products/turmeric-powder.jpg',
  unitPrice: 240,
  quantityKg: 50,
  totalAmount: 12000,
  name: '',
  phone: '',
  gstNumber: '',
  email: '',
  city: '',
  address: '',
  paymentMode: 'UPI (GPay / PhonePe / Paytm)',
  transactionId: '',
  paymentProofUrl: '',
  orderNumber: ''
};

// Step Navigation
window.goToStep = function(stepNum) {
  const step1 = document.getElementById('checkoutStep1');
  const step2 = document.getElementById('checkoutStep2');
  const step3 = document.getElementById('checkoutStep3');

  const ind1 = document.getElementById('stepIndicator1');
  const ind2 = document.getElementById('stepIndicator2');
  const ind3 = document.getElementById('stepIndicator3');

  if (step1) step1.style.display = (stepNum === 1 ? 'block' : 'none');
  if (step2) step2.style.display = (stepNum === 2 ? 'block' : 'none');
  if (step3) step3.style.display = (stepNum === 3 ? 'block' : 'none');

  if (ind1 && ind2 && ind3) {
    ind1.classList.remove('active', 'step-done');
    ind2.classList.remove('active', 'step-done');
    ind3.classList.remove('active', 'step-done');

    if (stepNum === 1) {
      ind1.classList.add('active');
    } else if (stepNum === 2) {
      ind1.classList.add('step-done');
      ind2.classList.add('active');
    } else if (stepNum === 3) {
      ind1.classList.add('step-done');
      ind2.classList.add('step-done');
      ind3.classList.add('active');
    }
  }

  const modalBox = document.querySelector('.modal-buy-checkout');
  if (modalBox) modalBox.scrollTop = 0;
};

// Proceed from Step 1 (Order Details) to Step 2 (Bank Payment Details)
window.goToPaymentStep = function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const product = document.getElementById('modalHiddenProduct')?.value || 'Wholesale Product';
  const unitPrice = parseFloat(document.getElementById('modalHiddenUnitPrice')?.value) || 240;
  
  const qtySelect = document.getElementById('enquiryQty');
  let qty = 50;
  if (qtySelect && qtySelect.value === 'custom') {
    const customVal = parseFloat(document.getElementById('enquiryCustomQty')?.value);
    if (!customVal || customVal <= 0) {
      showToast('Please enter a valid quantity in kg (எடையை உள்ளிடவும்).');
      const inp = document.getElementById('enquiryCustomQty');
      if (inp) {
        inp.focus();
        inp.style.borderColor = '#ef4444';
      }
      return;
    }
    qty = customVal;
  } else {
    qty = parseFloat(qtySelect?.value) || 50;
  }

  const name = document.getElementById('enquiryName')?.value.trim() || '';
  const phone = document.getElementById('enquiryPhone')?.value.trim() || '';
  const gst = document.getElementById('enquiryGST')?.value.trim().toUpperCase() || '';
  const email = document.getElementById('enquiryEmail')?.value.trim() || '';
  const city = document.getElementById('enquiryCity')?.value.trim() || '';
  const address = document.getElementById('enquiryMsg')?.value.trim() || '';

  if (!name || !phone) {
    showToast('Please enter your Name and Contact Phone Number.');
    return;
  }

  const total = Math.round(qty * unitPrice);

  currentCheckoutOrder.product = product;
  currentCheckoutOrder.unitPrice = unitPrice;
  currentCheckoutOrder.quantityKg = qty;
  currentCheckoutOrder.totalAmount = total;
  currentCheckoutOrder.name = name;
  currentCheckoutOrder.phone = phone;
  currentCheckoutOrder.gstNumber = gst;
  currentCheckoutOrder.email = email;
  currentCheckoutOrder.city = city;
  currentCheckoutOrder.address = address;

  // Update Step 2 Summary Chip
  const summaryProd = document.getElementById('step2SummaryProd');
  const summaryCust = document.getElementById('step2SummaryCust');
  const summaryCity = document.getElementById('step2SummaryCity');
  const payableAmount = document.getElementById('step2PayableAmount');

  if (summaryProd) summaryProd.textContent = `${product} (${qty} kg)`;
  if (summaryCust) summaryCust.textContent = gst ? `${name} (GSTIN: ${gst})` : name;
  if (summaryCity) summaryCity.textContent = city || 'Tamil Nadu';
  if (payableAmount) payableAmount.textContent = `₹${total.toLocaleString('en-IN')}`;

  // Update Direct UPI Button link with total amount
  const directUPIBtn = document.getElementById('modalDirectUPIBtn');
  const cachedBank = JSON.parse(localStorage.getItem('mk_current_account_details') || '{}');
  const upiId = cachedBank.bank_upi || '9843672274@upi';
  if (directUPIBtn) {
    directUPIBtn.href = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=SRI%20MK%20SPICEPOD%20TRADERS&am=${total}&cu=INR`;
  }

  // Refresh dynamic bank details
  loadCurrentAccountDetails();

  // Move to Step 2
  goToStep(2);
};

// Payment Screenshot File Upload Preview
window.handlePaymentScreenshotUpload = function(e) {
  const file = e.target.files && e.target.files[0];
  const previewBox = document.getElementById('paymentProofPreview');
  const imgPreview = document.getElementById('paymentProofImg');

  if (!file) return;

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      currentCheckoutOrder.paymentProofUrl = evt.target.result;
      if (imgPreview) imgPreview.src = evt.target.result;
      if (previewBox) previewBox.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  } else {
    currentCheckoutOrder.paymentProofUrl = `file_upload:${file.name}`;
    if (previewBox) previewBox.style.display = 'flex';
  }

  // Also upload to Supabase Storage if configured
  if (window.MKSupabase && window.MKSupabase.Storage) {
    window.MKSupabase.Storage.uploadImage(file, 'payment-proofs', 'receipts')
      .then(({ data }) => {
        if (data && data.publicUrl) {
          currentCheckoutOrder.paymentProofUrl = data.publicUrl;
        }
      }).catch(() => {});
  }
};

// Submit Step 2 (Payment Details & UTR) -> Transition to Step 3 (Order Done!)
window.submitPaymentProof = async function(e) {
  if (e && e.preventDefault) e.preventDefault();

  const paymentMode = document.getElementById('paymentMode')?.value || 'UPI (GPay / PhonePe / Paytm)';
  const txnId = document.getElementById('paymentTransactionId')?.value.trim() || '';
  const submitBtn = document.getElementById('btnSubmitPayment');

  if (!txnId) {
    showToast('Please enter your Bank UTR or UPI Reference Number.');
    document.getElementById('paymentTransactionId')?.focus();
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Order...';
  }

  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const orderNumber = `MK-ORD-${dateStr}-${randSuffix}`;

  currentCheckoutOrder.orderNumber = orderNumber;
  currentCheckoutOrder.paymentMode = paymentMode;
  currentCheckoutOrder.transactionId = txnId;

  const payload = {
    order_number: orderNumber,
    customer_name: currentCheckoutOrder.name,
    customer_phone: currentCheckoutOrder.phone,
    customer_email: currentCheckoutOrder.email,
    customer_gst: currentCheckoutOrder.gstNumber || '',
    customer_city: currentCheckoutOrder.city,
    delivery_address: currentCheckoutOrder.address,
    product_name: currentCheckoutOrder.product,
    quantity_kg: currentCheckoutOrder.quantityKg,
    unit_price: currentCheckoutOrder.unitPrice,
    total_amount: currentCheckoutOrder.totalAmount,
    payment_mode: currentCheckoutOrder.paymentMode,
    transaction_id: currentCheckoutOrder.transactionId,
    payment_proof_url: currentCheckoutOrder.paymentProofUrl,
    payment_status: 'Pending Verification',
    order_status: 'Pending Verification',
    notes: `${currentCheckoutOrder.gstNumber ? `GSTIN: ${currentCheckoutOrder.gstNumber} | ` : ''}Address: ${currentCheckoutOrder.address || 'N/A'}`
  };

  // 1. Save directly into backend SQLite orders database
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Backend order submission warning:', err);
  }

  // 2. Save directly to Supabase PostgreSQL Database
  if (window.MKSupabase && window.MKSupabase.Orders) {
    try {
      await window.MKSupabase.Orders.create(payload, [{
        product_name: currentCheckoutOrder.product,
        quantity_kg: currentCheckoutOrder.quantityKg,
        unit_price: currentCheckoutOrder.unitPrice,
        total_price: currentCheckoutOrder.totalAmount
      }]);
    } catch (err) {
      console.warn('Supabase order creation warning:', err);
    }
  }

  // 3. Populate Step 3 Confirmation Screen Elements
  const doneOrderId = document.getElementById('doneOrderId');
  const doneProduct = document.getElementById('doneProduct');
  const doneQuantity = document.getElementById('doneQuantity');
  const doneAmount = document.getElementById('doneAmount');
  const donePaymentMode = document.getElementById('donePaymentMode');
  const doneUTR = document.getElementById('doneUTR');
  const doneCustomer = document.getElementById('doneCustomer');
  const waShareBtn = document.getElementById('btnShareOrderWhatsApp');

  if (doneOrderId) doneOrderId.textContent = orderNumber;
  if (doneProduct) doneProduct.textContent = currentCheckoutOrder.product;
  if (doneQuantity) doneQuantity.textContent = `${currentCheckoutOrder.quantityKg} kg (@ ₹${currentCheckoutOrder.unitPrice}/kg)`;
  if (doneAmount) doneAmount.textContent = `₹${currentCheckoutOrder.totalAmount.toLocaleString('en-IN')}`;
  if (donePaymentMode) donePaymentMode.textContent = currentCheckoutOrder.paymentMode;
  if (doneUTR) doneUTR.textContent = currentCheckoutOrder.transactionId;
  if (doneCustomer) doneCustomer.textContent = `${currentCheckoutOrder.name} (${currentCheckoutOrder.phone})${currentCheckoutOrder.gstNumber ? ` • GSTIN: ${currentCheckoutOrder.gstNumber}` : ''}`;

  if (waShareBtn) {
    const waText = `*Wholesale Order Payment Confirmation - Sri MK Spicepod Traders*%0A%0A*Order #:* ${encodeURIComponent(orderNumber)}%0A*Product:* ${encodeURIComponent(currentCheckoutOrder.product)}%0A*Quantity:* ${encodeURIComponent(currentCheckoutOrder.quantityKg)} kg%0A*Total Amount:* ₹${encodeURIComponent(currentCheckoutOrder.totalAmount.toLocaleString('en-IN'))}%0A*Payment Mode:* ${encodeURIComponent(currentCheckoutOrder.paymentMode)}%0A*UTR / Txn ID:* ${encodeURIComponent(currentCheckoutOrder.transactionId)}%0A%0A*Customer:* ${encodeURIComponent(currentCheckoutOrder.name)}%0A*Phone:* ${encodeURIComponent(currentCheckoutOrder.phone)}${currentCheckoutOrder.gstNumber ? `%0A*GSTIN:* ${encodeURIComponent(currentCheckoutOrder.gstNumber)}` : ''}%0A*City:* ${encodeURIComponent(currentCheckoutOrder.city)}%0A*Address:* ${encodeURIComponent(currentCheckoutOrder.address)}%0A%0A_Payment proof submitted. Kindly verify and dispatch consignment._`;
    waShareBtn.onclick = () => {
      window.open(`https://wa.me/919843672274?text=${waText}`, '_blank');
    };
  }

  // Advance to Step 3
  goToStep(3);
  showToast(`Order #${orderNumber} placed successfully!`);

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-circle-check"></i> Submit Payment &amp; Place Order';
  }
};

// =========================================================================
// PDF RECEIPT DOWNLOAD & PRINT CONTROLLERS (ரசீது பதிவிறக்கம் & அச்சிடுதல்)
// =========================================================================

// Standalone Isolated A4 PDF Generator (Guarantees zero clipping and perfect alignment)
window.exportHTMLToA4PDF = function(htmlContent, filename) {
  return new Promise((resolve) => {
    // Clean up any stale iframe
    const oldIframe = document.getElementById('mk-pdf-isolated-iframe');
    if (oldIframe) oldIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'mk-pdf-isolated-iframe';
    // Position at top-left with opacity 0 and pointer-events none in an ample 750px viewport
    iframe.style.cssText = 'position: fixed; left: 0; top: 0; width: 750px; height: 1100px; opacity: 0; pointer-events: none; z-index: -1; border: 0;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(async () => {
      try {
        if (typeof html2pdf !== 'undefined') {
          const targetEl = doc.getElementById('pdf-root') || doc.body;
          const opt = {
            margin: [6, 6, 6, 6],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              logging: false,
              scrollX: 0,
              scrollY: 0,
              x: 0,
              y: 0,
              width: 750,
              windowWidth: 750,
              backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          await html2pdf().set(opt).from(targetEl).save();
          iframe.remove();
          showToast(`Downloaded: ${filename}`);
          resolve(true);
        } else {
          iframe.remove();
          printOrderSlip();
          resolve(false);
        }
      } catch (err) {
        console.warn('PDF export fallback:', err);
        iframe.remove();
        printOrderSlip();
        resolve(false);
      }
    }, 200);
  });
};

// Generate and Download Clean A4 PDF Order Receipt
window.downloadOrderReceiptPDF = async function() {
  const orderId = document.getElementById('doneOrderId')?.textContent || currentCheckoutOrder.orderNumber || `MK-ORD-${Date.now()}`;
  const prod = currentCheckoutOrder.product || document.getElementById('doneProduct')?.textContent || 'Wholesale Commodity';
  const qty = currentCheckoutOrder.quantityKg ? `${currentCheckoutOrder.quantityKg} kg` : (document.getElementById('doneQuantity')?.textContent || '50 kg');
  const unitRate = currentCheckoutOrder.unitPrice || 240;
  const amt = currentCheckoutOrder.totalAmount ? `₹${Number(currentCheckoutOrder.totalAmount).toLocaleString('en-IN')}` : (document.getElementById('doneAmount')?.textContent || '₹12,000');
  const mode = currentCheckoutOrder.paymentMode || document.getElementById('donePaymentMode')?.textContent || 'UPI Transfer';
  const utr = currentCheckoutOrder.transactionId || document.getElementById('doneUTR')?.textContent || 'N/A';
  const custName = currentCheckoutOrder.name || 'Wholesale Customer';
  const custPhone = currentCheckoutOrder.phone || '9843672274';
  const custGST = currentCheckoutOrder.gstNumber || '';
  const custEmail = currentCheckoutOrder.email || 'N/A';
  const custCity = currentCheckoutOrder.city || 'Tamil Nadu';
  const custAddress = currentCheckoutOrder.address || 'Standard Wholesale Consignment Address';
  const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  // Get current bank details
  const cachedBank = JSON.parse(localStorage.getItem('mk_current_account_details') || '{}');
  const bankAccName = cachedBank.bank_account_name || cachedBank.bank_acc_name || 'SRI MK SPICEPOD TRADERS';
  const bankAccNo = cachedBank.bank_account_no || cachedBank.bank_acc_no || '8391488082';
  const bankName = cachedBank.bank_name || 'INDIAN BANK';
  const bankBranch = cachedBank.bank_branch || 'AVINASHI ROAD';
  const bankIfsc = cachedBank.bank_ifsc || 'IDBI000A235';
  const bankUpi = cachedBank.bank_upi || '9843672274@upi';

  showToast('Generating official Receipt PDF...');

  const htmlDoc = `
    <!DOCTYPE html>
    <html style="margin:0; padding:0; background:#ffffff; width:750px;">
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            width: 750px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #pdf-root {
            width: 750px;
            margin: 0;
            border: 2px solid #0b4328;
            border-radius: 8px;
            padding: 16px;
            background: #ffffff;
            box-sizing: border-box;
          }
          table { width: 100%; border-collapse: collapse; }
          td, th { vertical-align: top; }
        </style>
      </head>
      <body>
        <div id="pdf-root">
          <!-- HEADER -->
          <table style="width: 100%; border-collapse: collapse; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px;">
            <tr>
              <td style="width: 52px; vertical-align: middle;">
                <div style="width: 44px; height: 44px; background-color: #0b4328; color: #ffffff; border-radius: 6px; text-align: center; line-height: 44px; font-size: 20px; font-weight: 900;">MK</div>
              </td>
              <td style="vertical-align: middle; padding-left: 8px;">
                <div style="font-size: 18px; font-weight: 900; color: #0b4328; line-height: 1.2;">SRI MK SPICEPOD TRADERS</div>
                <div style="font-size: 10px; color: #059669; font-weight: 700; text-transform: uppercase;">Spices &amp; Nuts Wholesale Direct Farm Sourced</div>
                <div style="font-size: 9px; color: #475569; margin-top: 2px; line-height: 1.3;">
                  <strong>GSTIN:</strong> 33AUJPM5853C1ZP &bull; <strong>PAN:</strong> AUJPM5853C<br>
                  No.148 D5, TTP Mill Road, Nataraja Layout, Thirumuruganpoondi, Tiruppur, TN - 641652<br>
                  Phone: +91 98436 72274 &bull; Email: mktraders4434@gmail.com
                </div>
              </td>
              <td style="width: 190px; text-align: right; vertical-align: top;">
                <div style="background-color: #059669; color: #ffffff; font-weight: 800; font-size: 9.5px; padding: 4px 9px; border-radius: 12px; display: inline-block;">OFFICIAL ORDER RECEIPT</div>
                <div style="font-size: 13px; font-weight: 900; margin-top: 3px; color: #0f172a;">${orderId}</div>
                <div style="font-size: 9px; color: #64748b;">Date: ${dateStr}</div>
              </td>
            </tr>
          </table>

          <!-- CUSTOMER & DELIVERY INFO (2 COLUMNS) -->
          <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 12px;">
            <tr>
              <td style="width: 52%; padding: 10px 12px; border-right: 1px solid #e2e8f0; font-size: 10.5px;">
                <strong style="color: #059669; font-size: 9.5px; text-transform: uppercase;">CUSTOMER (BILLED TO):</strong><br>
                <div style="font-size: 12.5px; font-weight: 800; color: #0f172a; margin-top: 2px;">${custName}</div>
                ${custGST ? `<div style="color: #0b4328; font-weight: 800; font-size: 10.5px; margin-top: 2px;">GSTIN: ${custGST}</div>` : ''}
                <div style="color: #475569; margin-top: 2px;">Phone: +91 ${custPhone} &bull; Destination: ${custCity}</div>
                ${custEmail !== 'N/A' ? `<div style="color: #475569; margin-top: 2px;">Email: ${custEmail}</div>` : ''}
              </td>
              <td style="width: 48%; padding: 10px 12px; font-size: 10px;">
                <strong style="color: #059669; font-size: 9.5px; text-transform: uppercase;">DELIVERY ADDRESS:</strong><br>
                <div style="color: #334155; margin-top: 2px; line-height: 1.3;">${custAddress}</div>
              </td>
            </tr>
          </table>

          <!-- ITEMS TABLE -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
            <thead>
              <tr style="background-color: #0b4328; color: #ffffff;">
                <th style="width: 48%; text-align: left; background-color: #0b4328; color: #ffffff; padding: 7px 8px; font-size: 10px;">Item Description</th>
                <th style="width: 16%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 7px 6px; font-size: 10px;">Quantity</th>
                <th style="width: 16%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 7px 6px; font-size: 10px;">Wholesale Rate</th>
                <th style="width: 20%; text-align: right; background-color: #0b4328; color: #ffffff; padding: 7px 8px; font-size: 10px;">Total Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px 8px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px;">
                  <strong style="color: #0f172a;">${prod}</strong><br>
                  <small style="color: #64748b;">Wholesale Farm Consignment • Export Certified Quality</small>
                </td>
                <td style="text-align: right; font-weight: 700; padding: 8px 6px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px;">${qty}</td>
                <td style="text-align: right; padding: 8px 6px; border-bottom: 1px solid #e2e8f0; font-size: 10.5px;">₹${unitRate}/kg</td>
                <td style="text-align: right; font-weight: 800; color: #0b4328; padding: 8px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11.5px;">${amt}</td>
              </tr>
            </tbody>
          </table>

          <!-- PAYMENT REMITTANCE & BENEFICIARY (2 COLUMNS) -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
            <tr>
              <td style="width: 48%; vertical-align: top; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 9px 11px; font-size: 10px;">
                <strong style="color: #166534; font-size: 10px;">✔ Payment Remittance:</strong><br>
                <div style="margin-top: 3px; line-height: 1.4;">
                  <strong>Payment Mode:</strong> ${mode}<br>
                  <strong>UTR / Txn ID:</strong> <span style="color: #0369a1; font-weight: 800; font-family: monospace;">${utr}</span><br>
                  <strong>Total Amount Paid:</strong> <span style="font-weight: 900; color: #15803d; font-size: 11.5px;">${amt}</span>
                </div>
              </td>
              <td style="width: 4%;"></td>
              <td style="width: 48%; vertical-align: top; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 9px 11px; font-size: 10px;">
                <strong style="color: #0b4328; font-size: 10px;">🏦 Beneficiary Current A/C:</strong><br>
                <div style="margin-top: 3px; line-height: 1.4; color: #1e293b;">
                  <strong>A/C Name:</strong> ${bankAccName}<br>
                  <strong>Current A/C:</strong> <span style="font-weight: 800; color: #0b4328;">${bankAccNo}</span> (${bankName})<br>
                  <strong>IFSC:</strong> ${bankIfsc} &bull; <strong>UPI:</strong> ${bankUpi}
                </div>
              </td>
            </tr>
          </table>

          <!-- FOOTER -->
          <table style="width: 100%; border-collapse: collapse; border-top: 1px dashed #cbd5e1; padding-top: 6px; margin-top: 8px;">
            <tr>
              <td style="width: 60%; vertical-align: bottom; font-size: 9px; color: #64748b; line-height: 1.4;">
                Computer Generated Wholesale Order Receipt &bull; Subject to Tiruppur Jurisdiction.<br>
                Helpline &amp; WhatsApp: +91 98436 72274 &bull; Email: mktraders4434@gmail.com
              </td>
              <td style="width: 40%; vertical-align: bottom; text-align: right;">
                <div style="font-weight: 700; color: #0f172a; margin-bottom: 16px; font-size: 10px;">For SRI MK SPICEPOD TRADERS</div>
                <div style="border-top: 1px solid #94a3b8; display: inline-block; padding-top: 2px; font-size: 9.5px; color: #334155;">Authorized Signatory</div>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;

  await exportHTMLToA4PDF(htmlDoc, `Receipt_${orderId}.pdf`);
};

// Print Order Receipt Slip
window.printOrderSlip = function() {
  const orderId = document.getElementById('doneOrderId')?.textContent || currentCheckoutOrder.orderNumber || 'ORDER';
  const prod = currentCheckoutOrder.product || document.getElementById('doneProduct')?.textContent || '';
  const qty = currentCheckoutOrder.quantityKg ? `${currentCheckoutOrder.quantityKg} kg` : (document.getElementById('doneQuantity')?.textContent || '');
  const amt = currentCheckoutOrder.totalAmount ? `₹${Number(currentCheckoutOrder.totalAmount).toLocaleString('en-IN')}` : (document.getElementById('doneAmount')?.textContent || '');
  const mode = currentCheckoutOrder.paymentMode || document.getElementById('donePaymentMode')?.textContent || '';
  const utr = currentCheckoutOrder.transactionId || document.getElementById('doneUTR')?.textContent || '';
  const cust = currentCheckoutOrder.name ? `${currentCheckoutOrder.name} (${currentCheckoutOrder.phone})` : (document.getElementById('doneCustomer')?.textContent || '');

  const printWindow = window.open('', '_blank', 'width=750,height=800');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Receipt - ${orderId} - Sri MK Spicepod Traders</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 25px; color: #0f172a; margin: 0; }
          .receipt-box { max-width: 600px; margin: 0 auto; border: 2px solid #0b4328; border-radius: 12px; padding: 24px; }
          .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px; }
          .header h1 { margin: 0; color: #0b4328; font-size: 22px; font-weight: 900; }
          .header p { margin: 4px 0 0; color: #64748b; font-size: 12px; }
          .badge { display: inline-block; background: #d1fae5; color: #065f46; font-weight: 700; font-size: 12px; padding: 4px 14px; border-radius: 20px; margin: 8px 0; }
          .receipt-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .receipt-table tr { border-bottom: 1px dashed #cbd5e1; }
          .receipt-table td { padding: 9px 6px; font-size: 13px; }
          .receipt-table td:first-child { color: #64748b; font-weight: 600; width: 44%; }
          .receipt-table td:last-child { font-weight: 700; color: #0f172a; text-align: right; }
          .footer { text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #94a3b8; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <h1>SRI MK SPICEPOD TRADERS</h1>
            <p>Wholesale Spices, Dry Fruits &amp; Premium Nuts Supply &bull; GSTIN: 33AUJPM5853C1ZP</p>
            <div class="badge">✔ Order Confirmed &bull; Payment Submitted</div>
          </div>
          <table class="receipt-table">
            <tr><td>Order Reference Number</td><td style="color:#0b4328; font-size:15px; font-weight:800;">${orderId}</td></tr>
            <tr><td>Customer / Business</td><td>${cust}</td></tr>
            <tr><td>Product Ordered</td><td>${prod}</td></tr>
            <tr><td>Quantity</td><td>${qty}</td></tr>
            <tr><td>Total Amount Paid</td><td style="color:#059669; font-size:16px;">${amt}</td></tr>
            <tr><td>Payment Mode</td><td>${mode}</td></tr>
            <tr><td>UTR / Transaction Ref</td><td style="color:#0284c7; font-family:monospace;">${utr}</td></tr>
            <tr><td>Official Current A/C</td><td>INDIAN BANK (8391488082)</td></tr>
          </table>
          <div class="footer">
            <p>Official Helpline &amp; WhatsApp: +91 98436 72274 &bull; Email: mktraders4434@gmail.com</p>
            <p>No.148 D5, TTP Mill Road, Nataraja Layout, Thirumuruganpoondi, Tiruppur - 641652</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

// Reset Modal and Close
window.closeModalAndReset = function() {
  const enquiryModal = document.getElementById('enquiryModal');
  if (enquiryModal) enquiryModal.classList.remove('active');

  const form1 = document.getElementById('orderFormStep1');
  if (form1) form1.reset();

  const form2 = document.getElementById('paymentSubmissionForm');
  if (form2) form2.reset();

  const customContainer = document.getElementById('customQtyContainer');
  if (customContainer) customContainer.style.display = 'none';
  const customQtyInput = document.getElementById('enquiryCustomQty');
  if (customQtyInput) {
    customQtyInput.value = '';
    customQtyInput.style.borderColor = '';
  }

  const qtySelect = document.getElementById('enquiryQty');
  if (qtySelect) qtySelect.value = '50';

  const previewBox = document.getElementById('paymentProofPreview');
  if (previewBox) previewBox.style.display = 'none';

  const gstInput = document.getElementById('enquiryGST');
  if (gstInput) gstInput.value = '';

  currentCheckoutOrder = {
    product: 'Turmeric Powder',
    category: 'Spices',
    img: 'images/products/turmeric-powder.jpg',
    unitPrice: 240,
    quantityKg: 50,
    totalAmount: 12000,
    name: '',
    phone: '',
    gstNumber: '',
    email: '',
    city: '',
    address: '',
    paymentMode: 'UPI (GPay / PhonePe / Paytm)',
    transactionId: '',
    paymentProofUrl: '',
    orderNumber: ''
  };

  goToStep(1);
};

// Buy Now / Wholesale Order Modal Logic
function initEnquiryModal() {
  const enquiryModal = document.getElementById('enquiryModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductName = document.getElementById('modalProductName');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalProductCategory = document.getElementById('modalProductCategory');
  const modalProductPrice = document.getElementById('modalProductPrice');
  const modalHiddenProduct = document.getElementById('modalHiddenProduct');
  const modalHiddenUnitPrice = document.getElementById('modalHiddenUnitPrice');

  // Event delegation so dynamically added products trigger modal seamlessly
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-open-enquiry');
    if (!btn) return;

    e.preventDefault();
    const name = btn.getAttribute('data-name') || 'Product';
    const category = btn.getAttribute('data-category') || 'Spices & Nuts';
    const img = btn.getAttribute('data-img') || 'images/products/turmeric-powder.jpg';
    const price = btn.getAttribute('data-price') || '240';

    if (modalProductName) modalProductName.textContent = name;
    if (modalProductCategory) modalProductCategory.textContent = category;
    if (modalProductImg) modalProductImg.src = img;
    if (modalProductPrice) modalProductPrice.textContent = `₹${price}`;
    if (modalHiddenProduct) modalHiddenProduct.value = name;
    if (modalHiddenUnitPrice) modalHiddenUnitPrice.value = price;

    const qtySelect = document.getElementById('enquiryQty');
    if (qtySelect) qtySelect.value = '50';
    const customContainer = document.getElementById('customQtyContainer');
    if (customContainer) customContainer.style.display = 'none';
    const customQtyInput = document.getElementById('enquiryCustomQty');
    if (customQtyInput) {
      customQtyInput.value = '';
      customQtyInput.style.borderColor = '';
    }
    const gstInp = document.getElementById('enquiryGST');
    if (gstInp) gstInp.value = '';

    window.calculateModalTotal();
    goToStep(1);

    if (enquiryModal) {
      enquiryModal.classList.add('active');
    }
  });

  if (modalCloseBtn && enquiryModal) {
    modalCloseBtn.addEventListener('click', () => {
      closeModalAndReset();
    });

    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) {
        closeModalAndReset();
      }
    });
  }
}

// Gallery Lightbox
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  if (galleryItems.length > 0 && lightboxModal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img')?.src;
        const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-title')?.textContent || 'Sri MK Spicepod Traders';
        
        if (lightboxImg) lightboxImg.src = img;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.add('active');
      });
    });

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }
}

// Contact Form
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || '';
      const email = document.getElementById('contactEmail')?.value || '';
      const phone = document.getElementById('contactPhone')?.value || '';
      const req = document.getElementById('contactRequirement')?.value || 'General Inquiry';
      const msg = document.getElementById('contactMessage')?.value || '';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      }

      // 1. Submit directly to Supabase Database
      if (window.MKSupabase && window.MKSupabase.Enquiries) {
        await window.MKSupabase.Enquiries.create({
          name: name,
          phone: phone,
          email: email,
          product: req,
          quantity: 'Direct Contact Form',
          message: msg,
          destination_city: ''
        });
      }

      // 2. Also send to local backend
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          product: req,
          quantity: 'Direct Contact Message',
          message: msg
        })
      }).catch(() => {});

      const waText = `*New Contact Message - Sri MK Spicepod Traders*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Requirement:* ${encodeURIComponent(req)}%0A*Message:* ${encodeURIComponent(msg)}`;

      showToast(`Thank you ${name}! Your wholesale inquiry has been saved.`);
      contactForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      }

      setTimeout(() => {
        window.open(`https://wa.me/919843672274?text=${waText}`, '_blank');
      }, 800);
    });
  }
}

// Toast Alert System
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;font-size:1.1rem;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
window.showToast = showToast;
