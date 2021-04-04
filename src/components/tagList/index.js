import * as React from "react"
import { Link } from "gatsby"
import "./index.scss"

const TagList = ({ tags }) => {
  return (
    <div className="taglist">
      {tags.map(tag => {
        return (
          <div className={`taglist__item taglist__item--${tag}`} key={tag}>
            <Link className="purea" to={`/tags/${tag}`}>{`#${tag.toLowerCase()}`}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default TagList
