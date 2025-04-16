"use client";

export default function SetupKhoaPhongPage() {
    return (
        <div className="h-[calc(100vh-76px)] p-1">
          <div className="flex flex-col lg:flex-row gap-1 h-full">
            {/* Panel trái 23% */}
            <div className="w-full lg:w-[23%] h-full bg-white rounded-xl shadow-lg overflow-auto">
              trái
            </div>
            
            {/* Panel phải 77% */}
            <div className="w-full lg:w-[77%] flex flex-col gap-1 h-full">
              {/* TimKiem ở trên */}
              <div className="flex-none">
                phải trên
              </div>
              
              {/* DSHoSoChiTiet ở dưới */}
              <div className="flex-1">
                phải dưới
              </div>
            </div>
          </div>
        </div>
      );
}