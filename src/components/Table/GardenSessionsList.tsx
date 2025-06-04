import React from 'react';
import { Session } from '../../types/types';
import { useTranslation } from 'react-i18next';

interface Props {
    sessions: Session[];
    volunteerStatus: Record<number, boolean>;
    availableSpots: Record<number, number>;
    onToggleVolunteerStatus?: (sessionId: number) => void;
    isOwner?: boolean;
    onNavigate: (path: string) => void;
}

export const GardenSessionsList: React.FC<Props> = ({
    
    sessions,
    volunteerStatus,
    availableSpots,
    onToggleVolunteerStatus,
    isOwner,
    onNavigate
}) => {
    const { t, i18n } = useTranslation();
    if (sessions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 text-lg">{t('noVolunteerOptions')}</p>
                <button
                    onClick={() => onNavigate('/home')}
                    className="mt-4 px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                    {t('backToList')}
                </button>
            </div>
        );
       
    }
    const getDescriptionByLang = (session: Session) => {
        switch (i18n.language) {
          case 'es':
            return session.taskDescriptionEs || session.taskDescription;
          case 'en':
            return session.taskDescriptionEn || session.taskDescription;
          case 'fr':
            return session.taskDescriptionFr || session.taskDescription;
          case 'ca':
          default:
            return session.taskDescription;
        }
      };
      
    return (
        <div className="space-y-4">
                   {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 transition-all hover:shadow-md">
                     <h3 className="font-semibold">{getDescriptionByLang(session)}</h3>
                    <p className="text-gray-600">{new Date(session.datetime).toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600">{t('availableSlots')}{availableSpots[session.id]}</p>
                        {availableSpots[session.id] === 0 && (
                            <span className="text-red-600 text-sm">{t('noSlotsAvailable')}</span>
                        )}
                    </div>
                    {isOwner && (
                        !volunteerStatus[session.id] ? (
                            <button
                            onClick={() => onToggleVolunteerStatus?.(session.id)}
                            disabled={availableSpots[session.id] === 0}
                            className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                                availableSpots[session.id] === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            >
                            {t('signUp')}
                            </button>
                        ) : (
                            <button
                            onClick={() => onToggleVolunteerStatus?.(session.id)}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                            {t('unsubscribe')}
                            </button>
                        )
                    )}
                </div>
            ))}
        </div>
    );
}; 