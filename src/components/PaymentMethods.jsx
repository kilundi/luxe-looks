const PaymentMethods = () => {
  const methods = [
    { name: 'M-Pesa', icon: '📱', color: 'bg-green-100 text-green-700' },
    { name: 'VISA', icon: '💳', color: 'bg-blue-100 text-blue-700' },
    { name: 'Cash on Delivery', icon: '💵', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Bank Transfer', icon: '🏦', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="mt-8 pt-8 border-t border-gray-800">
      <h4 className="text-lg font-bold text-accent mb-4">Payment Methods</h4>
      <div className="flex flex-wrap gap-3">
        {methods.map((method) => (
          <div
            key={method.name}
            className={`${method.color} px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-md`}
          >
            <span className="text-xl">{method.icon}</span>
            {method.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
