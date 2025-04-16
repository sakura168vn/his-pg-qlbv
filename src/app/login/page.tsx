'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { CustomSnackbar, useSnackbar, useFormErrors, formStyles } from "@/components/ui/CustomSnackbar";
import { useLoading } from '@/contexts/LoadingContext';

const globalStyles = `
    form:invalid {
        box-shadow: none;
    }
    input:invalid {
        box-shadow: none;
    }
`;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoading, startLoading, stopLoading } = useLoading();
    
    // Sử dụng hook xử lý lỗi form
    const { errors, setError, resetErrors, resetError } = useFormErrors({
        username: false,
        password: false
    });
    
    // Sử dụng hook quản lý snackbar
    const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
    
    const router = useRouter();

    useEffect(() => {
        // Kiểm tra cookie thông báo đăng nhập
        const loginMessageCookie = Cookies.get('show-login-message');
        if (loginMessageCookie === 'error') {
            showSnackbar('Bạn phải đăng nhập để tiếp tục!', 'error');
            // Xóa cookie sau khi đã hiển thị thông báo
            Cookies.remove('show-login-message', { path: '/' });
        }
    }, [showSnackbar]);

    // Lấy tên đăng nhập từ cookie khi component mount
    useEffect(() => {
        const savedUsername = Cookies.get('lastUsername');
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    useEffect(() => {
        // Kiểm tra nếu đã đăng nhập thì chuyển hướng về trang admin
        const userCookie = Cookies.get('user');
        if (userCookie) {
            router.replace('/admin');
            
            // Thiết lập interval để cập nhật last_activity mỗi 5 phút
            const updateActivityInterval = setInterval(async () => {
                try {
                    const response = await fetch('/api/auth/update-activity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (!response.ok) {
                        console.error('Không thể cập nhật trạng thái hoạt động');
                    }
                } catch (error) {
                    console.error('Lỗi khi cập nhật trạng thái hoạt động:', error);
                }
            }, 5 * 60 * 1000); // 5 phút

            // Cleanup interval khi component unmount
            return () => clearInterval(updateActivityInterval);
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLoading) return; // Ngăn chặn submit khi đang loading
        
        // Reset lỗi
        resetErrors();
        
        // Kiểm tra trường tên đăng nhập trống
        if (!username.trim()) {
            setError('username', true);
            showSnackbar('Vui lòng nhập tên đăng nhập', 'error');
            return;
        }
        
        // Kiểm tra trường mật khẩu trống
        if (!password.trim()) {
            setError('password', true);
            showSnackbar('Vui lòng nhập mật khẩu', 'error');
            return;
        }
        
        startLoading();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.error) {
                    // Xử lý các lỗi cụ thể dựa vào errorCode
                    switch (data.errorCode) {
                        case 'USER_NOT_FOUND':
                            setError('username', true);
                            showSnackbar('Tài khoản đăng nhập không tồn tại!', 'error');
                            break;
                        case 'INVALID_PASSWORD':
                            setError('password', true);
                            showSnackbar('Mật khẩu không chính xác!', 'error');
                            break;
                        case 'ACCOUNT_INACTIVE':
                            showSnackbar('Tài khoản đã ngừng hoạt động!', 'error');
                            break;
                        case 'ALREADY_LOGGED_IN':
                            showSnackbar(`Tài khoản đang đăng nhập tại máy ${data.computerName}!`, 'error');
                            break;
                        default:
                            showSnackbar(data.error, 'error');
                            break;
                    }
                } else {
                    // Lưu tên đăng nhập vào cookie
                    Cookies.set('lastUsername', username.trim(), { expires: 30 });
                    
                    // Lưu thông tin user vào localStorage
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Đánh dấu là đã đăng nhập
                    sessionStorage.setItem('isLogin', 'true');
                    
                    // Chuyển hướng đến trang admin
                    router.push(data.user.defaultPath);
                }
            } else {
                showSnackbar(data.error || 'Lỗi đăng nhập', 'error');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            showSnackbar('Không thể kết nối đến máy chủ', 'error');
        } finally {
            stopLoading();
        }
    };

    return (
        <div 
            className="min-h-screen flex items-center justify-center"
            style={{ 
                backgroundImage: "url('/images/AnhNen04.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >        
            <style jsx global>{globalStyles}</style>
            <style jsx global>{formStyles}</style>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative z-10">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Đăng nhập</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <input
                        type="text"
                        placeholder="Tên đăng nhập"
                        className={`w-full p-2 border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 text-sm`}
                        value={username}
                        onChange={(e) => {
                            if (isLoading) return; // Ngăn chặn thay đổi khi đang loading
                            setUsername(e.target.value);
                            if (e.target.value.trim()) {
                                resetError('username');
                            }
                        }}
                        onFocus={() => resetError('username')}
                        disabled={isLoading}
                    />
                    
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className={`w-full p-2 border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 text-sm`}
                        value={password}
                        onChange={(e) => {
                            if (isLoading) return; // Ngăn chặn thay đổi khi đang loading
                            setPassword(e.target.value);
                            if (e.target.value.trim()) {
                                resetError('password');
                            }
                        }}
                        onFocus={() => resetError('password')}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Đăng Nhập"}
                    </button>
                </form>
                
                <CustomSnackbar
                    open={snackbar.open}
                    message={snackbar.message}
                    severity={snackbar.severity}
                    onClose={hideSnackbar}
                    autoHideDuration={1500}
                />
            </div>
        </div>
    );
};

export default LoginPage;
