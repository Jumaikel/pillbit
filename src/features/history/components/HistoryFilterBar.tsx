import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LightColors, Typography, Spacing, Radius } from '@/constants';
import { ConsumptionStatus } from '@/database/models';

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

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        gap: Spacing.sm,
    },
    chip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.full,
        backgroundColor: LightColors.surface,
        borderWidth: 1,
        borderColor: LightColors.border,
    },
    chipSelected: {
        backgroundColor: LightColors.primary,
        borderColor: LightColors.primary,
    },
    chipText: {
        ...Typography.body2,
        color: LightColors.textSecondary,
    },
    chipTextSelected: {
        color: LightColors.surface,
        fontWeight: '600',
    },
});
