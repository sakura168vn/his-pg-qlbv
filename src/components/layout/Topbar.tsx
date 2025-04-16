"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { Menu, MenuItem, Divider, ListItemIcon, TextField, Button } from "@mui/material";
import { MdMenuOpen, MdOutlineMenu } from "react-icons/md";
import Image from "next/image";
import { Logout } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { motion, AnimatePresence } from "framer-motion";
import { getPageTitle } from "@/config/menu";
import { CustomSnackbar } from "@/components/ui/CustomSnackbar";

/**
 * Hướng dẫn xử lý form và hiển thị lỗi trong toàn bộ dự án:
 * 
 * 1. Khi hiển thị lỗi với Snackbar:
 *    - Luôn đi kèm với việc đánh dấu trường input lỗi bằng viền đỏ
 *    - Sử dụng state errors để theo dõi trạng thái lỗi của các trường
 *      const [errors, setErrors] = useState({ field1: false, field2: false })
 *
 * 2. Đối với Material UI TextField:
 *    - Tạo style cho trường lỗi:
 *      '& fieldset': { borderColor: errors.field ? '#ef4444' : '#e5e7eb' }
 *    - Reset lỗi khi người dùng focus:
 *      onFocus={() => setErrors(prev => ({ ...prev, field: false }))}
 *
 * 3. Đối với input HTML thông thường:
 *    - Sử dụng class động:
 *      className={`... ${errors.field ? 'border-red-500' : 'border-gray-300'}`}
 * 
 * 4. Reset tất cả lỗi khi bắt đầu xác thực form và khi mở/đóng form:
 *    - Tạo hàm resetAllErrors để gọi khi cần
 */

interface TopbarProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isCollapsed: boolean;
}

// Styles chung cho toàn bộ ứng dụng
const globalStyles = `
    label, h2, span, div {
        font-family: 'Roboto', sans-serif !important;
    }
`;

// Thêm global styles mặc định cho tất cả các biểu mẫu trong dự án
const formGlobalStyles = `
    * {
        font-family: 'Roboto', sans-serif;
    }
    
    form:invalid {
        box-shadow: none;
    }
    input:invalid {
        box-shadow: none;
    }
    .error-input {
        border-color: #ef4444 !important;
    }
    .error-input:focus {
        border-color: #dc2626 !important;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1) !important;
    }
    .success-input {
        border-color: #10b981 !important;
    }
    .success-input:focus {
        border-color: #059669 !important;
        box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1) !important;
    }
`;

