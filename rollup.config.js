import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import svg from 'rollup-plugin-svg';
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev', '--debug'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true,
            });

            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        },
    };
}

export default {
    input: 'src/frontend/main.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'dist/www/build/bundle.js',
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                dev: !production,
            },
        }),
        css({ output: 'bundle.css' }),
        svg({
            base64: true,
        }),
        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        copy({
            targets: [{
                src: 'node_modules/bootstrap/dist/**/*',
                dest: 'dist/www/vendor/bootstrap'
            }]
        }),
        commonjs(),
        typescript({
            tsconfig: 'src/frontend/tsconfig.json',
            sourceMap: !production,
            inlineSources: !production,
        }),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('dist'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
    onwarn(warning, rollupWarn) {
        if (warning.code !== 'CIRCULAR_DEPENDENCY') {
            rollupWarn(warning);
        }
    },
};
