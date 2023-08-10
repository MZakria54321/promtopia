"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);

  // search states
  const [searchText, setSearchText] = useState("");
  const [serachTimeOut, setSearchTimeOut] = useState(null);
  const [searchedResult, setSearchedResult] = useState([]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");

    return posts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.prompt) ||
        regex.test(item.tag)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(serachTimeOut);
    setSearchText(e.target.value);

    setTimeout(() => {
      const searchResult = filterPrompts(e.target.value);
      setSearchedResult(searchResult);
    }, 500);
  };

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const searchResult = filterPrompts(tag);
    setSearchedResult(searchResult);
  };

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
    };
    fetchPost();
  }, [posts]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or username or prompt text"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      {searchText ? (
        <PromptCardList data={searchedResult} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
