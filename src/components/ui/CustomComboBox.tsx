'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Option = {
  ma: string;
  ten: string;
};

type Props = {
  id?: string;
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  placeholder?: string;
};

export default function CustomComboBox({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setDisplayValue(value ? `${value.ma} - ${value.ten}` : '');
  }, [value]);

  const filtered = options.filter((item) => {
    const searchText = filterText.toLowerCase();
    if (searchText.includes('-')) {
      const [maSearch, tenSearch] = searchText.split('-').map(s => s.trim());
      return (item.ma?.toLowerCase() || '').includes(maSearch) ||
             (item.ten?.toLowerCase() || '').includes(tenSearch || '');
    }
    return (item.ma?.toLowerCase() || '').includes(searchText) ||
           (item.ten?.toLowerCase() || '').includes(searchText);
  });

  const handleSelect = (item: Option) => {
    onChange(item);
    setDisplayValue(`${item.ma} - ${item.ten}`);
    setFilterText('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setDisplayValue(newText);
    setFilterText(newText);
    setIsOpen(true);
    if (newText === '') {
      onChange(null);
      setFilterText('');
    }
  };

  const handleButtonClick = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        if (value) {
          setFilterText(value.ten);
        } else {
          setFilterText('');
        }
      }
      return nextState;
    });
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (value && displayValue === `${value.ma} - ${value.ten}`) {
      setFilterText(value.ten);
    } else {
      setFilterText(displayValue);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (value && displayValue !== `${value.ma} - ${value.ten}`) {
        setDisplayValue(`${value.ma} - ${value.ten}`);
      } else if (!value && displayValue !== '') {
        const isValidDisplay = options.some(opt => `${opt.ma} - ${opt.ten}` === displayValue);
        if (!isValidDisplay) {
          setDisplayValue('');
          onChange(null);
        }
      }
      setIsOpen(false);
    }, 150);
  };

  return (
    <div className="relative w-full max-w-sm text-sm">
      <div className="flex">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none"
        />
        <button
          onClick={handleButtonClick}
          className="px-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg overflow-hidden mt-1">
          <div className="max-h-60 overflow-auto">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 border-b border-gray-200 w-1/3 bg-gray-200">Mã</th>
                  <th className="px-3 py-2 border-b border-gray-200 bg-gray-200">Tên</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.ma}
                    className="hover:bg-blue-100 cursor-pointer"
                    onMouseDown={() => handleSelect(item)}
                  >
                    <td className="px-3 py-2 border-b border-gray-100">{item.ma}</td>
                    <td className="px-3 py-2 border-b border-gray-100">{item.ten}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-3 py-2 text-center text-gray-400">
                      Không có kết quả
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
