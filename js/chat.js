/**
 * MK SPICEPOD TRADERS - Live Chat Widget Client Script
 * Zero-Data-Loss Architecture: IndexedDB + LocalStorage + REST API Disk Persistence + Realtime BroadcastChannel, Live Polling & Payment Proof Attachment Upload
 */

(function () {
  'use strict';

  // State keys
  const STORAGE_CUSTOMER_KEY = 'mk_chat_customer_session';
  const STORAGE_MESSAGES_KEY = 'mk_chat_messages';
  const STORAGE_CONFIG_KEY = 'mk_chat_auto_config';
  const BROADCAST_CHANNEL_NAME = 'mk_spicepod_live_chat';

  // Default Auto Configuration
  const DEFAULT_AUTO_CONFIG = {
    teaserText: "👋 Need Wholesale Rates? Chat with us",
    welcomeMsg1: "Namaste! 🙏 Welcome to **SRI MK SPICEPOD TRADERS** – Wholesale Supplier of Premium Spices, Dry Fruits & Nuts.",
    welcomeMsg2: "How can we help your business today? You can select a quick topic below or type your requirement:",
    ratecardReply: "📊 **SRI MK SPICEPOD Daily Wholesale Rates (Indicative Bulk Rates/kg):**\n• Turmeric Salem Grade A: ₹240/kg\n• Red Chilli Guntur Sannam: ₹280/kg\n• Tellicherry Black Pepper: ₹650/kg\n• California Almonds: ₹720/kg\n• W240 King Cashews: ₹820/kg\n• Iranian Salted Pistachios: ₹1,150/kg\n• Green Cardamom 8mm: ₹2,600/kg\n\nFor bulk orders above 500kg, special discounted rates apply. Would you like a formal proforma quotation?",
    spicesReply: "🌶️ **Bulk Spices Supply:**\nWe supply standard 25kg / 50kg gunny bags with moisture-proof liner and food-grade lab certification. Please specify your required quantity (e.g. 200kg, 1 Ton) and destination city for freight estimation.",
    nutsReply: "🥜 **Nuts & Dry Fruits:**\nWe offer vacuum-packed 10kg & 20kg wholesale cartons of California Almonds, W240/W320 Cashews, Jumbo Pistachios, Afghan Figs, and Medjool Dates. Ready dispatch available across India.",
    deliveryReply: "🚚 **MOQ & Delivery Info:**\n• Minimum Order: 25 kg per item (or 100 kg mixed wholesale consignment).\n• Delivery: Dispatch within 24 hours via reputed transport / VRL / SafeXpress.\n• Payment: Bank Transfer (NEFT/RTGS/IMPS), UPI & Cash on Dispatch.",
    enableSmartBot: true
  };

  // State
  let currentCustomer = null;
  let chatMessages = [];
  let autoConfig = Object.assign({}, DEFAULT_AUTO_CONFIG);
  let broadcastChannel = null;
  let pollingInterval = null;
  let selectedAttachment = null; // { dataUrl: '', name: '', type: 'image' }

  // Initialize on DOM load or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initChatWidget();
    });
  } else {
    initChatWidget();
  }

  function initChatWidget() {
    // 0. Load Auto-Config
    loadAutoConfig();

    // 1. Inject HTML markup if not already present
    injectChatMarkup();

    // 2. Load stored customer session & chat messages
    loadCustomerSession();
    loadStoredMessages();

    // 3. Setup BroadcastChannel for real-time multi-tab & admin sync
    try {
      if ('BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_MESSAGE') {
            handleIncomingBroadcast(event.data);
          } else if (event.data && event.data.type === 'CONFIG_UPDATED') {
            if (event.data.config) {
              autoConfig = Object.assign({}, DEFAULT_AUTO_CONFIG, event.data.config);
              applyAutoConfig();
            }
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported:', e);
    }

    // 4. Setup storage listener as fallback
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_MESSAGES_KEY) {
        loadStoredMessages();
        renderChatMessages();
      } else if (e.key === STORAGE_CONFIG_KEY) {
        loadAutoConfig();
      }
    });

    // 5. Setup UI Event Listeners
    setupChatEventListeners();

    // 6. Start continuous live polling with Backend Server & Supabase
    startLivePolling();

    // 7. Check for unread messages badge
    updateLauncherBadge();

    // 8. Apply initial config to UI
    applyAutoConfig();
  }

  async function loadAutoConfig() {
    try {
      const local = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (local) {
        autoConfig = Object.assign({}, DEFAULT_AUTO_CONFIG, JSON.parse(local));
      }
    } catch (e) {}

    // 1. Check Supabase first
    if (window.MKSupabase && window.MKSupabase.AutoConfig) {
      try {
        const { data: supaConfig } = await window.MKSupabase.AutoConfig.get();
        if (supaConfig) {
          autoConfig = Object.assign({}, DEFAULT_AUTO_CONFIG, supaConfig);
          localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(autoConfig));
          applyAutoConfig();
          return;
        }
      } catch (err) {
        console.warn('Supabase AutoConfig fetch error:', err);
      }
    }

    // 2. Fallback to REST API
    fetch('/api/auto-config')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.config) {
          autoConfig = Object.assign({}, DEFAULT_AUTO_CONFIG, data.config);
          localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(autoConfig));
          applyAutoConfig();
        }
      })
      .catch(() => {});
  }

  function applyAutoConfig() {
    const teaserSpan = document.querySelector('#mkChatTeaserBubble span:first-child');
    if (teaserSpan && autoConfig && autoConfig.teaserText) {
      teaserSpan.innerHTML = autoConfig.teaserText;
    }
  }

  // Client-side image compression helper
  function compressAndReadImage(file, callback) {
    if (!file) return;
    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => callback(e.target.result, file.name, 'pdf');
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        callback(dataUrl, file.name, 'image');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Inject Widget DOM Structure
  function injectChatMarkup() {
    if (document.getElementById('mkChatWidgetContainer')) return;

    const container = document.createElement('div');
    container.id = 'mkChatWidgetContainer';
    container.innerHTML = `
      <!-- Floating Teaser Callout Tooltip -->
      <div class="mk-chat-teaser-bubble" id="mkChatTeaserBubble" title="Click to chat with wholesale support">
        <span>👋 <strong>Need Wholesale Rates?</strong> Chat with us</span>
        <span class="mk-chat-teaser-close" id="mkChatTeaserClose" title="Dismiss">&times;</span>
      </div>

      <!-- Floating Circular Chat Trigger Button -->
      <button class="mk-chat-launcher" id="mkChatLauncher" aria-label="Open Live Chat with SRI MK Spicepod Traders" title="Live Wholesale Chat">
        <i class="fas fa-comment-dots mk-chat-icon-msg"></i>
        <i class="fas fa-times mk-chat-icon-close"></i>
        <span class="mk-launcher-online-dot"></span>
        <span class="mk-chat-launcher-badge" id="mkChatLauncherBadge">0</span>
      </button>

      <!-- Chat Window -->
      <div class="mk-chat-window" id="mkChatWindow">
        <!-- Header -->
        <div class="mk-chat-header">
          <div class="mk-chat-header-info">
            <div class="mk-chat-header-avatar">MK</div>
            <div>
              <h3 class="mk-chat-header-title">SRI MK SPICEPOD Support</h3>
              <div class="mk-chat-header-status">
                <span class="mk-online-dot"></span> Online • Wholesale Support Desk
              </div>
            </div>
          </div>
          <div class="mk-chat-header-actions">
            <a href="tel:9843672274" class="mk-chat-btn-icon" title="Call Wholesale Desk (9843672274)" style="text-decoration:none;">
              <i class="fas fa-phone-alt"></i>
            </a>
            <button class="mk-chat-btn-icon" id="mkChatMinimizeBtn" title="Minimize Chat" aria-label="Minimize">
              <i class="fas fa-minus"></i>
            </button>
            <button class="mk-chat-btn-icon" id="mkChatCloseBtn" title="Close Chat" aria-label="Close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Customer session bar -->
        <div class="mk-customer-active-badge" id="mkCustomerActiveBadge">
          <span><i class="fas fa-user-circle" style="color:#059669;"></i> <strong id="mkCustomerNameBadge">Wholesale Buyer</strong></span>
          <a href="javascript:void(0)" id="mkChatSwitchUserBtn" style="color:#047857; text-decoration:underline; font-weight:700; font-size:0.75rem;">Edit Info</a>
        </div>

        <!-- Inline Profile Editor Card (Hidden by default) -->
        <div class="mk-chat-onboarding-modal" id="mkOnboardingModal" style="display:none; padding:12px; background:#f0fdf4; border-bottom:1px solid #bbf7d0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <strong style="font-size:0.85rem; color:#065f46;"><i class="fas fa-id-card"></i> Your Wholesale Profile</strong>
            <button type="button" id="mkCloseOnboardingBtn" style="background:none; border:none; color:#64748b; font-size:1.1rem; cursor:pointer;">&times;</button>
          </div>
          <form id="mkOnboardingForm">
            <input type="text" id="mkInputCustName" class="mk-chat-input-field" placeholder="Your Name / Business Name *" style="margin-bottom:6px; font-size:0.82rem; padding:7px 10px;" required>
            <input type="tel" id="mkInputCustPhone" class="mk-chat-input-field" placeholder="WhatsApp / Phone (10 digits) *" style="margin-bottom:6px; font-size:0.82rem; padding:7px 10px;" required>
            <input type="text" id="mkInputCustCity" class="mk-chat-input-field" placeholder="City / State (e.g. Chennai, Madurai)" style="margin-bottom:8px; font-size:0.82rem; padding:7px 10px;">
            <button type="submit" class="mk-chat-btn-submit" style="padding:8px; font-size:0.82rem;">
              <i class="fas fa-check-circle"></i> Save Profile Details
            </button>
          </form>
        </div>

        <!-- Chat Body (Messages Stream) -->
        <div class="mk-chat-body" id="mkChatBody">
          <!-- Content dynamically rendered here -->
        </div>

        <!-- WhatsApp Quick Jump Strip -->
        <div class="mk-chat-wa-strip">
          <span>Need direct catalog on WhatsApp?</span>
          <a href="https://wa.me/919843672274?text=Hello%20MK%20Spicepod%20Traders,%20I%20am%20chatting%20from%20your%20website%20regarding%20wholesale%20order." target="_blank" class="mk-chat-wa-link">
            <i class="fab fa-whatsapp"></i> Chat on WhatsApp
          </a>
        </div>

        <!-- Chat Footer (Message Input & Attachment) -->
        <div class="mk-chat-footer" id="mkChatFooter">
          <!-- Attachment Preview Box (shown when file is selected/pasted) -->
          <div class="mk-chat-attachment-preview" id="mkChatAttachPreview" style="display:none;">
            <div class="mk-preview-thumb-box">
              <img id="mkChatPreviewImg" src="" alt="Payment Proof">
              <div class="mk-preview-details">
                <span class="mk-preview-badge"><i class="fas fa-receipt"></i> Payment Proof / Receipt</span>
                <span class="mk-preview-filename" id="mkChatPreviewFilename">receipt.jpg</span>
              </div>
            </div>
            <button type="button" class="mk-chat-btn-remove-attach" id="mkChatRemoveAttachBtn" title="Remove attachment">&times;</button>
          </div>

          <div class="mk-chat-input-row">
            <input type="file" id="mkChatFileInput" accept="image/*,application/pdf" style="display:none;">
            <button type="button" class="mk-chat-btn-attach" id="mkChatAttachBtn" title="Upload Payment Proof / Receipt Screenshot">
              <i class="fas fa-paperclip"></i>
            </button>
            <input type="text" class="mk-chat-msg-input" id="mkChatInput" placeholder="Type message or attach payment receipt..." maxlength="500" autocomplete="off">
            <button class="mk-chat-btn-send" id="mkChatSendBtn" title="Send Message" aria-label="Send">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Fullscreen Lightbox Modal for Chat Image Previews -->
      <div class="mk-chat-lightbox-modal" id="mkChatLightboxModal" style="display:none;">
        <div class="mk-lightbox-backdrop" id="mkChatLightboxBackdrop"></div>
        <div class="mk-lightbox-content">
          <div class="mk-lightbox-header">
            <span id="mkLightboxTitle"><i class="fas fa-receipt"></i> Payment Proof / Receipt</span>
            <div class="mk-lightbox-actions">
              <a href="#" id="mkLightboxDownloadBtn" target="_blank" download="payment_proof.jpg" class="mk-lightbox-btn" title="Download"><i class="fas fa-download"></i></a>
              <button type="button" class="mk-lightbox-btn" id="mkLightboxCloseBtn" title="Close">&times;</button>
            </div>
          </div>
          <div class="mk-lightbox-body">
            <img id="mkLightboxImg" src="" alt="Proof Full View">
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  // Load Customer Profile
  function loadCustomerSession() {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOMER_KEY);
      if (saved) {
        currentCustomer = JSON.parse(saved);
      } else {
        // Auto initialize a seamless guest session
        const randId = `cust_${Date.now()}`;
        currentCustomer = {
          id: randId,
          name: 'Wholesale Buyer',
          phone: '',
          city: 'Tamil Nadu',
          is_guest: true,
          created_at: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(currentCustomer));
        
        // Notify backend of initial visitor
        fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentCustomer)
        }).catch(() => {});
      }
    } catch (e) {
      console.error('Error loading customer session:', e);
    }
  }

  // Save Customer Profile Permanently
  async function saveCustomerSession(customerData) {
    currentCustomer = Object.assign({}, currentCustomer, customerData);
    localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(currentCustomer));

    const nameBadge = document.getElementById('mkCustomerNameBadge');
    if (nameBadge) nameBadge.textContent = currentCustomer.name || 'Wholesale Buyer';

    // 1. Save to Supabase PostgreSQL Database (Zero-Data-Loss CRM)
    if (window.MKSupabase && window.MKSupabase.Customers) {
      try {
        const { data: supaCust } = await window.MKSupabase.Customers.upsert(currentCustomer);
        if (supaCust && supaCust.id) {
          currentCustomer.id = supaCust.id;
          localStorage.setItem(STORAGE_CUSTOMER_KEY, JSON.stringify(currentCustomer));
          setupSupabaseRealtimeChat(supaCust.id);
        }
      } catch (e) {
        console.warn('Supabase customer upsert error:', e);
      }
    }

    // 2. Also send to backend REST API
    fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentCustomer)
    }).catch(err => console.log('Stored in Supabase/LocalStorage:', err));
  }

  // Deduplicate messages helper
  function deduplicateMessages(msgList) {
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
        if (existing.message === msg.message && 
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

  function setupSupabaseRealtimeChat(customerId) {
    if (window.MKSupabase && window.MKSupabase.Chats && customerId) {
      try {
        window.MKSupabase.Chats.subscribe(customerId, (newMsg) => {
          if (newMsg && (newMsg.sender === 'admin' || newMsg.sender === 'agent')) {
            const formatted = {
              id: newMsg.id,
              customer_id: newMsg.customer_id,
              sender: 'agent',
              sender_name: newMsg.sender_name || 'MK Spicepod Support',
              message: newMsg.message,
              image_url: newMsg.image_url || '',
              timestamp: newMsg.created_at || new Date().toISOString(),
              quick_action: newMsg.quick_action || ''
            };
            const beforeCount = chatMessages.length;
            chatMessages = deduplicateMessages([...chatMessages, formatted]);
            if (chatMessages.length > beforeCount) {
              saveMessagesLocally();
              renderChatMessages();
              updateLauncherBadge();
            }
          }
        });
      } catch (e) {
        console.warn('Supabase realtime chat error:', e);
      }
    }
  }

  // Load Stored Messages
  function loadStoredMessages() {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        chatMessages = deduplicateMessages(parsed);
      } else {
        // Initial default welcome messages
        chatMessages = [
          {
            id: 'init_1',
            sender: 'bot',
            sender_name: 'MK Support Desk',
            message: (autoConfig && autoConfig.welcomeMsg1) ? autoConfig.welcomeMsg1 : DEFAULT_AUTO_CONFIG.welcomeMsg1,
            timestamp: new Date().toISOString(),
            quick_action: ''
          },
          {
            id: 'init_2',
            sender: 'bot',
            sender_name: 'MK Support Desk',
            message: (autoConfig && autoConfig.welcomeMsg2) ? autoConfig.welcomeMsg2 : DEFAULT_AUTO_CONFIG.welcomeMsg2,
            timestamp: new Date().toISOString(),
            quick_action: 'chips'
          }
        ];
      }
      saveMessagesLocally();
    } catch (e) {
      console.error('Error loading stored messages:', e);
    }
  }

  // Save messages to LocalStorage
  function saveMessagesLocally() {
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(chatMessages));
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  }

  // Start Realtime Polling
  function startLivePolling() {
    if (pollingInterval) clearInterval(pollingInterval);
    syncWithBackend();
    pollingInterval = setInterval(syncWithBackend, 3000);
  }

  // Stop Polling
  function stopLivePolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }

  // Selected file processing helper
  function handleSelectedFile(file) {
    if (!file) return;
    compressAndReadImage(file, (dataUrl, fileName) => {
      selectedAttachment = {
        dataUrl: dataUrl,
        name: fileName || file.name || 'payment_receipt.jpg',
        type: file.type || 'image/jpeg'
      };
      const preview = document.getElementById('mkChatAttachPreview');
      const previewImg = document.getElementById('mkChatPreviewImg');
      const previewFilename = document.getElementById('mkChatPreviewFilename');
      const input = document.getElementById('mkChatInput');

      if (preview && previewImg && previewFilename) {
        previewImg.src = dataUrl;
        previewFilename.textContent = selectedAttachment.name;
        preview.style.display = 'flex';
      }
      if (input) {
        if (!input.value.trim()) {
          input.value = '🧾 Attached payment remittance proof for wholesale order.';
        }
        input.focus();
      }
    });
  }

  function clearSelectedAttachment() {
    selectedAttachment = null;
    const preview = document.getElementById('mkChatAttachPreview');
    const fileInput = document.getElementById('mkChatFileInput');
    if (preview) preview.style.display = 'none';
    if (fileInput) fileInput.value = '';
  }

  window.openChatImageLightbox = function(url, title = 'Payment Proof / Receipt') {
    const modal = document.getElementById('mkChatLightboxModal');
    const img = document.getElementById('mkLightboxImg');
    const dlBtn = document.getElementById('mkLightboxDownloadBtn');
    const titleEl = document.getElementById('mkLightboxTitle');
    if (modal && img) {
      img.src = url;
      if (dlBtn) dlBtn.href = url;
      if (titleEl) titleEl.innerHTML = `<i class="fas fa-receipt"></i> ${escapeHtml(title)}`;
      modal.style.display = 'flex';
    }
  };

  window.closeChatImageLightbox = function() {
    const modal = document.getElementById('mkChatLightboxModal');
    if (modal) modal.style.display = 'none';
  };

  // Setup Event Listeners
  function setupChatEventListeners() {
    const launcher = document.getElementById('mkChatLauncher');
    const windowEl = document.getElementById('mkChatWindow');
    const closeBtn = document.getElementById('mkChatCloseBtn');
    const minimizeBtn = document.getElementById('mkChatMinimizeBtn');
    const sendBtn = document.getElementById('mkChatSendBtn');
    const inputField = document.getElementById('mkChatInput');
    const switchUserBtn = document.getElementById('mkChatSwitchUserBtn');
    const teaserBubble = document.getElementById('mkChatTeaserBubble');
    const teaserClose = document.getElementById('mkChatTeaserClose');
    const onboardingModal = document.getElementById('mkOnboardingModal');
    const closeOnboardingBtn = document.getElementById('mkCloseOnboardingBtn');
    const onboardingForm = document.getElementById('mkOnboardingForm');
    const attachBtn = document.getElementById('mkChatAttachBtn');
    const fileInput = document.getElementById('mkChatFileInput');
    const removeAttachBtn = document.getElementById('mkChatRemoveAttachBtn');
    const lightboxCloseBtn = document.getElementById('mkLightboxCloseBtn');
    const lightboxBackdrop = document.getElementById('mkChatLightboxBackdrop');

    function adjustMobileViewport() {
      if (window.innerWidth <= 768 && window.visualViewport) {
        if (windowEl && windowEl.classList.contains('active')) {
          windowEl.style.height = `${window.visualViewport.height}px`;
          windowEl.style.top = `${window.visualViewport.offsetTop}px`;
          scrollToBottom();
        }
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', adjustMobileViewport);
      window.visualViewport.addEventListener('scroll', adjustMobileViewport);
    }

    function openChat() {
      windowEl.classList.add('active');
      launcher.classList.add('open');
      if (window.innerWidth <= 768) {
        document.body.classList.add('mk-chat-active-mobile');
        adjustMobileViewport();
      }
      if (teaserBubble) teaserBubble.style.display = 'none';
      renderChatMessages();
      scrollToBottom();
      markMessagesAsRead();
      syncWithBackend();
      if (inputField) {
        setTimeout(() => {
          scrollToBottom();
          if (window.innerWidth > 768) inputField.focus();
        }, 150);
      }
    }

    function closeChat() {
      windowEl.classList.remove('active');
      launcher.classList.remove('open');
      document.body.classList.remove('mk-chat-active-mobile');
      if (windowEl) {
        windowEl.style.height = '';
        windowEl.style.top = '';
      }
      updateLauncherBadge();
    }

    if (inputField) {
      inputField.addEventListener('focus', () => {
        setTimeout(() => {
          adjustMobileViewport();
          scrollToBottom();
        }, 300);
      });
    }

    // Toggle Chat Window
    launcher.addEventListener('click', () => {
      if (windowEl.classList.contains('active')) {
        closeChat();
      } else {
        openChat();
      }
    });

    if (teaserBubble) {
      teaserBubble.addEventListener('click', (e) => {
        if (e.target !== teaserClose) {
          openChat();
        }
      });
    }

    if (teaserClose) {
      teaserClose.addEventListener('click', (e) => {
        e.stopPropagation();
        teaserBubble.style.display = 'none';
      });
    }

    closeBtn.addEventListener('click', closeChat);
    minimizeBtn.addEventListener('click', closeChat);

    // Send on button click
    sendBtn.addEventListener('click', () => {
      sendMessage();
    });

    // Send on Enter key
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Attachment button trigger
    if (attachBtn && fileInput) {
      attachBtn.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          handleSelectedFile(file);
        }
      });
    }

    if (removeAttachBtn) {
      removeAttachBtn.addEventListener('click', () => {
        clearSelectedAttachment();
      });
    }

    // Clipboard Paste support (Ctrl+V screenshot upload)
    if (inputField) {
      inputField.addEventListener('paste', (e) => {
        const items = (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData))?.items;
        if (items) {
          for (let index in items) {
            const item = items[index];
            if (item.kind === 'file') {
              const blob = item.getAsFile();
              handleSelectedFile(blob);
              break;
            }
          }
        }
      });
    }

    // Drag and drop onto chat window
    if (windowEl) {
      windowEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        windowEl.style.boxShadow = '0 0 0 3px #10b981';
      });
      windowEl.addEventListener('dragleave', (e) => {
        e.preventDefault();
        windowEl.style.boxShadow = '';
      });
      windowEl.addEventListener('drop', (e) => {
        e.preventDefault();
        windowEl.style.boxShadow = '';
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleSelectedFile(e.dataTransfer.files[0]);
        }
      });
    }

    // Lightbox modal close listeners
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', window.closeChatImageLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', window.closeChatImageLightbox);

    // Expose global open/close helpers
    window.openLiveChat = function(prefilledMsg) {
      openChat();
      if (prefilledMsg && typeof prefilledMsg === 'string') {
        const inp = document.getElementById('mkChatInput');
        if (inp) {
          inp.value = prefilledMsg;
          inp.focus();
        }
      }
    };
    window.closeLiveChat = closeChat;

    // Switch/Edit customer info
    if (switchUserBtn) {
      switchUserBtn.addEventListener('click', () => {
        if (onboardingModal) {
          const nameInput = document.getElementById('mkInputCustName');
          const phoneInput = document.getElementById('mkInputCustPhone');
          const cityInput = document.getElementById('mkInputCustCity');
          if (nameInput) nameInput.value = currentCustomer && !currentCustomer.is_guest ? currentCustomer.name : '';
          if (phoneInput) phoneInput.value = currentCustomer ? currentCustomer.phone : '';
          if (cityInput) cityInput.value = currentCustomer ? currentCustomer.city : '';
          onboardingModal.style.display = 'block';
        }
      });
    }

    if (closeOnboardingBtn && onboardingModal) {
      closeOnboardingBtn.addEventListener('click', () => {
        onboardingModal.style.display = 'none';
      });
    }

    if (onboardingForm) {
      onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('mkInputCustName').value.trim();
        const phone = document.getElementById('mkInputCustPhone').value.trim();
        const city = document.getElementById('mkInputCustCity').value.trim();

        if (!name || !phone) {
          alert('Please enter your Name and WhatsApp/Phone Number.');
          return;
        }

        const custId = currentCustomer && currentCustomer.id ? currentCustomer.id : `cust_${Date.now()}`;
        const customerData = {
          id: custId,
          name: name,
          phone: phone,
          city: city || 'Tamil Nadu',
          business_name: name,
          is_guest: false,
          created_at: currentCustomer && currentCustomer.created_at ? currentCustomer.created_at : new Date().toISOString()
        };

        saveCustomerSession(customerData);
        if (onboardingModal) onboardingModal.style.display = 'none';

        pushBotMessage(`Profile updated for **${name}** (+91 ${phone}). Our wholesale manager will assist you directly!`, 'chips');
      });
    }
  }

  // Render Messages in Chat Body
  function renderChatMessages() {
    const body = document.getElementById('mkChatBody');
    const nameBadge = document.getElementById('mkCustomerNameBadge');

    if (!body) return;

    if (currentCustomer && nameBadge) {
      nameBadge.textContent = currentCustomer.name || 'Wholesale Buyer';
    }

    body.innerHTML = '';

    // Render message stream
    chatMessages.forEach(msg => {
      const row = document.createElement('div');
      row.className = `mk-chat-message-row ${msg.sender}`;

      const timeFormatted = formatTime(msg.timestamp);
      let contentHtml = escapeHtml(msg.message)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');

      let imageHtml = '';
      if (msg.image_url && msg.image_url.trim().length > 5) {
        imageHtml = `
          <div class="mk-chat-image-bubble">
            <div class="mk-chat-image-tag"><i class="fas fa-receipt"></i> Payment Proof / Receipt</div>
            <div class="mk-chat-image-container" onclick="window.openChatImageLightbox('${escapeHtml(msg.image_url)}')">
              <img src="${escapeHtml(msg.image_url)}" alt="Payment Proof" loading="lazy" onerror="this.src='images/products/turmeric-powder.jpg'">
              <div class="mk-chat-image-overlay"><i class="fas fa-search-plus"></i> View Full Screen</div>
            </div>
          </div>
        `;
      }

      row.innerHTML = `
        <div class="mk-chat-bubble">
          ${imageHtml}
          <div>${contentHtml}</div>
          ${renderQuickChips(msg.quick_action)}
        </div>
        <div class="mk-chat-meta">
          <span>${msg.sender === 'customer' ? 'You' : (msg.sender_name || 'MK Support Desk')}</span> • <span>${timeFormatted}</span>
          ${msg.sender === 'customer' ? '<i class="fas fa-check-double" style="color:#059669; font-size:0.65rem;"></i>' : ''}
        </div>
      `;

      body.appendChild(row);
    });

    // Attach click listeners to chips
    body.querySelectorAll('.mk-chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const action = chip.getAttribute('data-action');
        handleQuickChipClick(action);
      });
    });

    scrollToBottom();
  }

  function getCustomerLatestOrder() {
    try {
      const lastStr = localStorage.getItem('mk_last_order') || sessionStorage.getItem('mk_active_order');
      if (lastStr) return JSON.parse(lastStr);
    } catch (e) {}

    try {
      const allOrders = JSON.parse(localStorage.getItem('mk_admin_orders') || '[]');
      if (currentCustomer && currentCustomer.phone) {
        const found = allOrders.find(o => 
          (currentCustomer.phone && (o.customer_phone === currentCustomer.phone || (o.customer && o.customer.includes(currentCustomer.phone))))
        );
        if (found) return found;
      }
      if (allOrders.length > 0) return allOrders[0];
    } catch (e) {}
    return null;
  }

  // Render Quick Action Chips
  function renderQuickChips(actionType) {
    if (actionType !== 'chips') return '';

    return `
      <div class="mk-chat-chips-container" style="margin-top:8px;">
        <button type="button" class="mk-chat-chip" data-action="track_order" style="background:#f0fdf4; border-color:#86efac; color:#15803d; font-weight:800;"><i class="fas fa-truck-ramp-box"></i> 📦 Track My Order Status</button>
        <button type="button" class="mk-chat-chip" data-action="rates"><i class="fas fa-file-invoice-dollar"></i> Today's Rate Card</button>
        <button type="button" class="mk-chat-chip" data-action="spices"><i class="fas fa-pepper-hot"></i> Bulk Spices Quote</button>
        <button type="button" class="mk-chat-chip" data-action="nuts"><i class="fas fa-bowl-rice"></i> Dry Fruits &amp; Nuts Rates</button>
        <button type="button" class="mk-chat-chip" data-action="order"><i class="fas fa-truck-fast"></i> Minimum Order &amp; Delivery</button>
        <button type="button" class="mk-chat-chip" data-action="upload_proof"><i class="fas fa-receipt"></i> 🧾 Upload Payment Proof</button>
        <button type="button" class="mk-chat-chip" data-action="manager"><i class="fas fa-headset"></i> Speak with Manager</button>
      </div>
    `;
  }

  // Handle Quick Chip Clicks
  function handleQuickChipClick(action) {
    let customerMsg = '';
    let botReply = '';

    switch (action) {
      case 'track_order':
        customerMsg = "Please check my wholesale order and payment verification status.";
        const lastOrd = getCustomerLatestOrder();
        if (lastOrd) {
          const isApproved = lastOrd.payment_status === 'Payment Received' || lastOrd.payment_status === 'Approved' || lastOrd.order_status === 'Confirmed';
          const pStatus = isApproved ? '✅ Payment Received (Bank Verified & Approved)' : (lastOrd.payment_status === 'Rejected' ? '❌ Payment Rejected / Invalid' : '⏳ Pending Verification');
          const dStatus = lastOrd.order_status || lastOrd.status || 'Processing';
          const ordId = lastOrd.order_number || lastOrd.id || 'ORDER';
          const pName = lastOrd.product || lastOrd.product_name || 'Wholesale Goods';
          const pQty = lastOrd.quantity || (lastOrd.quantity_kg ? `${lastOrd.quantity_kg} kg` : '50 kg');
          const pAmt = lastOrd.amount || (lastOrd.total_amount ? `₹${Number(lastOrd.total_amount).toLocaleString('en-IN')}` : '₹12,000');

          botReply = `📦 **Wholesale Order Status (#${ordId})**:\n• Product: ${pName}\n• Quantity: ${pQty}\n• Remittance Amount: ${pAmt}\n• Payment Status: **${pStatus}**\n• Dispatch Status: **${dStatus}**\n\n${isApproved ? '🚚 **Payment Remittance Confirmed!** Your consignment is scheduled for packing & dispatch.' : '🕒 *Our accounts desk is currently reconciling your UTR with our Indian Bank statement. Once approved, your status will update automatically right here!*'}`;
        } else {
          botReply = "No active order found for this browser session. If you recently placed an order, please type your Order Number (e.g. *MK-ORD-...*) below and we will check it for you.";
        }
        break;

      case 'rates':
        customerMsg = "Please share today's wholesale rate card.";
        botReply = (autoConfig && autoConfig.ratecardReply) ? autoConfig.ratecardReply : DEFAULT_AUTO_CONFIG.ratecardReply;
        break;

      case 'spices':
        customerMsg = "I need bulk wholesale quote for Spices (Turmeric, Chilli, Pepper, Coriander).";
        botReply = (autoConfig && autoConfig.spicesReply) ? autoConfig.spicesReply : DEFAULT_AUTO_CONFIG.spicesReply;
        break;

      case 'nuts':
        customerMsg = "I want bulk prices for Premium Dry Fruits & Nuts.";
        botReply = (autoConfig && autoConfig.nutsReply) ? autoConfig.nutsReply : DEFAULT_AUTO_CONFIG.nutsReply;
        break;

      case 'order':
        customerMsg = "What is the minimum order quantity (MOQ) and delivery timeline?";
        botReply = (autoConfig && autoConfig.deliveryReply) ? autoConfig.deliveryReply : DEFAULT_AUTO_CONFIG.deliveryReply;
        break;

      case 'upload_proof':
        pushBotMessage("📸 Please attach and upload your Payment Transfer Screenshot / Bank UTR Receipt using the 📎 button below:");
        setTimeout(() => {
          const fileInp = document.getElementById('mkChatFileInput');
          if (fileInp) {
            fileInp.value = '';
            fileInp.click();
          }
        }, 300);
        return;

      case 'manager':
        customerMsg = "I would like to speak directly with the Wholesale Support Manager.";
        botReply = "Connecting you with our Wholesale Support Manager right now. 👨‍💼\n\nPlease share your specific requirement, quantity (kg), and delivery city below — our manager is available and will respond to your chat in real-time.";
        break;

      case 'whatsapp':
        window.open(`https://wa.me/919843672274?text=Hello%20MK%20Spicepod%20Traders,%20I%20am%20chatting%20from%20your%20website%20regarding%20wholesale%20rates.`, '_blank');
        return;
    }

    if (customerMsg) {
      pushCustomerMessage(customerMsg);
      setTimeout(() => {
        pushBotMessage(botReply, 'chips');
      }, 500);
    }
  }

  // Send User Message
  async function sendMessage() {
    const input = document.getElementById('mkChatInput');
    if (!input) return;

    const text = input.value.trim();
    const hasAttachment = selectedAttachment && selectedAttachment.dataUrl;

    if (!text && !hasAttachment) return;

    input.value = '';

    if (hasAttachment) {
      const attachData = selectedAttachment.dataUrl;
      const attachName = selectedAttachment.name;
      clearSelectedAttachment();

      let uploadedUrl = '';

      // 1. Upload to Supabase Storage if available
      if (window.MKSupabase && window.MKSupabase.Storage) {
        try {
          const { data: uploadRes } = await window.MKSupabase.Storage.uploadDataUrl(attachData, 'receipts');
          if (uploadRes && uploadRes.publicUrl) {
            uploadedUrl = uploadRes.publicUrl;
          }
        } catch (e) {}
      }

      // 2. Upload to REST Backend /api/upload
      if (!uploadedUrl) {
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
            uploadedUrl = data.file_url;
          }
        } catch (err) {
          console.warn('REST upload notice:', err);
        }
      }

      // Fallback to compressed base64 dataUrl
      if (!uploadedUrl) {
        uploadedUrl = attachData;
      }

      const msgText = text || '🧾 Payment Proof Screenshot Attached';
      pushCustomerMessage(msgText, uploadedUrl);

      setTimeout(() => {
        pushBotMessage(`✅ **Payment Proof Received!** Thank you for sharing your payment receipt. Our accounts team will verify the remittance with our Indian Bank account records and confirm your wholesale dispatch shortly. 📦`, 'chips');
      }, 600);
      return;
    }

    pushCustomerMessage(text);

    // Auto smart response from assistant (if enabled)
    if (autoConfig.enableSmartBot !== false) {
      setTimeout(() => {
        generateSmartBotReply(text);
      }, 800);
    }
  }

  // Push Customer Message
  async function pushCustomerMessage(text, imageUrl = '') {
    if (!currentCustomer) loadCustomerSession();

    const msg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      customer_id: currentCustomer ? currentCustomer.id : 'guest',
      sender: 'customer',
      sender_name: currentCustomer ? (currentCustomer.name || 'Customer') : 'Customer',
      message: text,
      image_url: imageUrl,
      timestamp: new Date().toISOString(),
      quick_action: ''
    };

    chatMessages = deduplicateMessages([...chatMessages, msg]);
    saveMessagesLocally();
    renderChatMessages();

    // Broadcast to other tabs & admin
    broadcastMessage(msg);

    // 1. Send to Supabase PostgreSQL Database
    if (window.MKSupabase && window.MKSupabase.Chats && currentCustomer && currentCustomer.id) {
      try {
        const { data: sentMsg } = await window.MKSupabase.Chats.send({
          customer_id: currentCustomer.id,
          sender: 'customer',
          sender_name: currentCustomer.name || 'Customer',
          message: text,
          image_url: imageUrl
        });
        if (sentMsg && sentMsg.id) {
          msg.id = sentMsg.id;
          saveMessagesLocally();
        }
      } catch (err) {
        console.warn('Supabase chat send error:', err);
      }
    }

    // 2. Send to backend REST API fallback
    fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: msg.id,
        customer_id: currentCustomer ? currentCustomer.id : 'guest',
        sender: 'customer',
        sender_name: currentCustomer ? (currentCustomer.name || 'Customer') : 'Customer',
        message: text,
        image_url: imageUrl
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data && data.status === 'success' && data.chat_id) {
        msg.id = data.chat_id;
        if (data.timestamp) msg.timestamp = data.timestamp;
        saveMessagesLocally();
      }
    })
    .catch(err => console.log('Saved to Supabase/LocalStorage:', err));
  }

  // Push Bot Message
  async function pushBotMessage(text, quickAction = '') {
    if (!currentCustomer) loadCustomerSession();

    const msg = {
      id: `msg_bot_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      customer_id: currentCustomer ? currentCustomer.id : 'guest',
      sender: 'agent',
      sender_name: 'MK Support Desk',
      message: text,
      timestamp: new Date().toISOString(),
      quick_action: quickAction
    };

    chatMessages = deduplicateMessages([...chatMessages, msg]);
    saveMessagesLocally();
    renderChatMessages();
    broadcastMessage(msg);

    // Also persist bot reply in Supabase if registered
    if (window.MKSupabase && window.MKSupabase.Chats && currentCustomer && currentCustomer.id && currentCustomer.id.length > 10) {
      try {
        const { data: sentMsg } = await window.MKSupabase.Chats.send({
          customer_id: currentCustomer.id,
          sender: 'admin',
          sender_name: 'MK Support Desk',
          message: text,
          quick_action: quickAction
        });
        if (sentMsg && sentMsg.id) {
          msg.id = sentMsg.id;
          saveMessagesLocally();
        }
      } catch (e) {}
    }

    // Fallback REST API
    fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: msg.id,
        customer_id: currentCustomer ? currentCustomer.id : 'guest',
        sender: 'bot',
        sender_name: 'MK Support Desk',
        message: text,
        quick_action: quickAction
      })
    })
    .then(r => r.json())
    .then(data => {
      if (data && data.status === 'success' && data.chat_id) {
        msg.id = data.chat_id;
        if (data.timestamp) msg.timestamp = data.timestamp;
        saveMessagesLocally();
      }
    })
    .catch(() => {});
  }

  // Intelligent Wholesale Response Generator
  function generateSmartBotReply(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('status') || lower.includes('track') || lower.includes('my order') || lower.includes('approval') || lower.includes('approved') || lower.includes('pending') || lower.includes('delivery status')) {
      const lastOrd = getCustomerLatestOrder();
      if (lastOrd) {
        const isApproved = lastOrd.payment_status === 'Payment Received' || lastOrd.payment_status === 'Approved' || lastOrd.order_status === 'Confirmed';
        const pStatus = isApproved ? '✅ Payment Received (Bank Verified & Approved)' : (lastOrd.payment_status === 'Rejected' ? '❌ Remittance Rejected' : '⏳ Pending Bank Verification');
        const dStatus = lastOrd.order_status || lastOrd.status || 'Processing';
        const ordId = lastOrd.order_number || lastOrd.id || 'ORDER';
        const pName = lastOrd.product || lastOrd.product_name || 'Wholesale Commodity';
        const pQty = lastOrd.quantity || (lastOrd.quantity_kg ? `${lastOrd.quantity_kg} kg` : '50 kg');
        const pAmt = lastOrd.amount || (lastOrd.total_amount ? `₹${Number(lastOrd.total_amount).toLocaleString('en-IN')}` : '₹12,000');

        pushBotMessage(`📦 **Wholesale Order Status (#${ordId})**:\n• Product: ${pName}\n• Quantity: ${pQty}\n• Remittance Amount: ${pAmt}\n• Payment Status: **${pStatus}**\n• Dispatch Status: **${dStatus}**\n\n${isApproved ? '🚚 **Payment Remittance Confirmed!** Consignment is being packed for transport dispatch.' : '🕒 *Our accounts team is reconciling your payment with our Indian Bank account records. You will receive an alert here as soon as it is approved!*' }`, 'chips');
      } else {
        pushBotMessage(`Please provide your Order Reference Number (e.g. *MK-ORD-...*) and our team will check the status for you immediately.`, 'chips');
      }
    } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('vilai') || lower.includes('evlo')) {
      pushBotMessage(`Thank you for your enquiry! Our wholesale desk has noted your request. You can also directly call or WhatsApp our dispatch manager at **9843672274** for immediate dispatch confirmation.`, 'chips');
    } else if (lower.includes('payment') || lower.includes('proof') || lower.includes('utr') || lower.includes('receipt') || lower.includes('paid') || lower.includes('panam') || lower.includes('screenshot')) {
      pushBotMessage(`📸 You can upload your **Payment Screenshot / Bank UTR Receipt** using the 📎 paperclip button or select the chip below:`, 'chips');
    } else if (lower.includes('turmeric') || lower.includes('manjal')) {
      pushBotMessage(`Our Salem Grade A Turmeric Powder is naturally steam-sterilized with high Curcumin content (>3.5%). Bulk wholesale rate is **₹240/kg**. Ready for immediate dispatch.`, 'chips');
    } else if (lower.includes('almond') || lower.includes('badam')) {
      pushBotMessage(`We supply California Extra Bold Almonds at **₹720/kg** for 100kg+ consignments. Vacuum packed in 10kg/20kg boxes.`, 'chips');
    } else if (lower.includes('cashew') || lower.includes('mundhiri')) {
      pushBotMessage(`Premium W240 King Cashews wholesale rate is **₹820/kg**. 100% sortex clean and crispy.`, 'chips');
    } else if (lower.includes('cardamom') || lower.includes('elakkai') || lower.includes('elaichi')) {
      pushBotMessage(`8mm Bold Green Cardamom from Idukki plantations is available at **₹2,600/kg**. Export quality grade.`, 'chips');
    } else if (lower.includes('sample') || lower.includes('test')) {
      pushBotMessage(`Yes! We provide 5kg to 10kg sample consignments for quality verification before commercial wholesale dispatch.`, 'chips');
    } else if (lower.includes('manager') || lower.includes('support') || lower.includes('call') || lower.includes('talk')) {
      pushBotMessage(`Our Wholesale Support Manager is ready to assist you. 👨‍💼 Please type your delivery location and required items — we will reply right here in real-time.`, 'chips');
    } else {
      pushBotMessage(`Thank you for reaching out! Our wholesale desk has received your message: *" ${userText} "*. A team manager will respond to you right here shortly. For immediate assistance, call **9843672274**.`, 'chips');
    }
  }

  // Multi-tab sync helper
  function broadcastMessage(msg) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'NEW_MESSAGE',
          customer: currentCustomer,
          message: msg
        });
      } catch (e) {
        console.warn('Broadcast error:', e);
      }
    }
  }

  function handleIncomingBroadcast(data) {
    if (!data) return;

    if (data.type === 'ORDER_STATUS_UPDATED' || data.type === 'PAYMENT_APPROVED' || data.type === 'REFRESH_MESSAGES') {
      syncWithBackend();
      return;
    }

    if (!data.message) return;
    const msg = data.message;
    if (!currentCustomer) loadCustomerSession();

    if (msg.customer_id === currentCustomer.id) {
      const formatted = {
        id: msg.id,
        customer_id: msg.customer_id,
        sender: msg.sender === 'admin' ? 'agent' : msg.sender,
        sender_name: msg.sender_name || (msg.sender === 'admin' ? 'MK Spicepod Support' : 'Customer'),
        message: msg.message,
        image_url: msg.image_url || '',
        timestamp: msg.timestamp || new Date().toISOString(),
        quick_action: msg.quick_action || ''
      };
      const prevJson = JSON.stringify(chatMessages);
      chatMessages = deduplicateMessages([...chatMessages, formatted]);
      if (JSON.stringify(chatMessages) !== prevJson) {
        saveMessagesLocally();
        renderChatMessages();
        updateLauncherBadge();
      }
    }
  }

  // Periodic Backend Sync
  function syncWithBackend() {
    if (!currentCustomer || !currentCustomer.id) return;

    // 1. Check Supabase
    if (window.MKSupabase && window.MKSupabase.Chats) {
      try {
        window.MKSupabase.Chats.getForCustomer(currentCustomer.id).then(({ data }) => {
          if (Array.isArray(data) && data.length > 0) {
            const formattedList = data.map(remoteMsg => ({
              id: remoteMsg.id,
              customer_id: remoteMsg.customer_id,
              sender: remoteMsg.sender === 'admin' ? 'agent' : remoteMsg.sender,
              sender_name: remoteMsg.sender_name || (remoteMsg.sender === 'admin' ? 'MK Support Desk' : 'Customer'),
              message: remoteMsg.message,
              image_url: remoteMsg.image_url || '',
              timestamp: remoteMsg.created_at || new Date().toISOString(),
              quick_action: remoteMsg.quick_action || ''
            }));
            const prevJson = JSON.stringify(chatMessages);
            chatMessages = deduplicateMessages([...chatMessages, ...formattedList]);
            if (JSON.stringify(chatMessages) !== prevJson) {
              saveMessagesLocally();
              renderChatMessages();
              updateLauncherBadge();
            }
          }
        }).catch(() => {});
      } catch (e) {}
    }

    // 2. Fallback to REST API
    fetch(`/api/chats?customer_id=${encodeURIComponent(currentCustomer.id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.chats) && data.chats.length > 0) {
          const formattedList = data.chats.map(remoteMsg => ({
            id: remoteMsg.id,
            customer_id: remoteMsg.customer_id,
            sender: remoteMsg.sender === 'admin' ? 'agent' : remoteMsg.sender,
            sender_name: remoteMsg.sender_name || (remoteMsg.sender === 'admin' ? 'MK Support Desk' : 'Customer'),
            message: remoteMsg.message,
            image_url: remoteMsg.image_url || '',
            timestamp: remoteMsg.timestamp || new Date().toISOString(),
            quick_action: remoteMsg.quick_action || ''
          }));
          const prevJson = JSON.stringify(chatMessages);
          chatMessages = deduplicateMessages([...chatMessages, ...formattedList]);
          if (JSON.stringify(chatMessages) !== prevJson) {
            saveMessagesLocally();
            renderChatMessages();
            updateLauncherBadge();
          }
        }
      })
      .catch(() => {});
  }

  // Utility: Mark messages read
  function markMessagesAsRead() {
    const badge = document.getElementById('mkChatLauncherBadge');
    if (badge) {
      badge.style.display = 'none';
      badge.textContent = '0';
    }
  }

  function updateLauncherBadge() {
    const windowEl = document.getElementById('mkChatWindow');
    if (windowEl && windowEl.classList.contains('active')) return;

    const badge = document.getElementById('mkChatLauncherBadge');
    if (badge) {
      const agentMsgs = chatMessages.filter(m => m.sender === 'agent' || m.sender === 'admin');
      if (agentMsgs.length > 0) {
        badge.textContent = agentMsgs.length;
        badge.style.display = 'flex';
      }
    }
  }

  function scrollToBottom() {
    const body = document.getElementById('mkChatBody');
    if (body) {
      setTimeout(() => {
        body.scrollTop = body.scrollHeight;
      }, 50);
    }
  }

  function formatTime(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
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

})();
