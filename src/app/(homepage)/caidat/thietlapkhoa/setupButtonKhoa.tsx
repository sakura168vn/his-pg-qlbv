'use client';
import ButtonCRUD from "@/components/ui/ButtonCRUD";

export default function ButtonSetupKhoa() {
    return (
        <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="overflow-x-auto">
                <div className="flex justify-end items-start gap-2">
                    <ButtonCRUD type="add" onClick={() => { }} />
                    <ButtonCRUD type="edit" onClick={() => { }} />
                    <ButtonCRUD type="delete" onClick={() => { }} />
                    <ButtonCRUD type="save" onClick={() => { }} />
                    <ButtonCRUD type="cancel" onClick={() => { }} />
                </div>
            </div>
        </div>
    );
};