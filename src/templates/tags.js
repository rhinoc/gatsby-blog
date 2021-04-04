import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import PostItem from '../components/postItem';

const TagsTemplate = raw => {
  const { data, pageContext, location } = raw;
  const tag = pageContext.tag;
  const posts = data.allMarkdownRemark.nodes;
  const tagHeader = `Found ${posts.length} post${posts.length === 1 ? "" : "s"} tagged with "${tag}".`;

  return (
    <Layout location={location} icp={data.site.siteMetadata.icp} projectUrl={data.site.siteMetadata.projectUrl}>
      <Seo title={`Tag: ${tag}`} />
      <div className="blog-name">{data.site.siteMetadata.title}</div>
      <div className="tag-header">{tagHeader}</div>
      <section className="post-list">
        {posts.map(post => (
          <PostItem key={post.fields.slug} title={post.frontmatter.title} url={post.fields.slug} description={post.frontmatter.description || post.excerpt} date={post.frontmatter.date} timeToRead={post.timeToRead} />
        ))}
      </section>
    </Layout>
  );
};

export default TagsTemplate;

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
        icp
        projectUrl
      }
    }
    allMarkdownRemark(filter: { frontmatter: { tags: { in: [$tag] } } }, sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        timeToRead
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`;