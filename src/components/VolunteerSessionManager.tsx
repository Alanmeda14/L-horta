import React, { useState } from 'react';
import { VolunteerSession } from '../types';
import { Trash2, PlusCircle, Calendar, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VolunteerSessionManagerProps {
  sessions: VolunteerSession[];
  onChange: (updatedSessions: VolunteerSession[]) => void;
  gardenId: number;
}

const VolunteerSessionManager: React.FC<VolunteerSessionManagerProps> = ({ 
  sessions, 
  onChange, 
  gardenId 
}) => {
  const [newSession, setNewSession] = useState<VolunteerSession>({
    taskDescription: '',
    startDateTime: '',
    endDateTime: '',
    maxVolunteers: 1,
    gardenId,
  });

  const updateSessionField = (index: number, field: keyof VolunteerSession, value: any) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const deleteSession = (index: number) => {
    const updated = sessions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const addNewSession = () => {
    // Validate that end time is after start time
    if (newSession.startDateTime && newSession.endDateTime && 
        new Date(newSession.endDateTime) <= new Date(newSession.startDateTime)) {
      alert(t('validation.endTimeAfterStartTime'));
      return;
    }
    
    // Validate that all fields are filled
    if (!newSession.taskDescription || !newSession.startDateTime || !newSession.endDateTime) {
      alert(t('validation.fillAllRequiredFields'));
      return;
    }
    
    onChange([...sessions, { ...newSession }]);
    setNewSession({
      taskDescription: '',
      startDateTime: '',
      endDateTime: '',
      maxVolunteers: 1,
      gardenId,
    });
  };

  // Format date for display
  const formatDate = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">{t('volunteerSessions.title')}</h2>
      
      {sessions.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">{t('volunteerSessions.noScheduledSessions')}</p>
          <p className="text-sm text-gray-400 mt-1">{t('volunteerSessions.addNewSession')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div 
              key={session.id || index} 
              className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
            >
              <button
                onClick={() => deleteSession(index)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                aria-label="Eliminar sesión"
              >
                <Trash2 size={20} />
              </button>
              
              <div className="pr-8">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">{session.taskDescription}</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('volunteerSessions.taskDescription')}
                      </label>
                      <input
                        type="text"
                        value={session.taskDescription}
                        onChange={(e) => updateSessionField(index, 'taskDescription', e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('volunteerSessions.maxVolunteers')}
                      </label>
                      <div className="flex items-center">
                        <Users size={18} className="text-gray-500 mr-2" />
                        <input
                          type="number"
                          min="1"
                          value={session.maxVolunteers}
                          onChange={(e) => updateSessionField(index, 'maxVolunteers', parseInt(e.target.value) || 1)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('volunteerSessions.startDateTime')}
                      </label>
                      <div className="flex items-center">
                        <Calendar size={18} className="text-gray-500 mr-2" />
                        <input
                          type="datetime-local"
                          value={session.startDateTime}
                          onChange={(e) => updateSessionField(index, 'startDateTime', e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('volunteerSessions.endDateTime')}
                      </label>
                      <div className="flex items-center">
                        <Clock size={18} className="text-gray-500 mr-2" />
                        <input
                          type="datetime-local"
                          value={session.endDateTime}
                          onChange={(e) => updateSessionField(index, 'endDateTime', e.target.value)}
                          className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {session.startDateTime && session.endDateTime && (
                  <div className="bg-green-50 rounded-md p-3 text-sm text-gray-700">
                    <p className="flex items-center">
                      <Calendar size={16} className="text-green-600 mr-2" />
                      <span className="font-medium">{t('common.date')}</span> 
                      <span className="ml-2">{formatDate(session.startDateTime)}</span>
                    </p>
                    <p className="flex items-center mt-1">
                      <Clock size={16} className="text-green-600 mr-2" />
                      <span className="font-medium">{t('common.schedule')}</span> 
                      <span className="ml-2">
                        {formatTime(session.startDateTime)} - {formatTime(session.endDateTime)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="bg-gray-50 border rounded-lg p-5 mt-6">
        <h3 className="font-semibold text-gray-800 mb-4">Añadir nueva sesión de voluntariado</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción de la tarea *
              </label>
              <input
                type="text"
                placeholder="Ej: Plantación de tomates"
                value={newSession.taskDescription}
                onChange={(e) => setNewSession(prev => ({ ...prev, taskDescription: e.target.value }))}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número máximo de voluntarios *
              </label>
              <div className="flex items-center">
                <Users size={18} className="text-gray-500 mr-2" />
                <input
                  type="number"
                  min="1"
                  placeholder="Número de plazas"
                  value={newSession.maxVolunteers}
                  onChange={(e) => setNewSession(prev => ({ ...prev, maxVolunteers: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y hora de inicio *
              </label>
              <div className="flex items-center">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  value={newSession.startDateTime}
                  onChange={(e) => setNewSession(prev => ({ ...prev, startDateTime: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y hora de finalización *
              </label>
              <div className="flex items-center">
                <Clock size={18} className="text-gray-500 mr-2" />
                <input
                  type="datetime-local"
                  value={newSession.endDateTime}
                  onChange={(e) => setNewSession(prev => ({ ...prev, endDateTime: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={addNewSession}
          className="mt-5 w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          <span>Añadir sesión</span>
        </button>
      </div>
    </div>
  );
};

export default VolunteerSessionManager;