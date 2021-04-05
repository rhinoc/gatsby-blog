import * as React from 'react';
import { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import CateNav from '../components/cateNav';
import PostItem from '../components/postItem';
import Pagination from '../components/pagination/';
import '../styles/main.scss';

const IndexTemplate = raw => {
  const [stickyNav, setStickyNav] = useState(false);
  const { data, pageContext, location } = raw;
  const posts = data.allMarkdownRemark.nodes;

  useEffect(() => {
    const catNav = document.querySelector('.blog-name');
    const observer = new IntersectionObserver(e => setStickyNav(!e[0].isIntersecting), {
      root: null,
      threshold: 0,
    });
    observer.observe(catNav);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Layout location={location} icp={data.site.siteMetadata.icp} projectUrl={data.site.siteMetadata.projectUrl}>
      <Seo title="All Posts" />
      <div className="blog-name">{data.site.siteMetadata.title}</div>
      <CateNav cates={data.site.siteMetadata.nav} curCate={pageContext.cate} className={stickyNav ? 'accerator category-list--sticky' : ''} />
      <section className="post-list">
        {posts.map(post => (
          <PostItem key={post.fields.slug} title={post.frontmatter.title} url={post.fields.slug} description={post.frontmatter.description || post.excerpt} date={post.frontmatter.date} timeToRead={post.timeToRead} />
        ))}
      </section>
      <Pagination pageContext={pageContext} location={location}/>
    </Layout>
  );
};

export default IndexTemplate;

export const pageQuery = graphql`
  query($limit: Int!, $skip: Int!, $cate: String = "//") {
    site {
      siteMetadata {
        title
        icp
        nav
        projectUrl
      }
    }
    allMarkdownRemark(filter: { frontmatter: { category: { regex: $cate } } }, sort: { fields: [frontmatter___date], order: DESC }, skip: $skip, limit: $limit) {
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
