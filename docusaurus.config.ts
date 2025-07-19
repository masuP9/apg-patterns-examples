import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type { Options } from "@docusaurus/preset-classic";

const config: Config = {
  title: "APG Patterns Examples",
  tagline:
    "Accessible UI component implementations across React, Svelte, and Vue",
  favicon: "img/favicon.ico",

  url: "https://masup9.github.io",
  baseUrl: "/apg-patterns-examples/",

  organizationName: "masuP9",
  projectName: "apg-patterns-examples",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
          editUrl:
            "https://github.com/masuP9/apg-patterns-examples/tree/main/docs/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Options,
    ],
  ],

  plugins: [
    require.resolve('./plugins/code-loader'),
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "APG Patterns Examples",
      logo: {
        alt: "APG Patterns Examples Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Patterns",
        },
        {
          href: "https://www.w3.org/WAI/ARIA/apg/patterns/",
          label: "APG Spec",
          position: "right",
        },
        {
          href: "https://github.com/masuP9/apg-patterns-examples",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Patterns",
          items: [
            {
              label: "Button",
              to: "/button",
            },
            {
              label: "Accordion",
              to: "/accordion",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "APG Authoring Patterns",
              href: "https://www.w3.org/WAI/ARIA/apg/patterns/",
            },
            {
              label: "WCAG Guidelines",
              href: "https://www.w3.org/WAI/WCAG21/quickref/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/masuP9/apg-patterns-examples",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} APG Patterns Examples. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "typescript", "tsx"],
    },
  },

  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};

export default config;
