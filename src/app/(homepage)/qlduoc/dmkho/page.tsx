"use client";

import { FaSync } from 'react-icons/fa';
import ThietLapKho from './TimKiemDMKho';
import ButtonCRUD from '@/components/ui/ButtonCRUD';
import DanhMucKho from './DanhMucKho';
import ThemKhoPopup from './ThemKhoPopup';
import { useState, useCallback } from 'react';

type SearchParams = {
    loaiKho: string | null;
    tenKho: string;
};

export default function DanhMucKhoPage() {
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const [showHoatDong, setShowHoatDong] = useState(true);
    const [searchParams, setSearchParams] = useState<SearchParams>({
        loaiKho: null,
        tenKho: ''
    });

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setShouldRefresh(prev => !prev);
        setSearchParams({ loaiKho: null, tenKho: '' });
        setTimeout(() => setIsRefreshing(false), 500);
    }, []);

    const handleSearch = (params: SearchParams) => {
        setSearchParams(params);
    };

    const handleAddSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/apiQLDuoc/apiAddKho', {
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

            setIsAddPopupOpen(false);
            handleRefresh();
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="h-[calc(100vh-76px)] p-1">
            <div className="flex flex-col lg:flex-row gap-1 h-full">
                <div className="w-full lg:w-[55%] h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                    <div className="flex-1 min-h-0 overflow-auto">
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
                        <ThietLapKho onSearch={handleSearch} />
                        <div className="flex items-center justify-between text-lg font-semibold text-gray-700 border-t border-b p-2">
                            <span>Danh Mục Kho</span>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hoatDongFilter"
                                    checked={showHoatDong}
                                    onChange={(e) => setShowHoatDong(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="hoatDongFilter" className="text-sm font-medium text-gray-600">
                                    Hoạt động
                                </label>
                            </div>
                        </div>
                        <DanhMucKho 
                            key={`${shouldRefresh}-${showHoatDong}`} 
                            trangThai={showHoatDong ? 'Y' : 'N'} 
                            searchParams={searchParams}
                        />
                    </div>
                    <div className="flex-none border-t">
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <div className="overflow-x-auto">
                                <div className="flex justify-end items-start gap-2">
                                    <ButtonCRUD type="add" onClick={() => setIsAddPopupOpen(true)} />
                                    <ButtonCRUD type="edit" onClick={() => { }} />
                                    <ButtonCRUD type="delete" onClick={() => { }} />
                                    <ButtonCRUD type="save" onClick={() => { }} />
                                    <ButtonCRUD type="cancel" onClick={() => { }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-[45%] bg-white rounded-xl shadow-lg flex flex-col gap-1 h-full">
                </div>
            </div>

            <ThemKhoPopup
                isOpen={isAddPopupOpen}
                onClose={() => setIsAddPopupOpen(false)}
                onSubmit={handleAddSubmit}
            />
        </div>
    );
};
