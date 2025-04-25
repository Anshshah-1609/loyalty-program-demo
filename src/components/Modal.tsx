import { cn } from "@/utils/helper";
import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, className }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50 text-black",
        className
      )}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
