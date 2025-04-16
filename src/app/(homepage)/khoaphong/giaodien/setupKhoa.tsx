"use client";

import Image from "next/image";
import React, { useEffect, useState } from 'react';

const headerStyle = 'sticky top-0 border border-gray-300 px-4 py-2 text-center text-[13px] font-semibold bg-blue-600 text-white z-10';
const rowStyle = 'border border-gray-300 px-4 py-2 text-[13px]';

const TableHeader = () => (
    <tr className="bg-blue-600 text-white">
        <th className={`${headerStyle} `}>STT</th>
        <th className={`${headerStyle} `}>Tên Khoa Phòng</th>
    </tr>
);

export default function KhachHangPage() {
    return (
        <div className="bg-white p-4 m-4 rounded-md flex-1">
            <div className="relative">
                <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-[calc(100vh-260px)]">
                        <table className="w-full min-w-[1400px] whitespace-nowrap relative table-auto border-collapse">
                            <thead className="sticky top-0 z-10">
                                <TableHeader />
                            </thead>
                            <tbody className="bg-white">
                                <tr className="hover:bg-gray-50">
                                    <td className={`${rowStyle} text-center`}></td>
                                    <td className={`${rowStyle}`}></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}