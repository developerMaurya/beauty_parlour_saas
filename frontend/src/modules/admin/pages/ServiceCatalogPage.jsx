/**
 * @file ServiceCatalogPage.jsx
 * @description Dynamic Service Management: Categories, Subcategories, Services, Options, and Add-ons.
 * Conforms to Sections 20, 21, 22, 23, 24, 25, 26 (NO hardcoded services).
 * @module frontend/src/modules/admin/pages/ServiceCatalogPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, Scissors, Layers, PlusCircle, CheckCircle } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  serviceCategoryFetcher,
  serviceSubcategoryFetcher,
  serviceFetcher,
  serviceOptionFetcher,
  serviceAddonFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const ServiceCatalogPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'categories' | 'subcategories'

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [subcatModalOpen, setSubcatModalOpen] = useState(false);
  const [editingSubcat, setEditingSubcat] = useState(null);

  // Options / Variants Modal
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedServiceForOption, setSelectedServiceForOption] = useState(null);

  // Add-ons Modal
  const [addonModalOpen, setAddonModalOpen] = useState(false);
  const [selectedServiceForAddon, setSelectedServiceForAddon] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        serviceCategoryFetcher.list(),
        serviceSubcategoryFetcher.list(),
      ]);
      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);

      if (activeTab === 'services') {
        const sRes = await serviceFetcher.list({ branchId: selectedBranchId || undefined });
        setServices(sRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load service catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBranchId]);

  const handleSaveService = async (data) => {
    try {
      if (editingService) {
        await serviceFetcher.update(editingService._id, data);
        toast.success('Service updated');
      } else {
        await serviceFetcher.create(data);
        toast.success('New service created');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDuplicateService = async (serviceId) => {
    try {
      await serviceFetcher.duplicate(serviceId);
      toast.success('Service duplicated');
      loadData();
    } catch (err) {
      toast.error('Failed to duplicate service');
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        await serviceCategoryFetcher.update(editingCategory._id, data);
        toast.success('Category updated');
      } else {
        await serviceCategoryFetcher.create(data);
        toast.success('Category created');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleSaveSubcategory = async (data) => {
    try {
      if (editingSubcat) {
        await serviceSubcategoryFetcher.update(editingSubcat._id, data);
        toast.success('Subcategory updated');
      } else {
        await serviceSubcategoryFetcher.create(data);
        toast.success('Subcategory created');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save subcategory');
    }
  };

  const handleAddOption = async (data) => {
    try {
      await serviceOptionFetcher.create(selectedServiceForOption._id, data);
      toast.success('Service variant added');
      loadData();
    } catch (err) {
      toast.error('Could not add option variant');
    }
  };

  const handleAddAddon = async (data) => {
    try {
      await serviceAddonFetcher.create(selectedServiceForAddon._id, data);
      toast.success('Add-on created');
      loadData();
    } catch (err) {
      toast.error('Could not create add-on');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await serviceFetcher.delete(id);
      toast.success('Service deleted');
      loadData();
    } catch (err) {
      toast.error('Could not delete service');
    }
  };

  const serviceFields = [
    { name: 'name', label: 'Service Name', required: true, placeholder: 'e.g. Bridal HD Airbrush Makeup, Layer Cut' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: categories.map((c) => ({ label: c.name, value: c._id })),
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      type: 'select',
      options: subcategories.map((s) => ({ label: s.name, value: s._id })),
    },
    { name: 'duration', label: 'Duration (Minutes)', type: 'number', required: true, placeholder: '45' },
    { name: 'price', label: 'Base Price (₹)', type: 'currency', required: true },
    { name: 'discount', label: 'Discount Amount (₹)', type: 'currency' },
    {
      name: 'gender',
      label: 'Target Client Gender',
      type: 'select',
      options: [
        { label: 'All / Unisex', value: 'unisex' },
        { label: 'Female Only', value: 'female' },
        { label: 'Male Only', value: 'male' },
        { label: 'Kids', value: 'kids' },
      ],
    },
    { name: 'homeServiceAllowed', label: 'Allow Home Service Dispatch', type: 'switch', defaultValue: true },
    { name: 'description', label: 'Service Details & Steps', type: 'textarea', span: 2 },
  ];

  const catFields = [
    { name: 'name', label: 'Category Name', required: true, placeholder: 'e.g. Salon, Makeup, Massage, Hair, Spa' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  const subcatFields = [
    { name: 'name', label: 'Subcategory Name', required: true, placeholder: 'e.g. Hair Cut, Facial, Hair Color' },
    {
      name: 'category',
      label: 'Parent Category',
      type: 'select',
      required: true,
      options: categories.map((c) => ({ label: c.name, value: c._id })),
    },
  ];

  const optionFields = [
    { name: 'name', label: 'Option / Variant Name', required: true, placeholder: 'e.g. U Cut, V Cut, Step Cut, HD Finish' },
    { name: 'price', label: 'Variant Price (₹)', type: 'currency', required: true },
    { name: 'duration', label: 'Variant Duration (Mins)', type: 'number' },
  ];

  const addonFields = [
    { name: 'name', label: 'Add-on Name', required: true, placeholder: 'e.g. Hair Spa, Keratin Ampoule, Gold Mask' },
    { name: 'price', label: 'Add-on Price (₹)', type: 'currency', required: true },
    { name: 'duration', label: 'Additional Time (Mins)', type: 'number', placeholder: '15' },
  ];

  const serviceColumns = [
    {
      header: 'Service',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.category?.name || 'General'} · {row.duration} mins
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10b981' }}>
          ₹{(row.price || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Options & Add-ons',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => {
              setSelectedServiceForOption(row);
              setOptionModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Manage Variants (U Cut, V Cut)"
          >
            + Option ({row.options?.length || 0})
          </button>
          <button
            onClick={() => {
              setSelectedServiceForAddon(row);
              setAddonModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Manage Add-ons (Hair Wash, Spa)"
          >
            + Add-on ({row.addons?.length || 0})
          </button>
        </div>
      ),
    },
    {
      header: 'Home Service',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: row.homeServiceAllowed ? '#10b981' : 'var(--text-muted)' }}>
          {row.homeServiceAllowed ? 'Allowed' : 'Salon Only'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => handleDuplicateService(row._id)}
            className="btn btn-secondary btn-sm"
            title="Duplicate Service"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingService(row);
              setServiceModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteService(row._id)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
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
            Service Catalog & Dynamic Menu
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Create dynamic services, variants (e.g. U Cut, Layer Cut), add-ons (Hair Wash), and categories
          </p>
        </div>
        <div>
          {activeTab === 'services' && (
            <button
              onClick={() => {
                setEditingService(null);
                setServiceModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          )}
          {activeTab === 'categories' && (
            <button
              onClick={() => {
                setEditingCategory(null);
                setCatModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Create Category
            </button>
          )}
          {activeTab === 'subcategories' && (
            <button
              onClick={() => {
                setEditingSubcat(null);
                setSubcatModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Create Subcategory
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('services')}
          className={`btn ${activeTab === 'services' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Scissors className="w-4 h-4" /> Services & Options
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Layers className="w-4 h-4" /> Categories
        </button>
        <button
          onClick={() => setActiveTab('subcategories')}
          className={`btn ${activeTab === 'subcategories' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <PlusCircle className="w-4 h-4" /> Subcategories
        </button>
      </div>

      {activeTab === 'services' && (
        <DataTable
          columns={serviceColumns}
          data={services}
          isLoading={isLoading}
          searchPlaceholder="Search services..."
        />
      )}

      {activeTab === 'categories' && (
        <DataTable
          columns={[
            { header: 'Category Name', accessor: 'name' },
            { header: 'Description', accessor: 'description' },
          ]}
          data={categories}
          isLoading={isLoading}
          searchPlaceholder="Search categories..."
        />
      )}

      {activeTab === 'subcategories' && (
        <DataTable
          columns={[
            { header: 'Subcategory Name', accessor: 'name' },
            { header: 'Parent Category', render: (row) => row.category?.name || 'General' },
          ]}
          data={subcategories}
          isLoading={isLoading}
          searchPlaceholder="Search subcategories..."
        />
      )}

      <FormModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        fields={serviceFields}
        initialData={editingService || {}}
        onSubmit={handleSaveService}
        size="large"
      />

      <FormModal
        isOpen={catModalOpen}
        onClose={() => setCatModalOpen(false)}
        title="Create Category"
        fields={catFields}
        onSubmit={handleSaveCategory}
      />

      <FormModal
        isOpen={subcatModalOpen}
        onClose={() => setSubcatModalOpen(false)}
        title="Create Subcategory"
        fields={subcatFields}
        onSubmit={handleSaveSubcategory}
      />

      <FormModal
        isOpen={optionModalOpen}
        onClose={() => setOptionModalOpen(false)}
        title={`Add Variant to ${selectedServiceForOption?.name || ''}`}
        fields={optionFields}
        onSubmit={handleAddOption}
        submitText="Add Variant"
      />

      <FormModal
        isOpen={addonModalOpen}
        onClose={() => setAddonModalOpen(false)}
        title={`Add Add-on to ${selectedServiceForAddon?.name || ''}`}
        fields={addonFields}
        onSubmit={handleAddAddon}
        submitText="Add Add-on"
      />
    </div>
  );
};

export default ServiceCatalogPage;
