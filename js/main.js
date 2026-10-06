/**
 * MK SPICEPOD TRADERS
 * Main Interactive Application Script with Dynamic Admin Product Sync
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
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
});

// Dynamic Products Sync from Supabase Database
async function syncProductsFromAdmin() {
  const renderProductContainers = (products) => {
    if (!Array.isArray(products) || products.length === 0) return;

    const spicesContainer = document.querySelector('#spices .products-grid-4');
    const dryfruitsContainer = document.querySelector('#dry-fruits .products-grid-4');
    const nutsContainer = document.querySelector('#nuts .products-grid-4');
    const wholespicesContainer = document.querySelector('#whole-spices .products-grid-4');

    if (spicesContainer && dryfruitsContainer && nutsContainer && wholespicesContainer) {
      const renderCard = (prod) => `
        <div class="product-card" data-category="${(prod.category || 'spices').toLowerCase().replace(/\s+/g, '-')}">
          <div class="product-img-box">
            <img src="${prod.image_url || prod.img || 'images/products/turmeric-powder.jpg'}" alt="${prod.name}" loading="lazy" onerror="this.src='images/products/turmeric-powder.jpg'">
            <span class="product-badge-tag">${prod.grade || 'Grade A'}</span>
          </div>
          <div class="product-info">
            <h3 class="product-name">${prod.name}</h3>
            <button class="btn-enquiry btn-open-enquiry" data-name="${prod.name}" data-category="${prod.category || 'Spices'}" data-img="${prod.image_url || prod.img || 'images/products/turmeric-powder.jpg'}">
              Enquiry Now <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      const spices = products.filter(p => (p.category || '').toLowerCase() === 'spices' && p.status !== 'Inactive');
      const dryfruits = products.filter(p => (p.category || '').toLowerCase() === 'dry fruits' && p.status !== 'Inactive');
      const nuts = products.filter(p => (p.category || '').toLowerCase() === 'nuts' && p.status !== 'Inactive');
      const wholespices = products.filter(p => (p.category || '').toLowerCase() === 'whole spices' && p.status !== 'Inactive');

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

// Enquiry Modal Logic
function initEnquiryModal() {
  const enquiryModal = document.getElementById('enquiryModal');
  const enquiryForm = document.getElementById('enquiryForm');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalProductName = document.getElementById('modalProductName');
  const modalProductImg = document.getElementById('modalProductImg');
  const modalProductCategory = document.getElementById('modalProductCategory');
  const modalHiddenProduct = document.getElementById('modalHiddenProduct');

  // Use event delegation so dynamically added products from Admin trigger modal seamlessly
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-open-enquiry');
    if (!btn) return;

    e.preventDefault();
    const name = btn.getAttribute('data-name') || 'Product';
    const category = btn.getAttribute('data-category') || 'Spices & Nuts';
    const img = btn.getAttribute('data-img') || 'images/products/turmeric-powder.jpg';

    if (modalProductName) modalProductName.textContent = name;
    if (modalProductCategory) modalProductCategory.textContent = category;
    if (modalProductImg) modalProductImg.src = img;
    if (modalHiddenProduct) modalHiddenProduct.value = name;

    if (enquiryModal) {
      enquiryModal.classList.add('active');
    }
  });

  if (modalCloseBtn && enquiryModal) {
    modalCloseBtn.addEventListener('click', () => {
      enquiryModal.classList.remove('active');
    });

    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal) {
        enquiryModal.classList.remove('active');
      }
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const product = modalHiddenProduct?.value || 'Wholesale Products';
      const name = document.getElementById('enquiryName')?.value || '';
      const phone = document.getElementById('enquiryPhone')?.value || '';
      const quantity = document.getElementById('enquiryQty')?.value || 'Wholesale Quantity';
      const message = document.getElementById('enquiryMsg')?.value || '';
      const email = document.getElementById('enquiryEmail')?.value || '';

      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      }

      // 1. Save directly to Supabase PostgreSQL Database
      if (window.MKSupabase && window.MKSupabase.Enquiries) {
        await window.MKSupabase.Enquiries.create({
          name: name,
          phone: phone,
          email: email,
          product: product,
          quantity: quantity,
          message: message,
          destination_city: ''
        });
      }

      // 2. Also send to local backend endpoint
      fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          email: email,
          product: product,
          quantity: quantity,
          message: message
        })
      }).catch(() => {});

      const waText = `*Wholesale Enquiry - MK Spicepod Traders*%0A%0A*Product:* ${encodeURIComponent(product)}%0A*Quantity:* ${encodeURIComponent(quantity)}%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Notes:* ${encodeURIComponent(message)}`;

      showToast(`Thank you ${name}! Your wholesale enquiry has been recorded in Supabase.`);
      if (enquiryModal) enquiryModal.classList.remove('active');
      enquiryForm.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Enquiry <i class="fas fa-paper-plane"></i>';
      }

      setTimeout(() => {
        window.open(`https://wa.me/919843672274?text=${waText}`, '_blank');
      }, 700);
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
        const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-title')?.textContent || 'MK Spicepod Traders';
        
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

      const waText = `*New Contact Message - MK Spicepod Traders*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email)}%0A*Requirement:* ${encodeURIComponent(req)}%0A*Message:* ${encodeURIComponent(msg)}`;

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