const Topbar: React.FC<TopbarProps> = ({ isSidebarOpen, toggleSidebar, isCollapsed }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
    const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [userIdToReset, setUserIdToReset] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        oldPassword: false,
        newPassword: false,
        userIdToReset: false
    });
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error';
    }>({
        open: false,
        message: '',
        severity: 'success'
    });

    // Lấy thông tin người dùng từ cookie
    const [userData, setUserData] = useState<{
        username: string;
        name: string;
        ma_khoa?: string;
        so_dien_thoai?: string;
        ip: string;
        hostname: string;
        computerName: string;
    }>({
        username: '',
        name: 'Người dùng',
        ip: '',
        hostname: '',
        computerName: '',
    });

    useEffect(() => {
        // Lấy thông tin người dùng từ cookie khi component mount
        try {
            const userCookie = Cookies.get('user');
            if (userCookie) {
                const parsedUser = JSON.parse(userCookie);
                setUserData(parsedUser);
            }
        } catch (error) {
            console.error('Lỗi khi đọc cookie:', error);
        }
    }, []);

    // Tên hiển thị và username lấy từ thông tin người dùng
    const hoten = userData.name || 'Người dùng';
    const username = userData.username || '';

    // Thêm hàm xử lý phím Esc
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isChangePasswordVisible) {
                setChangePasswordVisible(false);
                setOldPassword("");
                setNewPassword("");
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isChangePasswordVisible]);

    const router = useRouter();
    const handleProfileNguoidung = () => {
        router.push("/nguoidung");
    };

    const handleLogout = async () => {
        try {
            handleClose(); // Đóng menu trước khi xử lý đăng xuất

            // Lấy thông tin user từ cookie
            const userCookie = Cookies.get('user');
            if (userCookie) {
                const userData = JSON.parse(userCookie);
                
                // Gọi API đăng xuất với thông tin chính xác
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userData.username,
                        computerName: userData.computerName
                    }),
                });
            }

            // Xóa cookie user
            Cookies.remove('user', {
                path: '/',
                secure: true,
                sameSite: 'strict'
            });

            // Xóa sessionStorage
            sessionStorage.clear();

            // Chuyển hướng trực tiếp đến trang login
            router.push('/login');
        } catch (error) {
            console.error('Lỗi đăng xuất:', error);
            router.push('/login');
        }
    };

    const pathname = usePathname();
    const currentTitle = getPageTitle(pathname) || "";

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Hàm reset tất cả lỗi
    const resetAllErrors = () => {
        setErrors({
            oldPassword: false,
            newPassword: false,
            userIdToReset: false
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangePassword = async () => {
        // Reset lỗi
        resetAllErrors();

        // 1. Kiểm tra mật khẩu cũ trước tiên
        if (!oldPassword) {
            setErrors(prev => ({ ...prev, oldPassword: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập mật khẩu cũ',
                severity: 'error'
            });
            return;
        }

        // 2. Kiểm tra mật khẩu mới
        if (!newPassword) {
            setErrors(prev => ({ ...prev, newPassword: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập mật khẩu mới',
                severity: 'error'
            });
            return;
        }

        // 3. Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            setErrors(prev => ({ ...prev, newPassword: true }));
            setSnackbar({
                open: true,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                severity: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/password-change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    oldPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            // Kiểm tra lỗi xác thực từ response thành công với flag lỗi
            if (data.errorCode === 'INVALID_PASSWORD') {
                // Hiển thị lỗi mật khẩu không chính xác trực tiếp lên Snackbar
                setErrors(prev => ({ ...prev, oldPassword: true }));
                setSnackbar({
                    open: true,
                    message: 'Mật khẩu cũ không chính xác!',
                    severity: 'error'
                });
                return; // Kết thúc hàm, không cần throw lỗi
            }

            if (!response.ok) {
                // Xử lý các loại lỗi cụ thể
                if (data.errorCode === 'USER_NOT_FOUND') {
                    // Hiển thị lỗi tài khoản không tồn tại trực tiếp lên Snackbar
                    setSnackbar({
                        open: true,
                        message: 'Tài khoản đăng nhập không tồn tại!',
                        severity: 'error'
                    });
                    return; // Kết thúc hàm, không cần throw lỗi
                } else if (data.errorCode === 'WEAK_PASSWORD') {
                    // Hiển thị lỗi mật khẩu yếu trực tiếp lên Snackbar
                    setErrors(prev => ({ ...prev, newPassword: true }));
                    setSnackbar({
                        open: true,
                        message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                        severity: 'error'
                    });
                    return; // Kết thúc hàm, không cần throw lỗi
                } else {
                    throw new Error(data.error || 'Có lỗi xảy ra khi thay đổi mật khẩu');
                }
            }

            setSnackbar({
                open: true,
                message: 'Thay đổi mật khẩu thành công',
                severity: 'success'
            });

            // Đóng popup và reset form sau khi thành công
            setChangePasswordVisible(false);
            setOldPassword("");
            setNewPassword("");
            setUserIdToReset("");
            resetAllErrors();
        } catch (error: any) {
            // Chỉ log lỗi hệ thống, không log lỗi xác thực để tránh lộ thông tin
            if (error.message !== 'Mật khẩu cũ không chính xác!' &&
                error.message !== 'Tài khoản đăng nhập không tồn tại!' &&
                error.message !== 'Mật khẩu mới phải có ít nhất 6 ký tự') {
                console.error('Lỗi thay đổi mật khẩu:', error);
            }

            setSnackbar({
                open: true,
                message: error.message || 'Có lỗi xảy ra khi thay đổi mật khẩu',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm xử lý hiển thị popup reset
    const handleShowResetPopup = () => {
        setIsResetPasswordVisible(true);
        setUserIdToReset("");
        setErrors(prev => ({ ...prev, userIdToReset: false }));
    };

    // Hàm xử lý đóng popup reset
    const handleCloseResetPopup = () => {
        setIsResetPasswordVisible(false);
        setUserIdToReset("");
        setErrors(prev => ({ ...prev, userIdToReset: false }));
    };

    // Hàm xử lý reset mật khẩu
    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Reset lỗi
        resetAllErrors();

        // Kiểm tra tên đăng nhập để reset
        if (!userIdToReset.trim()) {
            setErrors(prev => ({ ...prev, userIdToReset: true }));
            setSnackbar({
                open: true,
                message: 'Vui lòng nhập tên đăng nhập cần reset',
                severity: 'error'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adminUsername: username,
                    userIdToReset: userIdToReset.trim()
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSnackbar({
                    open: true,
                    message: data.message || 'Đã reset mật khẩu thành công',
                    severity: 'success'
                });

                // Đóng popup reset sau khi reset thành công
                setUserIdToReset("");
                setIsResetPasswordVisible(false);
                resetAllErrors();
            } else {
                setSnackbar({
                    open: true,
                    message: data.error || 'Có lỗi xảy ra khi reset mật khẩu',
                    severity: 'error'
                });
            }
        } catch (error: any) {
            // Không ghi log các lỗi xác thực để tránh hiển thị thông tin nhạy cảm
            if (error.message !== 'Tài khoản không tồn tại trong hệ thống') {
                console.error('Lỗi reset mật khẩu:', error);
            }

            setSnackbar({
                open: true,
                message: error.message || 'Có lỗi xảy ra khi reset mật khẩu',
                severity: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm xử lý đóng popup
    const handleClosePasswordChange = () => {
        setChangePasswordVisible(false);
        setOldPassword("");
        setNewPassword("");
        setUserIdToReset("");
        resetAllErrors();
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <div className={`fixed top-0 right-0 bg-white shadow-md z-40 h-[72px] transition-all duration-300 ease-in-out ${isSidebarOpen ? (isCollapsed ? "left-16" : "left-72") : "left-0"} font-roboto`}>
            <div className="h-full flex items-center px-6">
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition-colors duration-300"
                        onClick={toggleSidebar}
                    >
                        <AnimatePresence mode="wait">
                            {isSidebarOpen ? (
                                <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <MdMenuOpen className="w-6 h-6 text-gray-600" />
                                </motion.div>
                            ) : (
                                <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <MdOutlineMenu className="w-6 h-6 text-gray-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>

                <div className="ml-8 flex-1 flex">
                    <h2 className="relative inline-block font-bold text-[#0054a6] min-w-max after:block after:w-full after:h-[2px] after:bg-black after:mt-[5px]">
                        {currentTitle}
                    </h2>
                </div>

                <div className="ml-8 flex items-center gap-2">
                    <div
                        className="hidden md:flex items-center gap-4 bg-white p-2 px-6 rounded-full shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 w-[280px]"
                        onClick={handleClick}
                    >
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-semibold text-[#0054a6] truncate">{hoten}</span>
                            <span className="text-xs text-gray-500 truncate">{username}</span>
                        </div>
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                                <Image
                                    src="/icons/avatar.png"
                                    alt="Avatar"
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                    </div>

                    <div
                        className="md:hidden p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 transition-colors duration-300 cursor-pointer relative"
                        onClick={handleClick}
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                            <Image
                                src="/icons/avatar.png"
                                alt="Avatar"
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                    </div>

                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        slotProps={{
                            paper: {
                                elevation: 3,
                                sx: {
                                    overflow: "visible",
                                    filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.1))",
                                    mt: 1.5,
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "16px",
                                    minWidth: "300px",
                                    "&::before": {
                                        content: '""',
                                        display: "block",
                                        position: "absolute",
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: "background.paper",
                                        transform: "translateY(-50%) rotate(45deg)",
                                        zIndex: 0,
                                        borderTop: "1px solid #e5e7eb",
                                        borderLeft: "1px solid #e5e7eb",
                                    },
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        anchorPosition={{ top: 0, left: 0 }}
                    >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                                    <Image
                                        src="/icons/avatar.png"
                                        alt="Avatar"
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#0054a6] text-sm">{hoten}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{username}</div>
                                </div>
                            </div>
                        </div>

                        <MenuItem onClick={handleProfileNguoidung} sx={{
                            color: "#4b5563",
                            py: 1,
                            px: 2,
                            mx: 1,
                            mt: 1,
                            borderRadius: "6px",
                            '&:hover': {
                                backgroundColor: '#f3f4f6',
                                color: '#0054a6',
                                transform: 'translateX(4px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}>
                            <AccountCircleIcon sx={{
                                color: "inherit",
                                mr: 1.5,
                                fontSize: "1.1rem",
                                transition: 'all 0.2s ease-in-out'
                            }} />
                            <span className="font-medium text-sm">Thông Tin Cá Nhân</span>
                        </MenuItem>

                        <MenuItem onClick={() => {
                            setChangePasswordVisible(true);
                            resetAllErrors();
                            handleClose();
                        }} sx={{
                            color: "#4b5563",
                            py: 1,
                            px: 2,
                            mx: 1,
                            mt: 0.5,
                            borderRadius: "6px",
                            '&:hover': {
                                backgroundColor: '#f3f4f6',
                                color: '#0054a6',
                                transform: 'translateX(4px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}>
                            <AdminPanelSettingsIcon sx={{
                                color: "inherit",
                                mr: 1.5,
                                fontSize: "1.1rem",
                                transition: 'all 0.2s ease-in-out'
                            }} />
                            <span className="font-medium text-sm">Thay Đổi Mật Khẩu</span>
                        </MenuItem>

                        <Divider sx={{ my: 1 }} />

                        <MenuItem onClick={handleLogout} sx={{
                            color: "#ef4444",
                            py: 1,
                            px: 2,
                            mx: 1,
                            mt: 0.5,
                            borderRadius: "6px",
                            '&:hover': {
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                transform: 'translateX(4px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}>
                            <ListItemIcon>
                                <Logout sx={{
                                    color: "inherit",
                                    fontSize: "1.1rem",
                                    transition: 'all 0.2s ease-in-out'
                                }} />
                            </ListItemIcon>
                            <span className="font-medium text-sm">Đăng Xuất</span>
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            {isChangePasswordVisible && (
                <div
                    className="fixed inset-0 z-[100] flex items-start justify-center bg-black/30 backdrop-blur-sm"
                >
                    <div
                        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative mt-[88px] font-roboto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-medium text-gray-900">Thay đổi mật khẩu</h2>
                                <button
                                    onClick={handleClosePasswordChange}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                    {hoten}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                                    {username}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
                                <TextField
                                    type="password"
                                    fullWidth
                                    size="small"
                                    value={oldPassword}
                                    onChange={(e) => {
                                        setOldPassword(e.target.value);
                                        setErrors(prev => ({ ...prev, oldPassword: false }));
                                    }}
                                    onFocus={() => setErrors(prev => ({ ...prev, oldPassword: false }))}
                                    autoFocus
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontFamily: 'Roboto, sans-serif',
                                            '& fieldset': {
                                                borderColor: errors.oldPassword ? '#ef4444' : '#e5e7eb',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: errors.oldPassword ? '#dc2626' : '#0054a6',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0054a6',
                                            },
                                        },
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                <TextField
                                    type="password"
                                    fullWidth
                                    size="small"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setErrors(prev => ({ ...prev, newPassword: false }));
                                    }}
                                    onFocus={() => setErrors(prev => ({ ...prev, newPassword: false }))}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontFamily: 'Roboto, sans-serif',
                                            '& fieldset': {
                                                borderColor: errors.newPassword ? '#ef4444' : '#e5e7eb',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: errors.newPassword ? '#dc2626' : '#0054a6',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#0054a6',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            {username === 'admin' && (
                                <Button
                                    variant="outlined"
                                    onClick={handleShowResetPopup}
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        marginRight: 'auto',
                                        color: '#ef4444',
                                        borderColor: '#ef4444',
                                        '&:hover': {
                                            borderColor: '#dc2626',
                                            color: '#dc2626',
                                            backgroundColor: 'rgba(220, 38, 38, 0.04)',
                                        },
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                            <div className="flex gap-3">
                                <Button
                                    variant="outlined"
                                    onClick={handleClosePasswordChange}
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        color: '#4b5563',
                                        borderColor: '#e5e7eb',
                                        '&:hover': {
                                            borderColor: '#0054a6',
                                            color: '#0054a6',
                                        },
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleChangePassword}
                                    disabled={isSubmitting}
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        backgroundColor: '#0054a6',
                                        '&:hover': {
                                            backgroundColor: '#004494',
                                        },
                                    }}
                                >
                                    {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Popup Reset Password */}
            {isResetPasswordVisible && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 backdrop-blur-sm"
                >
                    <div
                        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative font-roboto animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'fadeIn 0.2s ease-out' }}
                    >
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-medium text-[#0054a6]">Reset mật khẩu</h2>
                                <button
                                    onClick={handleCloseResetPopup}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleResetPassword} className="p-6">
                            <div className="space-y-4">
                                <div className="text-sm text-gray-500 mt-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                                    <label className="block text-sm text-gray-700 mb-4">Tên đăng nhập cần reset</label>
                                    (Mật khẩu sẽ được đặt về mật khẩu mặc định <span className="font-bold text-blue-700">123</span>.)
                                </div>
                                <div>

                                    <TextField
                                        type="text"
                                        fullWidth
                                        size="small"
                                        placeholder="Nhập tài khoản cần reset..."
                                        value={userIdToReset}
                                        onChange={(e) => {
                                            setUserIdToReset(e.target.value);
                                            setErrors(prev => ({ ...prev, userIdToReset: false }));
                                        }}
                                        onFocus={() => setErrors(prev => ({ ...prev, userIdToReset: false }))}
                                        autoFocus
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontFamily: 'Roboto, sans-serif',
                                                '& fieldset': {
                                                    borderColor: errors.userIdToReset ? '#ef4444' : '#e5e7eb',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: errors.userIdToReset ? '#dc2626' : '#0054a6',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#0054a6',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseResetPopup}
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        color: '#4b5563',
                                        borderColor: '#e5e7eb',
                                        '&:hover': {
                                            borderColor: '#0054a6',
                                            color: '#0054a6',
                                        },
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting}
                                    sx={{
                                        fontFamily: 'Roboto, sans-serif',
                                        backgroundColor: '#ef4444',
                                        '&:hover': {
                                            backgroundColor: '#dc2626',
                                        },
                                    }}
                                >
                                    {isSubmitting ? "Đang xử lý..." : "Reset mật khẩu"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <CustomSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
                autoHideDuration={850}
            />

            <style jsx global>{globalStyles}</style>
            <style jsx global>{formGlobalStyles}</style>
        </div>
    );
};

export default Topbar;
