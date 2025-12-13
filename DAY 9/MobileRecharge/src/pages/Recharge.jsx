import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Recharge = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    operator: '',
    circle: '',
    selectedPlan: null
  });

  const [availablePlans, setAvailablePlans] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Load selected plan from RechargePlans.jsx
  useEffect(() => {
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      const plan = JSON.parse(savedPlan);
      setFormData(prev => ({ ...prev, selectedPlan: plan }));
      localStorage.removeItem('selectedPlan');
    }
  }, []);

  // Basic operator list
  const operators = [
    { id: 'airtel', name: 'Airtel', icon: '🔴' },
    { id: 'jio', name: 'Jio', icon: '🔵' },
    { id: 'vi', name: 'Vi', icon: '🟡' },
    { id: 'bsnl', name: 'BSNL', icon: '🟢' }
  ];

  const plans = {
    airtel: [
      { id: 1, price: 199, validity: 28, data: '1.5GB/day' },
      { id: 2, price: 399, validity: 56, data: '2GB/day' },
      { id: 3, price: 599, validity: 84, data: '3GB/day' }
    ],
    jio: [
      { id: 4, price: 149, validity: 21, data: '1GB/day' },
      { id: 5, price: 299, validity: 42, data: '2GB/day' },
      { id: 6, price: 499, validity: 70, data: '2.5GB/day' }
    ],
    vi: [
      { id: 7, price: 179, validity: 28, data: '1.2GB/day' },
      { id: 8, price: 359, validity: 56, data: '2GB/day' },
      { id: 9, price: 549, validity: 84, data: '2.8GB/day' }
    ],
    bsnl: [
      { id: 10, price: 159, validity: 28, data: '1GB/day' },
      { id: 11, price: 299, validity: 56, data: '1.5GB/day' },
      { id: 12, price: 499, validity: 84, data: '2GB/day' }
    ]
  };

  const offers = [
    { id: 1, code: 'FIRST10', discount: 10, minAmount: 100 },
    { id: 2, code: 'SAVE20', discount: 20, minAmount: 300 },
    { id: 3, code: 'CASHBACK50', discount: 50, minAmount: 500 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'operator') {
      setAvailablePlans(plans[value] || []);
      setDiscounts(offers);
    }
  };

  const handleRecharge = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!formData.mobileNumber || !formData.operator || !formData.selectedPlan) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);

    // Calculate final amount with discount if applicable
    let finalAmount = formData.selectedPlan.price;
    if (selectedDiscount && finalAmount >= selectedDiscount.minAmount) {
      finalAmount -= selectedDiscount.discount;
    }

    // Prepare recharge data
    const rechargeData = {
      mobileNumber: formData.mobileNumber,
      operator: formData.operator,
      plan: formData.selectedPlan,
      discount: selectedDiscount,
      finalAmount,
      transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      timestamp: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('rechargeData', JSON.stringify(rechargeData));

    // Add to transaction history
    const historyItem = {
      id: rechargeData.transactionId,
      mobileNumber: rechargeData.mobileNumber,
      operator: rechargeData.operator,
      plan: rechargeData.plan,
      amount: rechargeData.finalAmount,
      date: rechargeData.timestamp,
      status: 'success'
    };
    const existingHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    existingHistory.push(historyItem);
    localStorage.setItem('transactionHistory', JSON.stringify(existingHistory));

    setTimeout(() => {
      navigate("/recharge-success");
    }, 2000);
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-xl mx-auto px-4">

        <h1 className="text-4xl font-bold text-center mb-6">Mobile Recharge</h1>

        {/* Mobile Number */}
        <input
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleInputChange}
          className="w-full border p-3 rounded mb-6"
          placeholder="Enter mobile number"
        />

        {/* Operator */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {operators.map(op => (
            <button
              key={op.id}
              onClick={() =>
                handleInputChange({ target: { name: 'operator', value: op.id } })
              }
              className={`p-3 border rounded ${
                formData.operator === op.id ? 'bg-gray-300' : ''
              }`}
            >
              {op.icon} {op.name}
            </button>
          ))}
        </div>

        {/* Selected Plan */}
        {formData.selectedPlan && (
          <div className="p-4 border rounded mb-6 bg-gray-100">
            <h2 className="font-bold">Selected Plan</h2>
            <p>₹{formData.selectedPlan.price}</p>
            <p>{formData.selectedPlan.data}</p>
            <p>{formData.selectedPlan.validity} days</p>
          </div>
        )}

        {/* Discount Selection */}
        {formData.operator && discounts.length > 0 && (
          <div className="mb-6">
            <h2 className="font-bold mb-2">Select Discount (Optional)</h2>
            <div className="grid grid-cols-1 gap-2">
              {discounts.map(discount => (
                <button
                  key={discount.id}
                  onClick={() => setSelectedDiscount(discount)}
                  className={`p-3 border rounded ${
                    selectedDiscount?.id === discount.id ? 'bg-gray-300' : ''
                  }`}
                >
                  {discount.code} - ₹{discount.discount} off (Min ₹{discount.minAmount})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Proceed */}
        <button
          onClick={handleRecharge}
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded font-bold"
        >
          {isLoading ? "Processing..." : "Proceed to Pay"}
        </button>

      </div>
    </div>
  );
};

export default Recharge;
