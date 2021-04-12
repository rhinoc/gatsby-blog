import React, { useRef, useEffect } from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { Search2 as SearchIcon } from '@styled-icons/remix-fill/Search2';

export default connectSearchBox(({ show, refine, currentRefinement }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    show && inputRef.current && inputRef.current.focus()
  }, [show])

  return (
      <form className='search-box'>
        <SearchIcon className="icon"/>
        <input placeholder='Search by algolia' className='search-input' type="text" onChange={e => refine(e.target.value)} value={currentRefinement} ref={inputRef}></input>
      </form>
  );
});
