import { supabase } from './supabaseClient';

export const saveLog = async (
    sessionId: string,
    sender: 'ATC' | 'PILOT' | 'SYSTEM',
    message: string,
    context?: string
) => {
    try {
        const { error } = await supabase
            .from('flight_logs')
            .insert([
                {
                    session_id: sessionId,
                    sender,
                    message,
                    context
                }
            ]);

        if (error) {
            console.error('Error saving log to Supabase:', error);
        }
    } catch (err) {
        console.error('Unexpected error saving log:', err);
    }
};
