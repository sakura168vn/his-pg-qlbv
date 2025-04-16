'use client';

import { useRef, useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { CustomSnackbar } from '@/components/ui/CustomSnackbar';
import ButtonCRUD from '@/components/ui/ButtonCRUD';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CustomComboBox, { CustomComboBoxRef } from '@/components/ui/CustomComboBox';

interface Option {
    ma: string;
    ten: string;
}

interface FormData {
    ma_kho: string;
    ten_kho: string;
    loai_kho: Option | null;
    khoa: Option | null;
    trang_thai: string;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

interface ThemKhoPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

interface LoaiKhoAPI {
    ma_loai: string;
    ten_loai: string;
}

interface KhoaAPI {
    ma_khoa: string;
    ten_khoa: string;
}

export default function ThemKhoPopup({ isOpen, onClose, onSubmit }: ThemKhoPopupProps) {
    const tenKhoRef = useRef<HTMLInputElement>(null);
    const maKhoRef = useRef<HTMLInputElement>(null);
    const loaiKhoRef = useRef<any>(null);
    const [formData, setFormData] = useState<FormData>({
        ma_kho: '',
        ten_kho: '',
        loai_kho: null,
        khoa: null,
        trang_thai: 'Y'
    });
    const [isHoatDong, setIsHoatDong] = useState(true);
    const [danhSachLoaiKho, setDanhSachLoaiKho] = useState<Option[]>([]);
    const [danhSachKhoa, setDanhSachKhoa] = useState<Option[]>([]);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [errors, setErrors] = useState<{[key: string]: boolean}>({
        ma_kho: false,
        ten_kho: false,
        loai_kho: false,
        khoa: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch danh sách loại kho
                const resLoaiKho = await fetch('/api/apiQLDuoc/apidmLoai');
                const dataLoaiKho = await resLoaiKho.json() as LoaiKhoAPI[];
                console.log('Data Loại Kho:', dataLoaiKho);
                const mappedLoaiKho = dataLoaiKho.map(item => ({
                    ma: item.ma_loai,
                    ten: item.ten_loai
                }));
                setDanhSachLoaiKho(mappedLoaiKho);

                // Fetch danh sách khoa
                const resKhoa = await fetch('/api/apiQLDuoc/apiKhoa');
                const dataKhoa = await resKhoa.json() as KhoaAPI[];
                console.log('Data Khoa:', dataKhoa);
                const mappedKhoa = dataKhoa.map(item => ({
                    ma: item.ma_khoa,
                    ten: item.ten_khoa
                }));
                setDanhSachKhoa(mappedKhoa);
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
            // Reset form khi mở popup
            setFormData({
                ma_kho: '',
                ten_kho: '',
                loai_kho: null,
                khoa: null,
                trang_thai: 'Y'
            });
            setErrors({
                ma_kho: false,
                ten_kho: false,
                loai_kho: false,
                khoa: false
            });
            setIsHoatDong(true);
        }
    }, [isOpen]);

    const handleMaKhoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            tenKhoRef.current?.focus();
        }
    };

    const handleMaKhoBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const upperValue = e.target.value.toUpperCase();
        setFormData(prev => ({ ...prev, ma_kho: upperValue }));
    };

    const handleTenKhoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loaiKhoRef.current?.focus();
        }
    };

    const handleTenKhoBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const words = e.target.value.split(' ');
        const capitalizedWords = words.map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toLocaleUpperCase('vi-VN') + word.slice(1);
        });
        const capitalizedValue = capitalizedWords.join(' ');
        setFormData(prev => ({ ...prev, ten_kho: capitalizedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Ngăn chặn form submit mặc định
    };

    const handleButtonSubmit = async () => {
        // Reset errors
        setErrors({
            ma_kho: false,
            ten_kho: false,
            loai_kho: false,
            khoa: false
        });

        // Kiểm tra dữ liệu trống hoặc null
        if (!formData.ma_kho?.trim()) {
            setErrors(prev => ({ ...prev, ma_kho: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập mã kho',
                severity: 'error'
            });
            maKhoRef.current?.focus();
            return;
        }

        if (!formData.ten_kho?.trim()) {
            setErrors(prev => ({ ...prev, ten_kho: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập tên kho',
                severity: 'error'
            });
            tenKhoRef.current?.focus();
            return;
        }

        if (!formData.loai_kho?.ma) {
            setErrors(prev => ({ ...prev, loai_kho: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng chọn loại kho',
                severity: 'error'
            });
            loaiKhoRef.current?.focus();
            return;
        }

        if (!formData.khoa?.ma) {
            setErrors(prev => ({ ...prev, khoa: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng chọn khoa',
                severity: 'error'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch('/api/apiQLDuoc/apidmKho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dmkho_ma: formData.ma_kho.trim(),
                    dmkho_ten: formData.ten_kho.trim(),
                    dmkho_loai: formData.loai_kho.ma,
                    dmkho_khoa: formData.khoa.ma,
                    dmkho_trangthai: isHoatDong ? 'Y' : 'N'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.message === 'Mã kho đã tồn tại') {
                    setErrors(prev => ({ ...prev, ma_kho: true }));
                    maKhoRef.current?.focus();
                    maKhoRef.current?.select();
                }
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            // Reset form và đóng popup
            setFormData({
                ma_kho: '',
                ten_kho: '',
                loai_kho: null,
                khoa: null,
                trang_thai: 'Y'
            });
            setIsHoatDong(true);
            onSubmit(data);
            onClose();
        } catch (error: any) {
            setSnackbar({
                open: true,
                message: error.message,
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleClosePopup = () => {
        // Reset form data
        setFormData({
            ma_kho: '',
            ten_kho: '',
            loai_kho: null,
            khoa: null,
            trang_thai: 'Y'
        });
        setErrors({
            ma_kho: false,
            ten_kho: false,
            loai_kho: false,
            khoa: false
        });
        setIsHoatDong(true);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white rounded-lg w-full max-w-2xl p-4 relative shadow-xl border-2 border-blue-500 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-800">Thêm Kho Mới</h2>
                    <button
                        onClick={handleClosePopup}
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
                                    ref={maKhoRef}
                                    type="text"
                                    value={formData.ma_kho}
                                    onChange={(e) => {
                                        setFormData({ ...formData, ma_kho: e.target.value });
                                        setErrors(prev => ({ ...prev, ma_kho: false }));
                                    }}
                                    onKeyDown={handleMaKhoKeyDown}
                                    onBlur={handleMaKhoBlur}
                                    className={`w-full h-9 px-3 py-1 bg-white border ${errors.ma_kho ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                />
                                {errors.ma_kho && (
                                    <span className="text-xs text-red-500 pl-1">Mã kho không hợp lệ hoặc đã tồn tại</span>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Tên Kho <span className="text-red-500">*</span>
                                </label>
                                <input
                                    ref={tenKhoRef}
                                    type="text"
                                    value={formData.ten_kho}
                                    onChange={(e) => setFormData({ ...formData, ten_kho: e.target.value })}
                                    onKeyDown={handleTenKhoKeyDown}
                                    onBlur={handleTenKhoBlur}
                                    className="w-full h-9 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Loại Kho <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full relative">
                                    <CustomComboBox
                                        ref={loaiKhoRef}
                                        value={formData.loai_kho}
                                        onChange={(value) => setFormData({ ...formData, loai_kho: value })}
                                        options={danhSachLoaiKho}
                                        placeholder="Chọn loại kho"
                                        className="z-[9999]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1">
                            <div className="flex flex-col space-y-1">
                                <label className="text-sm font-medium text-gray-600 pl-1">
                                    Khoa <span className="text-red-500">*</span>
                                </label>
                                <div className="w-full relative">
                                    <CustomComboBox
                                        value={formData.khoa}
                                        onChange={(value) => setFormData({ ...formData, khoa: value })}
                                        options={danhSachKhoa}
                                        placeholder="Chọn khoa"
                                        className="z-[9998]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hoatDong"
                                    checked={isHoatDong}
                                    onChange={(e) => setIsHoatDong(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="hoatDong" className="text-sm font-medium text-gray-600">
                                    Hoạt Động
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                        <ButtonCRUD 
                            type="add" 
                            onClick={handleButtonSubmit}
                            disabled={isSubmitting}
                        />
                        <ButtonCRUD 
                            type="cancel" 
                            onClick={handleClosePopup}
                        />
                    </div>
                </form>

                <CustomSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={handleCloseSnackbar}
                />
            </div>
        </div>
    );
} 