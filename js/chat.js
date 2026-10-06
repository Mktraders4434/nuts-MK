/**
 * MK SPICEPOD TRADERS - Live Chat Widget Client Script
 * Zero-Data-Loss Architecture: IndexedDB + LocalStorage + REST API Disk Persistence + Realtime BroadcastChannel & Live Polling
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

    // 6. Sync with Backend Server if online
    syncWithBackend();

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

        <!-- Chat Footer (Message Input) -->
        <div class="mk-chat-footer" id="mkChatFooter">
          <input type="text" class="mk-chat-msg-input" id="mkChatInput" placeholder="Type your wholesale enquiry here..." maxlength="500" autocomplete="off">
          <button class="mk-chat-btn-send" id="mkChatSendBtn" title="Send Message" aria-label="Send">
            <i class="fas fa-paper-plane"></i>
          </button>
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

  function setupSupabaseRealtimeChat(customerId) {
    if (window.MKSupabase && window.MKSupabase.Chats && customerId) {
      try {
        window.MKSupabase.Chats.subscribe(customerId, (newMsg) => {
          if (newMsg && newMsg.sender === 'admin') {
            const exists = chatMessages.some(m => m.id === newMsg.id || (m.timestamp === newMsg.created_at && m.message === newMsg.message));
            if (!exists) {
              chatMessages.push({
                id: newMsg.id,
                customer_id: newMsg.customer_id,
                sender: 'agent',
                sender_name: newMsg.sender_name || 'MK Spicepod Support',
                message: newMsg.message,
                timestamp: newMsg.created_at || new Date().toISOString(),
                quick_action: newMsg.quick_action || ''
              });
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
        chatMessages = JSON.parse(saved);
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
        saveMessagesLocally();
      }
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

    function openChat() {
      windowEl.classList.add('active');
      launcher.classList.add('open');
      if (teaserBubble) teaserBubble.style.display = 'none';
      renderChatMessages();
      scrollToBottom();
      markMessagesAsRead();
      startLivePolling();
      if (inputField) setTimeout(() => inputField.focus(), 150);
    }

    function closeChat() {
      windowEl.classList.remove('active');
      launcher.classList.remove('open');
      stopLivePolling();
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

      row.innerHTML = `
        <div class="mk-chat-bubble">
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

  // Render Quick Action Chips
  function renderQuickChips(actionType) {
    if (actionType !== 'chips') return '';

    return `
      <div class="mk-chat-chips-container" style="margin-top:8px;">
        <button type="button" class="mk-chat-chip" data-action="rates"><i class="fas fa-file-invoice-dollar"></i> Today's Rate Card</button>
        <button type="button" class="mk-chat-chip" data-action="spices"><i class="fas fa-pepper-hot"></i> Bulk Spices Quote</button>
        <button type="button" class="mk-chat-chip" data-action="nuts"><i class="fas fa-bowl-rice"></i> Dry Fruits &amp; Nuts Rates</button>
        <button type="button" class="mk-chat-chip" data-action="order"><i class="fas fa-truck-fast"></i> Minimum Order &amp; Delivery</button>
        <button type="button" class="mk-chat-chip" data-action="manager"><i class="fas fa-headset"></i> Speak with Manager</button>
      </div>
    `;
  }

  // Handle Quick Chip Clicks
  function handleQuickChipClick(action) {
    let customerMsg = '';
    let botReply = '';

    switch (action) {
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
  function sendMessage() {
    const input = document.getElementById('mkChatInput');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    pushCustomerMessage(text);

    // Auto smart response from assistant (if enabled)
    if (autoConfig.enableSmartBot !== false) {
      setTimeout(() => {
        generateSmartBotReply(text);
      }, 800);
    }
  }

  // Push Customer Message
  async function pushCustomerMessage(text) {
    if (!currentCustomer) loadCustomerSession();

    const msg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      customer_id: currentCustomer ? currentCustomer.id : 'guest',
      sender: 'customer',
      sender_name: currentCustomer ? (currentCustomer.name || 'Customer') : 'Customer',
      message: text,
      timestamp: new Date().toISOString(),
      quick_action: ''
    };

    chatMessages.push(msg);
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
          message: text
        });
        if (sentMsg && sentMsg.id) {
          msg.id = sentMsg.id;
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
        customer_id: currentCustomer ? currentCustomer.id : 'guest',
        sender: 'customer',
        sender_name: currentCustomer ? (currentCustomer.name || 'Customer') : 'Customer',
        message: text
      })
    }).catch(err => console.log('Saved to Supabase/LocalStorage:', err));
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

    chatMessages.push(msg);
    saveMessagesLocally();
    renderChatMessages();
    broadcastMessage(msg);

    // Also persist bot reply in Supabase if registered
    if (window.MKSupabase && window.MKSupabase.Chats && currentCustomer && currentCustomer.id && currentCustomer.id.length > 10) {
      try {
        await window.MKSupabase.Chats.send({
          customer_id: currentCustomer.id,
          sender: 'admin',
          sender_name: 'MK Support Desk',
          message: text,
          quick_action: quickAction
        });
      } catch (e) {}
    }

    // Fallback REST API
    fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: currentCustomer ? currentCustomer.id : 'guest',
        sender: 'bot',
        sender_name: 'MK Support Desk',
        message: text,
        quick_action: quickAction
      })
    }).catch(() => {});
  }

  // Intelligent Wholesale Response Generator
  function generateSmartBotReply(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('vilai') || lower.includes('evlo')) {
      pushBotMessage(`Thank you for your enquiry! Our wholesale desk has noted your request. You can also directly call or WhatsApp our dispatch manager at **9843672274** for immediate dispatch confirmation.`, 'chips');
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

  // Multi-tab & Admin Broadcast
  function broadcastMessage(msg) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({
          type: 'NEW_MESSAGE',
          message: msg,
          customer: currentCustomer
        });
      } catch (e) {
        console.warn('Broadcast error:', e);
      }
    }
  }

  // Handle incoming broadcast from Admin or other tab
  function handleIncomingBroadcast(data) {
    if (data.message) {
      const exists = chatMessages.some(m => m.id === data.message.id || (m.timestamp === data.message.timestamp && m.message === data.message.message));
      if (!exists) {
        chatMessages.push(data.message);
        saveMessagesLocally();
        renderChatMessages();
        updateLauncherBadge();
      }
    }
  }

  // Sync with Backend Server & Supabase
  async function syncWithBackend() {
    if (!currentCustomer || !currentCustomer.id) return;

    // 1. Fetch from Supabase
    if (window.MKSupabase && window.MKSupabase.Chats && currentCustomer.id && currentCustomer.id.length > 10) {
      try {
        const { data: supaChats } = await window.MKSupabase.Chats.getByCustomerId(currentCustomer.id);
        if (Array.isArray(supaChats) && supaChats.length > 0) {
          let hasNew = false;
          supaChats.forEach(remoteMsg => {
            const exists = chatMessages.some(m => m.id === remoteMsg.id || (m.message === remoteMsg.message && m.timestamp === remoteMsg.created_at));
            if (!exists) {
              chatMessages.push({
                id: remoteMsg.id,
                customer_id: remoteMsg.customer_id,
                sender: remoteMsg.sender === 'admin' ? 'agent' : remoteMsg.sender,
                sender_name: remoteMsg.sender_name || (remoteMsg.sender === 'admin' ? 'MK Support Desk' : 'Customer'),
                message: remoteMsg.message,
                timestamp: remoteMsg.created_at || new Date().toISOString(),
                quick_action: remoteMsg.quick_action || ''
              });
              hasNew = true;
            }
          });
          if (hasNew) {
            saveMessagesLocally();
            renderChatMessages();
            updateLauncherBadge();
          }
          return;
        }
      } catch (e) {}
    }

    // 2. Fallback to REST API
    fetch(`/api/chats?customer_id=${encodeURIComponent(currentCustomer.id)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && Array.isArray(data.chats) && data.chats.length > 0) {
          let hasNew = false;
          data.chats.forEach(remoteMsg => {
            const exists = chatMessages.some(m => m.id === remoteMsg.id || (m.message === remoteMsg.message && m.timestamp === remoteMsg.timestamp));
            if (!exists) {
              chatMessages.push({
                id: remoteMsg.id,
                customer_id: remoteMsg.customer_id,
                sender: remoteMsg.sender === 'admin' ? 'agent' : remoteMsg.sender,
                sender_name: remoteMsg.sender_name || (remoteMsg.sender === 'admin' ? 'MK Support Desk' : 'Customer'),
                message: remoteMsg.message,
                timestamp: remoteMsg.timestamp || new Date().toISOString(),
                quick_action: remoteMsg.quick_action || ''
              });
              hasNew = true;
            }
          });
          if (hasNew) {
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
