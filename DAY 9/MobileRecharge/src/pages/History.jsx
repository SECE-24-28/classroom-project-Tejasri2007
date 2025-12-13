import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      const savedHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
      setTransactions(savedHistory);
    }
  }, [isLoggedIn]);

  const filteredTransactions = transactions.filter(txn => 
    filter === 'all' || txn.status === filter
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOperatorIcon = (operator) => {
    const icons = { airtel: '🔴', jio: '🔵', vi: '🟡', bsnl: '🟢' };
    return icons[operator] || '📱';
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600">Please login to view your transaction history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Transaction History</h1>
          <p className="text-gray-600">View all your recharge transactions</p>
        </div>

        {/* Filter Buttons */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {['all', 'success', 'failed', 'pending'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  filter === status
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map(txn => (
              <div key={txn.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{getOperatorIcon(txn.operator)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{txn.mobileNumber}</div>
                      <div className="text-sm text-gray-600 capitalize">{txn.operator}</div>
                      <div className="text-xs text-gray-500">{txn.plan.data} • {txn.plan.validity} days</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                    <div className="text-center md:text-right">
                      <div className="font-bold text-lg text-gray-800">₹{txn.amount}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(txn.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(txn.status)}`}>
                      {txn.status.toUpperCase()}
                    </div>
                    
                    <div className="text-xs text-gray-400 font-mono">
                      {txn.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">No transactions match your current filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;