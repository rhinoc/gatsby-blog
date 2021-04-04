import algoliasearch from 'algoliasearch/lite';
import { createRef, default as React, useState } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import SearchBox from './search-box';
import SearchResult from './search-result';
import { Close as CloseIcon } from '@styled-icons/remix-fill/';
import useClickOutside from '../../hooks/useClickOutside';
import './index.scss';

export default function Search({ indices, show, hideFn }) {
  const clickRef = createRef();
  const [query, setQuery] = useState();
  const searchClient = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID, process.env.GATSBY_ALGOLIA_SEARCH_KEY);
  useClickOutside(clickRef, hideFn);

  return (
    <InstantSearch searchClient={searchClient} indexName={indices[0].name} onSearchStateChange={({ query }) => setQuery(query)}>
      <div className={`accerator ${show ? 'search-modal' : 'nodisp'}`}>
        <CloseIcon
          className="close"
          onClick={hideFn}
        />
        <div className="search" ref={clickRef}>
          <SearchBox show={show}/>
          <SearchResult className="search-result" show={show && query?.length > 0} indices={indices} />
        </div>
      </div>
    </InstantSearch>
  );
}
