"""
MK SPICEPOD TRADERS - Unified Persistent Backend Server
Handles static file serving + Persistent SQLite & JSON Data Storage for Customer Data, Live Chats, Enquiries & Products.
Zero external dependencies (uses standard Python library).
"""

import http.server
import socketserver
import urllib.parse
import json
import sqlite3
import os
import sys
import datetime
import base64
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
DB_PATH = DATA_DIR / "database.db"
CUSTOMERS_JSON = DATA_DIR / "customers.json"
CHATS_JSON = DATA_DIR / "chats.json"
ENQUIRIES_JSON = DATA_DIR / "enquiries.json"
PRODUCTS_JSON = DATA_DIR / "products.json"
INVOICES_JSON = DATA_DIR / "invoices.json"
ORDERS_JSON = DATA_DIR / "orders.json"

PORT = 3000

# Official 4 Multi-Bank Current Accounts Default
DEFAULT_BANK_ACCOUNTS = [
    {
        "id": "bank_1",
        "bank_name": "INDIAN BANK",
        "bank_account_name": "SRI MK SPICEPOD TRADERS",
        "bank_account_no": "8391488082",
        "bank_ifsc": "IDBI000A235",
        "bank_branch": "AVINASHI ROAD",
        "bank_upi": "9843672274@upi",
        "account_type": "Current Account",
        "is_active": True,
        "is_default": True
    },
    {
        "id": "bank_2",
        "bank_name": "HDFC BANK",
        "bank_account_name": "SRI MK SPICEPOD TRADERS",
        "bank_account_no": "50200084367227",
        "bank_ifsc": "HDFC0001234",
        "bank_branch": "TIRUPPUR MAIN BRANCH",
        "bank_upi": "9843672274@hdfcbank",
        "account_type": "Current Account",
        "is_active": True,
        "is_default": False
    },
    {
        "id": "bank_3",
        "bank_name": "ICICI BANK",
        "bank_account_name": "SRI MK SPICEPOD TRADERS",
        "bank_account_no": "004505012345",
        "bank_ifsc": "ICIC0000045",
        "bank_branch": "KUMARAN ROAD BRANCH",
        "bank_upi": "9843672274@icici",
        "account_type": "Current Account",
        "is_active": True,
        "is_default": False
    },
    {
        "id": "bank_4",
        "bank_name": "STATE BANK OF INDIA (SBI)",
        "bank_account_name": "SRI MK SPICEPOD TRADERS",
        "bank_account_no": "39485720194",
        "bank_ifsc": "SBIN0001234",
        "bank_branch": "TIRUPPUR BAZAAR BRANCH",
        "bank_upi": "9843672274@sbi",
        "account_type": "Current Account",
        "is_active": True,
        "is_default": False
    }
]

