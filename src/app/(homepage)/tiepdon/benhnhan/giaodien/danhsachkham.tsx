"use client";

import { FaSync } from 'react-icons/fa';

const DanhSachKham = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-2">
      <div className="flex items-center justify-between mb-2 text-lg font-semibold text-gray-700 border-b pb-2">
        <span>Khoa Phòng</span>
        <button
          onClick={() => { }}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSync className={`text-blue-600 h-4 w-4 `} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-600">
              <th className="px-2 py-2 text-center font-semibold text-base text-white w-12 border border-gray-300">STT</th>
              <th className="px-2 py-2 text-left font-semibold text-base text-white border border-gray-300">Tên Khoa Phòng</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-gray-200`}>

            <tr>
              <td colSpan={2} className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  <FaSync className="animate-spin text-blue-600" />
                  <span className="text-gray-600">Đang tải dữ liệu...</span>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DanhSachKham