import * as Speech from 'expo-speech';

export interface SpeechServiceOptions {
    language?: string;
    rate?: number;
    onDone?: () => void;
    onStopped?: () => void;
    onError?: (error: Error) => void;
}

export class SpeechService {
    static async read(text: string, options?: SpeechServiceOptions) {
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
            await this.stop();
        }
        
        Speech.speak(text, {
            language: options?.language ?? 'en',
            rate: options?.rate ?? 1.0,
            pitch: 1.0,
            onDone: () => {
                console.log('Finished reading');
                options?.onDone?.();
            },
            onStopped: () => {
                console.log('Stopped reading');
                options?.onStopped?.();
            },
            onError: (error) => {
                console.error('Speech error:', error);
                options?.onError?.(error);
            },
        });
    }

    static async stop() {
        await Speech.stop();
    }
}
