// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'База знаний - MrFrolk',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/devabacus/' }, { icon: 'telegram', label: 'Telegram', href: 'https://t.me/mrfrolk' }],
			head: [
        // {
        //   tag: 'script',
        //   attrs: {
        //     // Скрипт встраивается внутри тега
        //   },
        //   content: `
        //     document.addEventListener('astro:page-load', () => {
        //       const activeLink = document.querySelector('.sidebar-content [aria-current="page"]');
        //       if (activeLink) {
        //         const details = activeLink.closest('details');
        //         if (details) details.open = true;
        //       }
        //     });
        //   `,
        // },
      ],

			sidebar: [
				{
					label: 'Auth',
					collapsed: true,
					autogenerate: {
						directory: 'auth',
					},
				},
				{
					label: 'Creative-tools',
					collapsed: true,
					autogenerate: {
						directory: 'creative-tools',
					},
				},
				{
					label: 'Devops',
					collapsed: true,
					autogenerate: {
						directory: 'devops',
					},
				},
				{
					label: 'Flutter',
					collapsed: true,
					autogenerate: {
						directory: 'flutter',
					},
				},
				{
					label: 'Frameworks',
					collapsed: true,
					autogenerate: {
						directory: 'frameworks',
					},
				},
				{
					label: 'MCU-dev',
					collapsed: true,
					autogenerate: {
						directory: 'mcu-dev',
					},
				},
				{
					label: 'NextCloud',
					collapsed: true,
					autogenerate: {
						directory: 'nextCloud',
					},
				},

			],

		}),
	],
});
