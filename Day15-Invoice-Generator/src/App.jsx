import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

function App() {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const invoiceRef = useRef();

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'desc' ? value : Number(value);
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { desc: '', qty: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + item.qty * item.price, 0);

  const downloadPDF = () => {
    alert('📝 Your PDF is downloaded');

    const element = invoiceRef.current;
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `Invoice_${clientName || 'Client'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    setTimeout(() => {
      html2pdf().set(opt).from(element).save();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">📄 Invoice Generator</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Client Info</h2>
        <input
          type="text"
          placeholder="Client Name"
          className="w-full p-2 mb-2 border border-gray-300 rounded"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Client Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />

        <h2 className="text-xl font-semibold mb-4">Items</h2>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Description"
              className="col-span-2 p-2 border border-gray-300 rounded"
              value={item.desc}
              onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
            />
            <input
              type="number"
              placeholder="Qty"
              className="p-2 border border-gray-300 rounded"
              value={item.qty}
              onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="p-2 border border-gray-300 rounded"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            />
            <button
              className="bg-red-100 text-red-600 border border-red-300 rounded px-2 font-bold text-lg hover:bg-red-200"
              onClick={() => removeItem(index)}
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={addItem} className="bg-green-500 text-white px-4 py-2 rounded mt-2">+ Add Item</button>
      </div>

      {/* Invoice Preview */}
      <div ref={invoiceRef} className="bg-white mt-8 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Invoice</h2>
        <p><strong>Client:</strong> {clientName}</p>
        <p><strong>Email:</strong> {clientEmail}</p>

        <table className="w-full mt-4 border-t border-gray-300">
          <thead>
            <tr className="text-left text-gray-700">
              <th className="py-2">Description</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="py-2">{item.desc}</td>
                <td>{item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-4 text-lg">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-6">
        <button onClick={downloadPDF} className="bg-indigo-600 text-white px-6 py-2 rounded shadow-md hover:bg-indigo-700">📥 Download PDF</button>
      </div>
    </div>
  );
}

export default App;