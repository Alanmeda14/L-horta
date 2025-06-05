import React from 'react';
import { Session } from '../../types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, MapPin, ArrowRight, UserPlus, UserMinus } from 'lucide-react';
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
    const { t } = useTranslation();

    if (sessions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                    {t('no_volunteering_sessions')}
                </h3>
                <p className="text-gray-500 mb-6">
                    {t('no_volunteering_sessions_message')}
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate('/home')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    {t('back_to_gardens')}
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <AnimatePresence>
                {sessions.map((session, index) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {session.taskDescription}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-5 h-5 text-green-600" />
                                            <span>
                                                {new Date(session.datetime).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-5 h-5 text-green-600" />
                                            <span>
                                                {new Date(session.datetime).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                            <span>{session.location || t('garden_location')}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-green-600" />
                                            <span className={`font-medium ${
                                                availableSpots[session.id] === 0 
                                                    ? 'text-red-600' 
                                                    : 'text-green-600'
                                            }`}>
                                                {availableSpots[session.id]} {t('spots_available')}
                                            </span>
                                        </div>
                                    </div>

                                    {session.description && (
                                        <p className="mt-4 text-gray-600">
                                            {session.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-4">
                                    {!volunteerStatus[session.id] ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onToggleVolunteerStatus?.(session.id)}
                                            disabled={availableSpots[session.id] === 0}
                                            className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                                                availableSpots[session.id] === 0
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                            }`}
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            {t('join_session')}
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => onToggleVolunteerStatus?.(session.id)}
                                            className="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                                        >
                                            <UserMinus className="w-5 h-5" />
                                            {t('leave_session')}
                                        </motion.button>
                                    )}

                                    {availableSpots[session.id] === 0 && (
                                        <span className="text-sm text-red-600 flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {t('session_full')}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}; 