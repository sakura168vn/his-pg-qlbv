"use client";

import Image from "next/image";
import React, { useEffect, useState } from 'react';

import { FaSync } from 'react-icons/fa';

const headerStyle = 'sticky top-0 border border-gray-300 px-4 py-2 text-center text-[13px] font-semibold bg-blue-600 text-white z-10';
const rowStyle = 'border border-gray-300 px-4 py-2 text-[13px]';

const columnWidths = {
    stt: 'w-[30px]',
    tenGiuong: 'w-[360px]',    
    hoatDong: 'w-[100px]',
}

const TableHeader = () => (
    <tr className="bg-blue-600 text-white">
        <th className={`${headerStyle} ${columnWidths.stt}`}>STT</th>
        <th className={`${headerStyle} ${columnWidths.tenGiuong}`}>Tên Giường</th>
        <th className={`${headerStyle} ${columnWidths.hoatDong}`}>Hoạt Động</th>
    </tr>
);

export default function FromSetupGiuongPage() {
    return (
        <div className="bg-white p-1 m-1 rounded-md flex-1">
            <div className="flex items-center justify-between mb-2 text-lg font-semibold text-gray-700 border-b pb-2">
                <span>Thông tin giường bệnh</span>
                <button
                    onClick={() => { }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaSync className={`text-blue-600 h-4 w-4 `} />
                </button>
            </div>
            <div className="relative">
                <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-[calc(100vh-260px)]">
                        <table className="w-full min-w-[100px] whitespace-nowrap relative table-auto border-collapse">
                            <thead className="sticky top-0 z-10">
                                <TableHeader />
                            </thead>
                            <tbody className="bg-white">
                                <tr className="hover:bg-gray-50">
                                    <td className={`${rowStyle} ${columnWidths.stt} text-center`}></td>
                                    <td className={`${rowStyle} ${columnWidths.tenGiuong}`}></td>                                    
                                    <td className={`${rowStyle} ${columnWidths.hoatDong}`}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}