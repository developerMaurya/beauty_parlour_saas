/**
 * @file ParlourProductSalesManager.jsx
 * @description Master Multi-Product Sales, POS & Retail Billing module for Golden Beauty Parlour.
 * Features:
 *   - Direct "Buy" Flow (No redundant Add button on product cards)
 *   - Step 1: Product & Quantity selection with visual "+ Add More Products" catalog grid (no select dropdown)
 *   - Step 2: Buyer Selection (Dropdown for Customer, Student, Staff) + "+ Register New User Account (Multi-Business)" with Full Name, Email, Password, Phone & Address
 *   - Step 3: Payment Mode, Discount, Tax & Order Placement
 *   - Step 4: Printable Bill / Receipt with instant Thermal (80mm) & Standard A4 Print switcher (includes Customer Address)
 *   - Sequential strict step-by-step wizard flow (cannot skip ahead without completing previous step)
 *   - Real-time stock deduction and restock on refund
 *   - Billing History Ledger with full past receipts
 * @module frontend/src/modules/admin/components/parlour/ParlourProductSalesManager
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Trash2,
  Eye,
  RefreshCw,
  Plus,
  Minus,
  X,
  CreditCard,
  DollarSign,
  Tag,
  Box,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  GraduationCap,
  Users,
  UserPlus,
  Layers,
  Award,
  Key,
  Receipt,
  Check,
} from 'lucide-react';
import axios from 'axios';
import { customerFetcher, studentFetcher, staffFetcher, userFetcher } from '../../../../services/api/admin/adminApi.js';

// Safely format an address (object or string) into a display string
export const formatAddressString = (addr) => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr;
  if (typeof addr === 'object') {
    const parts = [
      addr.street,
      addr.landmark,
      addr.city,
      addr.state,
      addr.postalCode || addr.pincode,
    ].filter(Boolean);
    return parts.join(', ') || addr.city || addr.street || '';
  }
  return String(addr);
};

export function ParlourProductSalesManager({ products = [], setProducts, showToast }) {
  // Active Tab: 'catalog' | 'history'
  const [activeTab, setActiveTab] = useState('catalog');

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStockFilter, setSelectedStockFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

  // ════════════════════════════════════════════════════════════════════════════
  // 1. SHOPPING / BILLING ITEMS STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_product_pos_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('parlour_product_pos_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart storage sync warn:', e.message);
    }
  }, [cart]);

  // Add Product to Cart / Bill
  const handleAddToCart = (product, qtyToAdd = 1) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      alert('This product is currently Out of Stock!');
      return false;
    }

    let success = true;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.product.id || item.product._id) === (product.id || product._id)
      );
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = Math.min(stock, currentQty + qtyToAdd);
        if (newQty === currentQty && qtyToAdd > 0) {
          alert(`Cannot add more than ${stock} units available in stock!`);
          success = false;
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prev, { product, quantity: Math.min(stock, Math.max(1, qtyToAdd)) }];
      }
    });

    return success;
  };

  // Update Item Quantity in Cart
  const handleUpdateCartQuantity = (productId, newQty) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if ((item.product.id || item.product._id) === productId) {
            const maxStock = Number(item.product.stock) || 1;
            const validQty = Math.max(1, Math.min(maxStock, Number(newQty) || 1));
            return { ...item, quantity: validQty };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => (item.product.id || item.product._id) !== productId));
  };

  // Clear Cart
  const handleClearCart = () => {
    if (cart.length > 0 && window.confirm('Are you sure you want to clear all items from the current bill?')) {
      setCart([]);
    }
  };

  // Aggregated Cart Metrics
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.product.price) || 0) * item.quantity, 0);
  }, [cart]);

  const cartTotalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // ════════════════════════════════════════════════════════════════════════════
  // 2. BUYERS DATA (CUSTOMERS, STUDENTS, STAFF)
  // ════════════════════════════════════════════════════════════════════════════
  const [customersList, setCustomersList] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loadingBuyers, setLoadingBuyers] = useState(false);

  // Fetch Buyers from DB
  const loadBuyers = async () => {
    try {
      setLoadingBuyers(true);
      const [custRes, stuRes, staffRes] = await Promise.all([
        customerFetcher.list({ limit: 100 }).catch(() => ({ data: [] })),
        studentFetcher.list({ limit: 100 }).catch(() => ({ data: [] })),
        staffFetcher.list({ limit: 100 }).catch(() => ({ data: [] })),
      ]);

      const rawCust = Array.isArray(custRes?.data) ? custRes.data : custRes?.data?.items || [];
      const rawStu = Array.isArray(stuRes?.data) ? stuRes.data : stuRes?.data?.items || [];
      const rawStaff = Array.isArray(staffRes?.data) ? staffRes.data : staffRes?.data?.items || [];

      // Fallbacks if empty
      const fallbackCust = [
        { _id: 'cust_01', name: 'Pooja Maurya', phone: '+91 98765 43210', email: 'pooja.m@gmail.com', address: 'Mahmoorganj, Varanasi' },
        { _id: 'cust_02', name: 'Sneha Kapoor', phone: '+91 98112 23344', email: 'sneha.k@gmail.com', address: 'Rathyatra, Varanasi' },
        { _id: 'cust_03', name: 'Priya Mishra', phone: '+91 99334 45566', email: 'priya.m@gmail.com', address: 'Sigra, Varanasi' },
        { _id: 'cust_04', name: 'Ananya Sharma', phone: '+91 98450 12345', email: 'ananya@gmail.com', address: 'Lanka, Varanasi' },
      ];
      const fallbackStu = [
        { _id: 'stu_01', name: 'Neha Verma', rollNo: 'STU-101', phone: '+91 98111 22233', email: 'neha@example.com', address: 'Orderly Bazar, Varanasi', course: 'Cosmetology & Bridal Hair' },
        { _id: 'stu_02', name: 'Kavita Mehrotra', rollNo: 'STU-102', phone: '+91 98391 22334', email: 'kavita@example.com', address: 'Bhelupur, Varanasi', course: 'Master Cosmetology Diploma' },
        { _id: 'stu_03', name: 'Tanvi Sen', rollNo: 'STU-103', phone: '+91 97210 55667', email: 'tanvi@example.com', address: 'Cantt, Varanasi', course: 'Self Bridal Makeup Mastery' },
      ];
      const fallbackStaff = [
        { _id: 'staff_01', name: 'Suman Sharma', designation: 'Senior Bridal Makeup Head', phone: '+91 98765 43201', email: 'suman@blossom.com', address: 'Shivpur, Varanasi' },
        { _id: 'staff_02', name: 'Priya Patel', designation: 'Nail Art Specialist & Hair Stylist', phone: '+91 98765 43202', email: 'priya@blossom.com', address: 'Pandeypur, Varanasi' },
        { _id: 'staff_03', name: 'Rekha Maurya', designation: 'Skin Aesthetician & Spa Director', phone: '+91 98765 43203', email: 'rekha@blossom.com', address: 'Mahmoorganj, Varanasi' },
        { _id: 'staff_04', name: 'Aarti Gupta', designation: 'Draping & Mehendi Artist', phone: '+91 98765 43204', email: 'aarti@blossom.com', address: 'Durgakund, Varanasi' },
      ];

      setCustomersList(rawCust.length > 0 ? rawCust : fallbackCust);
      setStudentsList(rawStu.length > 0 ? rawStu : fallbackStu);
      setStaffList(rawStaff.length > 0 ? rawStaff : fallbackStaff);
    } catch (e) {
      console.warn('Failed to load buyers:', e.message);
    } finally {
      setLoadingBuyers(false);
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // 3. STEP-BY-STEP CHECKOUT WIZARD STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  // Strict Wizard Steps: 1: Product & Quantity Selection, 2: Buyer Selection, 3: Payment & Place Order
  const [checkoutStep, setCheckoutStep] = useState(1);

  // Visual In-Modal "+ Add More Products" Catalog Picker State
  const [isBrowsingMoreProducts, setIsBrowsingMoreProducts] = useState(false);
  const [moreProductSearch, setMoreProductSearch] = useState('');

  // Buyer Form State
  const [buyerType, setBuyerType] = useState('customer'); // 'customer' | 'student' | 'staff' | 'walkin'
  const [selectedBuyerId, setSelectedBuyerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [buyerDetailTag, setBuyerDetailTag] = useState('');

  // Create New User Account (Multi-Business) State (with Full Address)
  const [isRegisteringBuyer, setIsRegisteringBuyer] = useState(false);
  const [newBuyerForm, setNewBuyerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    roleOrId: '',
  });

  // Billing calculation states
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [attendantStaff, setAttendantStaff] = useState('Front Desk Receptionist');
  const [transactionRef, setTransactionRef] = useState('');
  const [salesNotes, setSalesNotes] = useState('');

  // Helper: Auto-Generate Realistic Transaction & Receipt References
  const generateSaleRef = (method = 'Cash') => {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    if (method.includes('UPI')) return `UPI-${dateStr}-${rand}`;
    if (method.includes('Card')) return `POS-CARD-${rand}`;
    if (method.includes('Bank')) return `IMPS-${rand}`;
    return `CASH-REC-${rand}`;
  };

  // Initiate Buy for a Product (Single Buy Button, Direct Flow)
  const handleInitiateBuy = (product) => {
    const stock = Number(product.stock) || 0;
    if (stock <= 0) {
      alert('This product is currently Out of Stock!');
      return;
    }

    // Check if product is already in bill, else add it
    const exists = cart.find(
      (item) => (item.product.id || item.product._id) === (product.id || product._id)
    );
    if (!exists) {
      handleAddToCart(product, 1);
    }

    // Start strictly at Step 1: Product & Quantity Selection
    setCheckoutStep(1);
    setIsBrowsingMoreProducts(false);
    setTransactionRef(generateSaleRef(paymentMethod));
    setCheckoutModalOpen(true);
  };

  // Open Checkout from Floating Cart
  const handleOpenCheckoutFromCart = () => {
    if (cart.length === 0) {
      alert('Please select at least one product before checking out!');
      return;
    }
    setCheckoutStep(1);
    setIsBrowsingMoreProducts(false);
    setTransactionRef(generateSaleRef(paymentMethod));
    setCheckoutModalOpen(true);
  };

  // Handle Buyer Selection from Dropdown
  const handleSelectBuyerFromDropdown = (id) => {
    setSelectedBuyerId(id);
    if (!id || id === 'WALKIN') {
      setCustomerName('Walk-in Client');
      setCustomerPhone('+91 98765 00000');
      setCustomerEmail('walkin@goldenbeauty.com');
      setCustomerAddress('Counter / In-Salon Walkin');
      setBuyerDetailTag('Counter Client');
      return;
    }

    if (buyerType === 'customer') {
      const found = customersList.find((c) => String(c._id || c.id) === String(id));
      if (found) {
        setCustomerName(found.name || '');
        setCustomerPhone(found.phone || '');
        setCustomerEmail(found.email || '');
        setCustomerAddress(formatAddressString(found.address));
        setBuyerDetailTag('Registered Salon Client');
      }
    } else if (buyerType === 'student') {
      const found = studentsList.find((s) => String(s._id || s.id) === String(id));
      if (found) {
        setCustomerName(found.name || '');
        setCustomerPhone(found.phone || '');
        setCustomerEmail(found.email || '');
        setCustomerAddress(formatAddressString(found.address));
        setBuyerDetailTag(found.rollNo ? `Student Roll: ${found.rollNo}` : 'Trainee Academy Student');
      }
    } else if (buyerType === 'staff') {
      const found = staffList.find((s) => String(s._id || s.id) === String(id));
      if (found) {
        setCustomerName(found.name || '');
        setCustomerPhone(found.phone || '');
        setCustomerEmail(found.email || '');
        setCustomerAddress(formatAddressString(found.address));
        setBuyerDetailTag(found.designation || found.role || 'Staff Member');
      }
    }
  };

  // Switch Buyer Type
  const handleBuyerTypeChange = (type) => {
    setBuyerType(type);
    setSelectedBuyerId('');
    setIsRegisteringBuyer(false);
    if (type === 'walkin') {
      setCustomerName('Walk-in Client');
      setCustomerPhone('+91 98765 00000');
      setCustomerEmail('walkin@goldenbeauty.com');
      setCustomerAddress('Counter / In-Salon Walkin');
      setBuyerDetailTag('Counter Client');
    } else {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setCustomerAddress('');
      setBuyerDetailTag('');
    }
  };

  // Create & Register New Buyer Account into DB / Storage (with Address)
  const handleCreateNewBuyer = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newBuyerForm.name.trim()) {
      alert('Please enter Full Name to create user account!');
      return;
    }
    if (!newBuyerForm.phone.trim()) {
      alert('Please enter Phone Number!');
      return;
    }

    const payload = {
      name: newBuyerForm.name.trim(),
      email: newBuyerForm.email.trim() || `${newBuyerForm.name.toLowerCase().replace(/\s+/g, '')}@goldenbeauty.com`,
      phone: newBuyerForm.phone.trim(),
      password: newBuyerForm.password.trim() || 'Client@123',
      address: newBuyerForm.address.trim() || 'Varanasi, UP',
    };

    try {
      if (buyerType === 'customer') {
        const res = await customerFetcher.create(payload).catch(() => null);
        const created = res?.data || { _id: `cust_${Date.now()}`, ...payload };
        setCustomersList((prev) => [created, ...prev]);
        setSelectedBuyerId(created._id || created.id);
        setCustomerName(created.name);
        setCustomerPhone(created.phone);
        setCustomerEmail(created.email);
        setCustomerAddress(formatAddressString(created.address));
        setBuyerDetailTag('Newly Registered Client');
      } else if (buyerType === 'student') {
        const studentPayload = { ...payload, rollNo: newBuyerForm.roleOrId || `STU-${Date.now().toString().slice(-3)}` };
        const res = await studentFetcher.create(studentPayload).catch(() => null);
        const created = res?.data || { _id: `stu_${Date.now()}`, ...studentPayload };
        setStudentsList((prev) => [created, ...prev]);
        setSelectedBuyerId(created._id || created.id);
        setCustomerName(created.name);
        setCustomerPhone(created.phone);
        setCustomerEmail(created.email);
        setCustomerAddress(formatAddressString(created.address));
        setBuyerDetailTag(`Student Roll: ${created.rollNo}`);
      } else if (buyerType === 'staff') {
        const staffPayload = { ...payload, designation: newBuyerForm.roleOrId || 'Salon Stylist' };
        const res = await staffFetcher.create(staffPayload).catch(() => null);
        const created = res?.data || { _id: `staff_${Date.now()}`, ...staffPayload };
        setStaffList((prev) => [created, ...prev]);
        setSelectedBuyerId(created._id || created.id);
        setCustomerName(created.name);
        setCustomerPhone(created.phone);
        setCustomerEmail(created.email);
        setCustomerAddress(formatAddressString(created.address));
        setBuyerDetailTag(created.designation);
      }

      setIsRegisteringBuyer(false);
      setNewBuyerForm({ name: '', email: '', password: '', phone: '', address: '', roleOrId: '' });
      if (typeof showToast === 'function') {
        showToast(`User account "${payload.name}" registered and selected!`);
      }
    } catch (err) {
      alert(`Account registration error: ${err.message}`);
    }
  };

  // Grand Total Calculations for Cart Checkout
  const checkoutCalculations = useMemo(() => {
    const subtotal = cartSubtotal;
    const discount = Math.min(subtotal, Math.max(0, Number(discountAmount) || 0));
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round((taxableAmount * (Number(taxPercent) || 0)) / 100);
    const grandTotal = Math.max(0, taxableAmount + tax);
    return { subtotal, discount, tax, grandTotal };
  }, [cartSubtotal, discountAmount, taxPercent]);

  // ════════════════════════════════════════════════════════════════════════════
  // 4. CONFIRM MULTI-PRODUCT SALE & REAL-TIME INVENTORY DEDUCTION
  // ════════════════════════════════════════════════════════════════════════════
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  // Receipt Print Format: 'A4' | 'THERMAL'
  const [receiptPrintFormat, setReceiptPrintFormat] = useState('A4');

  // Persistent Sales History State
  const [salesHistory, setSalesHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_product_sales_history');
      if (stored) return JSON.parse(stored);
      return [];
    } catch {
      return [];
    }
  });

  const handleConfirmMultiSale = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (cart.length === 0) {
      alert('Cart is empty! Please add products before placing order.');
      return;
    }

    if (!customerName.trim()) {
      alert('Please specify or select customer / buyer name.');
      setCheckoutStep(2);
      return;
    }

    // Verify stock availability for all items in cart
    for (const item of cart) {
      const currentStock = Number(item.product.stock) || 0;
      if (currentStock < item.quantity) {
        alert(`Insufficient stock for "${item.product.name}"! Available: ${currentStock}, In Order: ${item.quantity}`);
        setCheckoutStep(1);
        return;
      }
    }

    const billNumber = `GBP-BILL-${Date.now().toString().slice(-5)}`;

    // Prepare purchased line items
    const purchasedItems = cart.map((item) => ({
      productId: item.product.id || item.product._id,
      productName: item.product.name,
      productBrand: item.product.brand || 'Salon Exclusive',
      productImage: item.product.image || item.product.imageUrl || '',
      quantity: item.quantity,
      unitPrice: Number(item.product.price) || 0,
      lineTotal: (Number(item.product.price) || 0) * item.quantity,
    }));

    // 1. Create Sale Record
    const saleRecord = {
      id: `SALE-${Date.now()}`,
      billNumber,
      buyerType,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || 'N/A',
      customerEmail: customerEmail.trim() || '',
      customerAddress: formatAddressString(customerAddress).trim() || 'Varanasi, UP',
      buyerDetailTag,
      items: purchasedItems,
      totalItemsCount: cartTotalItems,
      subtotal: checkoutCalculations.subtotal,
      discountAmount: checkoutCalculations.discount,
      taxPercent: Number(taxPercent) || 0,
      grandTotal: checkoutCalculations.grandTotal,
      paymentMethod,
      transactionRef: transactionRef || generateSaleRef(paymentMethod),
      attendantStaff,
      notes: salesNotes.trim(),
      createdAt: new Date().toISOString(),
    };

    // 2. Deduct Inventory for all items in Cart
    if (typeof setProducts === 'function') {
      setProducts((prev) => {
        const updated = prev.map((p) => {
          const cartItem = cart.find((ci) => (ci.product.id || ci.product._id) === (p.id || p._id));
          if (cartItem) {
            const newStock = Math.max(0, (Number(p.stock) || 0) - cartItem.quantity);
            return { ...p, stock: newStock, stockQuantity: newStock };
          }
          return p;
        });
        try {
          localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
        } catch (e) {
          console.warn('Storage sync error:', e.message);
        }
        return updated;
      });
    }

    // 3. Save Sale Record to Persistent Sales History
    setSalesHistory((prev) => {
      const updated = [saleRecord, ...prev];
      try {
        localStorage.setItem('parlour_product_sales_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage sync error:', e.message);
      }
      return updated;
    });

    // 4. Send API Calls to Backend DB (Async Stock Out Deduction & Bill Save)
    try {
      const activeTenant = localStorage.getItem('activeTenantId') || 'blossom-salon';
      const authToken = localStorage.getItem('token') || '';
      for (const item of cart) {
        axios
          .post(
            '/api/v1/admin/inventory/sale',
            {
              productId: item.product.id || item.product._id,
              quantity: item.quantity,
              customerName: saleRecord.customerName,
              customerPhone: saleRecord.customerPhone,
              customerAddress: saleRecord.customerAddress,
              paymentMethod: saleRecord.paymentMethod,
              transactionRef: saleRecord.transactionRef,
              notes: `Bill #${billNumber} | Part of ${cart.length} items sale`,
            },
            {
              headers: {
                'X-Tenant-Id': activeTenant,
                Authorization: authToken ? `Bearer ${authToken}` : '',
              },
            }
          )
          .catch(() => {});
      }
    } catch {
      // Offline fallback already updated local inventory
    }

    // 5. Empty Cart & Open Printable Receipt Modal
    setCart([]);
    setCheckoutModalOpen(false);
    setSelectedReceipt(saleRecord);

    if (typeof showToast === 'function') {
      showToast(`Order placed successfully! Bill #${billNumber} generated and stock deducted.`);
    }
  };

  // Refund / Delete Sale (Restores all items back to stock!)
  const handleRefundMultiSale = (saleId) => {
    const sale = salesHistory.find((s) => s.id === saleId);
    if (!sale) return;

    if (
      !window.confirm(
        `Are you sure you want to refund / cancel Bill #${sale.billNumber}? All items will be restored back into stock inventory.`
      )
    ) {
      return;
    }

    // 1. Restore Inventory
    if (typeof setProducts === 'function') {
      setProducts((prev) => {
        const updated = prev.map((p) => {
          const matchingItem =
            (sale.items || []).find((it) => it.productId === (p.id || p._id)) ||
            (sale.productId && sale.productId === (p.id || p._id) ? { quantity: sale.quantity } : null);
          if (matchingItem) {
            const restoredStock = (Number(p.stock) || 0) + Number(matchingItem.quantity);
            return { ...p, stock: restoredStock, stockQuantity: restoredStock };
          }
          return p;
        });
        try {
          localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
        } catch (e) {
          console.warn('Storage sync error:', e.message);
        }
        return updated;
      });
    }

    // 2. Remove from sales history
    setSalesHistory((prev) => {
      const updated = prev.filter((s) => s.id !== saleId);
      try {
        localStorage.setItem('parlour_product_sales_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage sync error:', e.message);
      }
      return updated;
    });

    if (typeof showToast === 'function') {
      showToast(`Bill #${sale.billNumber} refunded! Items restored to inventory.`);
    }
  };

  // Extract Categories from products
  const categoriesList = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered Products Catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedStockFilter === 'IN_STOCK' && (Number(p.stock) || 0) <= 0) {
        return false;
      }
      if (selectedStockFilter === 'LOW_STOCK') {
        const stock = Number(p.stock) || 0;
        const min = Number(p.minStock) || 3;
        if (stock === 0 || stock > min) return false;
      }
      if (selectedStockFilter === 'OUT_OF_STOCK' && (Number(p.stock) || 0) > 0) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const name = (p.name || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const sku = (p.sku || p.id || '').toLowerCase();
        if (!name.includes(q) && !brand.includes(q) && !cat.includes(q) && !sku.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedStockFilter, searchTerm]);

  // Aggregated Stats
  const stats = useMemo(() => {
    const totalUnitsInStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
    const totalSalesCount = salesHistory.length;
    const totalRevenue = salesHistory.reduce((acc, s) => acc + (Number(s.grandTotal) || 0), 0);
    return {
      productsCount: products.length,
      totalUnitsInStock,
      totalSalesCount,
      totalRevenue,
    };
  }, [products, salesHistory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
      {/* ── Print Specific Styles ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-bill-root, #printable-bill-root * {
            visibility: visible !important;
          }
          #printable-bill-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ── 1. Top Luxury Header & Action Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #241434 0%, #3b0764 50%, #1e112a 100%)',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 10px 25px -5px rgba(59, 7, 100, 0.4)',
          border: '1px solid rgba(192, 132, 252, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 16px rgba(236, 72, 153, 0.35)',
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.3px' }}>
                Parlour Product Sales (POS & Billing)
              </h1>
              <span
                style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  color: '#f472b6',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(236, 72, 153, 0.35)',
                }}
              >
                SALE / RETAIL
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#c084fc', marginTop: '3px' }}>
              Step-by-step product checkout, buyer registration, inventory deduction & Thermal/A4 invoicing
            </div>
          </div>
        </div>

        {/* Tab Toggle: Catalog POS vs Sales Receipts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Active Bill / Cart Status Button */}
          {cart.length > 0 && (
            <button
              type="button"
              onClick={handleOpenCheckoutFromCart}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              }}
            >
              <ShoppingCart size={16} />
              Bill Items ({cartTotalItems}) · ₹{cartSubtotal.toLocaleString()}
            </button>
          )}

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '4px',
              borderRadius: '12px',
              display: 'flex',
              gap: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              style={{
                padding: '8px 16px',
                borderRadius: '9px',
                background: activeTab === 'catalog' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
                color: activeTab === 'catalog' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <ShoppingCart size={15} />
              Products Catalog ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              style={{
                padding: '8px 16px',
                borderRadius: '9px',
                background: activeTab === 'history' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
                color: activeTab === 'history' ? '#ffffff' : '#cbd5e1',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <FileText size={15} />
              Billing History ({salesHistory.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Top KPI Metric Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total Products in Catalog</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
            {stats.productsCount} Items
          </div>
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
            Available for direct parlour sale
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total In-Stock Units</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>
            {stats.totalUnitsInStock} Units
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
            Ready for retail sale
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total Orders Billed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#8b5cf6', marginTop: '4px' }}>
            {stats.totalSalesCount} Bills
          </div>
          <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 600, marginTop: '2px' }}>
            Customer invoices generated
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '14px 18px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total Sales Revenue</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
            Auto-synced to parlour ledger
          </div>
        </div>
      </div>

      {/* ── 3. VIEW 1: PRODUCTS CATALOG & BUY / POS ── */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Filter & Search Bar */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '14px 16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flex: 1 }}>
              {/* Search input */}
              <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search products by name, brand, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Category Filter */}
              <div style={{ minWidth: '160px' }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1e293b',
                    background: '#f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">📦 All Categories</option>
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div style={{ minWidth: '150px' }}>
                <select
                  value={selectedStockFilter}
                  onChange={(e) => setSelectedStockFilter(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1e293b',
                    background: '#f8fafc',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">🏷️ All Stock Status</option>
                  <option value="IN_STOCK">✅ In Stock Only</option>
                  <option value="LOW_STOCK">⚠️ Low Stock Only</option>
                  <option value="OUT_OF_STOCK">✕ Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== 'ALL' || selectedStockFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setSelectedStockFilter('ALL');
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: '7px',
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '50px 20px',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
                color: '#64748b',
              }}
            >
              <Box size={40} style={{ margin: '0 auto 12px', color: '#cbd5e1' }} />
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>No Products Matching Filters</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
                Try adjusting your search keyword or selected category.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              {filteredProducts.map((p) => {
                const pId = p.id || p._id;
                const stock = Number(p.stock) || 0;
                const min = Number(p.minStock) || 3;
                const isOutOfStock = stock <= 0;
                const isLowStock = !isOutOfStock && stock <= min;
                const cartItem = cart.find((item) => (item.product.id || item.product._id) === pId);
                const quantityInCart = cartItem ? cartItem.quantity : 0;

                return (
                  <div
                    key={pId}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: isOutOfStock
                        ? '1px solid #fecaca'
                        : quantityInCart > 0
                        ? '2px solid #ec4899'
                        : isLowStock
                        ? '1.5px solid #fde68a'
                        : '1px solid #e2e8f0',
                      overflow: 'hidden',
                      boxShadow: quantityInCart > 0 ? '0 8px 20px rgba(236, 72, 153, 0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {/* In Bill Indicator Ribbon */}
                    {quantityInCart > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          zIndex: 2,
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ShoppingCart size={12} /> {quantityInCart} in Bill
                      </div>
                    )}

                    {/* Product Image & Badges */}
                    <div style={{ position: 'relative', width: '100%', height: '170px', background: '#f8fafc', overflow: 'hidden' }}>
                      <img
                        src={p.image || p.imageUrl || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80';
                        }}
                      />

                      {/* Stock Status Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: isOutOfStock ? '#fee2e2' : isLowStock ? '#fef3c7' : '#ecfdf5',
                          color: isOutOfStock ? '#dc2626' : isLowStock ? '#b45309' : '#059669',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '6px',
                          border: `1px solid ${isOutOfStock ? '#fca5a5' : isLowStock ? '#fde68a' : '#a7f3d0'}`,
                        }}
                      >
                        {isOutOfStock ? '✕ Out of Stock' : isLowStock ? `⚠️ Low (${stock} left)` : `✓ ${stock} in Stock`}
                      </span>
                    </div>

                    {/* Product Info Content */}
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                            {p.brand || 'Salon Exclusive'}
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {p.category}
                          </span>
                        </div>
                        <h3
                          style={{
                            fontSize: '14.5px',
                            fontWeight: 800,
                            color: '#0f172a',
                            margin: '4px 0 6px',
                            lineHeight: '1.35',
                            minHeight: '38px',
                          }}
                        >
                          {p.name}
                        </h3>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          SKU: {p.sku || p.id || 'N/A'} {p.unit ? `· Unit: ${p.unit}` : ''}
                        </div>
                      </div>

                      {/* Price & Single Buy Action Button (Clean, No Add Button) */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '14px',
                          paddingTop: '12px',
                          borderTop: '1px solid #f1f5f9',
                          gap: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>Price</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
                            ₹{(Number(p.price) || 0).toLocaleString('en-IN')}
                          </div>
                        </div>

                        {/* SINGLE "BUY" BUTTON - Direct Purchase Flow */}
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => handleInitiateBuy(p)}
                          style={{
                            padding: '9px 20px',
                            borderRadius: '10px',
                            background: isOutOfStock
                              ? '#e2e8f0'
                              : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                            color: isOutOfStock ? '#94a3b8' : '#ffffff',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 800,
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(236, 72, 153, 0.35)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Sparkles size={14} />
                          {quantityInCart > 0 ? `Buy (${quantityInCart})` : 'Buy'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 4. VIEW 2: BILLING HISTORY & SALES RECEIPTS ── */}
      {activeTab === 'history' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Product Billing & Sales Receipts Ledger
              </h2>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Showing {salesHistory.length} total bills issued · Instant Thermal & A4 invoice printing
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Bill & Date</th>
                  <th style={{ padding: '12px 16px' }}>Buyer Details & Address</th>
                  <th style={{ padding: '12px 16px' }}>Products Sold</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Units</th>
                  <th style={{ padding: '12px 16px' }}>Grand Total</th>
                  <th style={{ padding: '12px 16px' }}>Payment Mode</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Print / Refund</th>
                </tr>
              </thead>
              <tbody>
                {salesHistory.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                      <ShoppingBag size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                      <div style={{ fontWeight: 600, color: '#475569' }}>No product sales recorded yet</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>
                        Click on "Buy" on any product in the catalog to generate an instant bill.
                      </div>
                    </td>
                  </tr>
                ) : (
                  salesHistory.map((s) => {
                    const itemsArray = Array.isArray(s.items) && s.items.length > 0 ? s.items : [{ productName: s.productName, quantity: s.quantity, unitPrice: s.unitPrice }];
                    const totalUnits = s.totalItemsCount || s.quantity || itemsArray.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);

                    return (
                      <tr
                        key={s.id}
                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Bill & Date */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{s.billNumber}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {new Date(s.createdAt).toLocaleDateString()} {new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Buyer Info */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: '#1e293b' }}>{s.customerName}</span>
                            {s.buyerType && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: s.buyerType === 'student' ? '#f0fdf4' : s.buyerType === 'staff' ? '#eff6ff' : '#fdf2f8',
                                  color: s.buyerType === 'student' ? '#16a34a' : s.buyerType === 'staff' ? '#2563eb' : '#db2777',
                                  fontWeight: 700,
                                  textTransform: 'capitalize',
                                }}
                              >
                                {s.buyerType}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{s.customerPhone}</div>
                          {s.customerAddress && (
                            <div style={{ fontSize: '10.5px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                              <MapPin size={10} /> {formatAddressString(s.customerAddress)}
                            </div>
                          )}
                        </td>

                        {/* Products Sold */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>
                            {itemsArray.map((it) => `${it.productName} (x${it.quantity})`).slice(0, 2).join(', ')}
                            {itemsArray.length > 2 ? ` +${itemsArray.length - 2} more` : ''}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            Attendant: {s.attendantStaff || 'Salon Staff'}
                          </div>
                        </td>

                        {/* Total Units */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '12px', color: '#1e293b' }}>
                            {totalUnits}
                          </span>
                        </td>

                        {/* Grand Total */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 900, color: '#047857', fontSize: '14px' }}>
                            ₹{(Number(s.grandTotal) || 0).toLocaleString('en-IN')}
                          </div>
                          {Number(s.discountAmount) > 0 && (
                            <div style={{ fontSize: '10.5px', color: '#16a34a' }}>
                              (Disc: -₹{s.discountAmount})
                            </div>
                          )}
                        </td>

                        {/* Payment Mode */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '12.5px' }}>{s.paymentMethod}</div>
                          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>Ref: {s.transactionRef || 'N/A'}</div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedReceipt(s);
                                setReceiptPrintFormat('A4');
                              }}
                              title="Print Invoice / Receipt"
                              style={{
                                padding: '5px 9px',
                                borderRadius: '6px',
                                background: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                color: '#334155',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              <Printer size={13} /> Bill
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRefundMultiSale(s.id)}
                              title="Refund & Restore Stock"
                              style={{
                                padding: '5px 8px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#dc2626',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              <RotateCcw size={12} /> Refund
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          5. STEP-BY-STEP CHECKOUT WIZARD MODAL
          Step 1: Product & Quantity Selection (+ Visual Catalog Picker for Add More Products)
          Step 2: Buyer Selection (Customer / Student / Staff / Walk-in + Register New User Account with Address)
          Step 3: Payment Mode, Discount, Tax & Place Order
          ════════════════════════════════════════════════════════════════════════ */}
      {checkoutModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCheckoutModalOpen(false);
          }}
        >
          <div
            id="retail-checkout-modal-body"
            style={{
              background: '#0f172a',
              border: '1.5px solid rgba(236, 72, 153, 0.45)',
              borderRadius: '20px',
              maxWidth: isBrowsingMoreProducts ? '840px' : '680px',
              width: '100%',
              padding: '24px 26px',
              color: '#f8fafc',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 25px rgba(236, 72, 153, 0.2)',
              maxHeight: '94vh',
              overflowY: 'auto',
              transition: 'max-width 0.2s ease',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  {!isBrowsingMoreProducts && (
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(236, 72, 153, 0.15)',
                        border: '1px solid rgba(236, 72, 153, 0.35)',
                        color: '#f472b6',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Step {checkoutStep} of 3
                    </span>
                  )}
                  <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, color: '#f8fafc' }}>
                    {isBrowsingMoreProducts && 'Select Products to Add to Bill'}
                    {!isBrowsingMoreProducts && checkoutStep === 1 && 'Products & Quantity Selection'}
                    {!isBrowsingMoreProducts && checkoutStep === 2 && 'Buyer Details & Identification'}
                    {!isBrowsingMoreProducts && checkoutStep === 3 && 'Payment & Order Placement'}
                  </h3>
                </div>
                <div style={{ fontSize: '12px', color: '#c084fc' }}>
                  Golden Beauty Parlour Retail Sales Billing & Stock Ledger
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                VIEW 1A: VISUAL PRODUCT CATALOG PICKER (WHEN "+ ADD MORE" CLICKED)
                ════════════════════════════════════════════════════════════════ */}
            {isBrowsingMoreProducts ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search parlour products by name or brand..."
                      value={moreProductSearch}
                      onChange={(e) => setMoreProductSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 34px',
                        borderRadius: '8px',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#f8fafc',
                        fontSize: '12.5px',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBrowsingMoreProducts(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    ✓ Return to Bill ({cartTotalItems} items)
                  </button>
                </div>

                {/* Catalog Grid View */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                    gap: '12px',
                    maxHeight: '440px',
                    overflowY: 'auto',
                    padding: '4px',
                  }}
                >
                  {products
                    .filter((p) => {
                      if (!moreProductSearch.trim()) return true;
                      const q = moreProductSearch.toLowerCase();
                      return (p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q);
                    })
                    .map((p) => {
                      const pId = p.id || p._id;
                      const stock = Number(p.stock) || 0;
                      const isOut = stock <= 0;
                      const cartItem = cart.find((ci) => (ci.product.id || ci.product._id) === pId);
                      const inCartQty = cartItem ? cartItem.quantity : 0;

                      return (
                        <div
                          key={pId}
                          style={{
                            background: inCartQty > 0 ? 'rgba(236, 72, 153, 0.12)' : 'rgba(30, 41, 59, 0.6)',
                            border: inCartQty > 0 ? '1.5px solid #ec4899' : '1px solid rgba(148, 163, 184, 0.15)',
                            borderRadius: '12px',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '8px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <img
                              src={p.image || p.imageUrl || ''}
                              alt=""
                              style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', background: '#334155' }}
                              onError={(e) => {
                                e.currentTarget.src =
                                  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=80';
                              }}
                            />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                                {p.brand || 'Salon Product'}
                              </div>
                              <div
                                style={{
                                  fontSize: '12.5px',
                                  fontWeight: 800,
                                  color: '#f8fafc',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {p.name}
                              </div>
                              <div style={{ fontSize: '11px', color: isOut ? '#f87171' : '#38bdf8', marginTop: '2px' }}>
                                {isOut ? '✕ Out of stock' : `Stock: ${stock}`}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: '#34d399' }}>
                              ₹{(Number(p.price) || 0).toLocaleString()}
                            </div>

                            {inCartQty > 0 ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCartQuantity(pId, inCartQty - 1)}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '5px',
                                    background: '#334155',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ fontSize: '12px', fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                                  {inCartQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddToCart(p, 1)}
                                  disabled={inCartQty >= stock}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '5px',
                                    background: '#ec4899',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: inCartQty >= stock ? 'not-allowed' : 'pointer',
                                    fontWeight: 800,
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={isOut}
                                onClick={() => handleAddToCart(p, 1)}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  background: isOut ? '#334155' : 'linear-gradient(135deg, #ec4899, #db2777)',
                                  border: 'none',
                                  color: isOut ? '#94a3b8' : '#ffffff',
                                  fontSize: '11.5px',
                                  fontWeight: 800,
                                  cursor: isOut ? 'not-allowed' : 'pointer',
                                }}
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Return Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#34d399' }}>
                    Total Selected: {cartTotalItems} items · ₹{cartSubtotal.toLocaleString('en-IN')}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBrowsingMoreProducts(false)}
                    style={{
                      padding: '9px 20px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ec4899, #db2777)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    Return to Bill Summary
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* ════════════════════════════════════════════════════════════
                    STEP 1: PRODUCT & QUANTITY SELECTION
                    ════════════════════════════════════════════════════════════ */}
                {checkoutStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderRadius: '12px',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 14px',
                          background: 'rgba(30, 41, 59, 0.8)',
                          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Box size={14} color="#ec4899" />
                          Items in this Bill ({cart.length} distinct products)
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                          Total Units: <strong style={{ color: '#fff' }}>{cartTotalItems}</strong>
                        </div>
                      </div>

                      {cart.length === 0 ? (
                        <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                          <ShoppingCart size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>No products selected yet!</div>
                          <div style={{ fontSize: '12px', marginTop: '4px' }}>Please click "+ Add More Products" to select.</div>
                        </div>
                      ) : (
                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          {cart.map((item, idx) => {
                            const p = item.product;
                            const stock = Number(p.stock) || 0;
                            const lineTotal = (Number(p.price) || 0) * item.quantity;

                            return (
                              <div
                                key={p.id || p._id || idx}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '12px 14px',
                                  borderBottom: idx === cart.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                                  gap: '10px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                  <img
                                    src={p.image || p.imageUrl || ''}
                                    alt=""
                                    style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #334155' }}
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=80';
                                    }}
                                  />
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>{p.name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                      ₹{(Number(p.price) || 0).toLocaleString()} each · In Stock: <span style={{ color: '#38bdf8' }}>{stock}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQuantity(p.id || p._id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '6px',
                                      background: 'rgba(255, 255, 255, 0.08)',
                                      border: '1px solid rgba(255, 255, 255, 0.15)',
                                      color: '#fff',
                                      fontSize: '14px',
                                      fontWeight: 800,
                                      cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                    }}
                                  >
                                    -
                                  </button>
                                  <span style={{ fontSize: '13.5px', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAddToCart(p, 1)}
                                    disabled={item.quantity >= stock}
                                    style={{
                                      width: '28px',
                                      height: '28px',
                                      borderRadius: '6px',
                                      background: item.quantity >= stock ? 'rgba(255, 255, 255, 0.05)' : '#ec4899',
                                      border: 'none',
                                      color: item.quantity >= stock ? '#64748b' : '#fff',
                                      fontSize: '14px',
                                      fontWeight: 800,
                                      cursor: item.quantity >= stock ? 'not-allowed' : 'pointer',
                                    }}
                                  >
                                    +
                                  </button>
                                </div>

                                {/* Line Total */}
                                <div style={{ minWidth: '90px', textAlign: 'right' }}>
                                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#34d399' }}>
                                    ₹{lineTotal.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                                    ({item.quantity} × ₹{(Number(p.price) || 0).toLocaleString()})
                                  </div>
                                </div>

                                {/* Remove item */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromCart(p.id || p._id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#f87171',
                                    cursor: 'pointer',
                                    padding: '4px',
                                  }}
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* "+ Add More Products" Visual Catalog Trigger (No Dropdown) */}
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.4)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px dashed rgba(236, 72, 153, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#f472b6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Plus size={14} /> Add More Products to this Bill
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                          Click below to browse and add any other cosmetic or parlour products
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsBrowsingMoreProducts(true)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 3px 10px rgba(139, 92, 246, 0.35)',
                        }}
                      >
                        <Sparkles size={13} />
                        + Browse & Add More Products
                      </button>
                    </div>

                    {/* Step 1 Subtotal Summary Banner */}
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: '#a7f3d0', fontWeight: 700 }}>
                        Current Bill Subtotal ({cartTotalItems} items):
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399' }}>
                        ₹{cartSubtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Step 1 Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => setCheckoutModalOpen(false)}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#cbd5e1',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        disabled={cart.length === 0}
                        onClick={() => {
                          setCheckoutStep(2);
                          document.getElementById('retail-checkout-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '10px 22px',
                          borderRadius: '8px',
                          background: cart.length === 0 ? '#475569' : 'linear-gradient(135deg, #ec4899, #db2777)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 800,
                          cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                        }}
                      >
                        Continue to Buyer Details
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP 2: BUYER SELECTION (CUSTOMER / STUDENT / STAFF / WALKIN)
                    + INLINE CREATE NEW USER ACCOUNT (MULTI-BUSINESS) WITH ADDRESS
                    ════════════════════════════════════════════════════════════ */}
                {checkoutStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.45)',
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(148, 163, 184, 0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 800, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <User size={14} color="#ec4899" />
                          Buyer Selection (Who is purchasing?) <span style={{ color: '#ec4899' }}>*</span>
                        </label>

                        {/* Toggle Create New User Account / Client */}
                        <button
                          type="button"
                          onClick={() => setIsRegisteringBuyer(!isRegisteringBuyer)}
                          style={{
                            background: isRegisteringBuyer ? 'rgba(239, 68, 68, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                            border: `1px solid ${isRegisteringBuyer ? '#ef4444' : '#ec4899'}`,
                            color: isRegisteringBuyer ? '#f87171' : '#f472b6',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            padding: '4px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <UserPlus size={13} />
                          {isRegisteringBuyer ? 'Close Account Form' : '+ Register New Buyer Account'}
                        </button>
                      </div>

                      {/* Buyer Type Category Tabs */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '12px' }}>
                        {[
                          { key: 'customer', label: '👤 Client', count: customersList.length },
                          { key: 'student', label: '🎓 Student', count: studentsList.length },
                          { key: 'staff', label: '✂️ Staff', count: staffList.length },
                          { key: 'walkin', label: '🚶 Walk-in', count: null },
                        ].map((tab) => {
                          const isSelected = buyerType === tab.key;
                          return (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() => handleBuyerTypeChange(tab.key)}
                              style={{
                                padding: '7px 8px',
                                borderRadius: '8px',
                                background: isSelected ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'rgba(255, 255, 255, 0.06)',
                                border: `1px solid ${isSelected ? '#ec4899' : 'rgba(255, 255, 255, 0.1)'}`,
                                color: isSelected ? '#ffffff' : '#cbd5e1',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {tab.label} {tab.count !== null ? `(${tab.count})` : ''}
                            </button>
                          );
                        })}
                      </div>

                      {/* Form: Create New User Account (Multi-Business) with Address */}
                      {isRegisteringBuyer ? (
                        <div
                          style={{
                            background: 'rgba(15, 23, 42, 0.92)',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1.5px solid rgba(236, 72, 153, 0.45)',
                            marginBottom: '14px',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Key size={16} color="#ec4899" />
                            <h4 style={{ fontSize: '13.5px', fontWeight: 900, color: '#f472b6', margin: 0 }}>
                              Create New User Account (Multi-Business)
                            </h4>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                Full Name <span style={{ color: '#ec4899' }}>*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Priya Sharma"
                                value={newBuyerForm.name}
                                onChange={(e) => setNewBuyerForm({ ...newBuyerForm, name: e.target.value })}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  background: '#1e293b',
                                  border: '1px solid #334155',
                                  color: '#f8fafc',
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                Email Address <span style={{ color: '#ec4899' }}>*</span>
                              </label>
                              <input
                                type="email"
                                required
                                placeholder="priya@kashiservice.com"
                                value={newBuyerForm.email}
                                onChange={(e) => setNewBuyerForm({ ...newBuyerForm, email: e.target.value })}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  background: '#1e293b',
                                  border: '1px solid #334155',
                                  color: '#f8fafc',
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                Initial Account Password <span style={{ color: '#ec4899' }}>*</span>
                              </label>
                              <input
                                type="password"
                                required
                                placeholder="•••••••• (Default: Client@123)"
                                value={newBuyerForm.password}
                                onChange={(e) => setNewBuyerForm({ ...newBuyerForm, password: e.target.value })}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  background: '#1e293b',
                                  border: '1px solid #334155',
                                  color: '#f8fafc',
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                Phone Number <span style={{ color: '#ec4899' }}>*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="+91 98765 43210"
                                value={newBuyerForm.phone}
                                onChange={(e) => setNewBuyerForm({ ...newBuyerForm, phone: e.target.value })}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  background: '#1e293b',
                                  border: '1px solid #334155',
                                  color: '#f8fafc',
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            {/* Address / Location Field */}
                            <div style={{ gridColumn: 'span 2' }}>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                                Complete Address / Location
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. B-12/45, Rathyatra Crossing, Mahmoorganj, Varanasi - 221010"
                                value={newBuyerForm.address}
                                onChange={(e) => setNewBuyerForm({ ...newBuyerForm, address: e.target.value })}
                                style={{
                                  width: '100%',
                                  padding: '8px 10px',
                                  borderRadius: '6px',
                                  background: '#1e293b',
                                  border: '1px solid #334155',
                                  color: '#f8fafc',
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setIsRegisteringBuyer(false)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                background: '#334155',
                                border: 'none',
                                color: '#cbd5e1',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCreateNewBuyer}
                              style={{
                                padding: '6px 16px',
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                            >
                              ✓ Create & Auto-Select Buyer
                            </button>
                          </div>
                        </div>
                      ) : (
                        buyerType !== 'walkin' && (
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                              Select from Existing {buyerType === 'student' ? 'Students' : buyerType === 'staff' ? 'Staff' : 'Clients'}
                            </label>
                            <select
                              value={selectedBuyerId}
                              onChange={(e) => handleSelectBuyerFromDropdown(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '8px',
                                background: '#1e293b',
                                border: '1px solid #334155',
                                color: '#f8fafc',
                                fontSize: '13px',
                                fontWeight: 600,
                                outline: 'none',
                              }}
                            >
                              <option value="">
                                -- Choose {buyerType === 'student' ? 'Student' : buyerType === 'staff' ? 'Staff Member' : 'Client'} --
                              </option>
                              {buyerType === 'customer' &&
                                customersList.map((c) => (
                                  <option key={c._id || c.id} value={c._id || c.id}>
                                    {c.name} ({c.phone || c.email || 'Client'}) {formatAddressString(c.address) ? `· ${formatAddressString(c.address)}` : ''}
                                  </option>
                                ))}
                              {buyerType === 'student' &&
                                studentsList.map((s) => (
                                  <option key={s._id || s.id} value={s._id || s.id}>
                                    {s.name} · {s.rollNo || 'STU'} ({s.phone || 'Student'})
                                  </option>
                                ))}
                              {buyerType === 'staff' &&
                                staffList.map((st) => (
                                  <option key={st._id || st.id} value={st._id || st.id}>
                                    {st.name} · {st.designation || 'Staff'} ({st.phone || 'Active'})
                                  </option>
                                ))}
                            </select>
                          </div>
                        )
                      )}

                      {/* Selected Buyer Details Preview */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                            Buyer Full Name <span style={{ color: '#ec4899' }}>*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="e.g. Priya Sharma or Walk-in"
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: '#0f172a',
                              border: '1px solid #334155',
                              color: '#f8fafc',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              outline: 'none',
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                            Phone Number (For WhatsApp Invoice)
                          </label>
                          <input
                            type="text"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              background: '#0f172a',
                              border: '1px solid #334155',
                              color: '#f8fafc',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              outline: 'none',
                            }}
                          />
                        </div>
                      </div>

                      {/* Address / Location on Bill */}
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                          Customer Address / City (Printed on Bill)
                        </label>
                        <input
                          type="text"
                          value={formatAddressString(customerAddress)}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="e.g. Mahmoorganj, Varanasi - 221010"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#0f172a',
                            border: '1px solid #334155',
                            color: '#f8fafc',
                            fontSize: '12.5px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Step 2 Action Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutStep(1);
                          document.getElementById('retail-checkout-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#cbd5e1',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <ArrowLeft size={14} />
                        Back to Products
                      </button>

                      <button
                        type="button"
                        disabled={!customerName.trim()}
                        onClick={() => {
                          setCheckoutStep(3);
                          document.getElementById('retail-checkout-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '10px 22px',
                          borderRadius: '8px',
                          background: !customerName.trim() ? '#475569' : 'linear-gradient(135deg, #ec4899, #db2777)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: 800,
                          cursor: !customerName.trim() ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                        }}
                      >
                        Continue to Payment & Order
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* ════════════════════════════════════════════════════════════
                    STEP 3: PAYMENT MODE, DISCOUNT, TAX & PLACE ORDER
                    ════════════════════════════════════════════════════════════ */}
                {checkoutStep === 3 && (
                  <form onSubmit={handleConfirmMultiSale} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Order Summary Pill */}
                    <div
                      style={{
                        background: 'rgba(30, 41, 59, 0.45)',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.15)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Order Summary:</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc' }}>
                          {cartTotalItems} items ({cart.length} distinct products)
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Billed To:</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#f472b6' }}>
                          {customerName} ({customerPhone || 'Counter'})
                        </div>
                        {customerAddress && (
                          <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{formatAddressString(customerAddress)}</div>
                        )}
                      </div>
                    </div>

                    {/* Pricing, Discount & Taxes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                          Discount on Total Bill (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={checkoutCalculations.subtotal}
                          value={discountAmount}
                          onChange={(e) => setDiscountAmount(e.target.value)}
                          placeholder="0"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#4ade80',
                            fontSize: '13px',
                            fontWeight: 700,
                            outline: 'none',
                          }}
                        />
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {[50, 100, 250, 500].map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => setDiscountAmount(amt)}
                              style={{
                                padding: '2px 5px',
                                borderRadius: '4px',
                                background: 'rgba(74, 222, 128, 0.1)',
                                border: '1px solid rgba(74, 222, 128, 0.25)',
                                color: '#4ade80',
                                fontSize: '9.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              ₹{amt} off
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                          Tax / GST (%)
                        </label>
                        <select
                          value={taxPercent}
                          onChange={(e) => setTaxPercent(Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#f8fafc',
                            fontSize: '13px',
                            fontWeight: 600,
                            outline: 'none',
                          }}
                        >
                          <option value={0}>No Tax (0%)</option>
                          <option value={5}>GST 5%</option>
                          <option value={12}>GST 12%</option>
                          <option value={18}>GST 18%</option>
                        </select>
                      </div>
                    </div>

                    {/* Grand Total Highlight Banner */}
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                        border: '1.5px solid rgba(16, 185, 129, 0.45)',
                        borderRadius: '12px',
                        padding: '12px 18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '11.5px', color: '#a7f3d0', fontWeight: 700 }}>
                          TOTAL BILL AMOUNT PAYABLE ({cartTotalItems} Units):
                        </div>
                        <div style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '2px' }}>
                          ₹{checkoutCalculations.subtotal} (Subtotal) - ₹{checkoutCalculations.discount} (Disc) + ₹{checkoutCalculations.tax} (Tax)
                        </div>
                      </div>
                      <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#34d399' }}>
                        ₹{checkoutCalculations.grandTotal.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Payment Mode & Reference */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                          Payment Mode <span style={{ color: '#ec4899' }}>*</span>
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => {
                            const m = e.target.value;
                            setPaymentMethod(m);
                            setTransactionRef(generateSaleRef(m));
                          }}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#f8fafc',
                            fontSize: '13px',
                            fontWeight: 600,
                            outline: 'none',
                          }}
                        >
                          <option value="Cash">💵 Cash at Counter</option>
                          <option value="UPI (GPay / PhonePe / Paytm)">📱 UPI (GPay / PhonePe / Paytm)</option>
                          <option value="Card (Debit / Credit POS)">💳 Card (Debit / Credit POS)</option>
                          <option value="Bank Transfer (IMPS)">🏦 Bank Transfer (IMPS)</option>
                        </select>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>
                            Bill / Receipt Ref
                          </label>
                          <button
                            type="button"
                            onClick={() => setTransactionRef(generateSaleRef(paymentMethod))}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ec4899',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              padding: 0,
                            }}
                          >
                            <RefreshCw size={11} /> Regen
                          </button>
                        </div>
                        <input
                          type="text"
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid rgba(236, 72, 153, 0.4)',
                            color: '#f8fafc',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Attendant Staff / Notes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                          Sales Attendant
                        </label>
                        <select
                          value={attendantStaff}
                          onChange={(e) => setAttendantStaff(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#f8fafc',
                            fontSize: '12.5px',
                            outline: 'none',
                          }}
                        >
                          <option value="Front Desk Receptionist">Front Desk Receptionist</option>
                          <option value="Salon Manager">Salon Manager</option>
                          {staffList.map((st) => (
                            <option key={st._id || st.id} value={st.name}>
                              {st.name} ({st.designation || 'Staff'})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '5px' }}>
                          Disbursement / Sales Notes (Optional)
                        </label>
                        <input
                          type="text"
                          value={salesNotes}
                          onChange={(e) => setSalesNotes(e.target.value)}
                          placeholder="e.g. Bridal kit purchase or counter walk-in"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#f8fafc',
                            fontSize: '12.5px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Step 3 Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px',
                        paddingTop: '14px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutStep(2);
                          document.getElementById('retail-checkout-modal-body')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#cbd5e1',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <ArrowLeft size={14} />
                        Back to Buyer
                      </button>

                      <button
                        type="submit"
                        style={{
                          padding: '10px 24px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                        }}
                      >
                        <CheckCircle2 size={16} />
                        Confirm & Place Order (₹{checkoutCalculations.grandTotal.toLocaleString('en-IN')})
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          6. MODAL: PRINTABLE BILL / RECEIPT (THERMAL 80MM & A4 FORMAT SWITCHER)
          ════════════════════════════════════════════════════════════════════════ */}
      {selectedReceipt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: receiptPrintFormat === 'THERMAL' ? '420px' : '650px',
              width: '100%',
              padding: '24px',
              color: '#0f172a',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              maxHeight: '94vh',
              overflowY: 'auto',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Top Toolbar (No-Print) */}
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              {/* Thermal vs A4 Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setReceiptPrintFormat('A4')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    background: receiptPrintFormat === 'A4' ? '#ffffff' : 'transparent',
                    border: 'none',
                    color: receiptPrintFormat === 'A4' ? '#0f172a' : '#64748b',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: receiptPrintFormat === 'A4' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  📄 Standard A4
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptPrintFormat('THERMAL')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    background: receiptPrintFormat === 'THERMAL' ? '#ffffff' : 'transparent',
                    border: 'none',
                    color: receiptPrintFormat === 'THERMAL' ? '#0f172a' : '#64748b',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: receiptPrintFormat === 'THERMAL' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  🧾 Thermal (80mm)
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Printer size={13} />
                  Print ({receiptPrintFormat})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* ── PRINTABLE BILL ROOT CONTAINER ── */}
            <div id="printable-bill-root">
              {receiptPrintFormat === 'THERMAL' ? (
                /* ════ THERMAL 80MM RECEIPT FORMAT ════ */
                <div style={{ fontFamily: 'monospace', fontSize: '11.5px', color: '#000000', lineHeight: '1.4' }}>
                  <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 900 }}>GOLDEN BEAUTY PARLOUR</div>
                    <div style={{ fontSize: '11px' }}>& BRIDAL ACADEMY</div>
                    <div style={{ fontSize: '10px', color: '#333' }}>Mahmoorganj Road, Varanasi</div>
                    <div style={{ fontSize: '10px', color: '#333' }}>Phone: +91 98765 43210</div>
                    <div style={{ fontSize: '10px', color: '#333' }}>GSTIN: 09AAACG1234F1Z5</div>
                  </div>

                  <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', margin: '6px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Bill: {selectedReceipt.billNumber}</span>
                      <span>{new Date(selectedReceipt.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Buyer: {selectedReceipt.customerName}</span>
                      <span>{selectedReceipt.customerPhone}</span>
                    </div>
                    {selectedReceipt.customerAddress && (
                      <div style={{ fontSize: '10px' }}>Address: {formatAddressString(selectedReceipt.customerAddress)}</div>
                    )}
                    <div style={{ fontSize: '10px' }}>Mode: {selectedReceipt.paymentMethod}</div>
                  </div>

                  {/* Items */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', margin: '6px 0' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #000', textAlign: 'left' }}>
                        <th style={{ padding: '3px 0' }}>Item</th>
                        <th style={{ padding: '3px 0', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '3px 0', textAlign: 'right' }}>Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedReceipt.items || []).map((it, i) => (
                        <tr key={i} style={{ borderBottom: '1px dotted #ccc' }}>
                          <td style={{ padding: '3px 0' }}>
                            <div>{it.productName}</div>
                            <div style={{ fontSize: '9px', color: '#555' }}>₹{it.unitPrice} each</div>
                          </td>
                          <td style={{ padding: '3px 0', textAlign: 'center' }}>{it.quantity}</td>
                          <td style={{ padding: '3px 0', textAlign: 'right', fontWeight: 'bold' }}>
                            ₹{it.lineTotal || it.quantity * it.unitPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div style={{ borderTop: '1px dashed #000', paddingTop: '6px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Subtotal:</span>
                      <span>₹{selectedReceipt.subtotal}</span>
                    </div>
                    {Number(selectedReceipt.discountAmount) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Discount:</span>
                        <span>-₹{selectedReceipt.discountAmount}</span>
                      </div>
                    )}
                    {Number(selectedReceipt.taxPercent) > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>GST ({selectedReceipt.taxPercent}%):</span>
                        <span>
                          +₹{Math.round((((Number(selectedReceipt.subtotal) || 0) - (Number(selectedReceipt.discountAmount) || 0)) * selectedReceipt.taxPercent) / 100)}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: 900,
                        fontSize: '14px',
                        borderTop: '1px double #000',
                        borderBottom: '1px double #000',
                        padding: '4px 0',
                        marginTop: '4px',
                      }}
                    >
                      <span>NET AMOUNT:</span>
                      <span>₹{(Number(selectedReceipt.grandTotal) || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px' }}>
                    <div>Ref: {selectedReceipt.transactionRef}</div>
                    <div style={{ fontWeight: 'bold', margin: '4px 0' }}>*** FULLY PAID ***</div>
                    <div>Thank you for visiting Golden Beauty!</div>
                  </div>
                </div>
              ) : (
                /* ════ STANDARD A4 TAX INVOICE FORMAT ════ */
                <div style={{ fontFamily: 'sans-serif' }}>
                  {/* Bill Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #ec4899', paddingBottom: '14px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '26px' }}>💄</span>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#831843', margin: 0 }}>
                          Golden Beauty Parlour & Academy
                        </h2>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '3px' }}>
                        Luxury Salon, Spa & Professional Cosmetology Academy · Varanasi, UP
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Phone: +91 98765 43210 · GSTIN: 09AAACG1234F1Z5
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: '#fdf2f8', color: '#db2777', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #fbcfe8' }}>
                        RETAIL TAX INVOICE
                      </span>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                        {selectedReceipt.billNumber}
                      </div>
                    </div>
                  </div>

                  {/* Buyer & Bill Details with Address */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Billed To:</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>{selectedReceipt.customerName}</div>
                        {selectedReceipt.buyerType && (
                          <span style={{ fontSize: '10px', background: '#ecfdf5', color: '#059669', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, textTransform: 'capitalize' }}>
                            {selectedReceipt.buyerType}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {selectedReceipt.customerPhone} {selectedReceipt.buyerDetailTag ? `· ${selectedReceipt.buyerDetailTag}` : ''}
                      </div>
                      {selectedReceipt.customerAddress && (
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} color="#64748b" />
                          <span>Address: {formatAddressString(selectedReceipt.customerAddress)}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Date & Time:</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                        {new Date(selectedReceipt.createdAt).toLocaleDateString()} {new Date(selectedReceipt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Payment Mode: <strong>{selectedReceipt.paymentMethod}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '12.5px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>
                        <th style={{ padding: '8px 10px' }}>#</th>
                        <th style={{ padding: '8px 10px' }}>Item Description</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate (₹)</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedReceipt.items || []).map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{i + 1}</td>
                          <td style={{ padding: '8px 10px', fontWeight: 700, color: '#0f172a' }}>
                            {item.productName}
                            {item.productBrand && (
                              <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 400 }}>
                                Brand: {item.productBrand}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right' }}>₹{(Number(item.unitPrice) || 0).toLocaleString()}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                            ₹{(Number(item.lineTotal || item.unitPrice * item.quantity) || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}

                      {/* Subtotal */}
                      <tr style={{ borderTop: '1px solid #cbd5e1' }}>
                        <td colSpan="4" style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>Subtotal:</td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontWeight: 700 }}>₹{(Number(selectedReceipt.subtotal) || 0).toLocaleString()}</td>
                      </tr>

                      {Number(selectedReceipt.discountAmount) > 0 && (
                        <tr>
                          <td colSpan="4" style={{ padding: '4px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>Discount:</td>
                          <td style={{ padding: '4px 10px', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>-₹{selectedReceipt.discountAmount}</td>
                        </tr>
                      )}

                      {Number(selectedReceipt.taxPercent) > 0 && (
                        <tr>
                          <td colSpan="4" style={{ padding: '4px 10px', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>GST ({selectedReceipt.taxPercent}%):</td>
                          <td style={{ padding: '4px 10px', textAlign: 'right', fontWeight: 700 }}>
                            +₹{Math.round((((Number(selectedReceipt.subtotal) || 0) - (Number(selectedReceipt.discountAmount) || 0)) * selectedReceipt.taxPercent) / 100)}
                          </td>
                        </tr>
                      )}

                      <tr style={{ background: '#fdf2f8', borderTop: '2px solid #f472b6' }}>
                        <td colSpan="4" style={{ padding: '10px', fontWeight: 900, color: '#831843', fontSize: '13.5px', textAlign: 'right' }}>
                          Grand Total Paid:
                        </td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, color: '#831843', fontSize: '15px' }}>
                          ₹{(Number(selectedReceipt.grandTotal) || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Sign & Stamp */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                    <div>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Ref: {selectedReceipt.transactionRef}</div>
                      <div style={{ fontSize: '10.5px', color: '#16a34a', fontWeight: 700 }}>✓ Payment Status: FULLY PAID</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>Golden Beauty Parlour</div>
                      <div style={{ fontSize: '9.5px', color: '#94a3b8' }}>Authorized Signatory</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParlourProductSalesManager;
