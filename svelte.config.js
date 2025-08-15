import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocess } from 'svelte/compiler';

const config = {
    kit: { adapter: adapter(), paths: { base: process.env.NODE_ENV === 'production' ? '/jumper-generator' : '' } },
    preprocess: [
        vitePreprocess(),
    ]
};

export default config;