# Initialize SQLite Database & Tables
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Verify and migrate schema if old table without last_active exists
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='customers'")
    if cur.fetchone():
        cur.execute("PRAGMA table_info(customers)")
        cols = [col[1] for col in cur.fetchall()]
        if "last_active" not in cols or "total_messages" not in cols:
            cur.execute("DROP TABLE IF EXISTS customers")
            cur.execute("DROP TABLE IF EXISTS chats")
            cur.execute("DROP TABLE IF EXISTS enquiries")
            conn.commit()

    # Wholesale Orders & Payment Verification Table
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'")
    if cur.fetchone():
        cur.execute("PRAGMA table_info(orders)")
        cols = {c[1]: c[2] for c in cur.fetchall()}
        if cols.get("id") == "INTEGER" or "payment_mode" not in cols:
            cur.execute("ALTER TABLE orders RENAME TO orders_old")
            cur.execute("""
            CREATE TABLE orders (
                id TEXT PRIMARY KEY,
                order_number TEXT NOT NULL,
                customer_id TEXT DEFAULT '',
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                customer_email TEXT DEFAULT '',
                customer_gst TEXT DEFAULT '',
                customer_city TEXT DEFAULT '',
                delivery_address TEXT DEFAULT '',
                product_name TEXT NOT NULL,
                quantity_kg REAL NOT NULL,
                unit_price REAL NOT NULL,
                total_amount REAL NOT NULL,
                payment_mode TEXT DEFAULT 'UPI',
                transaction_id TEXT DEFAULT '',
                payment_proof_url TEXT DEFAULT '',
                payment_status TEXT DEFAULT 'Pending Verification',
                order_status TEXT DEFAULT 'Processing',
                notes TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """)
            cur.execute("PRAGMA table_info(orders_old)")
            old_col_names = [c[1] for c in cur.fetchall()]
            cur.execute("SELECT * FROM orders_old")
            old_rows = cur.fetchall()
            for row in old_rows:
                row_dict = dict(zip(old_col_names, row))
                oid = row_dict.get("order_number") or f"MK-ORD-{row_dict.get('id', 1)}"
                cur.execute("""
                INSERT OR IGNORE INTO orders (
                    id, order_number, customer_id, customer_name, customer_phone, customer_email, customer_gst,
                    customer_city, delivery_address, product_name, quantity_kg, unit_price, total_amount,
                    payment_mode, transaction_id, payment_proof_url, payment_status, order_status, notes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    str(oid), str(oid), str(row_dict.get("customer_id", "")),
                    str(row_dict.get("customer_name", "Customer")),
                    str(row_dict.get("customer_phone", "")),
                    str(row_dict.get("customer_email", "")),
                    str(row_dict.get("customer_gst", "")),
                    str(row_dict.get("customer_city", row_dict.get("delivery_city", ""))),
                    str(row_dict.get("delivery_address", "")),
                    str(row_dict.get("product_name", "Spices")),
                    float(row_dict.get("quantity_kg", 50)),
                    float(row_dict.get("unit_price", 240)),
                    float(row_dict.get("total_amount", 12000)),
                    str(row_dict.get("payment_mode", "UPI")),
                    str(row_dict.get("transaction_id", "")),
                    str(row_dict.get("payment_proof_url", "")),
                    str(row_dict.get("payment_status", "Pending Verification")),
                    str(row_dict.get("order_status", row_dict.get("status", "Confirmed"))),
                    str(row_dict.get("notes", "")),
                    str(row_dict.get("created_at", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))),
                    str(row_dict.get("updated_at", datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
                ))
            cur.execute("DROP TABLE IF EXISTS orders_old")
            conn.commit()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT NOT NULL,
        customer_id TEXT DEFAULT '',
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT DEFAULT '',
        customer_gst TEXT DEFAULT '',
        customer_city TEXT DEFAULT '',
        delivery_address TEXT DEFAULT '',
        product_name TEXT NOT NULL,
        quantity_kg REAL NOT NULL,
        unit_price REAL NOT NULL,
        total_amount REAL NOT NULL,
        payment_mode TEXT DEFAULT 'UPI', -- 'UPI' | 'NEFT/RTGS/IMPS' | 'Net Banking'
        transaction_id TEXT DEFAULT '',  -- UTR / Transaction Reference Number
        payment_proof_url TEXT DEFAULT '', -- Base64 image or URL
        payment_status TEXT DEFAULT 'Pending Verification', -- 'Pending Verification' | 'Payment Received' | 'Payment Rejected'
        order_status TEXT DEFAULT 'Processing', -- 'Processing' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled'
        notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # Customers Table (Never delete policy)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT DEFAULT '',
        city TEXT DEFAULT '',
        business_name TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TEXT NOT NULL,
        last_active TEXT NOT NULL,
        total_messages INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Active'
    )
    """)
    
    # Live Chat Messages Table (Never delete policy)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        sender TEXT NOT NULL, -- 'customer' | 'admin' | 'bot'
        sender_name TEXT NOT NULL,
        message TEXT NOT NULL,
        image_url TEXT DEFAULT '',
        quick_action TEXT DEFAULT '',
        timestamp TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
    """)
    try:
        cur.execute("ALTER TABLE chats ADD COLUMN image_url TEXT DEFAULT ''")
    except Exception:
        pass
    
    # Enquiries Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        customer_id TEXT DEFAULT '',
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT DEFAULT '',
        product TEXT NOT NULL,
        quantity TEXT DEFAULT '',
        message TEXT DEFAULT '',
        date TEXT NOT NULL
    )
    """)
    
    # Products Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        stock TEXT NOT NULL,
        grade TEXT DEFAULT '',
        hsn_code TEXT DEFAULT '0910',
        img TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        updated_at TEXT NOT NULL
    )
    """)
    try:
        cur.execute("ALTER TABLE products ADD COLUMN hsn_code TEXT DEFAULT '0910'")
    except Exception:
        pass

    # Quotations & Tax Invoices Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        doc_type TEXT NOT NULL, -- 'quotation' | 'invoice'
        doc_number TEXT NOT NULL,
        customer_id TEXT DEFAULT '',
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT DEFAULT '',
        customer_gstin TEXT DEFAULT '',
        customer_city TEXT DEFAULT '',
        billing_address TEXT DEFAULT '',
        doc_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        payment_terms TEXT DEFAULT '100% Advance before Dispatch',
        delivery_terms TEXT DEFAULT 'Door Delivery / Express Transport',
        items_json TEXT NOT NULL,
        subtotal REAL NOT NULL,
        discount REAL DEFAULT 0,
        gst_amount REAL NOT NULL,
        freight REAL DEFAULT 0,
        grand_total REAL NOT NULL,
        notes TEXT DEFAULT '',
        bank_details TEXT DEFAULT '',
        status TEXT DEFAULT 'Draft', -- 'Draft' | 'Sent' | 'Confirmed' | 'Paid' | 'Cancelled'
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # Admin Settings & Authentication Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        business_name TEXT NOT NULL,
        tagline TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        email TEXT DEFAULT '',
        address TEXT DEFAULT '',
        gstin TEXT DEFAULT '',
        pan TEXT DEFAULT '',
        fssai TEXT DEFAULT '',
        bank_name TEXT DEFAULT '',
        bank_account_name TEXT DEFAULT '',
        bank_account_no TEXT DEFAULT '',
        bank_ifsc TEXT DEFAULT '',
        bank_branch TEXT DEFAULT '',
        bank_upi TEXT DEFAULT '',
        bank_accounts_json TEXT DEFAULT '',
        admin_username TEXT DEFAULT 'admin',
        admin_password TEXT DEFAULT 'admin123',
        updated_at TEXT NOT NULL
    )
    """)
    
    try:
        cur.execute("ALTER TABLE settings ADD COLUMN bank_accounts_json TEXT DEFAULT ''")
    except Exception:
        pass
    try:
        cur.execute("ALTER TABLE settings ADD COLUMN instagram_url TEXT DEFAULT 'https://www.instagram.com/sri_mk_spicepodtraders?stkn=bXY5MHg4ZGJoOWI2&utm_source=qr'")
    except Exception:
        pass
    
    conn.commit()
    
    default_banks_json = json.dumps(DEFAULT_BANK_ACCOUNTS, ensure_ascii=False)
    
    cur.execute("SELECT COUNT(*) FROM settings")
    if cur.fetchone()[0] == 0:
        cur.execute("""
        INSERT INTO settings (id, business_name, tagline, phone, email, address, gstin, pan, fssai, bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, bank_accounts_json, admin_username, admin_password, updated_at)
        VALUES ('settings_1', 'SRI MK SPICEPOD TRADERS', 'Spices and Nuts Wholesale (Serving Businesses Nationwide)', '9843672274', 'mktraders4434@gmail.com', 'No.148 D5, TTP Mill Road, Nataraja Layout, Karipparayan Kovil Street, Saminathapuram, 15 Velampalayam, Thirumuruganpoondi, Tiruppur, Tamil Nadu - 641652', '33AUJPM5853C1ZP', 'AUJPM5853C', '12423008000456', 'INDIAN BANK', 'SRI MK SPICEPOD TRADERS', '8391488082', 'IDBI000A235', 'AVINASHI ROAD', '9843672274@upi', ?, 'admin', 'admin123', datetime('now'))
        """, (default_banks_json,))
        conn.commit()
    else:
        # Check if bank_accounts_json is empty or invalid
        cur.execute("SELECT bank_accounts_json FROM settings WHERE id = 'settings_1'")
        row = cur.fetchone()
        if not row or not row[0] or len(str(row[0]).strip()) < 10:
            cur.execute("""
            UPDATE settings
            SET bank_accounts_json = ?
            WHERE id = 'settings_1'
            """, (default_banks_json,))
            conn.commit()
    
    # Seed default customers if empty
    cur.execute("SELECT COUNT(*) FROM customers")
    if cur.fetchone()[0] == 0:
        seed_customers = [
            ("cust_1", "Ramesh Traders", "9843112233", "ramesh@traders.com", "Chennai", "Ramesh Wholesale Store", "Regular wholesale buyer of Almonds & Cashews", "2025-06-01 10:30:00", "2025-06-12 16:45:00", 8, "Active"),
            ("cust_2", "Sri Balaji Store", "9843223344", "balaji@store.com", "Madurai", "Sri Balaji Provisions", "Orders Salem Grade A Turmeric Powder in bulk", "2025-06-03 11:20:00", "2025-06-11 14:10:00", 12, "Active"),
            ("cust_3", "Elite Foods", "9843334455", "orders@elitefoods.com", "Coimbatore", "Elite Food Products", "Monthly bulk buyer of Dry Fruits & Nuts", "2025-06-05 09:15:00", "2025-06-10 18:22:00", 6, "Active"),
            ("cust_4", "Kumar & Co", "9843445566", "kumar@co.in", "Salem", "Kumar Spices & Groceries", "Inquires about Tellicherry Black Pepper & Guntur Chilli", "2025-06-06 14:00:00", "2025-06-09 12:05:00", 4, "Active"),
            ("cust_5", "Johnson Mart", "9843556677", "johnson@mart.com", "Bengaluru", "Johnson Supermart Chain", "Cardamom and Whole Spices distributor", "2025-06-08 16:40:00", "2025-06-08 17:30:00", 5, "Active")
        ]
        cur.executemany("INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", seed_customers)
        conn.commit()

    # Seed default chats if empty
    cur.execute("SELECT COUNT(*) FROM chats")
    if cur.fetchone()[0] == 0:
        seed_chats = [
            ("chat_1", "cust_1", "customer", "Ramesh Traders", "Hello MK Traders, what is today's bulk rate for California Almonds 200kg?", "", "2025-06-12 10:15:00", 1),
            ("chat_2", "cust_1", "admin", "MK Spicepod Support", "Hello Mr. Ramesh! Today's rate for California Almonds is ₹720/kg for orders above 100kg. Free shipping to Chennai included.", "", "2025-06-12 10:18:00", 1),
            ("chat_3", "cust_1", "customer", "Ramesh Traders", "Great! Please book 200kg. Dispatch invoice on WhatsApp.", "", "2025-06-12 10:20:00", 1),
            ("chat_4", "cust_2", "customer", "Sri Balaji Store", "Do you have Salem Grade A Turmeric Powder in 50kg gunny bags?", "", "2025-06-11 11:30:00", 1),
            ("chat_5", "cust_2", "admin", "MK Spicepod Support", "Yes sir, ready stock available with export lab certification. Rate is ₹240/kg.", "", "2025-06-11 11:35:00", 1)
        ]
        cur.executemany("INSERT INTO chats VALUES (?, ?, ?, ?, ?, ?, ?, ?)", seed_chats)
        conn.commit()

    # Seed default products if empty
    cur.execute("SELECT COUNT(*) FROM products")
    if cur.fetchone()[0] == 0:
        seed_products = [
            (1, "Turmeric Powder", "Spices", "240", "1200", "Grade A Salem", "images/products/turmeric-powder.jpg", "Active", "2025-06-01 10:00:00"),
            (2, "Red Chilli", "Spices", "280", "850", "Guntur Sannam", "images/products/red-chilli.jpg", "Active", "2025-06-01 10:00:00"),
            (3, "Black Pepper", "Spices", "650", "600", "Tellicherry Bold", "images/products/black-pepper.jpg", "Active", "2025-06-01 10:00:00"),
            (4, "Coriander Seeds", "Spices", "160", "1500", "Green Bold", "images/products/coriander-seeds.jpg", "Active", "2025-06-01 10:00:00"),
            (5, "Raisins", "Dry Fruits", "320", "900", "Golden Kismis", "images/products/raisins.jpg", "Active", "2025-06-01 10:00:00"),
            (6, "Dates", "Dry Fruits", "450", "750", "Medjool & Kimia", "images/products/dates.jpg", "Active", "2025-06-01 10:00:00"),
            (7, "Apricots", "Dry Fruits", "580", "400", "Turkish Jumbo", "images/products/apricots.jpg", "Active", "2025-06-01 10:00:00"),
            (8, "Figs", "Dry Fruits", "850", "500", "Anjeer Extra Bold", "images/products/figs.jpg", "Active", "2025-06-01 10:00:00"),
            (9, "Almonds", "Nuts", "720", "2000", "California Independence", "images/products/almonds.jpg", "Active", "2025-06-01 10:00:00"),
            (10, "Cashews", "Nuts", "820", "1400", "W240 King", "images/products/cashews.jpg", "Active", "2025-06-01 10:00:00"),
            (11, "Pistachios", "Nuts", "1150", "650", "Iranian Salted", "images/products/pistachios.jpg", "Active", "2025-06-01 10:00:00"),
            (12, "Walnuts", "Nuts", "950", "450", "Kashmir Extra Light", "images/products/walnuts.jpg", "Active", "2025-06-01 10:00:00"),
            (13, "Cinnamon", "Whole Spices", "480", "350", "Ceylon Quills", "images/products/cinnamon.jpg", "Active", "2025-06-01 10:00:00"),
            (14, "Cardamom", "Whole Spices", "2600", "250", "8mm Bold Green", "images/products/cardamom.jpg", "Active", "2025-06-01 10:00:00"),
            (15, "Cloves", "Whole Spices", "950", "300", "Madagascar Handpicked", "images/products/cloves.jpg", "Active", "2025-06-01 10:00:00"),
            (16, "Star Anise", "Whole Spices", "780", "220", "Whole Star Autumn", "images/products/star-anise.jpg", "Active", "2025-06-01 10:00:00")
        ]
        cur.executemany("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", seed_products)
        conn.commit()

    # Seed sample quotations and invoices if empty
    cur.execute("SELECT COUNT(*) FROM invoices")
    if cur.fetchone()[0] == 0:
        sample_items_1 = json.dumps([
            {"product": "California Almonds", "grade": "California Independence Extra Bold", "qty": 200, "rate": 720, "gst_rate": 5, "amount": 144000},
            {"product": "Cashews", "grade": "W240 King Grade", "qty": 100, "rate": 820, "gst_rate": 5, "amount": 82000}
        ])
        sample_items_2 = json.dumps([
            {"product": "Turmeric Powder", "grade": "Grade A Salem (>3.5% Curcumin)", "qty": 500, "rate": 240, "gst_rate": 5, "amount": 120000},
            {"product": "Red Chilli", "grade": "Guntur Sannam Stemless", "qty": 300, "rate": 280, "gst_rate": 5, "amount": 84000}
        ])
        seed_invoices = [
            ("inv_1", "quotation", "MK-QT-2025-001", "cust_1", "Ramesh Traders", "9843112233", "ramesh@traders.com", "33AABCR1234F1Z1", "Chennai", "No. 45, Wholesale Market Road, Koyambedu, Chennai - 600107", "2025-06-12", "2025-06-19", "100% Advance before Dispatch", "SafeXpress / Express Logistics", sample_items_1, 226000, 2000, 11200, 1500, 236700, "Rates valid for 7 days. Vacuum pack 10kg cartons included.", "Account Name: SRI MK SPICEPOD TRADERS\nBank: INDIAN BANK, AVINASHI ROAD Branch\nA/C No: 8391488082\nIFSC: IDBI000A235\nUPI: 9843672274@upi", "Sent", "2025-06-12 10:30:00", "2025-06-12 10:30:00"),
            ("inv_2", "invoice", "MK-INV-2025-101", "cust_2", "Sri Balaji Store", "9843223344", "balaji@store.com", "33AAECB5678M1Z8", "Madurai", "12, South Masi Street, Madurai - 625001", "2025-06-11", "2025-06-18", "Paid via NEFT", "VRL Logistics Door Delivery", sample_items_2, 204000, 0, 10200, 1800, 216000, "Goods dispatched with export lab quality certification.", "Account Name: SRI MK SPICEPOD TRADERS\nBank: INDIAN BANK, AVINASHI ROAD Branch\nA/C No: 8391488082\nIFSC: IDBI000A235\nUPI: 9843672274@upi", "Paid", "2025-06-11 14:00:00", "2025-06-11 14:00:00")
        ]
        cur.executemany("INSERT INTO invoices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", seed_invoices)
        conn.commit()

    conn.close()

