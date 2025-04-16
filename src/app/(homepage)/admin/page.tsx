"use client";

import Image from "next/image";

export default function Page() {
  return (
    <div className="bg-white p-4 m-4 rounded-md flex-1">
      {/* TOP */}
      <div className="flex items-center justify-between" >
        <h1 className="hidden md:block text-xl font-semibold">Danh sách khách hàng</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
            <Image src="/icons/search.png" alt="" width={14} height={14} />
            <input
              type="text"
              placeholder="Thông Tin Tìm Kiếm"
              className="w-[300px] p-2 bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zMauVang">
              <Image src="/icons/filter.png" alt="" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zMauVang">
              <Image src="/icons/sort.png" alt="" width={14} height={14} />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-zMauVang">
              <Image src="/icons/plus.png" alt="" width={14} height={14} />
            </button>

          </div>
        </div>
      </div>

      {/* LIST  <ThongTinKH />*/}
     

      {/* PHÂN TRANG  <ChanTrang />*/}
     
    </div>
  )
}