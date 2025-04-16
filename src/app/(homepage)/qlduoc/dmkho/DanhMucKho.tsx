'use client';

import { useState, useEffect } from 'react';

interface DanhMucKho {
    ma_kho: string;
    ten_kho: string;
    loai_kho: string;
    ten_khoa: string;
    trang_thai: string;
}

interface DanhMucKhoPageProps {
    trangThai: string;
    searchParams?: {
        loaiKho: string | null;
        tenKho: string;
    };
}

export default function DanhMucKhoPage({ trangThai, searchParams }: DanhMucKhoPageProps) {
    const [danhSachKho, setDanhSachKho] = useState<DanhMucKho[]>([]);
    const [filteredDanhSachKho, setFilteredDanhSachKho] = useState<DanhMucKho[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            let url = `/api/apiQLDuoc/apidmKho?trangThai=${trangThai}`;
            if (searchParams?.tenKho) {
                url += `&tenKho=${encodeURIComponent(searchParams.tenKho)}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu');
            }
            const data = await response.json();
            setDanhSachKho(data);
            filterData(data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterData = (data: DanhMucKho[]) => {
        let filtered = [...data];

        if (searchParams?.loaiKho) {
            const loaiKhoMapping: { [key: string]: string } = {
                'A': 'Kho Chính',
                'B': 'Kho Điều Trị',
                'C': 'Tủ Trực',
                'D': 'Quầy Thuốc'
            };
            const tenLoaiKho = loaiKhoMapping[searchParams.loaiKho];
            filtered = filtered.filter(kho => kho.loai_kho === tenLoaiKho);
        }

        setFilteredDanhSachKho(filtered);
    };

    useEffect(() => {
        fetchData();
    }, [trangThai, searchParams?.tenKho]);

    useEffect(() => {
        filterData(danhSachKho);
    }, [searchParams?.loaiKho, danhSachKho]);

    const getTrangThaiText = (trangThai: string) => {
        return trangThai === 'Y' ? 'Hoạt động' : trangThai === 'N' ? 'Ngừng hoạt động' : '';
    };

    const getTrangThaiClass = (trangThai: string) => {
        return trangThai === 'Y' 
            ? 'text-green-600 bg-green-100' 
            : trangThai === 'N' 
                ? 'text-red-600 bg-red-100'
                : '';
    };

    const getUniqueKey = (kho: DanhMucKho, index: number) => {
        if (kho.ma_kho) return kho.ma_kho;
        return `row-${index}-${kho.ten_kho || ''}-${kho.loai_kho || ''}-${kho.ten_khoa || ''}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-blue-600">
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Mã</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Tên kho</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Loại</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Khoa Phòng</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200`}>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-2 text-center">Đang tải dữ liệu...</td>
                            </tr>
                        ) : filteredDanhSachKho.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-2 text-center">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            filteredDanhSachKho.map((kho, index) => (
                                <tr key={getUniqueKey(kho, index)}>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.ma_kho || ''}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.ten_kho || ''}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.loai_kho || ''}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.ten_khoa || ''}</td>
                                    <td className={`px-2 py-2 border border-gray-300 text-center ${getTrangThaiClass(kho.trang_thai)}`}>
                                        {getTrangThaiText(kho.trang_thai)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};