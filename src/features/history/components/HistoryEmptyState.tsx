import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Spacing } from '@/constants';

export function HistoryEmptyState() {
    return (
        <View style={styles.container}>
            <EmptyState
                title="No history yet"
                description="When you take, postpone, or skip medications, they will appear here."
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
