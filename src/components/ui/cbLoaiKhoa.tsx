'use client';

import { useEffect, useState } from 'react';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";

interface LoaiKhoa {
  slk_ma: string;
  slk_ten: string;
}

interface ComboboxLoaiKhoaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ComboboxLoaiKhoa({ value, onChange, className }: ComboboxLoaiKhoaProps) {
  const [loaiKhoaList, setLoaiKhoaList] = useState<LoaiKhoa[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchLoaiKhoa = async () => {
      try {
        const response = await fetch('/api/apiCaiDat/apiLoaiKhoa');
        const data = await response.json();
        setLoaiKhoaList(data);
      } catch (error) {
        console.error('Error fetching loai khoa:', error);
      }
    };

    fetchLoaiKhoa();
  }, []);

  const filteredLoaiKhoa = search === ''
    ? loaiKhoaList
    : loaiKhoaList.filter((item) =>
        item.slk_ten.toLowerCase().includes(search.toLowerCase()) ||
        item.slk_ma.toLowerCase().includes(search.toLowerCase())
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

  const selectedLoaiKhoa = loaiKhoaList.find(item => item.slk_ma === value);

  return (
    <div className="relative" id="loaikhoa-combobox">
      <div className={`relative ${isOpen ? 'ring-2 ring-indigo-500 shadow-md' : ''}`}>
        <input
          value={search}
          onChange={handleInputChange}
          onBlur={handleComboBlur}
          onClick={handleInputClick}
          className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          placeholder={selectedLoaiKhoa?.slk_ten || 'Chọn Loại Khoa'}
        />
        <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-indigo-600 font-medium">
          Loại
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
          {filteredLoaiKhoa.map((item) => (
            <div
              key={item.slk_ma}
              className={`grid grid-cols-[100px_1fr] border-b border-gray-100 hover:bg-indigo-50 cursor-pointer transition-colors duration-150 ${value === item.slk_ma ? 'bg-indigo-100' : ''}`}
              onClick={() => handleSelectOption(item.slk_ma, item.slk_ten)}
            >
              <div className="px-3 py-2 text-sm">{item.slk_ma}</div>
              <div className="px-3 py-2 text-sm">{item.slk_ten}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
