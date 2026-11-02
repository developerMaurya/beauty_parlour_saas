/**
 * @file InventorySuppliersPage.jsx
 * @description Salon Retail Products, Professional Consumables, Stock Movements, and Suppliers.
 * Conforms to Section 42.
 * @module frontend/src/modules/admin/pages/InventorySuppliersPage
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Truck,
  Layers,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  productFetcher,
  inventoryFetcher,
  supplierFetcher,
  purchaseFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const InventorySuppliersPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'lowstock' | 'suppliers'

  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState(null);
  const [stockActionType, setStockActionType] = useState('IN'); // 'IN' | 'OUT'

  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pRes, lowRes, sRes, bRes] = await Promise.all([
        productFetcher.list({ branchId: selectedBranchId || undefined }),
        inventoryFetcher.getLowStock({ branchId: selectedBranchId || undefined }),
        supplierFetcher.list(),
        branchFetcher.list(),
      ]);
      setProducts(pRes.data || []);
      setLowStockProducts(lowRes.data || []);
      setSuppliers(sRes.data || []);
      setBranches(bRes.data || []);
    } catch (err) {
      toast.error('Failed to load inventory data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBranchId]);

  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) {
        await productFetcher.update(editingProduct._id, data);
        toast.success('Product updated');
      } else {
        await productFetcher.create(data);
        toast.success('Product cataloged');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleStockAction = async (data) => {
    try {
      const payload = {
        productId: selectedProductForStock._id,
        quantity: Number(data.quantity),
        reason: data.reason,
      };

      if (stockActionType === 'IN') {
        await inventoryFetcher.stockIn(payload);
        toast.success('Stock-In replenishment logged');
      } else {
        await inventoryFetcher.stockOut(payload);
        toast.success('Stock-Out logged');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to record stock movement');
    }
  };

  const handleSaveSupplier = async (data) => {
    try {
      if (editingSupplier) {
        await supplierFetcher.update(editingSupplier._id, data);
        toast.success('Supplier updated');
      } else {
        await supplierFetcher.create(data);
        toast.success('Supplier registered');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save supplier');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productFetcher.delete(id);
      toast.success('Product deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete product');
    }
  };

  const productFields = [
    { name: 'name', label: 'Product Name', required: true, placeholder: 'e.g. L’Oréal Mythic Hair Oil, MAC Studio Fix' },
    { name: 'sku', label: 'SKU / Barcode', placeholder: 'SKU-8821' },
    { name: 'category', label: 'Product Category', placeholder: 'e.g. Hair Care, Makeup, Consumables' },
    { name: 'price', label: 'Retail Price (₹)', type: 'currency', required: true },
    { name: 'costPrice', label: 'Purchase / Cost Price (₹)', type: 'currency' },
    { name: 'stockQuantity', label: 'Initial Stock Quantity', type: 'number', defaultValue: 10 },
    { name: 'minStockThreshold', label: 'Low Stock Alert Threshold', type: 'number', defaultValue: 5 },
    {
      name: 'branch',
      label: 'Store / Salon Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    { name: 'description', label: 'Usage / Product Description', type: 'textarea', span: 2 },
  ];

  const stockFields = [
    { name: 'quantity', label: `${stockActionType === 'IN' ? 'Replenishment' : 'Deduction'} Quantity`, type: 'number', required: true, placeholder: '10' },
    { name: 'reason', label: 'Reason / Supplier Invoice Ref', placeholder: stockActionType === 'IN' ? 'Purchase order #102' : 'Salon internal consumption' },
  ];

  const supplierFields = [
    { name: 'name', label: 'Supplier / Vendor Name', required: true, placeholder: 'e.g. Beauty Care Wholesale Traders' },
    { name: 'contactPerson', label: 'Contact Person', placeholder: 'e.g. Ramesh Kumar' },
    { name: 'phone', label: 'Phone Number', placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Vendor Address', type: 'textarea' },
  ];

  const productColumns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            SKU: {row.sku || 'N/A'} · Category: {row.category || 'General'}
          </div>
        </div>
      ),
    },
    {
      header: 'Retail Price',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10b981' }}>
          ₹{(row.price || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Available Stock',
      render: (row) => {
        const isLow = (row.stockQuantity || 0) <= (row.minStockThreshold || 5);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontWeight: 800,
                color: isLow ? '#ef4444' : 'var(--text-primary)',
              }}
            >
              {row.stockQuantity || 0} units
            </span>
            {isLow && (
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
                Low Stock
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Stock Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setSelectedProductForStock(row);
              setStockActionType('IN');
              setStockModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Stock In (+)"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" /> In
          </button>
          <button
            onClick={() => {
              setSelectedProductForStock(row);
              setStockActionType('OUT');
              setStockModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Stock Out (-)"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" /> Out
          </button>
        </div>
      ),
    },
    {
      header: 'Manage',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setEditingProduct(row);
              setProductModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteProduct(row._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const supplierColumns = [
    {
      header: 'Supplier',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.contactPerson}</div>
        </div>
      ),
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setEditingSupplier(row);
              setSupplierModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Products & Inventory Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage retail beauty products, in-salon consumables, stock movements, and suppliers
          </p>
        </div>
        <div>
          {activeTab !== 'suppliers' ? (
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingSupplier(null);
                setSupplierModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Add Supplier
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Package className="w-4 h-4" /> All Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('lowstock')}
          className={`btn ${activeTab === 'lowstock' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: lowStockProducts.length > 0 ? '#ef4444' : undefined }}
        >
          <AlertTriangle className="w-4 h-4" /> Low Stock Alerts ({lowStockProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`btn ${activeTab === 'suppliers' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Truck className="w-4 h-4" /> Suppliers & Vendors
        </button>
      </div>

      {activeTab === 'suppliers' ? (
        <DataTable
          columns={supplierColumns}
          data={suppliers}
          isLoading={isLoading}
          searchPlaceholder="Search suppliers..."
        />
      ) : (
        <DataTable
          columns={productColumns}
          data={activeTab === 'lowstock' ? lowStockProducts : products}
          isLoading={isLoading}
          searchPlaceholder="Search products by name, SKU..."
        />
      )}

      <FormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        fields={productFields}
        initialData={editingProduct || {}}
        onSubmit={handleSaveProduct}
        size="large"
      />

      <FormModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title={`Record Stock ${stockActionType}: ${selectedProductForStock?.name || ''}`}
        fields={stockFields}
        onSubmit={handleStockAction}
        submitText={`Confirm Stock-${stockActionType}`}
      />

      <FormModal
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Register New Supplier'}
        fields={supplierFields}
        initialData={editingSupplier || {}}
        onSubmit={handleSaveSupplier}
      />
    </div>
  );
};

export default InventorySuppliersPage;
