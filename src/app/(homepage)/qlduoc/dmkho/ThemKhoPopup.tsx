'use client';

import { useRef, useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { CustomSnackbar } from '@/components/ui/CustomSnackbar';
import ButtonCRUD from '@/components/ui/ButtonCRUD';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CustomComboBox, { CustomComboBoxRef } from '@/components/ui/CustomComboBox';
import { css } from '@emotion/css';

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

const styles = css`
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }

    .animate-shake {
        animation: shake 0.5s ease-in-out;
    }
`;

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
            // Reset snackbar khi mở popup
            setSnackbar({
                open: false,
                message: '',
                severity: 'success'
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

    const handleMaKhoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, ma_kho: value }));
        // Reset error và snackbar khi người dùng thay đổi giá trị
        if (errors.ma_kho) {
            setErrors(prev => ({ ...prev, ma_kho: false }));
            setSnackbar(prev => ({ ...prev, open: false }));
        }
    };

    const handleMaKhoFocus = () => {
        setErrors(prev => ({ ...prev, ma_kho: false }));
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleTenKhoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, ten_kho: value }));
        // Reset error khi người dùng thay đổi giá trị
        setErrors(prev => ({ ...prev, ten_kho: false }));
        if (snackbar.message === 'Vui lòng nhập tên kho') {
            setSnackbar(prev => ({ ...prev, open: false }));
        }
    };

    const handleLoaiKhoChange = (value: Option | null) => {
        setFormData(prev => ({ ...prev, loai_kho: value }));
        // Reset error và snackbar khi thay đổi giá trị
        setErrors(prev => ({ ...prev, loai_kho: false }));
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleKhoaChange = (value: Option | null) => {
        setFormData(prev => ({ ...prev, khoa: value }));
        // Reset error và snackbar khi thay đổi giá trị
        setErrors(prev => ({ ...prev, khoa: false }));
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleButtonSubmit();
    };

    const handleButtonSubmit = async () => {
        // Reset errors và snackbar
        setErrors({
            ma_kho: false,
            ten_kho: false,
            loai_kho: false,
            khoa: false
        });
        setSnackbar(prev => ({ ...prev, open: false }));

        try {
            setIsSubmitting(true);

            // Kiểm tra mã kho tồn tại trước
            const checkResponse = await fetch(`/api/apiQLDuoc/apidmKho/check?ma=${encodeURIComponent(formData.ma_kho.trim())}`);
            const checkData = await checkResponse.json();

            if (checkData.exists) {
                setErrors(prev => ({ ...prev, ma_kho: true }));
                maKhoRef.current?.focus();
                maKhoRef.current?.select();
                const input = maKhoRef.current;
                if (input) {
                    input.classList.add('animate-shake');
                    setTimeout(() => {
                        input.classList.remove('animate-shake');
                    }, 500);
                }
                setSnackbar({
                    open: true,
                    message: 'Mã kho đã tồn tại',
                    severity: 'error'
                });
                setIsSubmitting(false);
                return;
            }

            // Nếu mã kho chưa tồn tại, tiếp tục thêm mới
            const response = await fetch('/api/apiQLDuoc/apidmKho', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dmkho_ma: formData.ma_kho.trim(),
                    dmkho_ten: formData.ten_kho.trim(),
                    dmkho_loai: formData.loai_kho?.ma,
                    dmkho_khoa: formData.khoa?.ma,
                    dmkho_trangthai: isHoatDong ? 'Y' : 'N'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Xử lý các lỗi khác từ API
                if (data.field) {
                    setErrors(prev => ({ ...prev, [data.field]: true }));
                    
                    // Focus vào trường lỗi
                    switch (data.field) {
                        case 'ten_kho':
                            tenKhoRef.current?.focus();
                            break;
                        case 'loai_kho':
                            loaiKhoRef.current?.focus();
                            break;
                    }

                    setSnackbar({
                        open: true,
                        message: data.message,
                        severity: 'error'
                    });
                }
                return;
            }

            // Thành công
            setSnackbar({
                open: true,
                message: 'Thêm kho mới thành công',
                severity: 'success'
            });

            // Reset form và đóng popup
            setFormData({
                ma_kho: '',
                ten_kho: '',
                loai_kho: null,
                khoa: null,
                trang_thai: 'Y'
            });
            setIsHoatDong(true);
            
            // Gọi callback để cập nhật dữ liệu
            onSubmit(data);
            
            // Đóng popup sau 1 giây để người dùng thấy thông báo thành công
            setTimeout(() => {
                onClose();
            }, 1000);

        } catch (error: any) {
            // Xử lý lỗi hệ thống
            setSnackbar({
                open: true,
                message: 'Có lỗi xảy ra khi xử lý yêu cầu',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFieldFocus = (field: string) => {
        // Reset error và snackbar khi focus vào trường
        setErrors(prev => ({ ...prev, [field]: false }));
        setSnackbar(prev => ({ ...prev, open: false }));
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

    const handleButtonClick = () => {
        handleButtonSubmit();
    };

    if (!isOpen) return null;

    return (
        <>
            <style jsx global>{styles}</style>
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

                    <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
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
                                        onChange={handleMaKhoChange}
                                        onKeyDown={handleMaKhoKeyDown}
                                        onBlur={handleMaKhoBlur}
                                        onFocus={handleMaKhoFocus}
                                        className={`w-full h-9 px-3 py-1 bg-white border transition-all duration-200 
                                            ${errors.ma_kho 
                                                ? 'border-red-500 ring-1 ring-red-500 animate-shake' 
                                                : 'border-gray-300'
                                            } 
                                            rounded-md text-sm 
                                            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                            ${errors.ma_kho ? 'focus:border-red-500 focus:ring-red-500' : ''}`
                                        }
                                        placeholder="Nhập mã kho..."
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
                                        onChange={handleTenKhoChange}
                                        onKeyDown={handleTenKhoKeyDown}
                                        onBlur={handleTenKhoBlur}
                                        onFocus={() => handleFieldFocus('ten_kho')}
                                        className={`w-full h-9 px-3 py-1 bg-white border ${errors.ten_kho ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
                                            onChange={handleLoaiKhoChange}
                                            options={danhSachLoaiKho}
                                            placeholder="Chọn loại kho"
                                            className={`z-[9999] ${errors.loai_kho ? 'border-red-500 ring-1 ring-red-500' : ''}`}
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
                                            onChange={handleKhoaChange}
                                            options={danhSachKhoa}
                                            placeholder="Chọn khoa"
                                            className={`z-[9998] ${errors.khoa ? 'border-red-500 ring-1 ring-red-500' : ''}`}
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
                                onClick={handleButtonClick}
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
        </>
    );
} 