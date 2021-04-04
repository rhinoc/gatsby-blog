import { Link } from "gatsby"
import { default as React } from "react"
import { Highlight, Hits, Index, Snippet } from "react-instantsearch-dom"

const PageHit = ({ hit }) => (
  <Link to={hit.slug} className="purea">
      <Highlight attribute="title" hit={hit} tagName="mark" />
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </Link>
)

const HitsInIndex = ({ index }) => (
  <Index indexName={index.name}>
    <Hits className="search-result-list" hitComponent={PageHit} />
  </Index>
)

const SearchResult = ({ indices, className, show }) => {
  return (
    <div className={show ? className : "hide"}>
      {indices.map(index => (
        <HitsInIndex index={index} key={index.name} />
      ))}
    </div>
  )
}

export default SearchResult
