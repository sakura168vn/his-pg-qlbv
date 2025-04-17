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
    const [loaiKhoMapping, setLoaiKhoMapping] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchLoaiKho = async () => {
            try {
                const response = await fetch('/api/apiQLDuoc/apidmLoai');
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu loại kho');
                }
                const data = await response.json();
                const mapping: { [key: string]: string } = {};
                data.forEach((item: any) => {
                    mapping[item.dmloai_ma] = item.dmloai_ten;
                });
                setLoaiKhoMapping(mapping);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu loại kho:', error);
            }
        };
        fetchLoaiKho();
    }, []);

    const fetchData = async () => {
        try {
            let url = `/api/apiQLDuoc/apidmKho?trangThai=${trangThai}`;
            if (searchParams?.tenKho) {
                url += `&tenKho=${encodeURIComponent(searchParams.tenKho)}`;
            }
            if (searchParams?.loaiKho) {
                url += `&loaiKho=${encodeURIComponent(searchParams.loaiKho)}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu');
            }
            const data = await response.json();
            setDanhSachKho(data);
            setFilteredDanhSachKho(data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [trangThai, searchParams?.tenKho, searchParams?.loaiKho]);

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
                                <td colSpan={5} className="px-2 py-2 text-center">Loading...</td>
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