import { useConfigStore } from '../store/useConfigStore';
import { Colors, HighContrastLightColors, HighContrastDarkColors } from '../constants/colors';
import { getScaledTypography } from '../constants/typography';
import { useColorScheme } from 'react-native';

export function useTheme() {
    const configSettings = useConfigStore(state => state.settings);
    const systemTheme = (useColorScheme() || 'light') as 'light' | 'dark';
    
    // Determine actual theme
    let activeTheme: 'light' | 'dark' = systemTheme;
    if (configSettings?.theme === 'light') activeTheme = 'light';
    if (configSettings?.theme === 'dark') activeTheme = 'dark';
    
    const isHighContrast = configSettings?.isHighContrastEnabled || false;
    
    let colors = Colors[activeTheme];
    if (isHighContrast) {
        colors = activeTheme === 'dark' ? HighContrastDarkColors : HighContrastLightColors;
    }
    
    const textSizeSetting = configSettings?.textSize || 'normal';
    let scale = 1;
    if (textSizeSetting === 'large') scale = 1.2;
    if (textSizeSetting === 'extra_large') scale = 1.4;
    
    const typography = getScaledTypography(scale);
    
    return {
        theme: activeTheme,
        colors,
        typography,
        isHighContrast
    };
}
