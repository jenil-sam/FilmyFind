import { useState } from "react";
import "../css/SearchBar.css";

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form floating">
      <input
        type="text"
        placeholder="Search for movies..."
        className="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

export default SearchBar;