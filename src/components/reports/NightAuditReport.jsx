import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Calendar, TrendingUp, Users, DollarSign, Home, Clock, CheckCircle, XCircle, Download, Printer, RefreshCw, FileText, X, ArrowLeft } from 'lucide-react';
import HouseStatus from './HouseStatus';
import MOPCashierReport from './MOPCashierReport';
import RevenueAnalysis from './RevenueAnalysis';
import DueBalanceReport from './DueBalanceReport';
import ForecastReport from './ForecastReport';

const NightAuditReport = () => {
  const { axios } = useAppContext();
  const [reportData, setReportData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [showSubReports, setShowSubReports] = useState(false);
  const [activeSubReport, setActiveSubReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, [selectedDate]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/night-audit/report/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching night audit report:', error);
    } finally {
      setLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading Night Audit Report...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-content { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Modern Header */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8 no-print">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Night Audit Report</h1>
                  <p className="text-gray-600 text-sm">Comprehensive daily operations summary</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                  />
                </div>
                <button
                  onClick={fetchReport}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-200 font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowSubReports(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <FileText className="w-4 h-4" />
                  Sub Reports
                </button>
                <button
                  onClick={printReport}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Printer className="w-4 h-4" />
                  Print Report
                </button>
              </div>
            </div>
          </div>

          {activeSubReport ? (
            <>
              {activeSubReport === 'House Status' && (
                <HouseStatus 
                  selectedDate={selectedDate}
                  onBack={() => setActiveSubReport(null)}
                />
              )}
              {activeSubReport === 'MOP Wise Cashier Report (Front Desk)' && (
                <MOPCashierReport 
                  selectedDate={selectedDate}
                  onBack={() => setActiveSubReport(null)}
                />
              )}
              {activeSubReport === 'Revenue Analysis' && (
                <RevenueAnalysis 
                  selectedDate={selectedDate}
                  onBack={() => setActiveSubReport(null)}
                />
              )}
              {activeSubReport === 'In House Guest Due Balance' && (
                <DueBalanceReport 
                  onBack={() => setActiveSubReport(null)}
                />
              )}
              {activeSubReport === '10 Days Forecast' && (
                <ForecastReport 
                  selectedDate={selectedDate}
                  onBack={() => setActiveSubReport(null)}
                />
              )}
              {!['House Status', 'MOP Wise Cashier Report (Front Desk)', 'Revenue Analysis', 'In House Guest Due Balance', '10 Days Forecast'].includes(activeSubReport) && (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                      <button onClick={() => setActiveSubReport(null)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <h1 className="text-2xl font-bold text-gray-900">{activeSubReport}</h1>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">{activeSubReport}</h3>
                      <p className="text-gray-500">This report is coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : reportData && (
            <div className="print-content">
              {/* Modern Report Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">HOTEL HAVANA</h2>
                  <div className="w-24 h-1 bg-white/30 mx-auto mb-4 rounded-full"></div>
                  <p className="text-blue-100 text-lg font-medium">Night Audit Report</p>
                  <p className="text-blue-100 mt-2">Date: {new Date(reportData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Enhanced Key Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Occupancy Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Home className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Occupancy</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{reportData.occupancy.occupancyRate}%</div>
                      <div className="text-xs text-gray-500">Rate</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Rooms</span>
                      <span className="font-semibold text-gray-900">{reportData.occupancy.totalRooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Occupied</span>
                      <span className="font-semibold text-green-600">{reportData.occupancy.occupiedRooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Vacant</span>
                      <span className="font-semibold text-orange-600">{reportData.occupancy.vacantRooms}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{width: `${reportData.occupancy.occupancyRate}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Revenue</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{reportData.revenue.totalRevenue}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Room Revenue</span>
                      <span className="font-semibold text-gray-900">₹{reportData.revenue.roomRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Restaurant</span>
                      <span className="font-semibold text-gray-900">₹{reportData.revenue.restaurantRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Room Service</span>
                      <span className="font-semibold text-gray-900">₹{reportData.revenue.roomServiceRevenue}</span>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">ADR</span>
                        <span className="font-semibold text-blue-600">₹{reportData.revenue.adr}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">RevPAR</span>
                        <span className="font-semibold text-purple-600">₹{reportData.revenue.revpar}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guest Activity Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Guest Activity</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">{reportData.guestActivity.checkIns + reportData.guestActivity.checkOuts}</div>
                      <div className="text-xs text-gray-500">Total Activity</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600">Check-ins</span>
                      </div>
                      <span className="font-semibold text-green-600">{reportData.guestActivity.checkIns}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="text-gray-600">Check-outs</span>
                      </div>
                      <span className="font-semibold text-red-600">{reportData.guestActivity.checkOuts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">Stay-overs</span>
                      </div>
                      <span className="font-semibold text-blue-600">{reportData.guestActivity.stayOvers}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Check-ins Table */}
              {reportData.bookings.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Today's Check-ins</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {reportData.bookings.length} guests
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">GRC No.</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guest Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room No.</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-in Time</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.bookings.map((booking, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-blue-600">{booking.grcNo}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">{booking.name}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {booking.roomNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {booking.checkInDate ? new Date(booking.checkInDate).toLocaleString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-sm font-semibold text-green-600">
                                ₹{booking.totalAmount || booking.rate || '0'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Restaurant Orders */}
              {reportData.restaurantOrders.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Restaurant Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Order ID</th>
                          <th className="px-4 py-2 text-left">Customer</th>
                          <th className="px-4 py-2 text-left">Table/Room</th>
                          <th className="px-4 py-2 text-left">Time</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.restaurantOrders.map((order, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">#{order.orderId}</td>
                            <td className="px-4 py-2">{order.customerName}</td>
                            <td className="px-4 py-2">Room {order.tableNo}</td>
                            <td className="px-4 py-2">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-2 text-right">₹{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Room Service Orders */}
              {reportData.roomServiceOrders && reportData.roomServiceOrders.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Room Service Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Order ID</th>
                          <th className="px-4 py-2 text-left">Guest Name</th>
                          <th className="px-4 py-2 text-left">Room No.</th>
                          <th className="px-4 py-2 text-left">Status</th>
                          <th className="px-4 py-2 text-left">Time</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.roomServiceOrders.map((order, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">#{order.orderId}</td>
                            <td className="px-4 py-2">{order.guestName}</td>
                            <td className="px-4 py-2">{order.roomNumber}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-2 text-right">₹{order.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Enhanced Footer */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">
                      Report generated on {new Date().toLocaleString()}
                    </p>
                    <p className="text-gray-300 mt-2">
                      Hotel Havana Management System
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub Reports Modal */}
          {showSubReports && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Night Audit Sub Reports</h3>
                  </div>
                  <button
                    onClick={() => setShowSubReports(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: 'House Status', icon: Home, color: 'blue' },
                      { name: 'House Keeping Status', icon: CheckCircle, color: 'green' },
                      { name: 'MOP Wise Cashier Report (Front Desk)', icon: DollarSign, color: 'yellow' },
                      { name: 'Revenue Analysis', icon: TrendingUp, color: 'purple' },
                      { name: 'Room Tax Analysis', icon: FileText, color: 'indigo' },
                      { name: 'In House Guest Due Balance', icon: Users, color: 'red' },
                      { name: 'Performance Analysis', icon: TrendingUp, color: 'orange' },
                      { name: '10 Days Forecast', icon: Calendar, color: 'teal' }
                    ].map((report, index) => {
                      const Icon = report.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveSubReport(report.name);
                            setShowSubReports(false);
                          }}
                          className={`p-4 rounded-xl border-2 border-${report.color}-200 hover:border-${report.color}-400 hover:bg-${report.color}-50 transition-all duration-200 text-left group`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 bg-${report.color}-100 rounded-lg group-hover:bg-${report.color}-200 transition-colors`}>
                              <Icon className={`w-5 h-5 text-${report.color}-600`} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                                {report.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Click to view detailed report
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowSubReports(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NightAuditReport;