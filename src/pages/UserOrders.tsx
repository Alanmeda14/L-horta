import { useEffect, useState } from 'react';
import { getOrdersByUser } from '../services/orderService';
import type { DisplayOrder } from '../types/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Package, Calendar, Store, Euro } from 'lucide-react';
import Modal from '../components/common/Modal';

const OrderDetailsContent = ({ order }: { order: DisplayOrder }) => {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    try {
      console.log('Formatting date:', dateString);
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    try {
      console.log('Formatting price:', price);
      return Number(price).toFixed(2);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0.00';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar className="text-lime-600" size={20} />
          <div>
            <p className="text-sm text-gray-600">{t('dateLabel')}</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Store className="text-lime-600" size={20} />
          <div>
            <p className="text-sm text-gray-600">{t('gardenLabel')}</p>
            <p className="font-medium">{order.gardenName}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <Package className="text-lime-600" size={20} />
          {t('productsLabel')}
        </h3>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
              {item.image && (
                <img 
                  src={`http://localhost:8080${item.image}`} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} {item.units}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-lime-600">{formatPrice(item.totalPrice)}€</p>
                <p className="text-sm text-gray-600">{formatPrice(item.unitPrice)}€/{item.units}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t">
        <div className="flex items-center gap-2">
          <Euro className="text-lime-600" size={20} />
          <span className="font-medium">{t('totalLabel')}</span>
        </div>
        <p className="text-xl font-bold text-lime-600">{formatPrice(order.totalPrice)}€</p>
      </div>
    </div>
  );
};

const UserOrders = () => {
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DisplayOrder | null>(null);
  const { t } = useTranslation();
  const { userId } = useAuth();

  const formatDate = (dateString: string) => {
    try {
      console.log('Formatting date:', dateString);
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    try {
      console.log('Formatting price:', price);
      return Number(price).toFixed(2);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0.00';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        const data = await getOrdersByUser();
        console.log('Received orders:', data);
        setOrders(data);
        if (data.length === 0) {
          toast.info(t('noOrders'));
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error(t('ordersLoadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [t]);

  const handleOrderClick = (order: DisplayOrder) => {
    console.log('Opening modal for order:', order);
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package className="text-lime-600" size={24} />
            {t('orders_1')}
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-gray-500">{t('noOrders')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="text-lime-600" size={20} />
                      <span className="font-medium">{order.gardenName}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Entregado" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {t(order.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package size={16} />
                      <span>{order.items.length} {t('items')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-lime-600">
                      <Euro size={16} />
                      <span>{formatPrice(order.totalPrice)}€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedOrder && (
        <Modal
          title={t('orderDetails')}
          text={<OrderDetailsContent order={selectedOrder} />}
          onConfirm={handleCloseModal}
          onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UserOrders;
