import React from 'react';
import { ShoppingCart, Check, Pencil, Trash2 } from 'lucide-react';
import { GardenProduct } from '../../types/types';
import { useTranslation } from 'react-i18next';

interface Props {
  products: any[];
  quantities: Record<string, number>;
  productLookup: Record<string, any>;
  showAddedMessage?: boolean;
  hasItemsInCart?: boolean;
  onUpdateQuantity?: (productId: string, amount: number) => void;
  onAddToCart?: () => void;
  onNavigate: (path: string) => void;
  isOwner?: boolean;
  onEditProduct?: (product: any) => void;
  onDeleteProduct?: (productId: number) => void;
}
const getTranslatedName = (product: any, language: string): string => {
  switch (language) {
    case 'es':
      return product.esName;
    case 'en':
      return product.enName;
    case 'fr':
      return product.frName;
    case 'ca':
    default:
      return product.caName;
  }
};


export const GardenProductsTable: React.FC<Props> = ({
  products,
  quantities,
  productLookup,
  showAddedMessage,
  hasItemsInCart,
  onUpdateQuantity,
  onAddToCart,
  onNavigate,
  isOwner = false,
  onEditProduct,
  onDeleteProduct
}) => {
  const calculateTotal = (productId: string, pricePerKg: number) => {
    return (quantities[productId] / 1000) * pricePerKg;
  };

  const calculateGrandTotal = () => {
    return Object.entries(quantities).reduce((total, [productId, quantity]) => {
      const product = productLookup[productId];
      return total + (quantity / 1000) * product.unitPrice;
    }, 0);
  };
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
             <th className="text-left py-2 w-1/3">{t('product')}</th>
             <th className="text-center py-2 w-1/6">{t('pricePerKg')}</th>
              {!isOwner && <th className="text-center py-2 w-1/3">{t('quantity')}</th>}
              {!isOwner && <th className="text-right py-2 w-1/6">{t('total_1')}</th>}
              {isOwner && <th className="text-center py-2 w-1/3">{t('actions')}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => {
              const quantity = quantities[product.id] || 0;
              const total = calculateTotal(product.id.toString(), product.unitPrice).toFixed(2);

              return (
                <tr key={product.id}>
                  <td className="py-4 flex items-center gap-2">
                    <img src={`http://localhost:8080${product?.image}`} alt={product?.caName} className="w-12 h-12 rounded-full object-cover"/>
                    <span>{getTranslatedName(product, currentLanguage)}</span>
                  </td>
                  <td className="py-4 text-center">{product.unitPrice}€/kg</td>
                  {isOwner ? (
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEditProduct?.(product)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 flex items-center gap-1"
                        >
                          <Pencil size={14} />
                          {t('edit_1')}
                        </button>
                        <button
                          onClick={() => onDeleteProduct?.(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          {t('delete_1')}
                        </button>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="bg-green-100 w-8 h-8 flex items-center justify-center rounded hover:bg-green-200 active:bg-green-300 transition-colors"
                            onClick={() => onUpdateQuantity?.(product.id.toString(), -250)}
                          >
                            <span className="text-green-800 font-medium">-</span>
                          </button>
                          <div className="w-20 text-center tabular-nums">
                            {quantity}g
                          </div>
                          <button
                            className="bg-green-100 w-8 h-8 flex items-center justify-center rounded hover:bg-green-200 active:bg-green-300 transition-colors"
                            onClick={() => onUpdateQuantity?.(product.id.toString(), 250)}
                          >
                            <span className="text-green-800 font-medium">+</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="w-20 text-right ml-auto tabular-nums">
                          {total}€
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
          {!isOwner && (
            <tfoot>
              <tr className="border-t">
                <td colSpan={3} className="py-4 text-right font-semibold">{t('total_1')}</td>
                <td className="py-4">
                  <div className="w-20 text-right ml-auto tabular-nums font-bold">
                    {calculateGrandTotal().toFixed(2)}€
                  </div>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {!isOwner && (
        <div className="flex flex-wrap justify-between mt-6 gap-4">
          <button
            onClick={onAddToCart}
            disabled={!hasItemsInCart}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              hasItemsInCart
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {showAddedMessage ? (
              <>
                <Check size={20} />
                {t('addedToCart')}
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                {t('addToCart')}
              </>
            )}
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => onNavigate('/home')}
              className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              {t('backToList')}
            </button>
            <button
              onClick={() => onNavigate('/cesta')}
              className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              {t('viewCart')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
