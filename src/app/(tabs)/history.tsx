import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LightColors, Typography, Spacing } from '@/constants';
import { 
    useHistoryStore, 
    HistoryCard, 
    HistoryFilterBar, 
    HistoryEmptyState 
} from '@/features/history';

export default function HistoryScreen() {
    const { records, filters, isLoading, loadHistory, setFilters } = useHistoryStore();

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">
                    History
                </Text>
            </View>

            <View style={styles.filterContainer}>
                <HistoryFilterBar
                    selectedStatus={filters.status}
                    onSelectStatus={(status) => setFilters({ status })}
                />
            </View>

            {isLoading && records.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={LightColors.primary} />
                </View>
            ) : (
                <FlatList
                    data={records}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <HistoryCard item={item} />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<HistoryEmptyState />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightColors.background,
    },
    header: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    title: {
        ...Typography.headingXL,
        color: LightColors.textPrimary,
    },
    filterContainer: {
        marginBottom: Spacing.xs,
    },
    listContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xl,
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
