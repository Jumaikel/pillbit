import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Spacing, Radius } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

interface ExpirationBannerProps {
    count: number;
    hasExpired: boolean;
    onPress: () => void;
}

export function ExpirationBanner({ count, hasExpired, onPress }: ExpirationBannerProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
    if (count === 0) return null;

    const bgColor = hasExpired ? '#FEF2F2' : '#FFFbeb';
    const iconColor = hasExpired ? colors.error : colors.warning;
    const titleColor = hasExpired ? colors.error : colors.warning;

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: bgColor }]} 
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
        >
            <View style={styles.iconContainer}>
                <Ionicons name="warning" size={24} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: titleColor }]}>
                    Atención de Vencimiento
                </Text>
                <Text style={styles.subtitle}>
                    Tienes {count} medicamento{count !== 1 ? 's' : ''} {hasExpired ? 'vencido(s) o' : ''} próximo(s) a vencer.
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColor} />
        </TouchableOpacity>
    );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.lg,
        marginBottom: Spacing.md,
    },
    iconContainer: {
        marginRight: Spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        ...typography.bodyMD,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        ...typography.bodySM,
        color: colors.textSecondary,
    },
});
