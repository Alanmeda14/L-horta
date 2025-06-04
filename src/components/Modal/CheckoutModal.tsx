import React from "react";

interface CheckoutModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
    isOpen, 
    onConfirm, 
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 px-8 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Finalizar compra</h2>
                <p className="mb-6">¿Estás seguro que deseas proceder con la compra?</p>
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onCancel} 
                        className="w-full cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="w-full cursor-pointer rounded-lg bg-lime-600 px-4 py-2 text-white transition-colors hover:bg-lime-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;