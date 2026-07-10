import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

export class VoiceInputService {
    static async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Failed to request speech recognition permissions:', error);
            return false;
        }
    }

    static startListening(
        onResult: (text: string) => void,
        onError: (error: Error) => void,
        language: string = 'en-US'
    ) {
        // Because speech recognition is event-based and we are using expo-speech-recognition
        // The implementation involves adding listeners and calling start.
        // For simplicity in this service, we expose the native module methods and require
        // the consumer to attach the listeners, or we wrap it.
        
        try {
            ExpoSpeechRecognitionModule.start({
                lang: language,
                interimResults: true,
                maxAlternatives: 1,
            });
            
            // Note: Consumers should use useSpeechRecognitionEvent() hook provided by expo-speech-recognition
            // to listen to results in React components. This method just triggers the start.
            
        } catch (error: any) {
            onError(error);
        }
    }

    static stopListening() {
        try {
            ExpoSpeechRecognitionModule.stop();
        } catch (error) {
            console.error('Failed to stop listening:', error);
        }
    }
}
