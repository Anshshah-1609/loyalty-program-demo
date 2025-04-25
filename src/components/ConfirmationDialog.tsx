import React from "react";

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center z-50 text-black">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="w-1/2 py-2 bg-gray-400 text-white rounded-lg hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 py-2 bg-blue-500 text-white rounded-lg hover:cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
