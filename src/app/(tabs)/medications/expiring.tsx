import { useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants';
import { useExpirationStore, ExpirationCard } from '@/features/expiration';
import { EmptyState } from '@/components/EmptyState';
import { useTheme } from '@/hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components';

export default function ExpiringSoonScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
    const { expiringSoonList, isLoading, refreshExpirationData } = useExpirationStore();
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        refreshExpirationData();
    }, []);

    const handlePress = (id: number) => {
        router.push(`/medications/${id}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Button label={t('medications.details.btnBack')} onPress={() => router.navigate('/(tabs)/medications' as never)} variant="outline" />
                <Text style={styles.headerTitle}>{t('medications.list.expiring', { count: expiringSoonList.length })}</Text>
                <View style={styles.headerSpacer} />
            </View>
            {isLoading && expiringSoonList.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={expiringSoonList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ExpirationCard 
                            medication={item} 
                            onPress={() => handlePress(item.id)} 
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <EmptyState
                                title="All good"
                                description="No medications are expiring in the next 30 days."
                            />
                        </View>
                    }
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    headerTitle: {
        ...typography.headingMD,
        color: colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 80, // Approximate width of the back button to center the title
    },
    listContent: {
        padding: Spacing.md,
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
    },
});
