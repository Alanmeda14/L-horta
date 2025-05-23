import { useState } from "react";
import { Modal } from '../common/Modal';
import { createSession } from "../../services/volunteerSessionService";



interface Props {
  isOpen: boolean;
  onClose: () => void;
  gardenId: number;
}

export const CreateSessionModal: React.FC<Props> = ({ isOpen, onClose, gardenId }) => {
  const [datetime, setDatetime] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState(1);
  const [taskDescription, setTaskDescription] = useState("");

  const handleConfirm = async () => {
    try {
      // ✅ Convertir fecha al formato ISO válido para el backend
      const formattedDatetime = new Date(datetime).toISOString();
  
      // ✅ Crear el payload que se va a enviar al backend
      const payload = {
        gardenId,
        datetime: formattedDatetime,
        maxVolunteers,
        taskDescription,
      };
  
      // ✅ Mostrar el payload en la consola
      console.log("🟢 Payload enviado a createSession:", payload);
  
      // ✅ Enviar la sesión
      await createSession(payload);
      alert("✅ Sesión creada con éxito");
      //onClose();
    } catch (err) {
      console.error("❌ Error al crear sesión:", err);
      alert("No se pudo crear la sesión");
    }
  };
  

  return (
    <Modal
      title="Crear nueva sesión"
      text={
        <form className="flex flex-col gap-3 text-left">
          <label className="text-sm font-medium">Fecha y hora:</label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <label className="text-sm font-medium">Máx. voluntarios:</label>
          <input
            type="number"
            value={maxVolunteers}
            onChange={(e) => setMaxVolunteers(Number(e.target.value))}
            min={1}
            className="border p-2 rounded"
            required
          />

          <label className="text-sm font-medium">Descripción:</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="border p-2 rounded"
            rows={3}
            required
          />
        </form>
      }
      onCancel={onClose}
      onConfirm={handleConfirm}
    />
  );
};

