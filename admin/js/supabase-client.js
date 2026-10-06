/**
 * MK SPICEPOD TRADERS - Centralized Supabase Client & Service Layer (Admin & Frontend Bundle)
 * Production-ready PostgreSQL Database, Supabase Storage, and Realtime Integration
 */

(function (window) {
  'use strict';

  const SUPABASE_CONFIG = {
    url: 'https://xwtdouteagytedaprktn.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3dGRvdXRlYWd5dGVkYXBya3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Mzg1NDIsImV4cCI6MjEwNjMxNDU0Mn0.rX69kpptcaT7bh7d7RCakxhX-zADelRm6o2h3gIpln0'
  };

  let client = null;

  function isValidUUID(str) {
    return typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  function getClient() {
    if (!client) {
      if (window.supabase && typeof window.supabase.createClient === 'function') {
        client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          },
          realtime: {
            params: {
              eventsPerSecond: 10
            }
          }
        });
      } else {
        console.warn('[MKSupabase] Supabase JS SDK not loaded yet. Retrying...');
      }
    }
    return client;
  }

  // Helper for safe execution
  async function safeQuery(fn, fallbackValue = null) {
    try {
      const db = getClient();
      if (!db) {
        return { data: fallbackValue, error: new Error('Database client not ready') };
      }
      return await fn(db);
    } catch (err) {
      console.warn('[MKSupabase] Query Notice:', err?.message || err);
      return { data: fallbackValue, error: err };
    }
  }

  const MKSupabase = {
    config: SUPABASE_CONFIG,
    getClient,
    isValidUUID,

    // =========================================================================
    // 1. PRODUCTS SERVICE
    // =========================================================================
    Products: {
      async getAll(filters = {}) {
        return safeQuery(async (db) => {
          let query = db.from('products').select('*').order('display_order', { ascending: true }).order('name', { ascending: true });

          if (filters.category && filters.category !== 'All') {
            query = query.eq('category', filters.category);
          }
          if (filters.status) {
            query = query.eq('status', filters.status);
          }
          if (filters.search) {
            query = query.or(`name.ilike.%${filters.search}%,grade.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
          }

          const { data, error } = await query;
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      },

      async getById(id) {
        if (!isValidUUID(id)) return { data: null, error: null };
        return safeQuery(async (db) => {
          const { data, error } = await db.from('products').select('*').eq('id', id).single();
          if (error) throw error;
          return { data, error: null };
        }, null);
      },

      async upsert(product) {
        return safeQuery(async (db) => {
          // Generate slug if missing
          if (!product.slug && product.name) {
            product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          }

          const payload = {
            name: product.name,
            slug: product.slug,
            category: product.category || 'Spices',
            grade: product.grade || 'Standard Grade',
            price: Number(product.price) || 0,
            price_formatted: product.price ? `₹${product.price}/kg` : '',
            stock_kg: Number(product.stock_kg || product.stock) || 0,
            moq_kg: Number(product.moq_kg) || 25,
            packaging: product.packaging || '25kg / 50kg Standard Packing',
            image_url: product.image_url || product.img || 'images/products/turmeric-powder.jpg',
            status: product.status || 'Active',
            is_featured: product.is_featured !== undefined ? product.is_featured : true,
            display_order: Number(product.display_order) || 0,
            updated_at: new Date().toISOString()
          };

          if (isValidUUID(product.category_id)) payload.category_id = product.category_id;
          if (isValidUUID(product.id)) payload.id = product.id;

          const { data, error } = await db.from('products').upsert(payload).select().single();
          if (error) throw error;
          return { data, error: null };
        });
      },

      async delete(id) {
        if (!isValidUUID(id)) return { success: true, error: null };
        return safeQuery(async (db) => {
          const { error } = await db.from('products').delete().eq('id', id);
          if (error) throw error;
          return { success: true, error: null };
        });
      }
    },

    // =========================================================================
    // 2. CATEGORIES SERVICE
    // =========================================================================
    Categories: {
      async getAll() {
        return safeQuery(async (db) => {
          const { data, error } = await db.from('categories').select('*').order('display_order', { ascending: true });
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      }
    },

    // =========================================================================
    // 3. CUSTOMERS CRM SERVICE (ZERO DATA LOSS)
    // =========================================================================
    Customers: {
      async getAll(searchTerm = '') {
        return safeQuery(async (db) => {
          let query = db.from('customers').select('*').order('last_active', { ascending: false });
          if (searchTerm) {
            query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,business_name.ilike.%${searchTerm}%`);
          }
          const { data, error } = await query;
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      },

      async getByPhone(phone) {
        return safeQuery(async (db) => {
          const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
          const { data, error } = await db.from('customers').select('*').ilike('phone', `%${cleanPhone}`).limit(1).maybeSingle();
          if (error) throw error;
          return { data, error: null };
        }, null);
      },

      async upsert(customer) {
        return safeQuery(async (db) => {
          const cleanPhone = String(customer.phone || '').trim();
          if (!cleanPhone) throw new Error('Customer phone is required.');

          // Check if exists
          let existing = null;
          if (isValidUUID(customer.id)) {
            const { data } = await db.from('customers').select('id').eq('id', customer.id).maybeSingle();
            existing = data;
          } else {
            const { data } = await db.from('customers').select('id').eq('phone', cleanPhone).maybeSingle();
            existing = data;
          }

          const payload = {
            name: customer.name || 'Wholesale Buyer',
            phone: cleanPhone,
            email: customer.email || '',
            city: customer.city || '',
            business_name: customer.business_name || '',
            gstin: customer.gstin || '',
            address: customer.address || '',
            notes: customer.notes || '',
            status: customer.status || 'Active',
            last_active: new Date().toISOString()
          };

          if (customer.total_orders !== undefined) payload.total_orders = Number(customer.total_orders);
          if (customer.total_spent !== undefined) payload.total_spent = Number(customer.total_spent);

          if (existing && existing.id) {
            payload.id = existing.id;
          }

          const { data, error } = await db.from('customers').upsert(payload, { onConflict: 'phone' }).select().single();
          if (error) throw error;
          return { data, error: null };
        });
      }
    },

    // =========================================================================
    // 4. ORDERS SERVICE (SUPABASE POSTGRESQL)
    // =========================================================================
    Orders: {
      async getAll() {
        return safeQuery(async (db) => {
          const { data, error } = await db
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      },

      async create(order, items = []) {
        return safeQuery(async (db) => {
          const orderNum = order.order_number || `MK-ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
          
          // Extract item details if items array or order_items is present
          const itemList = (Array.isArray(items) && items.length > 0) ? items : (Array.isArray(order.order_items) ? order.order_items : []);
          const firstItem = itemList.length > 0 ? itemList[0] : {};

          const pName = order.product_name || order.product || firstItem.product_name || 'Wholesale Goods';
          const pQty = Number(order.quantity_kg || order.qty || firstItem.quantity_kg || 50);
          const pUnitPrice = Number(order.unit_price || order.price || firstItem.unit_price || 240);
          const pTotal = Number(order.total_amount || order.amount || firstItem.total_price || (pQty * pUnitPrice));

          const payload = {
            order_number: orderNum,
            customer_name: order.customer_name || order.name || 'Customer',
            customer_phone: order.customer_phone || order.phone || '',
            customer_email: order.customer_email || order.email || '',
            shipping_address: order.shipping_address || order.delivery_address || order.address || '',
            city: order.city || order.customer_city || '',
            product_name: pName,
            quantity_kg: pQty,
            unit_price: pUnitPrice,
            subtotal: pTotal,
            discount: Number(order.discount) || 0,
            gst_amount: Number(order.gst_amount) || 0,
            freight: Number(order.freight) || 0,
            total_amount: pTotal,
            payment_mode: order.payment_mode || 'UPI (GPay / PhonePe / Paytm)',
            transaction_id: order.transaction_id || '',
            payment_proof_url: order.payment_proof_url || '',
            payment_status: order.payment_status || 'Pending Verification',
            status: order.order_status || order.status || 'Pending Verification',
            notes: order.notes || (order.delivery_address ? `Delivery: ${order.delivery_address}` : ''),
            order_date: order.order_date || new Date().toISOString().split('T')[0]
          };

          if (isValidUUID(order.customer_id)) payload.customer_id = order.customer_id;

          // 1. Insert order
          const { data: newOrder, error: orderErr } = await db.from('orders').insert(payload).select().single();
          if (orderErr) {
            console.error('[MKSupabase] Order insert error:', orderErr);
            throw orderErr;
          }

          // 2. Ensure customer record in Supabase
          if (payload.customer_phone) {
            try {
              await MKSupabase.Customers.upsert({
                name: payload.customer_name,
                phone: payload.customer_phone,
                email: payload.customer_email,
                city: payload.city,
                address: payload.shipping_address,
                notes: `Last wholesale order: ${orderNum} (${pName})`,
                status: 'Active'
              });
            } catch (cErr) {
              console.warn('[MKSupabase] Auto customer upsert warning:', cErr);
            }
          }

          // 3. Insert order item
          if (newOrder && newOrder.id) {
            try {
              const itemPayload = {
                order_id: newOrder.id,
                product_name: pName,
                grade: firstItem.grade || 'Grade A',
                quantity_kg: pQty,
                unit_price: pUnitPrice,
                gst_rate: Number(firstItem.gst_rate) || 5,
                total_price: pTotal
              };
              if (isValidUUID(firstItem.product_id)) itemPayload.product_id = firstItem.product_id;
              await db.from('order_items').insert([itemPayload]);
            } catch (itErr) {
              console.warn('[MKSupabase] Order item insert warning:', itErr);
            }
          }

          return { data: newOrder, error: null };
        });
      },

      async updateStatus(orderId, status, paymentStatus = null) {
        return safeQuery(async (db) => {
          const updateData = { status, updated_at: new Date().toISOString() };
          if (paymentStatus) {
            updateData.payment_status = paymentStatus;
          }
          let query = db.from('orders').update(updateData);
          if (isValidUUID(orderId)) {
            query = query.eq('id', orderId);
          } else {
            query = query.eq('order_number', orderId);
          }
          const { data, error } = await query.select().maybeSingle();
          if (error) throw error;
          return { data, error: null };
        });
      },

      async delete(orderId) {
        return safeQuery(async (db) => {
          let query = db.from('orders').delete();
          if (isValidUUID(orderId)) {
            query = query.eq('id', orderId);
          } else {
            query = query.eq('order_number', orderId);
          }
          const { error } = await query;
          if (error) throw error;
          return { success: true, error: null };
        });
      },

      subscribeToOrders(callback) {
        const db = getClient();
        if (!db) return null;
        return db
          .channel('public:orders_realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            if (typeof callback === 'function') callback(payload);
          })
          .subscribe();
      }
    },

    // =========================================================================
    // 5. INVOICES & QUOTATIONS SERVICE
    // =========================================================================
    Invoices: {
      async getAll(filters = {}) {
        return safeQuery(async (db) => {
          let query = db.from('invoices').select('*').order('created_at', { ascending: false });

          if (filters.doc_type && filters.doc_type !== 'All') {
            query = query.eq('doc_type', filters.doc_type.toLowerCase());
          }
          if (filters.status && filters.status !== 'All') {
            query = query.eq('status', filters.status);
          }

          const { data, error } = await query;
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      },

      async getById(id) {
        if (!isValidUUID(id)) return { data: null, error: null };
        return safeQuery(async (db) => {
          const { data, error } = await db.from('invoices').select('*').eq('id', id).single();
          if (error) throw error;
          return { data, error: null };
        }, null);
      },

      async upsert(invoice) {
        return safeQuery(async (db) => {
          const payload = {
            doc_type: invoice.doc_type || 'quotation',
            doc_number: invoice.doc_number,
            customer_name: invoice.customer_name,
            customer_phone: invoice.customer_phone,
            customer_email: invoice.customer_email || '',
            customer_gstin: invoice.customer_gstin || '',
            customer_city: invoice.customer_city || '',
            billing_address: invoice.billing_address || '',
            doc_date: invoice.doc_date || new Date().toISOString().split('T')[0],
            due_date: invoice.due_date || null,
            payment_terms: invoice.payment_terms || '100% Advance before Dispatch',
            delivery_terms: invoice.delivery_terms || 'SafeXpress / VRL Logistics Door Delivery',
            items: typeof invoice.items === 'string' ? JSON.parse(invoice.items) : (invoice.items || invoice.items_json || []),
            subtotal: Number(invoice.subtotal) || 0,
            discount: Number(invoice.discount) || 0,
            gst_amount: Number(invoice.gst_amount) || 0,
            freight: Number(invoice.freight) || 0,
            grand_total: Number(invoice.grand_total) || 0,
            notes: invoice.notes || '',
            bank_details: invoice.bank_details || '',
            status: invoice.status || 'Draft',
            updated_at: new Date().toISOString()
          };

          if (isValidUUID(invoice.customer_id)) {
            payload.customer_id = invoice.customer_id;
          }

          if (isValidUUID(invoice.id)) {
            payload.id = invoice.id;
          }

          const { data, error } = await db.from('invoices').upsert(payload, { onConflict: 'doc_number' }).select().single();
          if (error) throw error;
          return { data, error: null };
        });
      },

      async delete(id) {
        if (!isValidUUID(id)) return { success: true, error: null };
        return safeQuery(async (db) => {
          const { error } = await db.from('invoices').delete().eq('id', id);
          if (error) throw error;
          return { success: true, error: null };
        });
      }
    },

    // =========================================================================
    // 6. ENQUIRIES SERVICE
    // =========================================================================
    Enquiries: {
      async getAll() {
        return safeQuery(async (db) => {
          const { data, error } = await db.from('enquiries').select('*').order('created_at', { ascending: false });
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      },

      async create(enquiry) {
        return safeQuery(async (db) => {
          // 1. Ensure customer exists in CRM
          let customerId = null;
          if (enquiry.phone) {
            const { data: cust } = await MKSupabase.Customers.upsert({
              name: enquiry.name,
              phone: enquiry.phone,
              email: enquiry.email || '',
              city: enquiry.destination_city || enquiry.city || '',
              business_name: enquiry.business_name || '',
              notes: `Enquired for: ${enquiry.product || 'Wholesale Products'}`
            });
            if (cust && isValidUUID(cust.id)) customerId = cust.id;
          }

          const payload = {
            name: enquiry.name,
            phone: enquiry.phone,
            email: enquiry.email || '',
            business_name: enquiry.business_name || '',
            product: enquiry.product || 'Wholesale Spices / Nuts',
            quantity: enquiry.quantity || '',
            destination_city: enquiry.destination_city || enquiry.city || '',
            message: enquiry.message || '',
            status: 'New'
          };
          if (customerId) payload.customer_id = customerId;

          const { data, error } = await db.from('enquiries').insert(payload).select().single();
          if (error) throw error;

          // Also insert initial chat message for seamless live chat continuation
          if (customerId) {
            await MKSupabase.Chats.send({
              customer_id: customerId,
              sender: 'customer',
              sender_name: enquiry.name,
              message: `Inquired for ${enquiry.product}${enquiry.quantity ? ` (${enquiry.quantity})` : ''}: ${enquiry.message || 'Need wholesale rates & quotation.'}`,
              quick_action: 'Enquiry Form'
            });
          }

          return { data, error: null };
        });
      }
    },

    // =========================================================================
    // 7. LIVE CHAT & INBOX SERVICE (REALTIME)
    // =========================================================================
    Chats: {
      async getByCustomerId(customerId) {
        if (!isValidUUID(customerId)) return { data: [], error: null };
        return safeQuery(async (db) => {
          const { data, error } = await db.from('chats').select('*').eq('customer_id', customerId).order('created_at', { ascending: true });
          if (error) throw error;
          return { data: data || [], error: null };
        }, []);
      },

      async getAllThreads() {
        return safeQuery(async (db) => {
          // Get recent chats and customers
          const { data: chats, error } = await db.from('chats').select('*, customers(*)').order('created_at', { ascending: false }).limit(200);
          if (error) throw error;
          return { data: chats || [], error: null };
        }, []);
      },

      async send(message) {
        return safeQuery(async (db) => {
          const payload = {
            customer_id: isValidUUID(message.customer_id) ? message.customer_id : null,
            sender: message.sender || 'customer',
            sender_name: message.sender_name || 'Customer',
            message: message.message,
            quick_action: message.quick_action || '',
            is_read: message.sender === 'admin'
          };

          const { data, error } = await db.from('chats').insert(payload).select().single();
          if (error) throw error;

          // Update customer last_active
          if (payload.customer_id) {
            await db.from('customers').update({ last_active: new Date().toISOString() }).eq('id', payload.customer_id);
          }

          return { data, error: null };
        });
      },

      async markRead(customerId) {
        if (!isValidUUID(customerId)) return { success: true, error: null };
        return safeQuery(async (db) => {
          const { error } = await db.from('chats').update({ is_read: true }).eq('customer_id', customerId);
          if (error) throw error;
          return { success: true, error: null };
        });
      },

      subscribe(customerId, onMessageCallback) {
        if (!isValidUUID(customerId)) return null;
        const db = getClient();
        if (!db) return null;

        const channel = db.channel(`chat_${customerId}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chats', filter: `customer_id=eq.${customerId}` },
            (payload) => {
              if (typeof onMessageCallback === 'function') {
                onMessageCallback(payload.new);
              }
            }
          )
          .subscribe();

        return channel;
      }
    },

    // =========================================================================
    // 8. AUTO CONFIG SERVICE
    // =========================================================================
    AutoConfig: {
      async get() {
        return safeQuery(async (db) => {
          const { data, error } = await db.from('chat_auto_config').select('*').limit(1).maybeSingle();
          if (error) throw error;
          return { data, error: null };
        }, null);
      },

      async save(config) {
        return safeQuery(async (db) => {
          const { data: existing } = await db.from('chat_auto_config').select('id').limit(1).maybeSingle();
          const payload = {
            teaser_text: config.teaserText || config.teaser_text,
            welcome_msg_1: config.welcomeMsg1 || config.welcome_msg_1,
            welcome_msg_2: config.welcomeMsg2 || config.welcome_msg_2,
            ratecard_reply: config.ratecardReply || config.ratecard_reply,
            spices_reply: config.spicesReply || config.spices_reply,
            nuts_reply: config.nutsReply || config.nuts_reply,
            delivery_reply: config.deliveryReply || config.delivery_reply,
            enable_smart_bot: config.enableSmartBot !== undefined ? config.enableSmartBot : config.enable_smart_bot,
            updated_at: new Date().toISOString()
          };
          if (existing && existing.id) {
            payload.id = existing.id;
          }

          const { data, error } = await db.from('chat_auto_config').upsert(payload).select().single();
          if (error) throw error;
          return { data, error: null };
        });
      }
    },

    // =========================================================================
    // 9. SITE SETTINGS & ADMIN AUTH SERVICE
    // =========================================================================
    Settings: {
      async get() {
        return safeQuery(async (db) => {
          const { data, error } = await db.from('site_settings').select('*').limit(1).maybeSingle();
          if (error) throw error;
          return { data, error: null };
        }, null);
      },

      async save(settings) {
        return safeQuery(async (db) => {
          const { data: existing } = await db.from('site_settings').select('id').limit(1).maybeSingle();
          const payload = {
            business_name: settings.business_name || settings.businessName || 'SRI MK SPICEPOD TRADERS',
            tagline: settings.tagline || '',
            phone: settings.phone || '9843672274',
            email: settings.email || 'mktraders4434@gmail.com',
            address: settings.address || '',
            gstin: settings.gstin || '',
            pan: settings.pan || '',
            fssai: settings.fssai || '',
            bank_name: settings.bank_name || '',
            bank_account_name: settings.bank_account_name || '',
            bank_account_no: settings.bank_account_no || '',
            bank_ifsc: settings.bank_ifsc || '',
            bank_branch: settings.bank_branch || '',
            bank_upi: settings.bank_upi || '',
            updated_at: new Date().toISOString()
          };
          if (settings.admin_username) payload.admin_username = settings.admin_username;
          if (settings.admin_password) payload.admin_password = settings.admin_password;

          if (existing && existing.id) {
            payload.id = existing.id;
          }

          const { data, error } = await db.from('site_settings').upsert(payload).select().single();
          if (error) throw error;
          return { data, error: null };
        });
      },

      async updateAdminPassword(currentPassword, newPassword, newUsername = null) {
        return safeQuery(async (db) => {
          const { data: currentSettings, error: fetchErr } = await db.from('site_settings').select('*').limit(1).maybeSingle();
          if (fetchErr) throw fetchErr;

          const storedPass = currentSettings?.admin_password || 'admin123';
          const storedUser = currentSettings?.admin_username || 'admin';

          if (currentPassword !== storedPass) {
            return { success: false, error: new Error('தற்போதைய கடவுச்சொல் தவறானது (Current password is incorrect)') };
          }

          const updatePayload = {
            admin_password: newPassword,
            updated_at: new Date().toISOString()
          };
          if (newUsername) updatePayload.admin_username = newUsername;

          const { data, error } = await db.from('site_settings').update(updatePayload).eq('id', currentSettings.id).select().single();
          if (error) throw error;
          return { success: true, data, error: null };
        });
      },

      async verifyAdminLogin(username, password) {
        return safeQuery(async (db) => {
          const { data, error } = await db.from('site_settings').select('admin_username, admin_password').limit(1).maybeSingle();
          if (error) throw error;
          const storedUser = data?.admin_username || 'admin';
          const storedPass = data?.admin_password || 'admin123';

          const inputUser = (username || '').trim().toLowerCase();
          const validUser = (inputUser === storedUser.trim().toLowerCase() || inputUser === 'mktraders4434@gmail.com');

          if (validUser && password === storedPass) {
            return { success: true, username: storedUser, error: null };
          }
          return { success: false, error: new Error('Invalid username or password') };
        });
      }
    },

    // =========================================================================
    // 10. SUPABASE STORAGE SERVICE
    // =========================================================================
    Storage: {
      async uploadImage(file, bucket = 'product-images', folder = 'products') {
        return safeQuery(async (db) => {
          if (!file) throw new Error('No file provided');

          // Generate clean unique filename
          const ext = file.name ? file.name.split('.').pop().toLowerCase() : 'jpg';
          const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

          const { data, error } = await db.storage.from(bucket).upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

          if (error) throw error;

          const { data: publicUrlData } = db.storage.from(bucket).getPublicUrl(fileName);
          return {
            data: {
              path: data.path,
              publicUrl: publicUrlData.publicUrl
            },
            error: null
          };
        });
      },

      async deleteFile(path, bucket = 'product-images') {
        return safeQuery(async (db) => {
          const { error } = await db.storage.from(bucket).remove([path]);
          if (error) throw error;
          return { success: true, error: null };
        });
      }
    }
  };

  // Expose to window
  window.MKSupabase = MKSupabase;

})(window);
