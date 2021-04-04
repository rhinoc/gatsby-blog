import React from 'react';
import { useState, useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import tocbot from 'tocbot';
import Layout from '../components/layout';
import Seo from '../components/seo';
import TagList from '../components/tagList/';
import { ChevronUp as BackTopIcon } from '@styled-icons/boxicons-solid';
import { StaticImage } from 'gatsby-plugin-image';
import 'katex/dist/katex.min.css';
import '../styles/tocbot.scss';
import '../styles/post.scss';

const Avatar = () => (
  <Link className="purea avatar-wrapper" to="/about">
    <StaticImage className="avatar" src="../images/memoji.png" alt="avatar image" quality={100} placeholder="blurred"/>
  </Link>
);

const handleToggle = function (toggle) {
  return () => {
    if (toggle.classList.contains('togglelist--collapsed')) {
      toggle.classList.remove('togglelist--collapsed');
    } else {
      toggle.classList.add('togglelist--collapsed');
    }
  };
};

const BlogPostTemplate = ({ data, location }) => {
  const [showToc, setShowToc] = useState(false);
  const [stickyToc, setStickyToc] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    /* BackTop & StickyToc */
    const observer = new IntersectionObserver(
      e => {
        setShowBackTop(!e[0].isIntersecting);
        setStickyToc(e[0].isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );
    const target = document.querySelector('.post__header__info--bottom');
    observer.observe(target);

    /* Toggle List */
    const toggles = document.querySelectorAll('.togglelist');
    const listeners = [];
    for (let i = 0; i < toggles.length; i++) {
      const toggle = toggles[i];
      listeners[i] = handleToggle(toggle);
      toggle.addEventListener('click', listeners[i]);
    }

    /* Tocbot */
    const vw = document.body.clientWidth;
    if (vw >= 1500) setShowToc(true);
    tocbot.init({
      tocSelector: '#tocbot',
      contentSelector: '.post',
      headingSelector: 'h2, h3, h4',
      hasInnerContainers: true,
    });
    return () => {
      for (let i = 0; i < toggles.length; i++) toggles[i].removeEventListener('click', listeners[i]);
      tocbot.destroy();
      observer.disconnect();
    };
  }, [data, location]);

  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const authorName = data.site.siteMetadata.author.name;
  const { previous, next } = data;

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <div className="post">
        <header className="post__header">
          <div className="post__header__info--top">
            <TagList tags={post.frontmatter.tags} />
          </div>
          <div className="post__header__title">{post.frontmatter.title}</div>
          <div className="post__header__info--bottom">
            <Avatar />
            <div className="author-wrapper">
              <div className="author">{authorName}</div>
              <div className="date">{post.frontmatter.date}</div>
            </div>
          </div>
        </header>
        <article dangerouslySetInnerHTML={{ __html: post.html }} className="post__body glass" />
        <footer className="post__footer">
          {previous && (
            <Link to={previous.fields.slug} rel="prev" className="prev glass purea">
              <div className="desc">← Previous</div>
              <div className="post-title">{previous.frontmatter.title}</div>
            </Link>
          )}
          {next && (
            <Link to={next.fields.slug} rel="next" className="next glass purea">
              <div className="desc">Next →</div>
              <div className="post-title">{next.frontmatter.title}</div>
            </Link>
          )}
        </footer>
      </div>
      <div className={`tocbot-wrapper ${stickyToc ? '' : 'tocbot-wrapper--sticky'}`}>
        <div className={showToc ? 'button' : 'button button--hide'} onClick={() => setShowToc(!showToc)}>{`<TOC/>`}</div>
        <div id="tocbot" className={showToc ? 'accerator tocbot' : 'hide'} />
      </div>
      <div className={`backtop-wrapper ${showBackTop ? '' : 'hide'}`} id="back_top">
        <a href="#top" data-scroll="#top" className="backtop" title="Back to top">
          <BackTopIcon />
        </a>
      </div>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($id: String!, $previousPostId: String, $nextPostId: String) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
