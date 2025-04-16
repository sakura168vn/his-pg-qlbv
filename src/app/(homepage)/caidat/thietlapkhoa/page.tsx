"use client";

import FromSetupGiuongPage from "./setupGiuong";
import FromSetupKhoaPage from "./setupKhoa";
import FromSetupPhongPage from "./setupPhong";
import ButtonSetupKhoa from "./setupButtonKhoa";

export default function SetupKhoaPhongPage() {
  return (
    <div className="h-[calc(100vh-76px)] p-1">
      <div className="flex flex-col lg:flex-row gap-1 h-full">
        {/* Panel trái 55% */}
        <div className="w-full lg:w-[55%] h-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          {/* Phần trên có thể scroll */}
          <div className="flex-1 min-h-0 overflow-auto">
            <FromSetupKhoaPage />
          </div>
          {/* Phần dưới luôn hiển thị đầy đủ và nằm sát mép dưới */}
          <div className="flex-none border-t">
            <ButtonSetupKhoa />
          </div>
        </div>

        {/* Panel phải 45% */}
        <div className="w-full lg:w-[45%] bg-white rounded-xl shadow-lg flex flex-col gap-1 h-full">
          {/* TimKiem ở trên */}
          <div className="h-[50%] overflow-auto">
            <FromSetupPhongPage />
          </div>

          {/* DSHoSoChiTiet ở dưới */}
          <div className="h-[50%] overflow-auto">
            <FromSetupGiuongPage />
          </div>
        </div>
      </div>
    </div>
  );
}