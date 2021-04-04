require('dotenv').config();

module.exports = {
  siteMetadata: {
    title: `Dicerorhinus`,
    author: {
      name: `rhinoc`,
      mail: `rhinoc@outlook.com`,
      summary: `Supposed to be a dev blog, but don't be suprised if you see something else.`,
    },
    description: `I think, therefore I am.`,
    siteUrl: `https://blog.rhinoc.top/`,
    projectUrl: `https://github.com/rhinoc`,
    icp: `粤ICP备18112604号-1`,
    nav: ['frontend', 'cs', 'embeded', 'etc'],
  },
  plugins: [
    { // define your .md posts path
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      },
    },
    { // define your posts media path
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `media`,
        path: `${__dirname}/content/media`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          { // remark plugin: support local images, and add figcaption for local image
            resolve: `gatsby-remark-images`,
            options: {
              linkImagesToOriginal: false,
              maxWidth: 1000,
              showCaptions: ["alt"],
              wrapperStyle: fluidResult => `width: ${fluidResult.presentationWidth}px;`,
            },
          },
          { // remark plugin: image figure caption for online image
            resolve: `gatsby-remark-figure-caption`,
            options: {figureClassName: 'online-image-figure'},
          },
          { // remark plugin: math equation support
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          { // remark plugin: iframe
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          { // remark plugin: custom blocks
            resolve: 'gatsby-remark-custom-blocks',
            options: {
              blocks: {
                danger: {
                  classes: 'danger pseudo-fa',
                  title: 'optional',
                },
                info: {
                  classes: 'info pseudo-fa',
                  title: 'optional',
                },
                togglelist: {
                  classes: 'togglelist pseudo-fa',
                  title: 'optional'
                }
              }
            }
          },
          { // remark plugin: autolink headers, !!!should before the prismjs plugin
            resolve: `gatsby-remark-autolink-headers`, 
            options: {
              icon: `<svg aria-hidden="true" width="8" height="8" version="1.1" viewBox="0 0 8 8"><path d="M0.408 3.156L0.624 1.932H2.052L2.4 0H3.624L3.276 1.932H4.452L4.8 0H6.024L5.676 1.932H7.104L6.888 3.156H5.46L5.244 4.332H6.684L6.468 5.556H5.028L4.692 7.488H3.468L3.804 5.556H2.628L2.292 7.488H1.068L1.404 5.556H0L0.216 4.332H1.62L1.836 3.156H0.408ZM3.06 3.156L2.844 4.332H4.02L4.236 3.156H3.06Z" fill-rule="evenodd"/></path></svg>`,
              className: `heading-anchor`,
              removeAccents: true,
            },
          },
          `gatsby-remark-code-titles`, // should before all code related plugin
          { // remark plugin: add copy button to code block
            resolve: `gatsby-remark-code-buttons`,
            options: {
              buttonText: `COPY`,
              toasterText: `COPIED`,
            }
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`, // punctuation marks
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Starter Blog`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries: require('./src/utils/algolia-queries'),
        enablePartialUpdates: true,
        matchFields: ['slug', 'modified'],
        concurrentQueries: false,
        skipIndexing: true,
      },
    },
    {
      resolve: `gatsby-plugin-posthog-analytics`,
      options: {
        apiKey: process.env.POSTHOG_API_KEY,
        appHost: process.env.POSTHOG_HOST,
        head: true,
        isEnabledDevMode: true
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-gatsby-cloud`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sass`,
  ],
};
