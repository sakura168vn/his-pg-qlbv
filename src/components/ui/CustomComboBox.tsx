'use client';

import { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
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
  className?: string;
};

export interface CustomComboBoxRef {
  focus: () => void;
}

const CustomComboBox = forwardRef<CustomComboBoxRef, Props>(({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  className,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const [filterText, setFilterText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  useEffect(() => {
    setDisplayValue(value && value.ma && value.ten ? `${value.ma} - ${value.ten}` : '');
  }, [value]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleGlobalFocus = (e: FocusEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('focusin', handleGlobalFocus);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('focusin', handleGlobalFocus);
    };
  }, []);

  const filtered = options.filter((item) => {
    if (!item || !item.ma || !item.ten) return false;
    const searchText = filterText.toLowerCase();
    if (searchText.includes('-')) {
      const [maSearch, tenSearch] = searchText.split('-').map(s => s.trim());
      return (item.ma.toLowerCase() || '').includes(maSearch) ||
             (item.ten.toLowerCase() || '').includes(tenSearch || '');
    }
    return (item.ma.toLowerCase() || '').includes(searchText) ||
           (item.ten.toLowerCase() || '').includes(searchText);
  });

  const handleSelect = (item: Option) => {
    if (!item || !item.ma || !item.ten) return;
    onChange(item);
    setDisplayValue(`${item.ma} - ${item.ten}`);
    setFilterText('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex(e.key === 'ArrowDown' ? 0 : filtered.length - 1);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filtered.length) {
          handleSelect(filtered[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setDisplayValue(newText);
    setFilterText(newText);
    setIsOpen(true);
    setSelectedIndex(-1);
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
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    const allDropdowns = document.querySelectorAll('.combobox-dropdown');
    allDropdowns.forEach((dropdown) => {
      if (dropdown !== dropdownRef.current) {
        dropdown.classList.add('hidden');
      }
    });
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
      setSelectedIndex(-1);
    }, 150);
  };

  return (
    <div className={`relative w-full max-w-sm text-sm ${className || ''}`}>
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
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
        <div 
          ref={dropdownRef}
          className="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 combobox-dropdown"
          style={{
            maxHeight: '400px',
            width: '450px',
            position: 'fixed',
            top: inputRef.current?.getBoundingClientRect().bottom + 'px',
            left: inputRef.current?.getBoundingClientRect().left + 'px',
            transform: 'translateX(-10%)',
          }}
        >
          <div 
            className="w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
            style={{ maxHeight: '400px' }}
          >
            <table className="w-full table-fixed text-left border-separate border-spacing-0">
              <thead className="bg-gray-50 sticky top-0 z-[9999]">
                <tr key="header-row" className="bg-gradient-to-b from-gray-50 to-gray-100">
                  <th style={{ width: '90px', minWidth: '90px' }} className="px-3 py-2.5 border-b border-gray-200 text-gray-700 text-sm font-semibold tracking-wide">Mã</th>
                  <th style={{ width: '350px', minWidth: '350px' }} className="px-3 py-2.5 border-b border-gray-200 text-gray-700 text-sm font-semibold tracking-wide">Tên</th>
                </tr>
              </thead>
              <tbody className="overflow-auto">
                {filtered.map((item, index) => (
                  <tr
                    key={`${item.ma}-${index}`}
                    className={clsx(
                      "cursor-pointer transition-colors duration-150",
                      selectedIndex === index 
                        ? "bg-blue-500 text-white" 
                        : "hover:bg-blue-50 text-gray-700"
                    )}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(item);
                      setIsOpen(false);
                      inputRef.current?.blur();
                    }}
                  >
                    <td style={{ width: '90px', minWidth: '90px' }} className="px-3 py-2 border-b border-gray-100 truncate font-medium">{item.ma}</td>
                    <td style={{ width: '350px', minWidth: '350px' }} className="px-3 py-2 border-b border-gray-100 truncate">{item.ten}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr key="no-results">
                    <td colSpan={2} className="px-3 py-3 text-center text-gray-500">
                      Không có kết quả
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9990]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
          margin: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #A3ADB8;
          border-radius: 4px;
          border: 1px solid transparent;
          background-clip: padding-box;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
          border-radius: 4px;
          border: 1px solid transparent;
          background-clip: padding-box;
        }
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Ẩn thanh cuộn khi không hover */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
        
        /* Hiện thanh cuộn khi hover */
        .scrollbar-thin:hover {
          scrollbar-color: #A3ADB8 transparent;
        }
        
        /* Style cho Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
      `}</style>
    </div>
  );
});

CustomComboBox.displayName = 'CustomComboBox';

export default CustomComboBox;
