'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';

interface KhoaPhong {
    stt: number;
    ma_khoa: string;
    ten_khoa: string;
}

interface DSKhoaPhongTaiTroProps {
    onKhoaClick: (maKhoa: string) => void;
    selectedMaKhoa: string;
}

const DSKhoaPhongTaiTro: React.FC<DSKhoaPhongTaiTroProps> = ({ onKhoaClick, selectedMaKhoa }) => {
    const [danhSachKhoa, setDanhSachKhoa] = useState<KhoaPhong[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRowClick = async (khoa: KhoaPhong) => {
        if (isProcessing || loading) return;
        
        try {
            setIsProcessing(true);
            // Nếu click vào khoa đang chọn, bỏ chọn
            if (selectedMaKhoa === khoa.ma_khoa) {
                onKhoaClick('');
            } else {
                onKhoaClick(khoa.ma_khoa);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const fetchDanhSachKhoa = async () => {
        if (isProcessing || loading) return;

        try {
            setLoading(true);
            setIsProcessing(true);
            setError(null);
            const response = await axios.get('/api/apiQLTaiTro/apiKhoa');
            if (response.data.status === 200) {
                setDanhSachKhoa(response.data.data);
            } else {
                setError('Không thể tải dữ liệu');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải dữ liệu');
            console.error('Error fetching departments:', err);
        } finally {
            setLoading(false);
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!isProcessing) {
            fetchDanhSachKhoa();
        }
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="flex items-center justify-between mb-2 text-lg font-semibold text-gray-700 border-b pb-2">
                <span>Khoa Phòng</span>
                <button 
                    onClick={fetchDanhSachKhoa}
                    disabled={isProcessing || loading}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaSync className={`text-blue-600 h-4 w-4 ${loading || isProcessing ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            {error && (
                <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-blue-600">
                            <th className="px-2 py-2 text-center font-semibold text-base text-white w-12 border border-gray-300">STT</th>
                            <th className="px-2 py-2 text-left font-semibold text-base text-white border border-gray-300">Tên Khoa Phòng</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-gray-200 ${isProcessing ? 'pointer-events-none' : ''}`}>
                        {loading ? (
                            <tr>
                                <td colSpan={2} className="text-center py-8">
                                    <div className="flex items-center justify-center space-x-2">
                                        <FaSync className="animate-spin text-blue-600" />
                                        <span className="text-gray-600">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : danhSachKhoa.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="text-center py-8 text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            danhSachKhoa.map((khoa) => (
                                <tr 
                                    key={khoa.ma_khoa}
                                    onClick={() => handleRowClick(khoa)}
                                    className={`hover:bg-gray-50 transition-colors cursor-pointer
                                        ${isProcessing ? 'opacity-50' : ''}
                                        ${selectedMaKhoa === khoa.ma_khoa ? 'bg-blue-50' : ''}`}
                                >
                                    <td className="px-2 py-2 text-gray-600 text-center border border-gray-300">{khoa.stt}</td>
                                    <td className="px-2 py-2 text-gray-600 border border-gray-300">{khoa.ten_khoa}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DSKhoaPhongTaiTro; 