import React from 'react';
import { Link } from 'gatsby';
import { ChevronLeft as LeftIcon } from '@styled-icons/boxicons-solid';
import { ChevronRight as RightIcon } from '@styled-icons/boxicons-solid';
import './index.scss';

let genPageList = (cur, last) => {
  const raw = [1, cur - 2, cur - 1, cur, cur + 1, cur + 2, last];
  let nums = Array.from(new Set(raw.filter(item => item >= 1 && item <= last)));
  const res = [1];
  for (let i = 1; i < nums.length - 1; i++) {
    if (nums[i] - 1 !== nums[i - 1]) {
      res.push(-1);
    }

    res.push(nums[i]);

    if (nums[i] + 1 !== nums[i + 1]) {
      res.push(-1);
    }
  }
  last !== 1 && res.push(last);

  return res;
};

const Pagination = ({pageContext, location}) => {
  const { previousPagePath, nextPagePath, humanPageNumber, numberOfPages } = pageContext;
  let baseUrl = location.pathname.replace(/\/page\/.*/, '');
  baseUrl = baseUrl[baseUrl.length - 1] === '/' ? baseUrl : `${baseUrl}/`;
  const PATH_ROOT = '';
  const PATH_PAGE = 'page/';
  const PATH_PREV = previousPagePath || `/${PATH_ROOT}`;
  const PATH_NEXT = nextPagePath || `/${PATH_PAGE}${numberOfPages}`

  const prevIcon = (
    <Link to={PATH_PREV} className={`purea pagination__icon ${!previousPagePath && 'pagination__icon--disabled'}`}>
      <div className="item-wrapper item-wrapper--chevron">
        <LeftIcon className="icon" />
      </div>
    </Link>
  );

  const nextIcon = (
    <Link to={PATH_NEXT} className={`purea pagination__icon ${!nextPagePath && 'pagination__icon--disabled'}`}>
      <div className="item-wrapper item-wrapper--chevron">
        <RightIcon className="icon" />
      </div>
    </Link>
  );

  const pageNumbers = genPageList(humanPageNumber, numberOfPages);

  const PageLink = ({ className, str, url }) => (
    <Link to={url} className="purea">
      <div className={`item-wrapper ${className}`}>{str}</div>
    </Link>
  );

  const Devider = (
    <div key={Math.random()} className="divider">
      ...
    </div>
  );

  const pageList = pageNumbers.map(number => {
    let className = number === humanPageNumber ? 'item-wrapper--active' : '';
    let url = number === 1 ? `${baseUrl}${PATH_ROOT}` : `${baseUrl}${PATH_PAGE}${number}`;

    if (number === -1) {
      return Devider;
    } else {
      return <PageLink className={className} str={number} key={url} url={url} />;
    }
  });

  return (
    <nav className="pagination">
      {prevIcon}
      {pageList}
      {nextIcon}
    </nav>
  );
};

export default Pagination;
