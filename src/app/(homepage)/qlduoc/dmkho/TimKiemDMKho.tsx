"use client";

import { useEffect, useState } from 'react';
import CustomCombobox from "@/components/ui/CustomComboBox";

type LoaiOption = {
    ma_loai: string;
    ten_loai: string;
};

type ThietLapKhoProps = {
    onSearch: (searchParams: { loaiKho: string | null; tenKho: string }) => void;
};

export default function ThietLapKho({ onSearch }: ThietLapKhoProps) {
    const [options, setOptions] = useState<{ ma: string; ten: string }[]>([]);
    const [selected, setSelected] = useState<{ ma: string; ten: string } | null>(null);
    const [tenKho, setTenKho] = useState('');
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
                console.log('API Response:', data); // Debug log

                if (data.error) {
                    throw new Error(`API error: ${data.error} - ${data.details || ''}`);
                }

                if (!data || (Array.isArray(data) && data.length === 0)) {
                    setError('Không có dữ liệu từ API');
                    setOptions([]);
                    return;
                }

                const rows = Array.isArray(data) ? data : (data.rows || []);

                if (rows.length === 0) {
                    setError('Không có dữ liệu từ API');
                    setOptions([]);
                    return;
                }

                const formattedOptions = rows.map((item: any) => {
                    if (!item.ma_loai || !item.ten_loai) {
                        console.warn('Invalid item structure:', item);
                    }
                    return {
                        ma: item.dmloai_ma || item.ma_loai || '',
                        ten: item.dmloai_ten || item.ten_loai || ''
                    };
                });

                console.log('Formatted Options:', formattedOptions); // Debug log
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

    const handleSearch = () => {
        onSearch({
            loaiKho: selected?.ma || null,
            tenKho: tenKho
        });
    };

    const handleTenKhoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLoaiKhoChange = (value: { ma: string; ten: string } | null) => {
        console.log('Selected value:', value); // Debug log
        setSelected(value);
        onSearch({
            loaiKho: value?.ma || null,
            tenKho: tenKho
        });
    };

    const handleTenKhoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTenKho(value);
        if (value === '') {
            onSearch({
                loaiKho: selected?.ma || null,
                tenKho: ''
            });
        }
    };

    return (
        <div className="p-4 flex items-center gap-4 flex-nowrap">
            <div className="flex items-center w-[50%] gap-10">
                <label htmlFor="loaiKho" className="whitespace-nowrap">Loại Kho</label>
                <div className="w-64">
                    <CustomCombobox
                        id="loaiKho"
                        options={options}
                        value={selected}
                        onChange={handleLoaiKhoChange}
                        placeholder="Tìm theo loại..."
                    />
                </div>
            </div>

            <div className="flex items-center w-[50%] gap-10 flex-grow">
                <label htmlFor="tenKho" className="whitespace-nowrap">Tên Kho</label>
                <input
                    type="text"
                    id="tenKho"
                    value={tenKho}
                    onChange={handleTenKhoChange}
                    onKeyDown={handleTenKhoKeyDown}
                    className="h-[38px] pl-2 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow min-w-0"
                    placeholder="Tìm theo tên..."
                />
            </div>
        </div>
    );
}