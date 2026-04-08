import React, { useRef, useState } from 'react'
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../EmojiPickerPopup';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { MdOutlineCameraAlt } from 'react-icons/md';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: '',
    amount: '',
    date: '',
    icon: '',
  });

  const handleChange = (key, value) => setExpense({ ...expense, [key]: value })

  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanReceipt = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('receipt', file);

    setIsScanning(true);
    const toastId = toast.loading('Scanning receipt...');

    try {
      const response = await axiosInstance.post('/api/v1/expense/scan-receipt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { amount, date, category } = response.data.data;

      setExpense((prev) => ({
        ...prev,
        amount: amount || prev.amount,
        date: date ? new Date(date).toISOString().split('T')[0] : prev.date,
        category: category || prev.category,
      }));

      toast.success('Receipt scanned successfully!', { id: toastId });
    } catch (error) {
      console.error('OCR Error:', error);
      toast.error('Failed to scan receipt. Please enter manually.', { id: toastId });
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Add Expense</h2>
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isScanning}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <MdOutlineCameraAlt className="text-lg" />
          {isScanning ? 'Scanning...' : 'Scan Receipt'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleScanReceipt}
          accept="image/*"
          className="hidden"
        />
      </div>

      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label='Expense Source'
        placeholder='Rent, Groceries, etc'
        type='text'
      />

      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label='Expense Amount'
        placeholder=''
        type='number'
      />

      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label='Date'
        placeholder=''
        type='date'
      />

      <div className="flex justify-end mt-6">
        <button
          type='button'
          className='add-btn add-btn-fill '
          onClick={() => onAddExpense(expense)}>
          Add Expense
        </button>
      </div>
    </div>
  )
}

export default AddExpenseForm