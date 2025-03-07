import React, { useContext, useEffect, useState } from "react";
import './SearchBar.css';
import { EscomContext } from "../../Context/escomContext";
import SearchPage from "../../Pages/SearchPage/SearchPage";

const SearchBar = () => {
  const { searchPage, setSearchPage } = useContext(EscomContext);
  const [search, setSearch] = useState(true);

  useEffect(() => {
    console.log(searchPage);
  }, [searchPage])

  return (
    <>
      <div className="search-bar" id={!searchPage ? 'default' : "open-search"}>
        <input onClick={() => setSearchPage(true)} type="text" placeholder="Type your search" />
        {!searchPage ? "" :
          <>
            <button onClick={() => setSearchPage(false)}>Close</button>
            <div id="search-history">
              <ul>
                <li>Search one</li>
                <li>Search one</li>
                <li>Search one</li>
                <li>Search one</li>
              </ul>
            </div>
          </>
        }
      </div>
    </>
  )
}

export default SearchBar;