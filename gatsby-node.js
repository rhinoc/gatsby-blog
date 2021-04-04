const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const { paginate } = require('gatsby-awesome-pagination');
const _ = require(`lodash`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Templates
  const postTemplate = path.resolve(`./src/templates/blog-post.js`);
  const tagTemplate = path.resolve(`./src/templates/tags.js`);
  const indexTemplate = path.resolve(`./src/templates/index.js`);
  const aboutTemplate = path.resolve(`./src/templates/about.js`);

  // Get All Data
  const result = await graphql(
    `
      {
        postsRemark: allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }, limit: 1000) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
        tagsGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___tags) {
            fieldValue
          }
        }
        cateGroup: allMarkdownRemark(limit: 2000) {
          group(field: frontmatter___category) {
            fieldValue
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }

  const posts = result.data.postsRemark.nodes;
  const tags = result.data.tagsGroup.group;
  const cates = result.data.cateGroup.group;

  createPage({
    path: `/about/`,
    component: aboutTemplate,
  })

  // create POST pages
  posts.forEach(async (post, index) => {
    createPage({
      path: post.fields.slug,
      component: postTemplate,
      context: {
        id: post.id,
        prev: index !== 0 ? posts[index - 1].id : null,
        nextPostId: index !== posts.length - 1 ? posts[index + 1].id : null,
      },
    });
  });

  // create TAG pages
  tags.forEach(async tag => createPage({
    path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
    component: tagTemplate,
    context: {
      tag: tag.fieldValue,
    },
  }));

  const promises = cates.map(async cate=>{
    const cateResult = await graphql(
      `
      {
        allMarkdownRemark(filter: { frontmatter: { category: { eq: "${cate.fieldValue}" } } }, sort: { fields: frontmatter___date, order: ASC }, limit: 1000) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
      `
    );
    const catePosts = cateResult.data.allMarkdownRemark.nodes;
    const cateKebab = _.kebabCase(cate.fieldValue);
    paginate({
      createPage,
      items: catePosts,
      itemsPerPage: 8,
      component: indexTemplate,
      pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? `/categories/${cateKebab}` : `/categories/${cateKebab}/page`),
      context: {
        cate: `/${cate.fieldValue}/`,
      },
    });
  })

  await Promise.all(promises);

  // create INDEX page
  paginate({
    createPage,
    items: posts,
    itemsPerPage: 8,
    component: indexTemplate,
    pathPrefix: ({ pageNumber }) => {
      if (pageNumber === 0) {
        return `/`;
      } else {
        return `/page`;
      }
    },
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = `/posts${createFilePath({ node, getNode })}`;

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type SiteSiteMetadata {
      author: Author
      projectUrl: String
      siteUrl: String
      social: Social
      icp: String
      nav: [String]
    }

    type Author {
      name: String
      mail: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
      category: String
      tags: [String]
    }

    type Fields {
      slug: String
    }
  `);
};
