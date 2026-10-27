import markdownIt from 'markdown-it';
import esbuild from './_source/_utilities/esbuild.js';
import lightingcss from './_source/_utilities/lightningcss.js';
import image from './_source/_utilities/image.js';
import style from './_source/_utilities/style.js';
import setVar from './_source/_utilities/setVar.js';
import markdownify from './_source/_utilities/markdownify.js';
import { IdAttributePlugin } from '@11ty/eleventy';

export default async function (eleventyConfig) {
	/* --------------------------------------------------------------------------
  Plugins, bundles, shortcodes, filters
  -------------------------------------------------------------------------- */
	eleventyConfig.addPlugin(esbuild);
	eleventyConfig.addPlugin(lightingcss);
	eleventyConfig.addPlugin(IdAttributePlugin);
	eleventyConfig.addBundle('css', { transforms: [style] });
	eleventyConfig.addShortcode('image', image);
	eleventyConfig.addPairedShortcode('setVar', setVar);
	eleventyConfig.addFilter('markdownify', markdownify);
	eleventyConfig.addFilter('orderedBy', (items, slugs) => {
		const positions = new Map();
		if (Array.isArray(slugs)) {
			slugs.forEach((slug, index) => {
				if (!positions.has(slug)) positions.set(slug, index);
			});
		}

		const orderedItems = Array.isArray(items) ? items : [];
		return [...orderedItems].sort((a, b) => {
			const aPosition = positions.get(a.fileSlug);
			const bPosition = positions.get(b.fileSlug);
			if (aPosition === undefined && bPosition === undefined) return 0;
			if (aPosition === undefined) return 1;
			if (bPosition === undefined) return -1;
			return aPosition - bPosition;
		});
	});

	/* --------------------------------------------------------------------------
  MarkdownIt settings
  -------------------------------------------------------------------------- */
	const markdownItOptions = {
		html: true,
		typographer: true,
	};
	eleventyConfig.setLibrary('md', markdownIt(markdownItOptions));

	/* --------------------------------------------------------------------------
  Files & folders
  -------------------------------------------------------------------------- */
	eleventyConfig.ignores.add('.DS_Store');
	eleventyConfig.setServerPassthroughCopyBehavior('passthrough');
	eleventyConfig.addPassthroughCopy('_source/assets/fonts');
	eleventyConfig.addPassthroughCopy('_source/assets/images');
	return {
		pathPrefix: process.env.SITE_PATH_PREFIX || '/',
		dir: {
			input: '_source',
			output: '_public',
			layouts: '_layouts',
			includes: '_includes',
		},
		templateFormats: ['html', 'md', 'liquid'],
		htmlTemplateEngine: 'liquid',
	};
}
