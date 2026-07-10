import { useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants';
import { useExpirationStore, ExpirationCard } from '@/features/expiration';
import { EmptyState } from '@/components/EmptyState';
import { useTheme } from '@/hooks/useTheme';

export default function ExpiredMedicationsScreen() {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
    const { expiredList, isLoading, refreshExpirationData } = useExpirationStore();
    const router = useRouter();

    useEffect(() => {
        refreshExpirationData();
    }, []);

    const handlePress = (id: number) => {
        router.push(`/medications/${id}`);
    };

    return (
        <View style={styles.container}>
            {isLoading && expiredList.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={expiredList}
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
                                title="All clear"
                                description="You have no expired medications."
                            />
                        </View>
                    }
                />
            )}
        </View>
    );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
