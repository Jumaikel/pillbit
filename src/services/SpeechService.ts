import * as Speech from 'expo-speech';

export class SpeechService {
    static async read(text: string, language: string = 'en-US', rate: number = 1.0) {
        const isSpeaking = await Speech.isSpeakingAsync();
        if (isSpeaking) {
            await this.stop();
        }
        
        Speech.speak(text, {
            language,
            rate,
            pitch: 1.0,
            onDone: () => console.log('Finished reading'),
            onError: (error) => console.error('Speech error:', error),
        });
    }

    static async stop() {
        await Speech.stop();
    }
}
