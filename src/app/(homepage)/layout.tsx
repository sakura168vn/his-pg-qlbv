"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

import ChatbotPopup from '@/components/Chatbot/ChatbotPopup';

export default function HomepageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={isSidebarOpen} isCollapsed={isCollapsed} />
            <Topbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
            <main className={`pt-[72px] min-h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? (isCollapsed ? "pl-16" : "pl-72") : "pl-0"
                }`}>
                {children}
            </main>
            {/* Chatbot luôn hiển thị ở mọi trang */}
            <ChatbotPopup />
        </div>
    );
}
