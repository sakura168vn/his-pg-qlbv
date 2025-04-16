"use client";

import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { MdLibraryAdd } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBack2Line } from "react-icons/ri";
import { LuSaveAll } from "react-icons/lu";
import { TiCancel } from "react-icons/ti";
import ComboboxLoaiKhoa from '@/components/ui/cbLoaiKhoa';
import ComboboxNguoiPhuTrach from "@/components/ui/cbNguoiPhuTrach";
import ButtonCRUD from "@/components/ui/ButtonCRUD";

export default function FromSetupThongTinPage() {
    const [loaiKhoa, setLoaiKhoa] = useState('');
    const [nguoiPhuTrach, setNguoiPhuTrach] = useState('');

    return (
        <div className="bg-white p-1 m-1 rounded-md flex-1">
            <div className="relative">
                <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-[calc(100vh-260px)]">
                        <div className="flex gap-4 items-end">
                            {/* Nhóm "Mã" */}
                            <div className="flex flex-col w-[35%]">
                                <div className="relative pt-4">
                                    <input
                                        type="text"
                                        id="maKhoa"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="maKhoa"
                                        className="absolute left-8 top-1 text-sm text-gray-700 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs bg-white px-1"
                                    >
                                        Mã
                                    </label>
                                </div>

                            </div>

                            {/* Nhóm "Loại" */}
                            <div className="flex flex-col w-[65%]">
                                <div className="relative pt-4">
                                    <input
                                        type="text"
                                        id="tenKhoa"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="tenKhoa"
                                        className="absolute left-8 top-1 text-sm text-gray-700 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs bg-white px-1"
                                    >
                                        Tên Khoa Phòng
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 items-end">
                            <div className="flex flex-col w-[35%]">
                                <div className="relative pt-4">
                                    <ComboboxLoaiKhoa
                                        value={loaiKhoa}
                                        onChange={setLoaiKhoa}
                                        className="w-full"
                                    />
                                    <label
                                        htmlFor="loaiKhoa"
                                        className="absolute left-8 top-1 text-sm text-gray-700 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs bg-white px-1"
                                    >
                                        Loại
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col w-[65%]">
                                <div className="relative pt-4">
                                    <ComboboxNguoiPhuTrach
                                        value={nguoiPhuTrach}
                                        onChange={setNguoiPhuTrach}
                                        className="w-full"
                                    />

                                    <label
                                        htmlFor="nguoiPhuTrach"
                                        className="absolute left-8 top-1 text-sm text-gray-700 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs bg-white px-1"
                                    >
                                        Người Phụ Trách
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-[100%]">
                            <div className="relative pt-4">
                                <input
                                    type="text"
                                    id="viTri"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="peer w-full h-[38px] pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="viTri"
                                    className="absolute left-8 top-1 text-sm text-gray-700 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs bg-white px-1"
                                >
                                    Vị Trí
                                </label>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    );
}
