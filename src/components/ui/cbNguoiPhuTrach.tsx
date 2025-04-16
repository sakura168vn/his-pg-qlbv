'use client';

import { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";

interface NguoiPhuTrach {
  su_userid: string;
  su_name: string;
}

interface ComboboxNguoiPhuTrachProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ComboboxNguoiPhuTrach({ value, onChange, className }: ComboboxNguoiPhuTrachProps) {
  const [NguoiPhuTrachList, setNguoiPhuTrachList] = useState<NguoiPhuTrach[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNguoiPhuTrach = async () => {
      try {
        const response = await fetch('/api/apiCaiDat/apiNguoiPhuTrach');
        const data = await response.json();
        setNguoiPhuTrachList(data);
      } catch (error) {
        console.error('Error fetching loai khoa:', error);
      }
    };

    fetchNguoiPhuTrach();
  }, []);

  const filteredNguoiPhuTrach = search === ''
    ? NguoiPhuTrachList
    : NguoiPhuTrachList.filter((item) =>
        item.su_name.toLowerCase().includes(search.toLowerCase()) ||
        item.su_userid.toLowerCase().includes(search.toLowerCase())
      );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsOpen(true);
  };

  const handleSelectOption = (ma: string, ten: string) => {
    onChange(ma);
    setSearch(ten);
    setIsOpen(false);
  };

  const handleComboBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const selectedNguoiPhuTrach = NguoiPhuTrachList.find(item => item.su_userid === value);

  return (
    <div className="relative" id="NguoiPhuTrach-combobox">
      <div className={`relative ${isOpen ? 'ring-2 ring-indigo-500 shadow-md' : ''}`}>
        <input
          value={search}
          onChange={handleInputChange}
          onBlur={handleComboBlur}
          onClick={handleInputClick}
          className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder={selectedNguoiPhuTrach?.su_name || 'Chọn Người Phụ Trách'}
        />
        <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-indigo-600 font-medium">
          Người Phụ Trách
        </label>
        <HiOutlineLocationMarker className="absolute left-2.5 top-1/2 -translate-y-1/2 text-indigo-400" />
        <MdKeyboardArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto transition-all duration-200">
          <div className="grid grid-cols-[100px_1fr] border-b border-gray-200 bg-indigo-50 sticky top-0">
            <div className="px-3 py-2 text-xs font-semibold text-indigo-700">Mã</div>
            <div className="px-3 py-2 text-xs font-semibold text-indigo-700">Tên</div>
          </div>
          {filteredNguoiPhuTrach.map((item) => (
            <div
              key={item.su_userid}
              className={`grid grid-cols-[100px_1fr] border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 ${value === item.su_userid ? 'bg-indigo-100' : ''}`}
              onClick={() => handleSelectOption(item.su_userid, item.su_name)}
            >
              <div className="px-3 py-2 text-sm">{item.su_userid}</div>
              <div className="px-3 py-2 text-sm">{item.su_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 