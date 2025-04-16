"use client";

import { useEffect, useState } from 'react';
import CustomCombobox from "@/components/ui/CustomComboBox";

type LoaiOption = {
    ma_loai: string;
    ten_loai: string;
};

export default function ThietLapKho() {
    const [options, setOptions] = useState<{ ma: string; ten: string }[]>([]);
    const [selected, setSelected] = useState<{ ma: string; ten: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoaiOptions = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch('/api/apiQLDuoc/apidmLoai');

                if (!res.ok) {
                    throw new Error(`API error: ${res.status}`);
                }

                const data = await res.json();

                // Kiểm tra cấu trúc dữ liệu
                if (data.error) {
                    throw new Error(`API error: ${data.error} - ${data.details || ''}`);
                }

                // Kiểm tra nếu dữ liệu là mảng rỗng
                if (!data || (Array.isArray(data) && data.length === 0)) {
                    setError('Không có dữ liệu từ API');
                    setOptions([]);
                    return;
                }

                // Kiểm tra nếu dữ liệu có cấu trúc khác
                const rows = Array.isArray(data) ? data : (data.rows || []);

                if (rows.length === 0) {
                    setError('Không có dữ liệu từ API');
                    setOptions([]);
                    return;
                }

                // Kiểm tra cấu trúc của mỗi phần tử
                const formattedOptions = rows.map((item: any) => {
                    if (!item.ma_loai || !item.ten_loai) {
                        console.warn('Invalid item structure:', item);
                    }
                    return {
                        ma: item.ma_loai || '',
                        ten: item.ten_loai || ''
                    };
                });

                setOptions(formattedOptions);
            } catch (error) {
                console.error('Error fetching options:', error);
                setError('Lỗi khi tải dữ liệu: ' + (error instanceof Error ? error.message : String(error)));
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLoaiOptions();
    }, []);

    return (

        <div className="p-4 flex items-center gap-4 flex-nowrap">
            {/* Nhóm Loại Kho */}
            <div className="flex items-center w-[50%] gap-10">
                <label htmlFor="loaiKho" className=" whitespace-nowrap">Loại Kho</label>

                <div className="w-64">
                    <CustomCombobox
                        id="loaiKho"
                        options={options}
                        value={selected}
                        onChange={setSelected}
                        placeholder="Tìm theo loại..."
                    />
                </div>

            </div>

            {/* Nhóm Tên Kho */}
            <div className="flex items-center w-[50%] gap-10 flex-grow">
                <label htmlFor="tenKho" className=" whitespace-nowrap">Tên Kho</label>
                <input
                    type="text"
                    id="tenKho"
                    className="h-[38px] pl-2 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow min-w-0"
                    placeholder="Tìm theo tên..."
                />
            </div>
            
        </div>

    );
}