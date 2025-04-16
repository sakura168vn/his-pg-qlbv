"use client";

import { FaSync } from 'react-icons/fa';
import ThietLapKho from './TimKiemDMKho';
import ButtonCRUD from '@/components/ui/ButtonCRUD';
import DanhMucKho from './DanhMucKho';
import ThemKhoPopup from './ThemKhoPopup';
import { useState } from 'react';

export default function DanhMucKhoPage() {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Thêm logic refresh ở đây
        setTimeout(() => setIsRefreshing(false), 500);
    };

    const handleAddSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/apiQLDuoc/apidmKho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Có lỗi xảy ra');
            }

            // Đóng popup và refresh dữ liệu
            setIsAddPopupOpen(false);
            handleRefresh();
            alert('Thêm kho thành công!');
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="h-[calc(100vh-76px)] p-1 gap-1 flex flex-col md:flex-row">
            <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-xl border border-gray-300">
                <div className="w-full lg:h-9/10">
                    <div className="flex items-center justify-between text-lg font-semibold text-gray-700 border-b p-2">
                        <span>Thông Tin Tìm Kiếm</span>
                        <button
                            onClick={handleRefresh}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isRefreshing}
                        >
                            <FaSync className={`text-blue-600 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                    <ThietLapKho />
                    <div className="flex items-center justify-between text-lg font-semibold text-gray-700 border-t border-b p-2">
                        <span>Danh Mục Kho</span>
                    </div>
                    <DanhMucKho />
                </div>

                <div className="w-full lg:h-1/10 pr-2 border-t">
                    <div className="flex justify-end m-5 gap-2">
                        <div className="flex justify-end gap-2">
                            <ButtonCRUD type="add" onClick={() => setIsAddPopupOpen(true)} />
                            <ButtonCRUD type="edit" onClick={() => { }} />
                            <ButtonCRUD type="delete" onClick={() => { }} />
                            <ButtonCRUD type="save" onClick={() => { }} />
                            <ButtonCRUD type="cancel" onClick={() => { }} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/3">
            </div>

            <ThemKhoPopup
                isOpen={isAddPopupOpen}
                onClose={() => setIsAddPopupOpen(false)}
                onSubmit={handleAddSubmit}
            />
        </div>
    );
};
