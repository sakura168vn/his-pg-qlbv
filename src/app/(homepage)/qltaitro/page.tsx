'use client';

import { useState } from 'react';
import TimKiem from './giaodien/TimKiem';
import DSHoSoChiTiet from './giaodien/DSHoSo';
import DSKhoaPhongTaiTro from './giaodien/KhoaPhong';

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

export default function QLTaiTro() {
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>();
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaKhoa, setSelectedMaKhoa] = useState('');

  const handleSearch = (params: SearchParams, data: any[]) => {
    setSearchParams(params);
    setTableData(data);
  };

  const handleKhoaClick = async (maKhoa: string) => {
    setSelectedMaKhoa(maKhoa);
    // Tạo searchParams mới với maKhoa mới
    const newParams: SearchParams = {
      ...(searchParams || {
        nam: new Date().getFullYear().toString(),
        dangDieuTri: true,
        raVien: false,
        locTreEm: false,
        locTheHN: false,
        tinhTP: '',
        soHS: '',
        soDT: '',
      }),
      maKhoa
    };
    
    try {
      setLoading(true);
      const response = await fetch('/api/apiQLTaiTro/apiCheckDK', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newParams),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu');
      }

      const result = await response.json();
      if (result.status === 200) {
        setTableData(result.data);
        setSearchParams(newParams);
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

  return (
    <div className="h-[calc(100vh-76px)] p-1">
      <div className="flex flex-col lg:flex-row gap-1 h-full">
        {/* Panel DSKhoaPhongTaiTro - Cột trái 23% */}
        <div className="w-full lg:w-[23%] h-full bg-white rounded-xl shadow-lg overflow-auto">
          <DSKhoaPhongTaiTro 
            onKhoaClick={handleKhoaClick}
            selectedMaKhoa={selectedMaKhoa}
          />
        </div>
        
        {/* Panel bên phải - TimKiem và DSHoSoChiTiet 77% */}
        <div className="w-full lg:w-[77%] flex flex-col gap-1 h-full">
          {/* TimKiem ở trên */}
          <div className="flex-none">
            <TimKiem 
              onSearch={handleSearch} 
              initialValues={searchParams}
            />
          </div>
          
          {/* DSHoSoChiTiet ở dưới */}
          <div className="flex-1">
            <DSHoSoChiTiet 
              searchParams={searchParams}
              data={tableData}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
