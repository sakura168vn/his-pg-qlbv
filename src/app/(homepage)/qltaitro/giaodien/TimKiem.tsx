'use client';

import React, { useState, useCallback, useMemo, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { FaSearch, FaSync } from 'react-icons/fa';
import { IoCalendarOutline } from 'react-icons/io5';
import { BsTelephone, BsFileEarmarkText } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { MdKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';
import { CustomSnackbar, useSnackbar } from "@/components/ui/CustomSnackbar";
import { debounce } from 'lodash';

interface SearchParams {
  nam: string;
  dangDieuTri: boolean;
  raVien: boolean;
  locTreEm: boolean;
  locTheHN: boolean;
  tinhTP: string;
  soHS?: string;
  soDT?: string;
  maKhoa?: string;
}

interface TimKiemProps {
  onSearch: (params: SearchParams, data: any[]) => void;
  initialValues?: SearchParams;
}

interface Option {
  value: string;
  label: string;
}

const TimKiem: React.FC<TimKiemProps> = ({ onSearch, initialValues }) => {
  const currentYear = new Date().getFullYear();
  const years: Option[] = Array.from({ length: 11 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  const [tinhTPOptions, setTinhTPOptions] = useState<Option[]>([]);

  // Fetch danh sách tỉnh/thành phố
  const fetchTinhTP = async () => {
    try {
      const response = await axios.get('/api/apiQLTaiTro/apiTinhTP');
      if (response.data.status === 200) {
        // Không thêm placeholder vào danh sách options
        setTinhTPOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  useEffect(() => {
    fetchTinhTP();
  }, []);

  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const [yearOpen, setYearOpen] = useState(false);
  const [tinhTPOpen, setTinhTPOpen] = useState(false);
  const [yearSearch, setYearSearch] = useState('');
  const [tinhTPSearch, setTinhTPSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo searchParams với đang điều trị = true mặc định
  const defaultSearchParams: SearchParams = {
    nam: new Date().getFullYear().toString(),
    dangDieuTri: true,
    raVien: false,
    locTreEm: false,
    locTheHN: false,
    tinhTP: '',
    soHS: '',
    soDT: '',
    maKhoa: ''
  };

  const [searchParams, setSearchParams] = useState<SearchParams>({
    ...defaultSearchParams,
    ...initialValues
  });

  // Lọc danh sách năm dựa trên từ khóa tìm kiếm
  const filteredYears = useMemo(() => {
    return years.filter(year => 
      year.label.toLowerCase().includes(yearSearch.toLowerCase())
    );
  }, [years, yearSearch]);

  // Lọc danh sách tỉnh/thành phố dựa trên từ khóa tìm kiếm
  const filteredTinhTP = useMemo(() => {
    return tinhTPOptions.filter(option => 
      option.label.toLowerCase().includes(tinhTPSearch.toLowerCase())
    );
  }, [tinhTPOptions, tinhTPSearch]);

  const handleInputChange = (name: keyof SearchParams, value: string) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  // Tối ưu handleNumberKeyDown
  const handleNumberKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: 'soHS' | 'soDT') => {
    if (isProcessing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      // Nếu nhập số hồ sơ hoặc số điện thoại, reset các điều kiện khác
      if (field === 'soHS' && searchParams.soHS) {
        const newParams = {
          ...defaultSearchParams,
          soHS: searchParams.soHS,
          soDT: ''
        };
        setSearchParams(newParams);
        handleSubmit();
      } else if (field === 'soDT' && searchParams.soDT) {
        const newParams = {
          ...defaultSearchParams,
          soDT: searchParams.soDT,
          soHS: ''
        };
        setSearchParams(newParams);
        handleSubmit();
      }
    }
  };

  // Tối ưu handleNumberChange
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, field: 'soHS' | 'soDT') => {
    if (isProcessing) return;

    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      // Khi thay đổi số hồ sơ, xóa số điện thoại và ngược lại
      if (field === 'soHS') {
        handleInputChange('soDT', '');
      } else {
        handleInputChange('soHS', '');
      }
      handleInputChange(field, value);
    }
  };

  // Tối ưu handleSubmit
  const handleSubmit = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setLoading(true);
      setError(null);
      
      // Nếu có số hồ sơ hoặc số điện thoại, chỉ gửi điều kiện tương ứng
      const searchParamsToSend = {
        ...searchParams,
        maKhoa: searchParams.maKhoa || '',
        // Không cần gửi giá trị 'all' cho tinhTP, giữ nguyên giá trị rỗng
      };

      if (searchParamsToSend.soHS) {
        // Reset các điều kiện khác khi tìm theo số hồ sơ
        const params = searchParamsToSend as Record<string, any>;
        Object.keys(params).forEach(key => {
          if (key !== 'soHS' && key !== 'maKhoa') {
            params[key] = key === 'dangDieuTri' ? false : '';
          }
        });
      } else if (searchParamsToSend.soDT) {
        // Reset các điều kiện khác khi tìm theo số điện thoại
        const params = searchParamsToSend as Record<string, any>;
        Object.keys(params).forEach(key => {
          if (key !== 'soDT' && key !== 'maKhoa') {
            params[key] = key === 'dangDieuTri' ? false : '';
          }
        });
      }

      const response = await fetch('/api/apiQLTaiTro/apiCheckDK', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParamsToSend),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu');
      }

      const result = await response.json();
      if (result.status === 200) {
        setData(result.data);
        onSearch(searchParamsToSend, result.data);
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu');
      showSnackbar('Có lỗi xảy ra khi tải dữ liệu', 'error');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  // Load dữ liệu mặc định khi component mount
  useEffect(() => {
    const fetchDefaultData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/apiQLTaiTro/apiCheckDK', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nam: new Date().getFullYear().toString(),
            dangDieuTri: true,
            raVien: false,
            locTreEm: false,
            locTheHN: false,
            tinhTP: '',
            soHS: '',
            soDT: '',
            maKhoa: ''
          }),
        });

        if (!response.ok) {
          throw new Error('Lỗi khi tải dữ liệu');
        }

        const result = await response.json();
        if (result.status === 200) {
          setData(result.data);
          onSearch(searchParams, result.data);
        } else {
          setError('Không thể tải dữ liệu');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultData();
  }, []);

  // Tối ưu handleCheckboxChange
  const handleCheckboxChange = (name: keyof SearchParams) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return;

    const checked = e.target.checked;
    let newParams: SearchParams;
    
    if (name === 'dangDieuTri') {
      newParams = { 
        ...searchParams, 
        dangDieuTri: checked,
        raVien: checked ? false : searchParams.raVien
      };
    } else if (name === 'raVien') {
      newParams = { 
        ...searchParams, 
        raVien: checked,
        dangDieuTri: checked ? false : searchParams.dangDieuTri
      };
    } else {
      newParams = { ...searchParams, [name]: checked };
    }
    
    setSearchParams(newParams);
  };

  // Tối ưu handleSelectOption
  const handleSelectOption = async (
    type: 'year' | 'tinhTP',
    value: string,
    label: string
  ) => {
    if (isProcessing) return;

    handleInputChange(type === 'year' ? 'nam' : 'tinhTP', value);
    if (type === 'year') {
      setYearSearch(label);
      setYearOpen(false);
    } else {
      setTinhTPSearch(label);
      setTinhTPOpen(false);
    }
  };

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const yearElement = document.getElementById('year-combobox');
      const tinhTPElement = document.getElementById('tinhtp-combobox');

      if (yearOpen && yearElement && !yearElement.contains(event.target as Node)) {
        setYearOpen(false);
        setYearSearch('');
      }
      if (tinhTPOpen && tinhTPElement && !tinhTPElement.contains(event.target as Node)) {
        setTinhTPOpen(false);
        setTinhTPSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [yearOpen, tinhTPOpen]);

  // Xử lý thay đổi giá trị cho combobox năm
  const handleYearInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearSearch(value);
    setYearOpen(true);
  };

  // Xử lý thay đổi giá trị cho combobox tỉnh/thành phố
  const handleTinhTPInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTinhTPSearch(value);
    setTinhTPOpen(true);
    
    // Nếu xóa trắng, reset giá trị tinhTP
    if (!value) {
      handleInputChange('tinhTP', '');
    }
  };

  // Xử lý click vào input
  const handleInputClick = (type: 'year' | 'tinhTP') => {
    if (type === 'year') {
      setYearOpen(true);
    } else {
      setTinhTPOpen(true);
    }
  };

  // Xử lý phím tắt cho combobox
  const handleComboKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    type: 'year' | 'tinhTP'
  ) => {
    const isYear = type === 'year';
    const options = isYear ? filteredYears : filteredTinhTP;
    const searchValue = isYear ? yearSearch : tinhTPSearch;
    
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (options.length > 0) {
          const matchedOption = options.find(opt => 
            opt.label.toLowerCase().startsWith(searchValue.toLowerCase())
          );
          if (matchedOption) {
            handleInputChange(isYear ? 'nam' : 'tinhTP', matchedOption.value);
            if (isYear) {
              setYearOpen(false);
            } else {
              setTinhTPOpen(false);
            }
          }
        }
        break;
      case 'Escape':
        if (isYear) {
          setYearOpen(false);
        } else {
          setTinhTPOpen(false);
        }
        break;
      case 'Backspace':
        // Nếu đang xóa và input đã trống, reset giá trị
        if (searchValue === '') {
          if (isYear) {
            handleInputChange('nam', '');
          } else {
            handleInputChange('tinhTP', '');
          }
        }
        break;
    }
  };

  // Xử lý mất focus cho combobox
  const handleComboBlur = (type: 'year' | 'tinhTP') => {
    setTimeout(() => {
      if (type === 'year') {
        setYearOpen(false);
      } else {
        setTinhTPOpen(false);
      }
    }, 200);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
      <div className="flex items-center mb-2 text-lg font-semibold text-gray-700 border-b pb-2">
        <FaSearch className="mr-2 text-blue-600" />
        <span>Tìm Kiếm:</span>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Năm và checkbox Đang ĐT */}
          <div className="space-y-4">
            <div className="relative" id="year-combobox">
              <div className={`relative ${yearOpen ? 'ring-2 ring-blue-500' : ''}`}>
                <input
                  value={yearSearch}
                  onChange={handleYearInputChange}
                  onBlur={() => handleComboBlur('year')}
                  onKeyDown={(e) => handleComboKeyDown(e, 'year')}
                  onClick={() => handleInputClick('year')}
                  className="peer w-full h-[38px] px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={years.find(y => y.value === searchParams.nam)?.label || ''}
                />
                <label className="absolute left-2 -top-2.5 bg-white px-1 text-xs text-gray-600">
                  Năm
                </label>
                <MdKeyboardArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${yearOpen ? 'rotate-180' : ''}`} />
              </div>
              {yearOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                  {filteredYears.map((year) => (
                    <div
                      key={year.value}
                      className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${searchParams.nam === year.value ? 'bg-blue-100' : ''}`}
                      onClick={() => handleSelectOption('year', year.value, year.label)}
                    >
                      {year.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label className="inline-flex items-center whitespace-nowrap hover:cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.dangDieuTri}
                onChange={handleCheckboxChange('dangDieuTri')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-xs text-gray-700">Đang Điều Trị</span>
            </label>
          </div>

          {/* Số HS và checkbox Ra Viện */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={searchParams.soHS}
                onChange={(e) => handleNumberChange(e, 'soHS')}
                onKeyDown={(e) => handleNumberKeyDown(e, 'soHS')}
                className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số hồ sơ"
              />
              <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-gray-600">
                Số HS
              </label>
              <BsFileEarmarkText className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <label className="inline-flex items-center whitespace-nowrap hover:cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.raVien}
                onChange={handleCheckboxChange('raVien')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-xs text-gray-700">Ra Viện</span>
            </label>
          </div>

          {/* Số ĐT và checkbox Trẻ em */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={searchParams.soDT}
                onChange={(e) => handleNumberChange(e, 'soDT')}
                onKeyDown={(e) => handleNumberKeyDown(e, 'soDT')}
                className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số điện thoại"
              />
              <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-gray-600">
                Số ĐT
              </label>
              <BsTelephone className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <label className="inline-flex items-center whitespace-nowrap hover:cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.locTreEm}
                onChange={handleCheckboxChange('locTreEm')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-xs text-gray-700">Trẻ em {"<"} 10 tuổi</span>
            </label>
          </div>

          {/* Tỉnh/TP và checkbox Lọc thẻ HN */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-4">
            <div className="relative" id="tinhtp-combobox">
              <div className={`relative ${tinhTPOpen ? 'ring-2 ring-blue-500' : ''}`}>
                <input
                  value={tinhTPSearch}
                  onChange={handleTinhTPInputChange}
                  onBlur={() => handleComboBlur('tinhTP')}
                  onKeyDown={(e) => handleComboKeyDown(e, 'tinhTP')}
                  onClick={() => handleInputClick('tinhTP')}
                  className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={tinhTPOptions.find(t => t.value === searchParams.tinhTP)?.label || 'Chọn Tỉnh/TP'}
                />
                <label className="absolute left-8 -top-2.5 bg-white px-1 text-xs text-gray-600">
                  Tỉnh/TP
                </label>
                <HiOutlineLocationMarker className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <MdKeyboardArrowDown className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${tinhTPOpen ? 'rotate-180' : ''}`} />
              </div>
              {tinhTPOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                  {filteredTinhTP.map((option) => (
                    <div
                      key={option.value}
                      className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${searchParams.tinhTP === option.value ? 'bg-blue-100' : ''}`}
                      onClick={() => handleSelectOption('tinhTP', option.value, option.label)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <label className="inline-flex items-center whitespace-nowrap hover:cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.locTheHN}
                onChange={handleCheckboxChange('locTheHN')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-xs text-gray-700">Lọc thẻ HN</span>
            </label>
          </div>

          {/* Nút Nạp DL */}
          <div className="flex justify-end items-start">
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-[38px] text-sm w-full sm:w-auto justify-center"
            >
              {isProcessing ? (
                <>
                  <FaSync className="mr-1.5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <FaSearch className="mr-1.5" />
                  Nạp DL
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </div>
  );
};

export default TimKiem;
