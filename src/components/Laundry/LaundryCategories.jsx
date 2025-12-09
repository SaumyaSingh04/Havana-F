import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmationDialog from '../common/ConfirmationDialog';

const LaundryCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry-categories`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : (data.categories || []));
    } catch (error) {
      toast.error('Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmAction(() => performSubmit);
    setShowConfirmDialog(true);
  };

  const performSubmit = async () => {
    setShowConfirmDialog(false);
    try {
      const token = localStorage.getItem('token');
      const url = editingCategory
        ? `${import.meta.env.VITE_API_BASE_URL}/api/laundry-categories/${editingCategory._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/laundry-categories`;
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully`);
        setShowForm(false);
        resetForm();
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => performDelete(id));
    setShowConfirmDialog(true);
  };

  const performDelete = async (id) => {
    setShowConfirmDialog(false);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry-categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      categoryName: category.categoryName,
      description: category.description || '',
      isActive: category.isActive !== undefined ? category.isActive : true
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      categoryName: '',
      description: '',
      isActive: true
    });
    setEditingCategory(null);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Tag style={{color: 'hsl(45, 43%, 58%)'}} size={24} />
            Laundry Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage laundry item categories</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          style={{background: 'linear-gradient(to bottom, hsl(45, 43%, 58%), hsl(45, 32%, 46%))', border: '1px solid hsl(45, 43%, 58%)'}}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom, hsl(45, 32%, 46%), hsl(45, 43%, 58%))'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(to bottom, hsl(45, 43%, 58%), hsl(45, 32%, 46%))'}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.categoryName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description || 'No description'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(category)} className="flex-1 rounded px-3 py-1 text-sm" style={{color: 'hsl(45, 43%, 58%)', border: '1px solid hsl(45, 43%, 58%)'}}>
                    <Edit size={16} className="inline mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(category._id)} className="flex-1 text-red-600 hover:text-red-800 border border-red-600 rounded px-3 py-1 text-sm">
                    <Trash2 size={16} className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{category.categoryName}</td>
                    <td className="px-6 py-4">{category.description || 'No description'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(category)} style={{color: 'hsl(45, 43%, 58%)'}}>
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(category._id)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name</label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="3"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingCategory ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => { setShowConfirmDialog(false); setConfirmAction(null); }}
        onConfirm={confirmAction}
        title={confirmAction?.toString().includes('Delete') ? 'Confirm Deletion' : `Confirm ${editingCategory ? 'Update' : 'Creation'}`}
        message={confirmAction?.toString().includes('Delete') 
          ? 'Are you sure you want to delete this category? This action cannot be undone.'
          : `Are you sure you want to ${editingCategory ? 'update' : 'create'} this category "${formData.categoryName}"?`
        }
        confirmText={confirmAction?.toString().includes('Delete') ? 'Delete' : (editingCategory ? 'Update' : 'Create')}
        cancelText="Cancel"
        type={confirmAction?.toString().includes('Delete') ? 'danger' : 'info'}
      />
    </div>
  );
};

export default LaundryCategories;
