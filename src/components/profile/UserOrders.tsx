import { useEffect, useState } from 'react';
import { getOrdersByUser } from '../../services/orderService';
import type { DisplayOrder } from '../../types/types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// 1️⃣ Importa el hook de auth para obtener el userId
import { useAuth } from '../../context/AuthContext'; // ajusta la ruta si es necesario

const UserOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Usa useAuth para obtener el userId del usuario autenticado
  const { userId } = useAuth();

  useEffect(() => {
      const fetchOrders = async () => {
        try {
          const data = await getOrdersByUser();
          setOrders(data);
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }, []);

  /* useEffect(() => {
    // 3️⃣ Si no hay userId, no haces nada (todavía no logueado o cargando)
    if (!userId) return;

    setLoading(true);

    // 4️⃣ Cambiado: llama a getOrdersByUser SIN argumentos
    getOrdersByUser()
      .then((data) => {
        console.log("Pedidos recibidos del backend:", data);
        setOrders(data);
        if (data.length === 0) {
          toast.info(t('noOrders'));
        }
      })
      .catch((err: unknown) => {
        console.error(t('ordersLoadError'), err);
        toast.error(t('ordersLoadError'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [t, userId]); // Mantén userId en dependencias para que se actualice al cambiar */

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('orders_1')}</h1>

          {loading && <p className="text-gray-500">{t('loading')}</p>}

          {!loading && orders.length === 0 && (
            <p className="text-gray-500">{t('noOrders')}</p>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">
                      <strong>{t('dateLabel')}:</strong>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <span className={`text-sm font-semibold ${
                      order.status === "Entregado" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {t(order.status)}
                    </span>
                  </div>

                  <p className="text-gray-800 mb-2">
                    <strong>{t('gardenLabel')}:</strong> {order.gardenName}
                  </p>

                  <div>
                    <p className="font-medium text-gray-700">{t('productsLabel')}:</p>
                    <ul className="ml-6 list-disc text-sm text-gray-700 mt-1">
                      {order.items.map((p, i) => (
                        <li key={i}>{p.name} x{p.quantity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
