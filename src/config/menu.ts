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
} from "lucide-react";

export interface MenuItem {
    title: string;
    path: string;
    pageTitle: string;
    icon: any;
    subItems?: {
        title: string;
        path: string;
        pageTitle: string;
    }[];
}

export const menuItems: MenuItem[] = [
    
    {
        title: "Trang Chủ",
        path: "/admin",
        pageTitle: "TRANG CHỦ",
        icon: Grid,
    },
    {
        title: "Quản lý Tiếp Đón",
        path: "/tiedon",
        pageTitle: "QUẢN LÝ TIẾP ĐÓN",
        icon: Stethoscope,
        subItems: [
            { 
                title: "Tiếp Đón Bệnh Nhân", 
                path: "/tiepdon/benhnhan",
                pageTitle: "QUẢN LÝ TIẾP ĐÓN"
            },
            { 
                title: "Danh Sách Bệnh Nhân", 
                path: "/tiepdon/danhsach",
                pageTitle: "DANH SÁCH BỆNH NHÂN"
            },
        ],
    },
    {
        title: "Quản lý Bác sĩ",
        path: "/bacsi",
        pageTitle: "QUẢN LÝ BÁC SĨ",
        icon: Stethoscope,
        subItems: [
            { 
                title: "Danh sách bác sĩ", 
                path: "/bacsi/danhsach",
                pageTitle: "DANH SÁCH BÁC SĨ"
            },
            { 
                title: "Thêm bác sĩ", 
                path: "/bacsi/them",
                pageTitle: "THÊM BÁC SĨ"
            },
            { 
                title: "Chỉnh sửa bác sĩ", 
                path: "/bacsi/chinhsua",
                pageTitle: "CHỈNH SỬA BÁC SĨ"
            },
        ],
    },
    {
        title: "Quản lý Bệnh nhân",
        path: "/admin/patients",
        pageTitle: "QUẢN LÝ BỆNH NHÂN",
        icon: Users,
        subItems: [
            { 
                title: "Danh sách bệnh nhân", 
                path: "/benhnhan",
                pageTitle: "DANH SÁCH BỆNH NHÂN"
            },
            { 
                title: "Thêm bệnh nhân", 
                path: "/admin/patients/add",
                pageTitle: "THÊM BỆNH NHÂN"
            },
            { 
                title: "Chỉnh sửa bệnh nhân", 
                path: "/admin/patients/edit",
                pageTitle: "CHỈNH SỬA BỆNH NHÂN"
            },
        ],
    },
    {
        title: "Quản lý Tài Trợ",
        path: "/qltaitro",
        pageTitle: "CHƯƠNG TRÌNH QUẢN LÝ TÀI TRỢ",
        icon: FilePlus2,
        subItems: [
            { 
                title: "Danh sách bệnh nhân", 
                path: "/qltaitro",
                pageTitle: "CHƯƠNG TRÌNH QUẢN LÝ TÀI TRỢ"
            },
        ],
    },
    {
        title: "Khách Hàng",
        path: "/khachhang",
        pageTitle: "THÔNG TIN KHÁCH HÀNG",
        icon: Calendar,
    },
    {
        title: "Quản Lý Dược",
        path: "/qlduoc",
        pageTitle: "QUẢN LÝ DƯỢC",
        icon: LayoutGrid,
        subItems: [
            { 
                title: "Danh mục kho", 
                path: "/qlduoc/dmkho",
                pageTitle: "DANH MỤC KHO"
            },
            { 
                title: "Danh mục nước sản xuất", 
                path: "/qlduoc/dmnuocsanxuat",
                pageTitle: "DANH MỤC NƯỚC SẢN XUẤT"
            },
            { 
                title: "Danh mục hãng sản xuất", 
                path: "/qlduoc/dmhangsanxuat",
                pageTitle: "DANH MỤC HÃNG SẢN XUẤT"
            },
            { 
                title: "Danh mục loại hàng", 
                path: "/qlduoc/dmloaihang",
                pageTitle: "DANH MỤC LOẠI HÀNG"
            },
            { 
                title: "Danh mục tên hàng", 
                path: "/qlduoc/dmtenhang",
                pageTitle: "DANH MỤC TÊN HÀNG"
            },
        ],
    },
    {
        title: "Báo cáo",
        path: "/admin/reports",
        pageTitle: "BÁO CÁO",
        icon: FileText,
    },
    {
        title: "Thông báo",
        path: "/admin/notifications",
        pageTitle: "THÔNG BÁO",
        icon: AlertCircle,
    },
    {
        title: "Tin nhắn",
        path: "/admin/messages",
        pageTitle: "TIN NHẮN",
        icon: MessageSquare,
    },
    {
        title: "Cài đặt",
        path: "/caidat",
        pageTitle: "CÀI ĐẶT",
        icon: Settings,
        subItems: [
            { 
                title: "Thiết lập khoa", 
                path: "/caidat/dmkhoa",
                pageTitle: "THIẾT LẬP KHOA"
            },
        ],
    },
];

export const getPageTitle = (path: string): string => {
    const mainItem = menuItems.find(item => item.path === path);
    if (mainItem) return mainItem.pageTitle;

    for (const item of menuItems) {
        if (item.subItems) {
            const subItem = item.subItems.find(sub => sub.path === path);
            if (subItem) return subItem.pageTitle;
        }
    }

    return "";
}; 