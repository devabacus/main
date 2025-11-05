// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'База знаний - MrFrolk',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/devabacus/' }, { icon: 'telegram', label: 'Telegram', href: 'https://t.me/mrfrolk' }],
		
			sidebar: [
				{
					label: 'Auth',
					collapsed: true,
					autogenerate: {
						directory: 'auth',
					},
				},
				{
					label: 'CAD-3D',
					collapsed: true,
					autogenerate: {
						directory: 'cad-3d',
					},
				},
				{
					label: 'Development',
					collapsed: true,
					autogenerate: {
						directory: 'development',
					},
				},
				{
					label: 'DevOps',
					collapsed: true,
					autogenerate: {
						directory: 'devops',
					},
				},
				{
					label: 'Graphics-video',
					collapsed: true,
					autogenerate: {
						directory: 'graphics-video',
					},
				},
				{
					label: 'Tools',
					collapsed: true,
					autogenerate: {
						directory: 'tools',
					},
				},
			
				{
					label: 'Web-development',
					collapsed: true,
					autogenerate: {
						directory: 'web-development',
					},
				},

			],

		}),
	],
});
