import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { StaticImage } from 'gatsby-plugin-image';
import '../styles/about.scss';

const AboutPage = raw => {
  const { data, location } = raw;

  return (
    <Layout location={location} icp={data.site.siteMetadata.icp} projectUrl={data.site.siteMetadata.projectUrl}>
      <Seo title="About" />
      <div className="about-wrapper">
        <StaticImage className="memoji" src="../images/memoji_bg.png" quality={100} placeholder="tracedSVG" alt="memoji"/>
        <div className="accerator glass card">
          <h2 className="title">About Me</h2>
          <div className="content">
            <p>Hi, I'm {data.site.siteMetadata.author.name}, a front-end developer.</p>
            <p>Maybe a awesome designer among developers, and a excellent developer among designers.</p>
            <p>
              Contact me through <a alt="mail" className="purea" href={`mailto:${data.site.siteMetadata.author.mail}`}>{data.site.siteMetadata.author.mail}</a>
            </p>
          </div>
          <h2 className="title">About the Site</h2>
          <div className="content">
            <p>This is my spot on the web for projects, tutorials, and anything else I wanna share with the world. This site has no ads, sponsors and affiliates.</p>
            <p>I made my first personal website in middle school, and I've been making them ever since. Writting things down helps me find peace and makes me feel safe. Hope you guys can enjoy here too.</p>
          </div>
          <h2 className="title">Credits</h2>
          <div className="content">
            <p>During designing and developing this blog, I referred to or directly used <a className="purea" alt="credits" href="/posts/gatsby/#credits">those people's awesome ideas or designs</a>. Thx for their work!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        icp
        projectUrl
        author {
          name
          mail
        }
      }
    }
  }
`;
