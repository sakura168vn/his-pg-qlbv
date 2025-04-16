"use client";

import { FaSync } from 'react-icons/fa';
import ThongTinHanhChinh from "./giaodien/thongtinhanhchinh";
import DanhSachKham from './giaodien/danhsachkham';

const TiepDonPage = () => {
    return (
        <div className="h-[calc(100vh-76px)] p-1 gap-1 flex flex-col md:flex-row">
            <div className="w-full lg:w-2/3 bg-white shadow-lg rounded-xl">
                <div className="flex items-center justify-between text-lg font-semibold text-gray-700 border-b p-2">
                    <span>Thông Tin Hành Chính</span>
                    <button
                        onClick={() => { }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaSync className="text-blue-600 h-4 w-4" />
                    </button>
                </div>
                <ThongTinHanhChinh />                
            </div>
            <div className="w-full lg:w-1/3">
            </div>
        </div>
    );
};

export default TiepDonPage;
