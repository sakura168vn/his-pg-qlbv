"use client";

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { FaSync, FaSearch } from 'react-icons/fa';

const headerStyle = 'border border-gray-300 px-4 py-2 text-center text-[13px] font-semibold bg-blue-600 text-white';
const rowStyle = 'border border-gray-300 px-4 py-2 text-[13px]';

const columnWidths = {
    maKhoa: 'w-[100px]',
    tenKhoa: 'w-[260px]',
    loaiKhoa: 'w-[100px]',
    trangThai: 'w-[100px]',
}

interface KhoaData {
    ma_khoa: string;
    ten_khoa: string;
    loai_khoa: string;
    trang_thai: string;
}

const TableHeader = () => (
    <thead className="sticky top-0 bg-blue-600 text-white">
        <tr>
            <th className={`${headerStyle} ${columnWidths.maKhoa}`}>Mã</th>
            <th className={`${headerStyle} ${columnWidths.tenKhoa}`}>Tên Khoa</th>
            <th className={`${headerStyle} ${columnWidths.loaiKhoa}`}>Loại</th>
            <th className={`${headerStyle} ${columnWidths.trangThai}`}>Trạng Thái</th>
        </tr>
    </thead>
);

export default function FromSetupKhoaPage() {
    const [khoaList, setKhoaList] = useState<KhoaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchKhoaData = async (search: string = '') => {
        try {
            setLoading(true);
            const response = await fetch(`/api/apiCaiDat/apiSetupKhoa${search ? `?search=${encodeURIComponent(search)}` : ''}`);
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const data = await response.json();
            setKhoaList(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching khoa data:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKhoaData();
    }, []);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            fetchKhoaData(searchTerm);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header với search - không scroll */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-10">
                    <span className="hidden md:block text-lg font-semibold text-gray-700">Thông tin khoa</span>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder="Tìm theo tên hoặc theo mã khoa..."
                            className="w-[350px] pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
                <button
                    onClick={() => fetchKhoaData(searchTerm)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    <FaSync className={`text-blue-600 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Table container - scroll chỉ ở đây */}
            <div className="flex-1 overflow-hidden">
                {error ? (
                    <div className="p-4 text-red-500 text-center">{error}</div>
                ) : (
                    <div className="h-full overflow-auto">
                        <table className="w-full border-collapse">
                            <TableHeader />
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">
                                            <div className="flex justify-center items-center">
                                                <FaSync className="animate-spin text-blue-600 mr-2" />
                                                <span>Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : khoaList.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    khoaList.map((khoa) => (
                                        <tr key={khoa.ma_khoa} className="hover:bg-gray-50">
                                            <td className={`${rowStyle} ${columnWidths.maKhoa} text-center`}>
                                                {khoa.ma_khoa}
                                            </td>
                                            <td className={`${rowStyle} ${columnWidths.tenKhoa}`}>
                                                {khoa.ten_khoa}
                                            </td>
                                            <td className={`${rowStyle} ${columnWidths.loaiKhoa}`}>
                                                {khoa.loai_khoa}
                                            </td>
                                            <td className={`${rowStyle} ${columnWidths.trangThai} text-center`}>
                                                {khoa.trang_thai === 'Y' ? (
                                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                        Hoạt động
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                        Không hoạt động
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}