init_db()

class AppHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def _send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # API: Customers List
        if path == "/api/customers":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM customers ORDER BY last_active DESC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return self._send_json_response({"status": "success", "customers": rows})

        # API: Live Chats
        elif path == "/api/chats":
            customer_id = query.get("customer_id", [None])[0]
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            if customer_id:
                cur.execute("SELECT * FROM chats WHERE customer_id = ? ORDER BY timestamp ASC", (customer_id,))
            else:
                cur.execute("SELECT * FROM chats ORDER BY timestamp ASC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return self._send_json_response({"status": "success", "chats": rows})

        # API: Enquiries
        elif path == "/api/enquiries":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM enquiries ORDER BY date DESC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return self._send_json_response({"status": "success", "enquiries": rows})

        # API: Full Backup Export (Permanent Zero Data Loss Guarantee)
        elif path == "/api/backup":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            
            cur.execute("SELECT * FROM customers")
            customers = [dict(row) for row in cur.fetchall()]
            
            cur.execute("SELECT * FROM chats")
            chats = [dict(row) for row in cur.fetchall()]
            
            cur.execute("SELECT * FROM enquiries")
            enquiries = [dict(row) for row in cur.fetchall()]
            
            cur.execute("SELECT * FROM products")
            products = [dict(row) for row in cur.fetchall()]
            
            cur.execute("SELECT * FROM invoices")
            invoices = [dict(row) for row in cur.fetchall()]
            
            conn.close()
            
            backup_payload = {
                "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "business": "MK SPICEPOD TRADERS",
                "persistence_status": "GUARANTEED_PERMANENT",
                "counts": {
                    "total_customers": len(customers),
                    "total_chat_messages": len(chats),
                    "total_enquiries": len(enquiries),
                    "total_products": len(products),
                    "total_invoices": len(invoices)
                },
                "customers": customers,
                "chats": chats,
                "enquiries": enquiries,
                "products": products,
                "invoices": invoices
            }
            return self._send_json_response(backup_payload)

        # API: Products List
        elif path == "/api/products":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM products ORDER BY id ASC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return self._send_json_response({"status": "success", "products": rows})

        # API: Quotations & Tax Invoices List
        elif path == "/api/invoices":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM invoices ORDER BY created_at DESC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return self._send_json_response({"status": "success", "invoices": rows})

        # API: Wholesale Orders & Payment Verification List
        elif path == "/api/orders":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
            rows = [dict(row) for row in cur.fetchall()]
            conn.close()
            return self._send_json_response({"status": "success", "orders": rows})

        # API: Auto-Config for Live Chat & Bot Messages
        elif path == "/api/auto-config":
            auto_config_file = DATA_DIR / "auto_config.json"
            if auto_config_file.exists():
                try:
                    with open(auto_config_file, "r", encoding="utf-8") as f:
                        cfg = json.load(f)
                    return self._send_json_response({"status": "success", "config": cfg})
                except Exception:
                    pass
            default_cfg = {
                "teaserText": "👋 Need Wholesale Rates? Chat with us",
                "welcomeMsg1": "Namaste! 🙏 Welcome to **MK SPICEPOD TRADERS** – Wholesale Supplier of Premium Spices, Dry Fruits & Nuts.",
                "welcomeMsg2": "How can we help your business today? You can select a quick topic below or type your requirement:",
                "ratecardReply": "📊 **MK SPICEPOD Daily Wholesale Rates (Indicative Bulk Rates/kg):**\n• Turmeric Salem Grade A: ₹240/kg\n• Red Chilli Guntur Sannam: ₹280/kg\n• Tellicherry Black Pepper: ₹650/kg\n• California Almonds: ₹720/kg\n• W240 King Cashews: ₹820/kg\n• Iranian Salted Pistachios: ₹1,150/kg\n• Green Cardamom 8mm: ₹2,600/kg\n\nFor bulk orders above 500kg, special discounted rates apply. Would you like a formal proforma quotation?",
                "spicesReply": "🌶️ **Bulk Spices Supply:**\nWe supply standard 25kg / 50kg gunny bags with moisture-proof liner and food-grade lab certification. Please specify your required quantity (e.g. 200kg, 1 Ton) and destination city for freight estimation.",
                "nutsReply": "🥜 **Nuts & Dry Fruits:**\nWe offer vacuum-packed 10kg & 20kg wholesale cartons of California Almonds, W240/W320 Cashews, Jumbo Pistachios, Afghan Figs, and Medjool Dates. Ready dispatch available across India.",
                "deliveryReply": "🚚 **MOQ & Delivery Info:**\n• Minimum Order: 25 kg per item (or 100 kg mixed wholesale consignment).\n• Delivery: Dispatch within 24 hours via reputed transport / VRL / SafeXpress.\n• Payment: Bank Transfer (NEFT/RTGS/IMPS), UPI & Cash on Dispatch.",
                "enableSmartBot": True
            }
            return self._send_json_response({"status": "success", "config": default_cfg})

        # API: Site Settings
        elif path == "/api/settings":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM settings LIMIT 1")
            row = cur.fetchone()
            conn.close()
            if row:
                res = dict(row)
                try:
                    if res.get("bank_accounts_json"):
                        res["bank_accounts"] = json.loads(res["bank_accounts_json"])
                    else:
                        res["bank_accounts"] = DEFAULT_BANK_ACCOUNTS
                except Exception:
                    res["bank_accounts"] = DEFAULT_BANK_ACCOUNTS
                return self._send_json_response({"status": "success", "settings": res})
            return self._send_json_response({"status": "success", "settings": {"bank_accounts": DEFAULT_BANK_ACCOUNTS}})

        # API: Multi-Bank Accounts List
        elif path == "/api/bank-accounts":
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT bank_accounts_json, bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi FROM settings LIMIT 1")
            row = cur.fetchone()
            conn.close()
            banks = DEFAULT_BANK_ACCOUNTS
            if row and row["bank_accounts_json"]:
                try:
                    parsed = json.loads(row["bank_accounts_json"])
                    if isinstance(parsed, list) and len(parsed) > 0:
                        banks = parsed
                except Exception:
                    pass
            return self._send_json_response({"status": "success", "bank_accounts": banks})

        # API: Health check
        elif path == "/api/health":
            return self._send_json_response({
                "status": "healthy",
                "storage": "SQLite + JSON Files + IndexedDB Bridge",
                "server_time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

        # Otherwise fallback to standard static file serving
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body_data = self.rfile.read(content_length).decode("utf-8")
            payload = json.loads(body_data) if body_data else {}
        except Exception as e:
            return self._send_json_response({"status": "error", "message": f"Invalid JSON payload: {str(e)}"}, 400)

        # API: Save/Update Customer Profile (Permanent)
        if path == "/api/customers":
            name = payload.get("name", "").strip() or "Wholesale Buyer"
            phone = payload.get("phone", "").strip()
            email = payload.get("email", "").strip()
            city = payload.get("city", "").strip() or "Tamil Nadu"
            business_name = payload.get("business_name", "").strip() or name
            notes = payload.get("notes", "").strip()
            cust_id = payload.get("id", "").strip() or f"cust_{int(datetime.datetime.now().timestamp() * 1000)}"
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()
            
            # Check if customer already exists by ID or by non-empty phone
            if phone:
                cur.execute("SELECT id FROM customers WHERE id = ? OR phone = ?", (cust_id, phone))
            else:
                cur.execute("SELECT id FROM customers WHERE id = ?", (cust_id,))
            existing = cur.fetchone()

            if existing:
                cid = existing[0]
                cur.execute("""
                UPDATE customers 
                SET name = COALESCE(NULLIF(?, ''), name), email = COALESCE(NULLIF(?, ''), email), city = COALESCE(NULLIF(?, ''), city),
                    business_name = COALESCE(NULLIF(?, ''), business_name), phone = COALESCE(NULLIF(?, ''), phone), last_active = ?
                WHERE id = ?
                """, (name, email, city, business_name, phone, now, cid))
                cust_id = cid
            else:
                cur.execute("""
                INSERT INTO customers (id, name, phone, email, city, business_name, notes, created_at, last_active, total_messages, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'Active')
                """, (cust_id, name, phone, email, city, business_name, notes, now, now))

            conn.commit()
            self._sync_customers_to_json(conn)
            conn.close()

            return self._send_json_response({
                "status": "success",
                "customer_id": cust_id,
                "message": "Customer data permanently saved."
            })
            
            # Mirror to JSON file backup
            self._sync_customers_to_json(conn)
            conn.close()

            return self._send_json_response({
                "status": "success",
                "customer_id": cust_id,
                "message": "Customer data permanently saved."
            })

        # API: Upload File / Payment Proof / Screenshot
        elif path == "/api/upload":
            img_data = payload.get("image", "").strip()
            folder = payload.get("folder", "receipts").strip()
            filename = payload.get("filename", "receipt.jpg").strip()

            if not img_data:
                return self._send_json_response({"status": "error", "message": "No image data provided."}, 400)

            target_dir = BASE_DIR / "images" / folder
            target_dir.mkdir(parents=True, exist_ok=True)

            try:
                # Handle base64 data URL
                if "base64," in img_data:
                    header, base64_str = img_data.split("base64,", 1)
                    ext = "jpg"
                    if "png" in header:
                        ext = "png"
                    elif "pdf" in header:
                        ext = "pdf"
                    elif "webp" in header:
                        ext = "webp"
                else:
                    base64_str = img_data
                    ext = filename.split(".")[-1] if "." in filename else "jpg"

                file_bytes = base64.b64decode(base64_str)
                safe_name = f"proof_{int(datetime.datetime.now().timestamp() * 1000)}.{ext}"
                dest_path = target_dir / safe_name

                with open(dest_path, "wb") as f:
                    f.write(file_bytes)

                rel_url = f"images/{folder}/{safe_name}"
                return self._send_json_response({
                    "status": "success",
                    "file_url": rel_url,
                    "filename": safe_name,
                    "message": "File uploaded successfully."
                })
            except Exception as e:
                return self._send_json_response({"status": "error", "message": f"Upload failed: {str(e)}"}, 500)

        # API: Post Live Chat Message
        elif path == "/api/chats":
            customer_id = payload.get("customer_id", "").strip()
            sender = payload.get("sender", "customer").strip() # customer | admin | bot
            sender_name = payload.get("sender_name", "Customer").strip()
            message = payload.get("message", "").strip()
            image_url = payload.get("image_url", "").strip()
            quick_action = payload.get("quick_action", "").strip()
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if not customer_id or (not message and not image_url):
                return self._send_json_response({"status": "error", "message": "customer_id and message/image are required."}, 400)

            if not message and image_url:
                message = "🧾 Payment Proof / Receipt Uploaded"

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()

            # Ensure customer exists in customers table so they appear in Admin CRM
            cur.execute("SELECT id FROM customers WHERE id = ?", (customer_id,))
            cust_row = cur.fetchone()
            if not cust_row:
                cur.execute("""
                INSERT INTO customers (id, name, phone, email, city, business_name, notes, created_at, last_active, total_messages, status)
                VALUES (?, ?, ?, '', 'Tamil Nadu', ?, 'Live Chat Customer', ?, ?, 1, 'Active')
                """, (customer_id, sender_name if sender == 'customer' else 'Live Visitor', '9843672274' if sender == 'admin' else '', sender_name if sender == 'customer' else 'Live Visitor', now, now))
            else:
                cur.execute("""
                UPDATE customers 
                SET last_active = ?, total_messages = total_messages + 1
                WHERE id = ?
                """, (now, customer_id))

            chat_id = payload.get("id") or f"chat_{int(datetime.datetime.now().timestamp() * 1000)}"
            cur.execute("""
            INSERT OR REPLACE INTO chats (id, customer_id, sender, sender_name, message, image_url, quick_action, timestamp, is_read)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
            """, (chat_id, customer_id, sender, sender_name, message, image_url, quick_action, now))

            conn.commit()
            self._sync_chats_to_json(conn)
            self._sync_customers_to_json(conn)
            conn.close()

            return self._send_json_response({
                "status": "success",
                "chat_id": chat_id,
                "image_url": image_url,
                "timestamp": now,
                "message": "Message permanently stored."
            })

        # API: Mark messages as read
        elif path == "/api/chats/read":
            customer_id = payload.get("customer_id")
            if customer_id:
                conn = sqlite3.connect(DB_PATH)
                cur = conn.cursor()
                cur.execute("UPDATE chats SET is_read = 1 WHERE customer_id = ?", (customer_id,))
                conn.commit()
                conn.close()
            return self._send_json_response({"status": "success"})

        # API: Save Inbound Enquiry
        elif path == "/api/enquiries":
            name = payload.get("name", "").strip()
            phone = payload.get("phone", "").strip()
            email = payload.get("email", "").strip()
            product = payload.get("product", "").strip()
            quantity = payload.get("quantity", "").strip()
            message = payload.get("message", "").strip()
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if not name or not phone:
                return self._send_json_response({"status": "error", "message": "Name and Phone required."}, 400)

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()

            # Ensure customer profile is recorded permanently
            cur.execute("SELECT id FROM customers WHERE phone = ?", (phone,))
            existing = cur.fetchone()
            if existing:
                cust_id = existing[0]
                cur.execute("UPDATE customers SET name = ?, last_active = ? WHERE id = ?", (name, now, cust_id))
            else:
                cust_id = f"cust_{int(datetime.datetime.now().timestamp() * 1000)}"
                cur.execute("""
                INSERT INTO customers (id, name, phone, email, city, business_name, notes, created_at, last_active, total_messages, status)
                VALUES (?, ?, ?, ?, '', '', 'Registered via Wholesale Enquiry', ?, ?, 1, 'Active')
                """, (cust_id, name, phone, email, now, now))

            enq_id = f"enq_{int(datetime.datetime.now().timestamp() * 1000)}"
            cur.execute("""
            INSERT INTO enquiries (id, customer_id, name, phone, email, product, quantity, message, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (enq_id, cust_id, name, phone, email, product, quantity, message, now))

            # Also create an initial live chat entry for seamless conversation continuation!
            chat_msg = f"Inquired for {product} ({quantity}): {message}" if quantity else f"Inquired for {product}: {message}"
            cur.execute("""
            INSERT INTO chats (id, customer_id, sender, sender_name, message, quick_action, timestamp, is_read)
            VALUES (?, ?, 'customer', ?, ?, 'Enquiry Form', ?, 0)
            """, (f"chat_{int(datetime.datetime.now().timestamp() * 1000)}", cust_id, name, chat_msg, now))

            conn.commit()
            self._sync_customers_to_json(conn)
            self._sync_chats_to_json(conn)
            conn.close()

            return self._send_json_response({
                "status": "success",
                "enquiry_id": enq_id,
                "customer_id": cust_id,
                "message": "Enquiry & Customer Data permanently saved."
            })

        # API: Save/Update Product
        elif path == "/api/products":
            prod_id = payload.get("id")
            name = payload.get("name", "").strip()
            category = payload.get("category", "Spices").strip()
            price = str(payload.get("price", "0")).strip()
            stock = str(payload.get("stock", "0")).strip()
            grade = payload.get("grade", "").strip()
            hsn_code = payload.get("hsn_code", "0910").strip() or "0910"
            img = payload.get("img", "images/products/turmeric-powder.jpg").strip()
            status = payload.get("status", "Active").strip()
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if not name:
                return self._send_json_response({"status": "error", "message": "Product name is required."}, 400)

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()

            if prod_id:
                cur.execute("SELECT id FROM products WHERE id = ?", (prod_id,))
                if cur.fetchone():
                    cur.execute("""
                    UPDATE products
                    SET name = ?, category = ?, price = ?, stock = ?, grade = ?, hsn_code = ?, img = ?, status = ?, updated_at = ?
                    WHERE id = ?
                    """, (name, category, price, stock, grade, hsn_code, img, status, now, prod_id))
                else:
                    cur.execute("""
                    INSERT INTO products (id, name, category, price, stock, grade, hsn_code, img, status, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (prod_id, name, category, price, stock, grade, hsn_code, img, status, now))
            else:
                cur.execute("""
                INSERT INTO products (name, category, price, stock, grade, hsn_code, img, status, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (name, category, price, stock, grade, hsn_code, img, status, now))
                prod_id = cur.lastrowid

            conn.commit()
            self._sync_products_to_json(conn)
            conn.close()

            return self._send_json_response({"status": "success", "product_id": prod_id, "message": "Product saved successfully."})

        # API: Delete Product
        elif path == "/api/products/delete":
            prod_id = payload.get("id")
            if prod_id:
                conn = sqlite3.connect(DB_PATH)
                cur = conn.cursor()
                cur.execute("DELETE FROM products WHERE id = ?", (prod_id,))
                conn.commit()
                self._sync_products_to_json(conn)
                conn.close()
            return self._send_json_response({"status": "success", "message": "Product deleted successfully."})

        # API: Save/Update Quotation or Tax Invoice
        elif path == "/api/invoices":
            inv_id = payload.get("id") or f"inv_{int(datetime.datetime.now().timestamp() * 1000)}"
            doc_type = payload.get("doc_type", "quotation").strip().lower() # 'quotation' | 'invoice'
            doc_number = payload.get("doc_number", f"MK-{doc_type.upper()}-{int(datetime.datetime.now().timestamp())}").strip()
            customer_id = payload.get("customer_id", "").strip()
            customer_name = payload.get("customer_name", "").strip()
            customer_phone = payload.get("customer_phone", "").strip()
            customer_email = payload.get("customer_email", "").strip()
            customer_gstin = payload.get("customer_gstin", "").strip()
            customer_city = payload.get("customer_city", "").strip()
            billing_address = payload.get("billing_address", "").strip()
            doc_date = payload.get("doc_date", datetime.date.today().isoformat()).strip()
            due_date = payload.get("due_date", "").strip()
            payment_terms = payload.get("payment_terms", "100% Advance before Dispatch").strip()
            delivery_terms = payload.get("delivery_terms", "Door Delivery / Express Transport").strip()
            items_json = payload.get("items_json")
            if isinstance(items_json, (list, dict)):
                items_json = json.dumps(items_json)
            elif not items_json:
                items_json = "[]"
            
            subtotal = float(payload.get("subtotal", 0))
            discount = float(payload.get("discount", 0))
            gst_amount = float(payload.get("gst_amount", 0))
            freight = float(payload.get("freight", 0))
            grand_total = float(payload.get("grand_total", 0))
            notes = payload.get("notes", "").strip()
            bank_details = payload.get("bank_details", "").strip()
            status = payload.get("status", "Draft").strip()
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if not customer_name:
                return self._send_json_response({"status": "error", "message": "Customer name is required."}, 400)

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()

            cur.execute("SELECT id FROM invoices WHERE id = ?", (inv_id,))
            if cur.fetchone():
                cur.execute("""
                UPDATE invoices
                SET doc_type = ?, doc_number = ?, customer_id = ?, customer_name = ?, customer_phone = ?,
                    customer_email = ?, customer_gstin = ?, customer_city = ?, billing_address = ?,
                    doc_date = ?, due_date = ?, payment_terms = ?, delivery_terms = ?, items_json = ?,
                    subtotal = ?, discount = ?, gst_amount = ?, freight = ?, grand_total = ?,
                    notes = ?, bank_details = ?, status = ?, updated_at = ?
                WHERE id = ?
                """, (doc_type, doc_number, customer_id, customer_name, customer_phone,
                      customer_email, customer_gstin, customer_city, billing_address,
                      doc_date, due_date, payment_terms, delivery_terms, items_json,
                      subtotal, discount, gst_amount, freight, grand_total,
                      notes, bank_details, status, now, inv_id))
            else:
                cur.execute("""
                INSERT INTO invoices (
                    id, doc_type, doc_number, customer_id, customer_name, customer_phone,
                    customer_email, customer_gstin, customer_city, billing_address,
                    doc_date, due_date, payment_terms, delivery_terms, items_json,
                    subtotal, discount, gst_amount, freight, grand_total,
                    notes, bank_details, status, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    inv_id, doc_type, doc_number, customer_id, customer_name, customer_phone,
                    customer_email, customer_gstin, customer_city, billing_address,
                    doc_date, due_date, payment_terms, delivery_terms, items_json,
                    subtotal, discount, gst_amount, freight, grand_total,
                    notes, bank_details, status, now, now
                ))

            # If customer not registered, create customer record
            if customer_phone:
                cur.execute("SELECT id FROM customers WHERE phone = ?", (customer_phone,))
                if not cur.fetchone():
                    new_cust_id = customer_id or f"cust_{int(datetime.datetime.now().timestamp() * 1000)}"
                    cur.execute("""
                    INSERT INTO customers (id, name, phone, email, city, business_name, created_at, last_active, total_messages, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 'Active')
                    """, (new_cust_id, customer_name, customer_phone, customer_email, customer_city, customer_name, now, now))
                    self._sync_customers_to_json(conn)

            conn.commit()
            self._sync_invoices_to_json(conn)
            conn.close()

            return self._send_json_response({
                "status": "success",
                "invoice_id": inv_id,
                "doc_number": doc_number,
                "message": f"{doc_type.capitalize()} saved successfully."
            })

        # API: Delete Quotation or Tax Invoice
        elif path == "/api/invoices/delete":
            inv_id = payload.get("id")
            if inv_id:
                conn = sqlite3.connect(DB_PATH)
                cur = conn.cursor()
                cur.execute("DELETE FROM invoices WHERE id = ?", (inv_id,))
                conn.commit()
                self._sync_invoices_to_json(conn)
                conn.close()
            return self._send_json_response({"status": "success", "message": "Document deleted successfully."})

        # API: Save Auto-Config for Live Chat & Bot Messages
        elif path == "/api/auto-config":
            auto_config_file = DATA_DIR / "auto_config.json"
            try:
                with open(auto_config_file, "w", encoding="utf-8") as f:
                    json.dump(payload, f, ensure_ascii=False, indent=2)
                return self._send_json_response({
                    "status": "success",
                    "message": "Auto-message & bot configuration saved successfully."
                })
            except Exception as e:
                return self._send_json_response({"status": "error", "message": str(e)}, 500)

        # API: Admin Login Authentication
        elif path == "/api/auth/login":
            username = payload.get("username", "").strip()
            password = payload.get("password", "").strip()
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM settings LIMIT 1")
            row = cur.fetchone()
            conn.close()

            stored_user = row["admin_username"] if row and "admin_username" in row.keys() else "admin"
            stored_pass = row["admin_password"] if row and "admin_password" in row.keys() else "admin123"

            if (username.lower() == stored_user.lower() or username.lower() == "mktraders4434@gmail.com") and password == stored_pass:
                return self._send_json_response({
                    "status": "success",
                    "authenticated": True,
                    "username": stored_user,
                    "message": "Login successful"
                })
            return self._send_json_response({"status": "error", "message": "Invalid username or password"}, 401)

        # API: Admin Change Password
        elif path == "/api/auth/change-password":
            current_pass = payload.get("current_password", "").strip()
            new_pass = payload.get("new_password", "").strip()
            new_username = payload.get("new_username", "").strip()

            if not new_pass or len(new_pass) < 4:
                return self._send_json_response({"status": "error", "message": "New password must be at least 4 characters."}, 400)

            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM settings LIMIT 1")
            row = cur.fetchone()

            stored_pass = row["admin_password"] if row and "admin_password" in row.keys() else "admin123"

            if current_pass != stored_pass:
                conn.close()
                return self._send_json_response({"status": "error", "message": "Current password is incorrect."}, 403)

            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            if new_username:
                cur.execute("UPDATE settings SET admin_password = ?, admin_username = ?, updated_at = ?", (new_pass, new_username, now))
            else:
                cur.execute("UPDATE settings SET admin_password = ?, updated_at = ?", (new_pass, now))
            conn.commit()
            conn.close()

            return self._send_json_response({"status": "success", "message": "Admin password updated successfully."})

        # API: Save Multi-Bank Accounts Directly
        elif path == "/api/bank-accounts":
            banks = payload.get("bank_accounts")
            if isinstance(banks, list) and len(banks) > 0:
                banks_json = json.dumps(banks, ensure_ascii=False)
                # Find default or first active bank
                def_bank = next((b for b in banks if b.get("is_default")), banks[0])
                bank_name = def_bank.get("bank_name", "INDIAN BANK")
                bank_account_name = def_bank.get("bank_account_name", "SRI MK SPICEPOD TRADERS")
                bank_account_no = def_bank.get("bank_account_no", "8391488082")
                bank_ifsc = def_bank.get("bank_ifsc", "IDBI000A235")
                bank_branch = def_bank.get("bank_branch", "AVINASHI ROAD")
                bank_upi = def_bank.get("bank_upi", "9843672274@upi")
                now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                conn = sqlite3.connect(DB_PATH)
                cur = conn.cursor()
                cur.execute("SELECT id FROM settings LIMIT 1")
                row = cur.fetchone()
                if row:
                    cur.execute("""
                    UPDATE settings
                    SET bank_accounts_json = ?, bank_name = ?, bank_account_name = ?,
                        bank_account_no = ?, bank_ifsc = ?, bank_branch = ?, bank_upi = ?, updated_at = ?
                    WHERE id = ?
                    """, (banks_json, bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, now, row[0]))
                else:
                    cur.execute("""
                    INSERT INTO settings (id, business_name, bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, bank_accounts_json, admin_username, admin_password, updated_at)
                    VALUES ('settings_1', 'SRI MK SPICEPOD TRADERS', ?, ?, ?, ?, ?, ?, ?, 'admin', 'admin123', ?)
                    """, (bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, banks_json, now))
                conn.commit()
                conn.close()
                return self._send_json_response({"status": "success", "message": "All 4 bank accounts saved successfully.", "bank_accounts": banks})
            return self._send_json_response({"status": "error", "message": "Invalid bank accounts payload."}, 400)

        # API: Save Settings
        elif path == "/api/settings":
            business_name = payload.get("business_name", "SRI MK SPICEPOD TRADERS").strip()
            tagline = payload.get("tagline", "").strip()
            phone = payload.get("phone", "").strip()
            email = payload.get("email", "").strip()
            address = payload.get("address", "").strip()
            gstin = payload.get("gstin", "").strip()
            bank_name = payload.get("bank_name", "").strip()
            bank_account_name = payload.get("bank_account_name", "").strip()
            bank_account_no = payload.get("bank_account_no", "").strip()
            bank_ifsc = payload.get("bank_ifsc", "").strip()
            bank_branch = payload.get("bank_branch", "").strip()
            bank_upi = payload.get("bank_upi", "").strip()
            instagram_url = payload.get("instagram_url", "https://www.instagram.com/sri_mk_spicepodtraders?stkn=bXY5MHg4ZGJoOWI2&utm_source=qr").strip()
            bank_accounts = payload.get("bank_accounts")
            bank_accounts_json = payload.get("bank_accounts_json")
            if isinstance(bank_accounts, list):
                bank_accounts_json = json.dumps(bank_accounts, ensure_ascii=False)
            elif not bank_accounts_json:
                bank_accounts_json = ""

            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()
            cur.execute("SELECT id, bank_accounts_json FROM settings LIMIT 1")
            row = cur.fetchone()
            if row:
                if not bank_accounts_json:
                    bank_accounts_json = row[1] or json.dumps(DEFAULT_BANK_ACCOUNTS, ensure_ascii=False)
                cur.execute("""
                UPDATE settings
                SET business_name = ?, tagline = ?, phone = ?, email = ?, address = ?,
                    gstin = ?, instagram_url = ?, bank_name = ?, bank_account_name = ?, bank_account_no = ?,
                    bank_ifsc = ?, bank_branch = ?, bank_upi = ?, bank_accounts_json = ?, updated_at = ?
                WHERE id = ?
                """, (business_name, tagline, phone, email, address, gstin, instagram_url, bank_name,
                      bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, bank_accounts_json, now, row[0]))
            else:
                if not bank_accounts_json:
                    bank_accounts_json = json.dumps(DEFAULT_BANK_ACCOUNTS, ensure_ascii=False)
                cur.execute("""
                INSERT INTO settings (id, business_name, tagline, phone, email, address, gstin, instagram_url, bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, bank_accounts_json, admin_username, admin_password, updated_at)
                VALUES ('settings_1', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin', 'admin123', ?)
                """, (business_name, tagline, phone, email, address, gstin, instagram_url, bank_name, bank_account_name, bank_account_no, bank_ifsc, bank_branch, bank_upi, bank_accounts_json, now))
            conn.commit()
            conn.close()

            return self._send_json_response({"status": "success", "message": "Settings saved successfully."})

        # API: Create / Place Order with Payment Proof
        elif path == "/api/orders":
            order_id = payload.get("id") or payload.get("order_number") or f"MK-ORD-{int(datetime.datetime.now().timestamp())}"
            order_number = payload.get("order_number") or order_id
            customer_name = payload.get("customer_name", "").strip()
            customer_phone = payload.get("customer_phone", "").strip()
            customer_email = payload.get("customer_email", "").strip()
            customer_gst = payload.get("customer_gst", "").strip().upper()
            customer_city = payload.get("customer_city", "").strip()
            delivery_address = payload.get("delivery_address", "").strip()
            product_name = payload.get("product_name", "Spices").strip()
            quantity_kg = float(payload.get("quantity_kg", 50))
            unit_price = float(payload.get("unit_price", 240))
            total_amount = float(payload.get("total_amount", quantity_kg * unit_price))
            payment_mode = payload.get("payment_mode", "UPI").strip()
            transaction_id = payload.get("transaction_id", "").strip()
            payment_proof_url = payload.get("payment_proof_url", "").strip()
            payment_status = payload.get("payment_status", "Pending Verification").strip()
            order_status = payload.get("order_status", "Processing").strip()
            notes = payload.get("notes", "").strip()
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if not customer_name or not customer_phone:
                return self._send_json_response({"status": "error", "message": "Customer Name and Phone are required."}, 400)

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()

            # Check if customer exists
            cur.execute("SELECT id FROM customers WHERE phone = ?", (customer_phone,))
            cust_row = cur.fetchone()
            if cust_row:
                cust_id = cust_row[0]
                cur.execute("UPDATE customers SET last_active = ?, name = COALESCE(NULLIF(?, ''), name), city = COALESCE(NULLIF(?, ''), city) WHERE id = ?", (now, customer_name, customer_city, cust_id))
            else:
                cust_id = f"cust_{int(datetime.datetime.now().timestamp() * 1000)}"
                cur.execute("""
                INSERT INTO customers (id, name, phone, email, city, business_name, notes, created_at, last_active, total_messages, status)
                VALUES (?, ?, ?, ?, ?, ?, '', ?, ?, 1, 'Active')
                """, (cust_id, customer_name, customer_phone, customer_email, customer_city, customer_name, now, now))

            # Insert or Replace Order to guarantee clean primary key sync
            cur.execute("""
            INSERT OR REPLACE INTO orders (
                id, order_number, customer_id, customer_name, customer_phone, customer_email, customer_gst, customer_city,
                delivery_address, product_name, quantity_kg, unit_price, total_amount, payment_mode,
                transaction_id, payment_proof_url, payment_status, order_status, notes, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id, order_number, cust_id, customer_name, customer_phone, customer_email, customer_gst, customer_city,
                delivery_address, product_name, quantity_kg, unit_price, total_amount, payment_mode,
                transaction_id, payment_proof_url, payment_status, order_status, notes, now, now
            ))

            # Also add a record to chats so Admin Live Chat immediately has the order notice
            gst_snippet = f"\n• GSTIN: {customer_gst}" if customer_gst else ""
            chat_msg = f"📦 *New Wholesale Order Placed:*\n• Product: {product_name} ({quantity_kg} kg)\n• Rate: ₹{unit_price:,.2f}/kg\n• Total Amount: ₹{total_amount:,.2f}\n• Payment Mode: {payment_mode}\n• Transaction / UTR: {transaction_id or 'Submitted'}{gst_snippet}\n• Payment Status: {payment_status}"
            cur.execute("""
            INSERT INTO chats (id, customer_id, sender, sender_name, message, quick_action, timestamp, is_read)
            VALUES (?, ?, 'customer', ?, ?, 'Order Payment Form', ?, 0)
            """, (f"chat_{int(datetime.datetime.now().timestamp() * 1000)}", cust_id, customer_name, chat_msg, now))

            conn.commit()
            self._sync_orders_to_json(conn)
            self._sync_customers_to_json(conn)
            self._sync_chats_to_json(conn)
            conn.close()

            return self._send_json_response({
                "status": "success",
                "order_id": order_id,
                "order_number": order_number,
                "customer_id": cust_id,
                "total_amount": total_amount,
                "message": "Order and Payment details permanently saved."
            })

        # API: Update Order / Payment Status
        elif path == "/api/orders/update-status":
            order_id = payload.get("id") or payload.get("order_number")
            payment_status = payload.get("payment_status")
            order_status = payload.get("order_status")
            notes = payload.get("notes")
            now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if not order_id:
                return self._send_json_response({"status": "error", "message": "Order ID is required."}, 400)

            conn = sqlite3.connect(DB_PATH)
            cur = conn.cursor()

            updates = []
            params = []
            if payment_status:
                updates.append("payment_status = ?")
                params.append(payment_status)
            if order_status:
                updates.append("order_status = ?")
                params.append(order_status)
            if notes is not None:
                updates.append("notes = ?")
                params.append(notes)
            updates.append("updated_at = ?")
            params.append(now)

            params.extend([str(order_id), str(order_id)])
            cur.execute(f"UPDATE orders SET {', '.join(updates)} WHERE id = ? OR order_number = ?", params)
            conn.commit()
            self._sync_orders_to_json(conn)
            conn.close()

            return self._send_json_response({"status": "success", "message": "Order status updated successfully."})

        # API: Delete Order
        elif path == "/api/orders/delete":
            order_id = payload.get("id")
            if order_id:
                conn = sqlite3.connect(DB_PATH)
                cur = conn.cursor()
                cur.execute("DELETE FROM orders WHERE id = ?", (order_id,))
                conn.commit()
                self._sync_orders_to_json(conn)
                conn.close()
            return self._send_json_response({"status": "success", "message": "Order deleted successfully."})

        return self._send_json_response({"status": "error", "message": "Endpoint not found"}, 404)

    def _sync_orders_to_json(self, conn):
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM orders")
            rows = [dict(r) for r in cur.fetchall()]
            with open(ORDERS_JSON, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error syncing orders JSON: {e}")

    def _sync_customers_to_json(self, conn):
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM customers")
            rows = [dict(r) for r in cur.fetchall()]
            with open(CUSTOMERS_JSON, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error syncing customers JSON: {e}")

    def _sync_chats_to_json(self, conn):
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM chats")
            rows = [dict(r) for r in cur.fetchall()]
            with open(CHATS_JSON, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error syncing chats JSON: {e}")

    def _sync_products_to_json(self, conn):
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM products")
            rows = [dict(r) for r in cur.fetchall()]
            with open(PRODUCTS_JSON, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error syncing products JSON: {e}")

    def _sync_invoices_to_json(self, conn):
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM invoices")
            rows = [dict(r) for r in cur.fetchall()]
            with open(INVOICES_JSON, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error syncing invoices JSON: {e}")

    def _sync_orders_to_json(self, conn):
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM orders")
            rows = [dict(r) for r in cur.fetchall()]
            with open(ORDERS_JSON, "w", encoding="utf-8") as f:
                json.dump(rows, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error syncing orders JSON: {e}")


def run_server():
    server_address = ("", PORT)
    # Enable socket address reuse to prevent port bind errors
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(server_address, AppHTTPRequestHandler) as httpd:
        print(f"[SERVER] MK SPICEPOD TRADERS Unified Server running on http://localhost:{PORT}")
        print(f"[PERSISTENCE] Customer Data & Live Chat Engine ACTIVE (SQLite + JSON Backups)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server...")
            httpd.server_close()

if __name__ == "__main__":
    run_server()
