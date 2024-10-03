export default function () {
    return {
        enforce: 'pre',
        name: 'glsl-replace-includes',
        async transform(source, shader) {
            // Specify the extensions you want to target
            const extensions = ['.glsl', '.frag', '.vert'];
            // Check if the file extension matches the target extensions
            if (extensions.some(ext => shader.endsWith(ext))) {
                const shader = source.replace(/#include\s+"([^"]+)"/g, (match, p1) => {
                    if (p1.startsWith('node_modules')) {
                        return `#include "/../../${p1}"`;
                    } else if (p1.startsWith('lygia')) {
                        return `#include "/${p1}"`;
                    }
                    return match; // Return the original match if conditions don't match
                });
                return {
                    code: shader,
                    map: null // Provide source map if necessary
                };
            }
            return null; // Return null to let other plugins handle the file
        }
    };
};
