import { useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LightColors, Spacing } from '@/constants';
import { useExpirationStore, ExpirationCard } from '@/features/expiration';
import { EmptyState } from '@/components/EmptyState';

export default function ExpiredMedicationsScreen() {
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
                    <ActivityIndicator size="large" color={LightColors.primary} />
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
                                icon="checkmark-circle"
                                title="No expired medications"
                                message="You don't have any expired medications in your inventory."
                            />
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LightColors.background,
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
