import * as React from 'react';
import {useState} from 'react';
import { Link } from 'gatsby';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../themes/theme';
import { GlobalStyles } from '../themes/GlobalStyles';
import { StaticImage } from 'gatsby-plugin-image';
import { CreativeCommons, CreativeCommonsBy } from '@styled-icons/remix-fill/';
import useDarkMode from '../hooks/useDarkMode';
import Search from '../components/search';
import { Search2 as SearchIcon } from '@styled-icons/remix-fill/Search2';

const IconLight = () => <StaticImage className="blog-title__icon" src="../images/icon-light.svg" quality={100} placeholder="tracedSVG" alt="blog-icon" />;
const IconDark = () => <StaticImage className="blog-title__icon" src="../images/icon-dark.svg" quality={100} placeholder="tracedSVG" alt="blog-icon" />;

const Layout = ({ location, children, icp, projectUrl, className='' }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;
  const darkModeEnabled = useDarkMode();
  const [showSearch, setShowSearch] = useState(false);
  let blogTitle = (
    <div className="blog-title">
      <Link to="/" className="purea">
        {darkModeEnabled ? <IconLight /> : <IconDark />}
      </Link>
    </div>
  );

  return (
    <ThemeProvider theme={darkModeEnabled ? darkTheme : lightTheme}>
      <GlobalStyles />
      <div className={`container ${showSearch ? 'container--fixed':''} ${className}`} data-is-root-path={isRootPath}>
        <header className="blog-header">
          {blogTitle}
          <div className="menu">
            <SearchIcon
              className="search-icon"
              onClick={() => {
                setShowSearch(true);
              }}
            />
            <Link to="/" className="purea">
              Blog
            </Link>
            <a target="_blank" rel="noreferrer" href={projectUrl} className="purea" alt="project" >
              Project
            </a>
            <Link to="/about" className="purea">
              About
            </Link>
          </div>
        </header>
        <main className="blog-main">{children}</main>
        <footer className="blog-footer">
          <div className="license">
            <a className="purea icon-wrapper" href="https://creativecommons.org/licenses/by/4.0/">
              <CreativeCommons />
              <CreativeCommonsBy />
            </a>
            <aside>
              Except where <Link className="purea" to="/posts/gatsby/#credits" alt="credits">otherwise noted</Link>, content on this site is licensed under a{' '}
              <a className="purea" href="https://creativecommons.org/licenses/by/4.0/" rel="license">
                Creative Commons Attribution 4.0 International license
              </a>
              .
            </aside>
          </div>
          <div className="copyright">© 2021 — Designed & developed by rhinoc</div>
          <div className="icp">
            互联网ICP备案：
            <a className="purea" target="_blank" rel="noreferrer" href="https://www.miitbeian.gov.cn/" nofollow="">
              {icp}
            </a>
          </div>
        </footer>
        <Search indices={[{ name: `Pages`, title: `Pages` }]} show={showSearch} hideFn={()=>setShowSearch(false)}/>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
