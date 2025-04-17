'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';

interface DSHoSoChiTietProps {
    searchParams?: {
        nam: string;
        dangDieuTri: boolean;
        raVien: boolean;
        locTreEm: boolean;
        locTheHN: boolean;
        tinhTP: string;
        soHS?: string;
        soDT?: string;
        maKhoa?: string;
    };
    data: any[];
    loading: boolean;
    error: string | null;
}

const columnWidths = {
    stt: 'w-[30px]',
    maHS: 'w-[70px]',
    hoTen: 'w-[150px]',
    ngaySinh: 'w-[90px]',
    gioiTinh: 'w-[50px]',
    maKhoa: 'w-[80px]',
    icd: 'w-[80px]',
    chanDoan: 'w-[360px] min-w-[360px] max-w-[360px] truncate overflow-hidden text-ellipsis',
    ngayVaoVien: 'w-[130px]',
    doiTuong: 'w-[130px]',
    maThe: 'w-[150px]',
    tyle: 'w-[60px]',
    diaChi: 'w-[200px] min-w-[200px] max-w-[200px] truncate overflow-hidden text-ellipsis',
    phuongXa: 'w-[150px]',
    quanHuyen: 'w-[150px]',
    tinhTP: 'w-[150px]',
    cmnd: 'w-[80px]',
    sdt: 'w-[80px]'
};

const headerStyle = 'sticky top-0 border border-gray-300 px-4 py-2 text-center text-[13px] font-semibold bg-blue-600 text-white z-10';
const rowStyle = 'border border-gray-300 px-4 py-2 text-[13px]';

const TableHeader = () => (
    <tr className="bg-blue-600 text-white">
        <th className={`${headerStyle} ${columnWidths.stt}`}>STT</th>
        <th className={`${headerStyle} ${columnWidths.maHS}`}>Mã HS</th>
        <th className={`${headerStyle} ${columnWidths.hoTen}`}>Họ Và Tên</th>
        <th className={`${headerStyle} ${columnWidths.ngaySinh}`}>Ngày Sinh</th>        
        <th className={`${headerStyle} ${columnWidths.gioiTinh}`}>Giới</th>
        <th className={`${headerStyle} ${columnWidths.sdt}`}>Số ĐT</th>
        <th className={`${headerStyle} ${columnWidths.maKhoa}`}>Mã Khoa</th>
        <th className={`${headerStyle} ${columnWidths.icd}`}>ICD</th>
        <th className={`${headerStyle} ${columnWidths.chanDoan}`}>Chẩn Đoán</th>
        <th className={`${headerStyle} ${columnWidths.ngayVaoVien}`}>Ngày Vào Viện</th>
        <th className={`${headerStyle} ${columnWidths.doiTuong}`}>Đối Tượng</th>
        <th className={`${headerStyle} ${columnWidths.maThe}`}>Mã Thẻ BHYT</th>
        <th className={`${headerStyle} ${columnWidths.tyle}`}>(%)</th>
        <th className={`${headerStyle} ${columnWidths.cmnd}`}>Số CMND</th>
        <th className={`${headerStyle} ${columnWidths.diaChi}`}>Địa Chỉ</th>
        <th className={`${headerStyle} ${columnWidths.phuongXa}`}>Phường/Xã</th>
        <th className={`${headerStyle} ${columnWidths.quanHuyen}`}>Quận/Huyện</th>
        <th className={`${headerStyle} ${columnWidths.tinhTP}`}>Tỉnh/TP</th>                
    </tr>
);

const DSHoSoChiTiet: React.FC<DSHoSoChiTietProps> = ({ searchParams, data, loading, error }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-2">
            {error && (
                <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 rounded">
                    {error}
                </div>
            )}
            <div className="relative">
                <div className="overflow-x-auto">
                    <div className="overflow-y-auto max-h-[calc(100vh-260px)]">
                        <table className="w-full min-w-[1400px] whitespace-nowrap relative table-auto border-collapse">
                            <thead className="sticky top-0 z-10">
                                <TableHeader />
                            </thead>
                            <tbody className="bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={18} className="text-center py-8">
                                            <div className="flex items-center justify-center space-x-2">
                                                <FaSync className="animate-spin text-blue-600" />
                                                <span className="text-gray-600">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={18} className="text-center py-8 text-gray-500">
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((row, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className={`${rowStyle} text-center ${columnWidths.stt}`}>{row.ds_stt}</td>
                                            <td className={`${rowStyle} ${columnWidths.maHS}`}>{row.ds_sohoso}</td>
                                            <td className={`${rowStyle} ${columnWidths.hoTen}`}>{row.ds_hoten}</td>
                                            <td className={`${rowStyle} text-center ${columnWidths.ngaySinh}`}>{row.ds_ngaysinh}</td>
                                            <td className={`${rowStyle} text-center ${columnWidths.gioiTinh}`}>{row.ds_gioitinh}</td>
                                            <td className={`${rowStyle} ${columnWidths.sdt}`}>{row.ds_sodt}</td>
                                            <td className={`${rowStyle} ${columnWidths.maKhoa}`}>{row.ds_makhoa_dt}</td>
                                            <td className={`${rowStyle} ${columnWidths.icd}`}>{row.ds_icd10}</td>
                                            <td className={`${rowStyle} ${columnWidths.chanDoan}`}>{row.ds_chandoan}</td>
                                            <td className={`${rowStyle} text-center ${columnWidths.ngayVaoVien}`}>{row.ds_ngayvaokhoa}</td>
                                            <td className={`${rowStyle} ${columnWidths.doiTuong}`}>{row.ds_doituong}</td>
                                            <td className={`${rowStyle} ${columnWidths.maThe}`}>{row.ds_mathe}</td>
                                            <td className={`${rowStyle} text-center ${columnWidths.tyle}`}>{row.ds_tylethe}</td>
                                            <td className={`${rowStyle} ${columnWidths.cmnd}`}>{row.ds_cmnd}</td>
                                            <td className={`${rowStyle} ${columnWidths.diaChi}`}>{row.ds_diachi}</td>
                                            <td className={`${rowStyle} ${columnWidths.phuongXa}`}>{row.ds_phuong_xa}</td>
                                            <td className={`${rowStyle} ${columnWidths.quanHuyen}`}>{row.ds_quan_huyen}</td>
                                            <td className={`${rowStyle} ${columnWidths.tinhTP}`}>{row.ds_tinh_thanhpho}</td>                                                                                        
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DSHoSoChiTiet;
