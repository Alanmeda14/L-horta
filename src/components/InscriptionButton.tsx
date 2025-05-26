import { useState } from "react";
import {createInscription} from '../services/VolunteerInscriptionService';
import { toast } from "react-toastify";

interface Props {
  sessionId: number;
  userId: number;
}

export const InscriptionButton: React.FC<Props> = ({ sessionId, userId }) => {
  const [loading, setLoading] = useState(false);
  const [inscribed, setInscribed] = useState(false);

  const handleInscription = async () => {
    setLoading(true);
    try {
      await createInscription({ sessionId, userId });
      setInscribed(true);
      toast.success("Te has inscrito exitosamente.");
    } catch (error) {
      console.error("❌ Error al inscribirse:", error);
      toast.success("No se pudo completar la inscripción.");
    } finally {
      setLoading(false);
    }
  };

  if (inscribed) {
    return (
      <button
        disabled
        className="mt-2 px-4 py-2 bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed"
      >
        Ya inscrito
      </button>
    );
  }

  return (
    <button
      onClick={handleInscription}
      disabled={loading}
      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      {loading ? "Inscribiendo..." : "Inscribirme"}
    </button>
  );
};
