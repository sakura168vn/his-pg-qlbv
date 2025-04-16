"use client";

import React, { useState, useMemo } from 'react';
import {
    TextField,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormLabel,
    FormControl,
    InputLabel,
    Autocomplete,
    Box,
} from '@mui/material';

export default function ThongTinHanhChinh() {
    const [gender, setGender] = useState('male');

    // Định nghĩa các styles chung
    const commonInputStyles = "h-[30px] pl-2 pr-1 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    const commonLabelStyles = "text-sm whitespace-nowrap";

    return (
        <div className="bg-white p-2 m-2 rounded-md flex-1 border border-gray-300">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {/* Mã BN */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblMaBN" className={`w-[100px] ${commonLabelStyles}`}>
                        Mã BN
                    </label>
                    <input
                        type="text"
                        id="txtMaBN"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Mã HS */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblMaHS" className={`w-[80px] ${commonLabelStyles}`}>
                        Mã HS
                    </label>
                    <input
                        type="text"
                        id="txtMaHS"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Mã thẻ BHYT */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblMaTheBHYT" className={`w-[110px] ${commonLabelStyles}`}>
                        Mã Thẻ BHYT
                    </label>
                    <input
                        type="text"
                        id="txtMaTheBHYT"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Họ Và Tên */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblHoVaTen" className={`w-[100px] ${commonLabelStyles}`}>
                        Họ Và Tên
                    </label>
                    <input
                        type="text"
                        id="txtHoVaTen"
                        className={`${commonInputStyles} w-[372px]`}
                    />
                </div>

                {/* Tuổi */}
                <div className="flex items-center gap-2 min-w-[250px]">
                    <label htmlFor="lblTuoi" className={`w-[110px] ${commonLabelStyles}`}>
                        Tuổi
                    </label>
                    <input
                        type="text"
                        id="txtTuoi"
                        className={`${commonInputStyles} w-[145px]`}
                    />
                </div>

                {/* Giới Tính */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblGioi" className={`w-[100px] ${commonLabelStyles} pl-2`}>
                        Giới Tính
                    </label>
                    <RadioGroup
                        row
                        id="rdGioi"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        sx={{
                            '& .MuiRadio-root': {
                                color: '#1976d2',
                                padding: '4px'
                            },
                            '& .Mui-checked': {
                                color: '#1976d2',
                            },
                            '& .MuiFormControlLabel-root': {
                                marginRight: '8px'
                            },
                            gap: '10px'
                        }}
                    >
                        <FormControlLabel value="male" control={<Radio size="small" />} label="Nam" />
                        <FormControlLabel value="female" control={<Radio size="small" />} label="Nữ" />
                    </RadioGroup>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Quốc Tịch */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblQuocTich" className={`w-[100px] ${commonLabelStyles}`}>
                        Quốc Tịch
                    </label>
                    <input
                        type="text"
                        id="txtQuocTich"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Dân Tộc */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblDanToc" className={`w-[80px] ${commonLabelStyles}`}>
                        Dân Tộc
                    </label>
                    <input
                        type="text"
                        id="txtDanToc"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Nghề Nghiệp */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblNgheNghiep" className={`w-[110px] ${commonLabelStyles}`}>
                        Nghề Nghiệp
                    </label>
                    <input
                        type="text"
                        id="cbNgheNghiep"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Địa Chỉ Chi Tiết */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblDiaChiCT" className={`w-[100px] ${commonLabelStyles}`}>
                        Địa chỉ chi tiết
                    </label>
                    <input
                        type="text"
                        id="txDiaChiCT"
                        className={`${commonInputStyles} w-[372px]`}
                    />
                </div>

                {/* Phường Xã */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblPhuongXa" className={`w-[110px] ${commonLabelStyles}`}>
                        Phường/ Xã
                    </label>
                    <input
                        type="text"
                        id="txtPhuongXa"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Quận Huyện */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblQuanHuyen" className={`w-[100px] ${commonLabelStyles}`}>
                        Quận/ Huyện
                    </label>
                    <input
                        type="text"
                        id="txQuanHuyen"
                        className={`${commonInputStyles} w-[372px]`}
                    />
                </div>

                {/* Tỉnh Thành Phố */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblTinhThanhPho" className={`w-[110px] ${commonLabelStyles}`}>
                        Tỉnh/ TP
                    </label>
                    <input
                        type="text"
                        id="txtTinhThanhPho"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Số CCCD/CMND */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblSoCCCD" className={`w-[100px] ${commonLabelStyles}`}>
                        Số CCCD
                    </label>
                    <input
                        type="text"
                        id="txSoCCCD"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Ngày Cấp */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblNgayCap" className={`w-[80px] ${commonLabelStyles}`}>
                        Ngày Cấp
                    </label>
                    <input
                        type="text"
                        id="txNgayCap"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Nơi Cấp */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblNoiCap" className={`w-[110px] ${commonLabelStyles}`}>
                        Nơi Cấp
                    </label>
                    <input
                        type="text"
                        id="txtNoiCap"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Số Điện Thoại*/}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblSoDT" className={`w-[100px] ${commonLabelStyles}`}>
                        Số ĐT
                    </label>
                    <input
                        type="text"
                        id="txSoDT"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Quan Hệ */}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblQuanHe" className={`w-[80px] ${commonLabelStyles}`}>
                        Quan Hệ
                    </label>
                    <input
                        type="text"
                        id="txQuanHe"
                        className={`${commonInputStyles} w-[130px]`}
                    />
                </div>

                {/* Họ Và Tên Người Thân */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblTenNT" className={`w-[110px] ${commonLabelStyles}`}>
                        Tên Người Thân
                    </label>
                    <input
                        type="text"
                        id="txtTenNT"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                {/* Địa Chỉ Người Thân*/}
                <div className="flex items-center gap-2 min-w-fit">
                    <label htmlFor="lblDiaChiNT" className={`w-[100px] ${commonLabelStyles}`}>
                        Địa chỉ NT
                    </label>
                    <input
                        type="text"
                        id="txDiaChiNT"
                        className={`${commonInputStyles} w-[372px]`}
                    />
                </div>

                {/* Số ĐT Người Thân */}
                <div className="flex items-center gap-2 flex-1 min-w-[400px]">
                    <label htmlFor="lblSoDTNT" className={`w-[110px] ${commonLabelStyles}`}>
                        SĐT Người Thân
                    </label>
                    <input
                        type="text"
                        id="txtSoDTNT"
                        className={`${commonInputStyles} w-[400px]`}
                    />
                </div>
            </div>
        </div>
    );
}