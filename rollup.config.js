import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.js', // update if your entry file is different
    output: {
        file: 'dist/bundle.js',
        format: 'esm',
    },
    plugins: [resolve(), commonjs()],
};
