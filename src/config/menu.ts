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
    icon: any;
    subItems?: {
        title: string;
        path: string;
    }[];
}

export interface PageTitle {
    path: string;
    title: string;
}

export const menuItems: MenuItem[] = [
    
    {
        title: "Trang Chủ",
        path: "/admin",
        icon: Grid,
    },
    {
        title: "Quản lý Tiếp Đón",
        path: "/tiedon",
        icon: Stethoscope,
        subItems: [
            { title: "Tiếp Đón Bệnh Nhân", path: "/tiepdon/benhnhan" },
            { title: "Danh Sách Bệnh Nhân", path: "/tiepdon/danhsach" },            
        ],
    },
    {
        title: "Quản lý Bác sĩ",
        path: "/bacsi",
        icon: Stethoscope,
        subItems: [
            { title: "Danh sách bác sĩ", path: "/bacsi/danhsach" },
            { title: "Thêm bác sĩ", path: "/bacsi/them" },
            { title: "Chỉnh sửa bác sĩ", path: "/bacsi/chinhsua" },
        ],
    },
    {
        title: "Quản lý Bệnh nhân",
        path: "/admin/patients",
        icon: Users,
        subItems: [
            { title: "Danh sách bệnh nhân", path: "/benhnhan" },
            { title: "Thêm bệnh nhân", path: "/admin/patients/add" },
            { title: "Chỉnh sửa bệnh nhân", path: "/admin/patients/edit" },
        ],
    },
    {
        title: "Quản lý Tài Trợ",
        path: "/qltaitro",
        icon: FilePlus2,
        subItems: [
            { title: "Danh sách bệnh nhân", path: "/qltaitro" },
        ],
    },
    {
        title: "Khách Hàng",
        path: "/khachhang",
        icon: Calendar,
    },
    {
        title: "Quản Lý Dược",
        path: "/qlduoc",
        icon: LayoutGrid,
        subItems: [
            { title: "Danh mục kho", path: "/qlduoc/dmkho" },
            { title: "Danh mục nước sản xuất", path: "/qlduoc/dmnuocsanxuat" },
            { title: "Danh mục hãng sản xuất", path: "/qlduoc/dmhangsanxuat" },
            { title: "Danh mục loại hàng", path: "/qlduoc/dmloaihang" },
            { title: "Danh mục tên hàng", path: "/qlduoc/dmtenhang" },
        ],
    },
    {
        title: "Báo cáo",
        path: "/admin/reports",
        icon: FileText,
    },
    {
        title: "Thông báo",
        path: "/admin/notifications",
        icon: AlertCircle,
    },
    {
        title: "Tin nhắn",
        path: "/admin/messages",
        icon: MessageSquare,
    },
    {
        title: "Cài đặt",
        path: "/caidat",
        icon: Settings,
        subItems: [
            { title: "Thiết lập khoa", path: "/caidat/thietlapkhoa" },
        ],
    },
];

export const pageTitles: PageTitle[] = [
    { path: "/admin", title: "TRANG CHỦ" },
    { path: "/tiepdon", title: "QUẢN LÝ TIẾP ĐÓN" },
    { path: "/tiepdon/benhnhan", title: "QUẢN LÝ TIẾP ĐÓN" },
    { path: "/bacsi", title: "QUẢN LÝ BÁC SĨ" },
    { path: "/bacsi/danhsach", title: "DANH SÁCH BÁC SĨ" },
    { path: "/bacsi/them", title: "THÊM BÁC SĨ" },
    { path: "/bacsi/chinhsua", title: "CHỈNH SỬA BÁC SĨ" },
    { path: "benhnhan", title: "DANH SÁCH BỆNH NHÂN" },
    { path: "/admin", title: "LỊCH HẸN" },
    { path: "/khoaphong", title: "KHOA/PHÒNG BAN" },
    { path: "/admin/reports", title: "BÁO CÁO" },
    { path: "/admin/notifications", title: "THÔNG BÁO" },
    { path: "/admin/messages", title: "TIN NHẮN" },
    { path: "/admin/settings", title: "CÀI ĐẶT" },
    { path: "/khachhang", title: "THÔNG TIN KHÁCH HÀNG" },
    { path: "/lichbacsi", title: "LỊCH BÁC SĨ" },
    { path: "/dongmokho", title: "ĐÓNG - MỞ KHO XUẤT VTTH" },
    { path: "/nguoidung", title: "THÔNG TIN CÁ NHÂN" },
    { path: "/qltaitro", title: "CHƯƠNG TRÌNH QUẢN LÝ TÀI TRỢ" },
    { path: "/caidat/thietlapkhoa", title: "THIẾT LẬP KHOA" },

    { path: "/qlduoc/dmkho", title: "DANH MỤC KHO" },
    { path: "/qlduoc/dmnuocsanxuat", title: "DANH MỤC NƯỚC SẢN XUẤT" },
    { path: "/qlduoc/dmhangsanxuat", title: "DANH MỤC HÃNG SẢN XUẤT" },
    { path: "/qlduoc/dmloaihang", title: "DANH MỤC LOẠI HÀNG" },
    { path: "/qlduoc/dmtenhang", title: "DANH MỤC TÊN HÀNG" },
]; 