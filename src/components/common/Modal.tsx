import { ex } from "@fullcalendar/core/internal-common";
import { CircleAlert } from "lucide-react";
import React from "react";

interface ModalProps {
  title?: string;
  text: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, text, onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 px-8 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="w-full flex flex-col items-center max-w-md rounded-lg bg-white p-6 shadow-lg lg:w-[390px]">
        <span className="text-lime-600">
          <CircleAlert size={56} />
        </span>

        {title && (
          <div
            id="modalTitle"
            className="mt-3 font-medium text-gray-900 text-lg text-center"
          >
            {title}
          </div>
        )}

        <div className="mt-3 w-full">{text}</div>

        <footer className="w-full mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full cursor-pointer rounded-lg bg-lime-600 px-4 py-2 text-white transition-colors hover:bg-lime-700"
          >
            Confirm
          </button>
        </footer>
      </div>
    </div>
  );
};
export default Modal;