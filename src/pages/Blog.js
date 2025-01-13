import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 5; // Define the number of posts per page

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('date'); // Add sort method state
  const [filterLetter, setFilterLetter] = useState(''); // Add filter letter state

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "post"] | order(publishedAt desc) {
        title,
        slug,
        content,
        coverImage,
        publishedAt,
        author->{
          name,
          "imageUrl": profilePicture.asset->url
        }
      }`)
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Calculate the current posts to display based on the page
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;

  // Add sorting function
  const getSortedPosts = () => {
    let sortedPosts = [...posts];
    
    // Apply letter filter if selected
    if (filterLetter) {
      sortedPosts = sortedPosts.filter(post => 
        post.title.toLowerCase().startsWith(filterLetter.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortMethod) {
      case 'alpha':
        return sortedPosts.sort((a, b) => 
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        );
      case 'alpha-reverse':
        return sortedPosts.sort((a, b) => 
          b.title.toLowerCase().localeCompare(a.title.toLowerCase())
        );
      case 'date':
        return sortedPosts.sort((a, b) => 
          new Date(b.publishedAt) - new Date(a.publishedAt)
        );
      case 'date-reverse':
        return sortedPosts.sort((a, b) => 
          new Date(a.publishedAt) - new Date(b.publishedAt)
        );
      default:
        return sortedPosts;
    }
  };

  // Update the current posts calculation to use sorted posts
  const sortedPosts = getSortedPosts();
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

  // Generate alphabet array for filter
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div class="spinner center">
      

    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    </div>;
  }

  return (
    <div className="blog">
      <h1>Blog</h1>
      
      {/* Sorting controls only */}
      <div className="blog-controls" >
        <select 
          value={sortMethod} 
          onChange={(e) => setSortMethod(e.target.value)}
          className="sort-select"
        >
          <option value="date">Newest First</option>
          <option value="date-reverse">Oldest First</option>
          <option value="alpha">A-Z</option>
          <option value="alpha-reverse">Z-A</option>
        </select>
      </div>

      <div className="blog-list">
        {currentPosts.map((post) => (
          <div key={post.slug.current} className="blog-post">
            <img
              src={urlFor(post.coverImage).width(200).url()}
              alt={post.title}
              className="post-cover-image"
            />
            <div className="blog-content">
              <h2>{post.title}</h2>
              <div className="author-info">
                {post.author.imageUrl && (
                  <img
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    className="author-icon"
                  />
                )}
                <p>By {post.author.name}</p>
              </div>
              <p>{post.content[0]?.children[0]?.text.slice(0, 100)}...</p>
              <div className="post-dates">
                <p className="publication-date">
                  Published: {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Link to={`/blog/${post.slug.current}`} className="read-more-button">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Moved alphabet filter here */}
      <div className="alphabet-filter">
        <button 
          className={filterLetter === '' ? 'active' : ''} 
          onClick={() => setFilterLetter('')}
        >
          All
        </button>
        {alphabet.map(letter => (
          <button
            key={letter}
            className={filterLetter === letter ? 'active' : ''}
            onClick={() => setFilterLetter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Blog;
