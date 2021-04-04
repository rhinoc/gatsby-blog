import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import '../styles/404.scss';

const NotFoundPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout className="container--error" location={location} title={siteTitle} projectUrl={data.site.siteMetadata.projectUrl}>
      <Seo title="404: Not Found"/>
      <main>
        <div className="tag">Page not found</div>
        <div className="title">Error 404</div>
        <div className="desc">Maybe Bigfoot has broken this page.</div>
        <div className="desc">
          Come back to the{' '}
          <Link to="/" className="back-btn">
            homepage
          </Link>
        </div>
      </main>
    </Layout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        projectUrl
      }
    }
  }
`;
