import * as React from 'react';
import { Link } from 'gatsby';
import './index.scss';

const CateItem = ({ title = 'all', base = '/', curCate = '/all/' }) => {
  return (
    <Link to={`${title === 'all' ? base : `${base}${title}`}`} className={`purea category-list__item ${`/${title}/` === curCate ? 'category-list__item--active' : ''}`}>
      {title}
    </Link>
  );
};

const CateNav = ({ cates, curCate, className = ''}) => (
  <nav className={`category-list ${className}`}>
    <CateItem curCate={curCate} />
    {cates.map(cate => (
      <CateItem key={cate} title={cate} base="/categories/" curCate={curCate} />
    ))}
  </nav>
);

export default CateNav