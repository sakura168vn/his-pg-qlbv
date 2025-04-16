'use client';

import { useState, useEffect } from 'react';

interface DanhMucKho {
    ma_kho: string;
    ten_kho: string;
    loai_kho: string;
    ten_khoa: string;
}

export default function DanhMucKhoPage() {
    const [danhSachKho, setDanhSachKho] = useState<DanhMucKho[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/apiQLDuoc/apidmKho');
                if (!response.ok) {
                    throw new Error('Không thể tải dữ liệu');
                }
                const data = await response.json();
                setDanhSachKho(data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-blue-600">
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">STT</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Mã</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Tên kho</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Loại</th>
                            <th className="px-2 py-2 text-center font-semibold text-base text-white border border-gray-300">Khoa Phòng</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200`}>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-2 text-center">Đang tải dữ liệu...</td>
                            </tr>
                        ) : danhSachKho.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-2 py-2 text-center">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            danhSachKho.map((kho, index) => (
                                <tr key={kho.ma_kho}>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300 text-center">{index + 1}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.ma_kho}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.ten_kho}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.loai_kho}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{kho.ten_khoa}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};