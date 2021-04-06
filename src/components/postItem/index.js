import * as React from 'react';
import { Link } from 'gatsby';
import { Timer as TimerIcon, Calendar as DateIcon } from '@styled-icons/remix-fill';
import './index.scss';

const PostItem = ({ title, url, description, date, timeToRead }) => (
  <Link to={url} className="accerator purea post-item glass">
    <header className="post-item__title">{title}</header>
    <section className="post-item__desc">
      <p
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </section>
    <section className="post-item__info">
      <div className="date">
        <DateIcon className="icon" />
        {date}
      </div>
      <div className="read-time">
        <TimerIcon className="icon" />
        {`${timeToRead} min read`}
      </div>
    </section>
  </Link>
);

export default PostItem;
