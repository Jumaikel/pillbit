import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { 
    useHistoryStore, 
    HistoryCard, 
    HistoryFilterBar, 
    HistoryEmptyState 
} from '@/features/history';
import { useTranslation } from 'react-i18next';

export default function HistoryScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t } = useTranslation();
    const { records, filters, isLoading, loadHistory, setFilters } = useHistoryStore();

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">
                    {t('history.title')}
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
                    <ActivityIndicator size="large" color={colors.primary} />
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

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    title: {
        ...typography.headingXL,
        color: colors.textPrimary,
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
