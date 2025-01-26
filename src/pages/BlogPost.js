import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "post" && slug.current == $slug][0]{
          title,
          content,
          coverImage,
          publishedAt,
          author->{
            name,
            bio,
            "profileImageUrl": profilePicture.asset->url
          }
        }`,
        { slug }
      )
      .then((data) => {
        setPost(data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(console.error);
  }, [slug]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="blog-post-detail">
      <div className="post-content">
        {post.coverImage && (
          <img src={urlFor(post.coverImage).url()} alt={post.title} className="cover-image" />
        )}
        <div className="content-wrapper">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <p className="publication-date">
              Published on: {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="author-info">
              {post.author.profileImageUrl && (
                <img
                  src={post.author.profileImageUrl}
                  alt={post.author.name}
                  className="author-icon"
                />
              )}
              <p>By {post.author.name}</p>
            </div>
          </div>
          <div className="content">
            {post.content && post.content.map((block, index) => {
              if (block._type === 'block') {
                // Handle different text styles
                const TextComponent = block.style === 'normal' ? 'p' : block.style;
                return (
                  <TextComponent key={index} className={`block-${block.style}`}>
                    {block.children && block.children.map((child) => {
                      const isListItem = block.listItem !== undefined;
                      if (isListItem) {
                        return (
                          <li key={child._key}>
                            {child.marks && child.marks.includes('strong') ? (
                              <strong>{child.text}</strong>
                            ) : (
                              child.text
                            )}
                          </li>
                        );
                      }
                      
                      if (child.marks && child.marks.includes('strong')) {
                        return <strong key={child._key}>{child.text}</strong>;
                      }
                      return <span key={child._key}>{child.text}</span>;
                    })}
                  </TextComponent>
                );
              } else if (block._type === 'image') {
                return (
                  <img
                    key={index}
                    src={urlFor(block).url()}
                    alt={block.alt || 'Image'}
                    className="content-image"
                  />
                );
              } else if (block._type === 'audio') {
                return (
                  <audio key={index} controls>
                    <source src={urlFor(block).url()} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                );
              } else if (block._type === 'video') {
                return (
                  <video key={index} controls>
                    <source src={urlFor(block).url()} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );
              } else if (block._type === 'code') {
                return (
                  <pre key={index}>
                    <code>{block.code}</code>
                  </pre>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPost;