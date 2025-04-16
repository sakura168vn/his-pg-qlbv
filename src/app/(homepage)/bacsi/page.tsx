"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BacSiPage() {
    const router = useRouter();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onClick={() => router.push("/bacsi/danhsach")}
                >
                    <h2 className="text-xl font-semibold text-[#0054a6] mb-4">Danh sách bác sĩ</h2>
                    <p className="text-gray-600">Xem và quản lý danh sách bác sĩ trong hệ thống</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onClick={() => router.push("/bacsi/them")}
                >
                    <h2 className="text-xl font-semibold text-[#0054a6] mb-4">Thêm bác sĩ</h2>
                    <p className="text-gray-600">Thêm bác sĩ mới vào hệ thống</p>
                </motion.div>

                <motion.div
                    className="bg-white rounded-lg shadow-lg p-6 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onClick={() => router.push("/bacsi/chinhsua")}
                >
                    <h2 className="text-xl font-semibold text-[#0054a6] mb-4">Chỉnh sửa bác sĩ</h2>
                    <p className="text-gray-600">Cập nhật thông tin bác sĩ trong hệ thống</p>
                </motion.div>
            </div>
        </div>
    );
} 