import { useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LightColors, Spacing } from '@/constants';
import { useExpirationStore, ExpirationCard } from '@/features/expiration';
import { EmptyState } from '@/components/EmptyState';

export default function ExpiringSoonScreen() {
    const { expiringSoonList, isLoading, refreshExpirationData } = useExpirationStore();
    const router = useRouter();

    useEffect(() => {
        refreshExpirationData();
    }, []);

    const handlePress = (id: number) => {
        router.push(`/medications/${id}`);
    };

    return (
        <View style={styles.container}>
            {isLoading && expiringSoonList.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={LightColors.primary} />
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
                                icon="checkmark-circle"
                                title="All good!"
                                message="None of your medications are expiring within the next 30 days."
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
