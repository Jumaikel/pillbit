import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Spacing } from '@/constants';

export function HistoryEmptyState() {
    return (
        <View style={styles.container}>
            <EmptyState
                icon="clock"
                title="No history yet"
                message="When you take, postpone, or skip medications, they will appear here."
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
    },
});
