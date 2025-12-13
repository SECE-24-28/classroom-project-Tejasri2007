import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalRevenue: 0,
    totalUsers: 0,
    recentTransactions: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin-login');
      return;
    }

    // Load admin stats from localStorage
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    const revenue = history.reduce((sum, txn) => sum + txn.amount, 0);
    const users = new Set(history.map(txn => txn.mobileNumber)).size;

    setStats({
      totalTransactions: history.length,
      totalRevenue: revenue,
      totalUsers: users,
      recentTransactions: history.slice(-5).reverse()
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  const getOperatorIcon = (operator) => {
    const icons = { airtel: '🔴', jio: '🔵', vi: '🟡', bsnl: '🟢' };
    return icons[operator] || '📱';
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">{stats.totalTransactions}</div>
            <div className="text-gray-600">Total Transactions</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">₹{stats.totalRevenue}</div>
            <div className="text-gray-600">Total Revenue</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
          {stats.recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {stats.recentTransactions.map(txn => (
                <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{getOperatorIcon(txn.operator)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{txn.mobileNumber}</div>
                      <div className="text-sm text-gray-600 capitalize">{txn.operator}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{txn.amount}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
