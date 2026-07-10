import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Spacing, Radius } from '@/constants';
import { ConsumptionStatus } from '@/database/models';
import { useTheme } from '@/hooks/useTheme';

interface HistoryFilterBarProps {
    selectedStatus?: ConsumptionStatus;
    onSelectStatus: (status?: ConsumptionStatus) => void;
}

const filters: { label: string; value: ConsumptionStatus | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Taken', value: 'taken' },
    { label: 'Skipped', value: 'skipped' },
    { label: 'Postponed', value: 'postponed' },
];

export function HistoryFilterBar({ selectedStatus, onSelectStatus }: HistoryFilterBarProps) {
  const { colors, typography } = useTheme();
  const styles = getStyles(colors, typography);
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {filters.map((filter, index) => {
                const isSelected = filter.value === selectedStatus;
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.chip,
                            isSelected && styles.chipSelected
                        ]}
                        onPress={() => onSelectStatus(filter.value)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected
                        ]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const getStyles = (colors: any, typography: any) => StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        ...typography.bodySM,
        color: colors.textSecondary,
    },
    chipTextSelected: {
        color: colors.surface,
        fontWeight: '600',
    },
});
