'use client';

import { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import CustomComboBox from '@/components/ui/CustomComboBox';
import { CustomSnackbar } from '@/components/ui/CustomSnackbar';

interface ThemKhoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

interface LoaiKho {
    ma_loai: string;
    ten_loai: string;
}

interface Khoa {
    ma_khoa: string;
    ten_khoa: string;
}

interface ComboBoxOption {
    ma: string;
    ten: string;
}

export default function ThemKhoPopup({ isOpen, onClose, onSubmit }: ThemKhoPopupProps) {
    const [formData, setFormData] = useState({
        ma_kho: '',
        ten_kho: '',
        loai_kho: null as ComboBoxOption | null,
        khoa: null as ComboBoxOption | null,
        trang_thai: 'Y'
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error' as 'error' | 'success'
    });

    const [danhSachLoaiKho, setDanhSachLoaiKho] = useState<LoaiKho[]>([]);
    const [danhSachKhoa, setDanhSachKhoa] = useState<Khoa[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch danh sách loại kho
                const resLoaiKho = await fetch('/api/apiQLDuoc/apidmLoai');
                const dataLoaiKho = await resLoaiKho.json();
                setDanhSachLoaiKho(dataLoaiKho);

                // Fetch danh sách khoa
                const resKhoa = await fetch('/api/apiQLDuoc/apiKhoa');
                const dataKhoa = await resKhoa.json();
                setDanhSachKhoa(dataKhoa);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                setSnackbar({
                    open: true,
                    message: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
                    severity: 'error'
                });
            }
        };

        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.ma_kho.trim() || !formData.ten_kho.trim()) {
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập đầy đủ mã kho và tên kho',
                severity: 'error'
            });
            return;
        }
        if (!formData.loai_kho || !formData.khoa) {
            setSnackbar({
                open: true,
                message: 'Vui lòng chọn loại kho và khoa',
                severity: 'error'
            });
            return;
        }
        onSubmit({
            ...formData,
            loai_kho: formData.loai_kho.ma,
            khoa: formData.khoa.ma
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-4 relative shadow-xl border-2 border-blue-500">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h2 className="text-lg font-semibold text-gray-800">Thêm Kho Mới</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <IoMdClose size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Mã Kho <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.ma_kho}
                                    onChange={(e) => setFormData({ ...formData, ma_kho: e.target.value })}
                                    className="w-full h-9 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Tên Kho <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.ten_kho}
                                    onChange={(e) => setFormData({ ...formData, ten_kho: e.target.value })}
                                    className="w-full h-9 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Loại Kho <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full">
                                    <CustomComboBox
                                        value={formData.loai_kho}
                                        onChange={(value) => setFormData({ ...formData, loai_kho: value })}
                                        options={danhSachLoaiKho.map(loai => ({
                                            ma: loai.ma_loai,
                                            ten: loai.ten_loai
                                        }))}
                                        placeholder="Chọn loại kho"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Khoa <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full">
                                    <CustomComboBox
                                        value={formData.khoa}
                                        onChange={(value) => setFormData({ ...formData, khoa: value })}
                                        options={danhSachKhoa.map(khoa => ({
                                            ma: khoa.ma_khoa,
                                            ten: khoa.ten_khoa
                                        }))}
                                        placeholder="Chọn khoa"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-8 px-4 flex items-center justify-center rounded-md text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="h-8 px-4 flex items-center justify-center rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Thêm
                        </button>
                    </div>
                </form>
            </div>

            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
} 