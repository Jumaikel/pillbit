const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk(srcDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    let changed = false;

    // We skip the constants directory itself
    if (file.includes('constants')) return;
    if (file.includes('useTheme.ts')) return;

    // Check if file uses Typography, LightColors, DarkColors, or Colors
    const usesTheme = content.includes('Typography') || content.includes('LightColors') || content.includes('DarkColors') || content.includes('Colors.');

    if (usesTheme) {
        // Remove old imports
        content = content.replace(/import\s+\{([^}]*)\}\s+from\s+['"]@\/constants['"];/g, (match, p1) => {
            const tokens = p1.split(',').map(t => t.trim());
            const newTokens = tokens.filter(t => !['Typography', 'LightColors', 'DarkColors', 'Colors'].includes(t));
            if (newTokens.length === 0) return '';
            return `import { ${newTokens.join(', ')} } from '@/constants';`;
        });

        // Add useTheme import if not there
        if (!content.includes('useTheme')) {
            // Find last import
            const lastImportIndex = content.lastIndexOf('import ');
            const endOfLastImport = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLastImport + 1) + `import { useTheme } from '@/hooks/useTheme';\n` + content.slice(endOfLastImport + 1);
        }

        // Inside every functional component, we need to inject `const { colors, typography } = useTheme();`
        // We will just use regex to find component declarations
        const componentRegex = /(export\s+default\s+function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{|export\s+const\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{|function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{)/g;
        
        let match;
        const replacements = [];
        while ((match = componentRegex.exec(content)) !== null) {
            replacements.push({
                index: match.index + match[0].length,
                text: `\n  const { colors, typography } = useTheme();`
            });
        }

        // Apply replacements from bottom to top
        for (let i = replacements.length - 1; i >= 0; i--) {
            const r = replacements[i];
            content = content.slice(0, r.index) + r.text + content.slice(r.index);
        }

        // Now replace StyleSheet usages!
        // This is the tricky part. Stylesheets are usually at the bottom.
        // We will transform `const styles = StyleSheet.create({...})` into a hook or function.
        // A common pattern is `const getStyles = (colors: any, typography: any) => StyleSheet.create({...})`
        
        if (content.includes('StyleSheet.create')) {
            content = content.replace(/const\s+styles\s*=\s*StyleSheet\.create\(/g, 'const getStyles = (colors: any, typography: any) => StyleSheet.create(');
            
            // In the component, we need to add `const styles = getStyles(colors, typography);`
            // right after our injected `useTheme()` hook
            content = content.replace(/const \{ colors, typography \} = useTheme\(\);/g, 'const { colors, typography } = useTheme();\n  const styles = getStyles(colors, typography);');
        }

        // Replace direct usages in the file
        content = content.replace(/Typography\./g, 'typography.');
        content = content.replace(/LightColors\./g, 'colors.');
        content = content.replace(/DarkColors\./g, 'colors.');
        content = content.replace(/Colors\.light\./g, 'colors.');
        content = content.replace(/Colors\.dark\./g, 'colors.');

        fs.writeFileSync(file, content);
        console.log('Refactored:', file);
    }
});
