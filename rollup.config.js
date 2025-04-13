import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/main.jsx', // ✅ updated entry file
    output: {
        file: 'dist/bundle.js',
        format: 'esm',
    },
    plugins: [resolve(), commonjs()],
};
