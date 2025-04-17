// src/components/ui/ButtonCRUD.tsx
import React from "react";
import { MdLibraryAdd } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBack2Line } from "react-icons/ri";
import { LuSaveAll } from "react-icons/lu";
import { TiCancel } from "react-icons/ti";

type ActionType = "add" | "edit" | "delete" | "save" | "cancel";

interface ButtonCRUDProps {
  type: ActionType;
  onClick?: () => void;
  disabled?: boolean;
}

const actionMap: Record<ActionType, { label: string; icon: React.ReactNode }> = {
  add:    { label: "Thêm", icon: <MdLibraryAdd /> },
  edit:   { label: "Sửa", icon: <FaEdit /> },
  delete: { label: "Xóa", icon: <RiDeleteBack2Line /> },
  save:   { label: "Lưu", icon: <LuSaveAll /> },
  cancel: { label: "Hủy", icon: <TiCancel /> },
};

export default function ButtonCRUD({ type, onClick, disabled = false }: ButtonCRUDProps) {
  const action = actionMap[type];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center h-[36px] min-w-[100px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-[#FF3333] 
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      <>
        <span className="mr-1.5">{action.icon}</span>
        {action.label}
      </>
    </button>
  );
}
