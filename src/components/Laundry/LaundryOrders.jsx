import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList, Eye, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LaundryOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (error) {
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleView = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedOrder(data.order || data);
      setShowViewModal(true);
    } catch (error) {
      toast.error('Failed to fetch order');
    }
  };

  const handleEdit = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const order = data.order || data;
      setSelectedOrder(order);
      setEditFormData(order);
      setShowEditModal(true);
    } catch (error) {
      toast.error('Failed to fetch order');
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });
      
      if (response.ok) {
        toast.success('Order updated successfully');
        setShowEditModal(false);
        fetchOrders();
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        toast.success('Status updated successfully');
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/${orderId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Order deleted successfully');
        fetchOrders();
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <ClipboardList style={{color: 'hsl(45, 43%, 58%)'}} size={24} />
            Laundry Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage laundry orders</p>
        </div>
        <button
          onClick={() => navigate('/laundry/orders/create')}
          className="text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          style={{background: 'linear-gradient(to bottom, hsl(45, 43%, 58%), hsl(45, 32%, 46%))', border: '1px solid hsl(45, 43%, 58%)'}}
        >
          <Plus size={18} />
          Create Order
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow text-center py-12 text-gray-500">
          <ClipboardList className="mx-auto mb-3" size={48} />
          <p className="text-sm sm:text-base">No orders found</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">GRC: {order.grcNo}</h3>
                    <p className="text-sm text-gray-600">Room: {order.roomNumber}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(order.laundryStatus)}`}>
                    {order.laundryStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-500">Items:</span> <span className="font-medium">{order.items?.length || 0}</span></div>
                  <div><span className="text-gray-500">Amount:</span> <span className="font-medium">₹{order.totalAmount}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Type:</span> <span className="font-medium">{order.serviceType}</span></div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button onClick={() => handleView(order._id)} className="text-blue-600 hover:text-blue-800 text-sm">
                    View
                  </button>
                  <button onClick={() => handleEdit(order._id)} className="text-green-600 hover:text-green-800 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleCancel(order._id)} className="text-orange-600 hover:text-orange-800 text-sm">
                    Cancel
                  </button>
                  <button onClick={() => handleDelete(order._id)} className="text-red-600 hover:text-red-800 text-sm">
                    Delete
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GRC No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{order.grcNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.roomNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.requestedByName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.items?.length || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{order.totalAmount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(order.laundryStatus)}`}>
                        {order.laundryStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.serviceType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleView(order._id)} className="text-blue-600 hover:text-blue-800" title="View">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(order._id)} className="text-green-600 hover:text-green-800" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleCancel(order._id)} className="text-orange-600 hover:text-orange-800" title="Cancel">
                          <X size={16} />
                        </button>
                        <button onClick={() => handleDelete(order._id)} className="text-red-600 hover:text-red-800" title="Delete">
                          <Trash2 size={16} />
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

      {/* View Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">View Order</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-medium">GRC:</span> {selectedOrder.grcNo}</div>
              <div><span className="font-medium">Room:</span> {selectedOrder.roomNumber}</div>
              <div><span className="font-medium">Guest:</span> {selectedOrder.requestedByName}</div>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusBadge(selectedOrder.laundryStatus)}`}>
                  {selectedOrder.laundryStatus}
                </span>
              </div>
              <div><span className="font-medium">Service:</span> {selectedOrder.serviceType}</div>
              <div><span className="font-medium">Amount:</span> ₹{selectedOrder.totalAmount}</div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Items:</h3>
              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="flex justify-between p-2 bg-gray-50 rounded mb-1">
                  <span>{item.itemName}</span>
                  <span>₹{item.price} x {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Order</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">GRC No</label>
                  <input type="text" value={editFormData.grcNo || ''} onChange={(e) => setEditFormData({...editFormData, grcNo: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Room Number</label>
                  <input type="text" value={editFormData.roomNumber || ''} onChange={(e) => setEditFormData({...editFormData, roomNumber: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Guest Name</label>
                  <input type="text" value={editFormData.requestedByName || ''} onChange={(e) => setEditFormData({...editFormData, requestedByName: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={editFormData.laundryStatus || 'pending'} onChange={(e) => setEditFormData({...editFormData, laundryStatus: e.target.value})} className="w-full p-2 border rounded">
                    <option value="pending">Pending</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Service Type</label>
                  <select value={editFormData.serviceType || 'inhouse'} onChange={(e) => setEditFormData({...editFormData, serviceType: e.target.value})} className="w-full p-2 border rounded">
                    <option value="inhouse">In-House</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Total Amount</label>
                  <input type="number" value={editFormData.totalAmount || 0} onChange={(e) => setEditFormData({...editFormData, totalAmount: parseFloat(e.target.value)})} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Items</label>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 p-2 bg-gray-50 rounded">
                      <input type="text" defaultValue={item.itemName} placeholder="Item name" className="p-2 border rounded" />
                      <input type="number" defaultValue={item.quantity} placeholder="Quantity" className="p-2 border rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleUpdateOrder}
                  className="px-4 py-2 text-white rounded hover:opacity-90"
                  style={{background: 'linear-gradient(to bottom, hsl(45, 43%, 58%), hsl(45, 32%, 46%))', border: '1px solid hsl(45, 43%, 58%)'}}
                >
                  Update
                </button>
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryOrders;