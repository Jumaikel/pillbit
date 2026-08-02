import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { Spacing, Radius } from '@/constants';
import { MedicationExpirationState } from '../types';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components';

interface ExpirationCardProps {
    medication: MedicationExpirationState;
    onPress?: () => void;
    onDiscard?: () => void;
}

export function ExpirationCard({ medication, onPress, onDiscard }: ExpirationCardProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
  const { t } = useTranslation();
    const { name, expirationDate, expirationStatus, daysRemaining } = medication;
    
    const isExpired = expirationStatus === 'expired';
    
    let subtitleText = '';
    let badgeColor = '';
    let badgeTextColor = '';

    if (isExpired) {
        subtitleText = `Expired ${Math.abs(daysRemaining)} days ago`;
        badgeColor = '#FEE9E7';
        badgeTextColor = colors.error;
    } else {
        subtitleText = `Expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
        badgeColor = '#FFF5E0';
        badgeTextColor = colors.warning;
    }

    const dateObj = new Date(expirationDate);
    // Explicitly add timezone offset if needed or use simple split since it's YYYY-MM-DD
    const dateStr = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const cardProps = onPress ? { onPress, accessibilityLabel: `View ${name}` } : {};

    return (
        <Card style={styles.container} {...cardProps}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                        {name}
                    </Text>
                    <Text style={styles.dateText}>{dateStr}</Text>
                </View>

                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={[styles.badgeText, { color: badgeTextColor }]}>
                        {subtitleText}
                    </Text>
                </View>
                {onDiscard && (
                    <View style={styles.actionContainer}>
                        <Button label={t('medications.details.btnDiscard')} onPress={onDiscard} variant="outline" />
                    </View>
                )}
            </View>
        </Card>
    );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    container: {
        marginBottom: Spacing.sm,
    },
    content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: Spacing.xs,
    },
    textContainer: {
        width: '100%',
    },
    name: {
        ...typography.headingMD,
        color: colors.textPrimary,
        marginBottom: Spacing.xxs,
    },
    dateText: {
        ...typography.bodySM,
        color: colors.textSecondary,
    },
    badge: {
        borderRadius: Radius.full,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xxs,
        marginTop: Spacing.xs,
    },
    badgeText: {
        ...typography.caption,
        fontWeight: '600',
    },
    actionContainer: {
        marginTop: Spacing.sm,
        width: '100%',
    }
});
