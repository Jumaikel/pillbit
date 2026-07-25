import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/EmptyState';
import { Spacing } from '@/constants';

import { useTranslation } from 'react-i18next';

export function HistoryEmptyState() {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <EmptyState
                title={t('history.emptyTitle')}
                description={t('history.emptyDesc')}
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
