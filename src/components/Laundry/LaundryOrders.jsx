import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LaundryOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/laundry/orders`, {
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default LaundryOrders;
