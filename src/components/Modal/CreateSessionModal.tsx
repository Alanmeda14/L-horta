import { useState } from "react";
import { Modal } from '../common/Modal';
import { createSession } from "../../services/volunteerSessionService";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gardenId: number;
}

export const CreateSessionModal: React.FC<Props> = ({ isOpen, onClose, gardenId }) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxVolunteers, setMaxVolunteers] = useState(1);
  const [taskDescription, setTaskDescription] = useState("");

  const handleConfirm = async () => {
    try {
      if (!date || !startTime || !endTime) {
        toast.error("Completa fecha y horas");
        return;
      }

      const startDatetime = new Date(`${date}T${startTime}`).toISOString();
      const endDatetime = new Date(`${date}T${endTime}`).toISOString();

      if (startDatetime >= endDatetime) {
        toast.error("La hora de inicio debe ser anterior a la de finalización");
        return;
      }

      const payload = {
        gardenId,
        startDatetime,
        endDatetime,
        maxVolunteers,
        taskDescription,
      };
  
  
      // ✅ Enviar la sesión
      await createSession(payload);
      toast.success("Sesión creada con éxito");
      onClose();
    } catch (err) {
      console.error("Error al crear sesión:", err);
      toast.error("No se pudo crear la sesión");
    }
  };

  return (
    <Modal
      title="Crear nueva sesión"
      text={
        <form className="flex flex-col gap-3 text-left">
          <label className="text-sm font-medium">Fecha:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <label className="text-sm font-medium">Hora de inicio:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <label className="text-sm font-medium">Hora de finalización:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
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
