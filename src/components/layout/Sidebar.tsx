'use client';

import {
    Users,
    Home,
    Calendar,
    MessageSquare,
    Grid,
    Stethoscope,
    Wallet,
    Settings,
    KeyRound,
    LayoutGrid,
    FileText,
    AlertCircle,
    FilePlus2,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { menuItems } from "@/config/menu";

const SubMenuItem = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(href);
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="block p-2 text-sm transition-all duration-150 ease-out text-[#0054a6] font-medium hover:bg-[#EDF9FD] hover:text-[#0054a6] hover:shadow-sm rounded-lg"
        >
            {children}
        </Link>
    );
};

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isCollapsed }) => {
    const pathname = usePathname();
    const [_, forceRender] = useState(0);
    const openMenus = useRef<{ [key: string]: boolean }>({});

    const toggleMenu = (path: string, e: React.MouseEvent) => {
        e.stopPropagation();
        openMenus.current[path] = !openMenus.current[path];
        forceRender((prev) => prev + 1);
    };

    const isActive = (path: string) =>
        pathname === path || pathname?.startsWith(path + "/");

    const menuItemClass = (path: string) =>
        `flex items-center gap-2 p-2.5 rounded-lg transition-all duration-150 ease-out ${isActive(path)
            ? "bg-[#EDF9FD] text-[#0054a6] font-medium"
            : "text-[#0054a6] font-medium hover:bg-[#EDF9FD] hover:text-[#0054a6] hover:shadow-sm"
        }`;

    return (
        <aside className={`fixed top-0 left-0 ${isCollapsed ? 'w-16' : 'w-72'} bg-white h-screen border-r border-[#C3EBFA] z-50 transition-all duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="h-full flex flex-col">
                {/* Logo section - fixed height 72px */}
                <div className="h-[72px] flex items-center justify-center">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/images/LogoTamAnh.png"
                            alt="logo"
                            width={46}
                            height={46}
                            priority
                            style={{ width: "auto", height: "auto" }}
                        />


                        {!isCollapsed && (
                            <Image
                                src="/images/LogoTA2.png"
                                alt="logo"
                                width={120}
                                height={30}
                                priority
                                className="hidden lg:block"
                                style={{ width: "auto", height: "auto" }}
                            />
                        )}
                    </div>
                </div>

                {/* Menu section - scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className={`${isCollapsed ? 'p-2' : 'p-6'}`}>
                        {/* Admin Panel */}
                        <div className="mb-8">
                            {!isCollapsed && (
                                <p className="text-xs font-medium text-[#0054a6] uppercase tracking-wider mb-4">Menu Chính</p>
                            )}
                            <nav>
                                <ul className="space-y-1">
                                    {menuItems.map((item) => (
                                        <li key={item.path}>
                                            {item.subItems ? (
                                                <div className="flex flex-col">
                                                    <div
                                                        onClick={(e) => toggleMenu(item.path, e)}
                                                        className={`${isCollapsed ? 'justify-center' : ''} ${menuItemClass(item.path)} cursor-pointer flex justify-between items-center`}
                                                    >
                                                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-2`}>
                                                            <item.icon className="w-5 h-5" />
                                                            {!isCollapsed && <span>{item.title}</span>}
                                                        </div>
                                                        {!isCollapsed && (
                                                            <ChevronDown
                                                                className={`w-4 h-4 transition-transform duration-300 ease-in-out text-[#0054a6] ${openMenus.current[item.path] ? "rotate-180" : ""
                                                                    }`}
                                                            />
                                                        )}
                                                    </div>
                                                    {!isCollapsed && (
                                                        <div
                                                            className={`pl-4 space-y-0.5 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${openMenus.current[item.path] ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                                                        >
                                                            {item.subItems.map((subItem) => (
                                                                <SubMenuItem key={subItem.path} href={subItem.path}>
                                                                    - {subItem.title}
                                                                </SubMenuItem>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link href={item.path} className={`${isCollapsed ? 'justify-center' : ''} ${menuItemClass(item.path)}`}>
                                                    <item.icon className="w-5 h-5" />
                                                    {!isCollapsed && <span>{item.title}</span>}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar; 