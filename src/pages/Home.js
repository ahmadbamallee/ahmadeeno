import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [trendingPost, setTrendingPost] = useState(null);
  const [badges, setBadges] = useState([]);
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 2000;
  const badgesPerPage = 4;

  useEffect(() => {
    // Fetch home data
    sanityClient
      .fetch(`*[_type == "home"][0]{ heroImage, titles, intro, name }`)
      .then((data) => setHomeData(data))
      .catch((err) => console.error('Error fetching home data:', err));

    // Fetch trending post
    sanityClient
      .fetch(`*[_type == "trendingOnSite"][0]{
        title,
        slug,
        _createdAt,
        author-> { name, "imageUrl": profilePicture.asset->url }
      }`)
      .then((data) => setTrendingPost(data))
      .catch((err) => console.error('Error fetching trending post:', err));

    // Fetch digital badges
    sanityClient
      .fetch(`*[_type == "digitalBadge"]{ title, "badgeImageUrl": badgeImage.asset->url, verificationLink }`)
      .then((data) => {
        if (!data || data.length === 0) {
          console.error('No badges found.');
        } else {
          setBadges(data);
        }
      })
      .catch((err) => console.error('Error fetching badges:', err));
  }, []);

  useEffect(() => {
    if (homeData && homeData.titles) {
      const title = homeData.titles[currentTitleIndex];
      let speed = isDeleting ? deletingSpeed : typingSpeed;

      const handleTyping = setTimeout(() => {
        setDisplayedTitle((prev) =>
          isDeleting ? title.substring(0, prev.length - 1) : title.substring(0, prev.length + 1)
        );

        if (!isDeleting && displayedTitle === title) {
          setIsDeleting(true);
          speed = pauseDuration;
        } else if (isDeleting && displayedTitle === "") {
          setIsDeleting(false);
          setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % homeData.titles.length);
          speed = pauseDuration;
        }
      }, speed);

      return () => clearTimeout(handleTyping);
    }
  }, [homeData, displayedTitle, isDeleting, currentTitleIndex]);

  const totalSlides = Math.ceil(badges.length / badgesPerPage);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  const displayedBadges = badges.slice(
    currentSlide * badgesPerPage,
    currentSlide * badgesPerPage + badgesPerPage
  );

  if (!homeData) {
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
    <div className="app-wrapper">
      {/* Home Section */}
      <div className="home">
        <div className="home-content">
          <p className="intro">{homeData.intro}</p>
          <h1>
            I'm <strong>{homeData.name}</strong>
          </h1>
          <h2 className="dynamic-title">{displayedTitle}</h2>
          <div className="buttons">
            <Link to="/certificates" className="btn btn-primary">
              Certificates
            </Link>
          </div>
        </div>
        {homeData.heroImage && (
          <img
            src={urlFor(homeData.heroImage).width(200).url()}
            alt="Profile"
            className="profile-image"
          />
        )}
      </div>

      {/* Trending on Site Section */}
      {trendingPost && (
        <section className="trending-site-section">
          <h2>Trending on Site</h2>
          <div className="trending-content">
            <h3>{trendingPost.title}</h3>
            <div className="author-info">
              {trendingPost.author.imageUrl && (
                <img
                  src={urlFor(trendingPost.author.imageUrl).width(50).url()}
                  alt={trendingPost.author.name}
                  className="author-icon"
                />
              )}
              <p>
                By {trendingPost.author.name} •{' '}
                {new Date(trendingPost._createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Badge Section with Pagination */}
      {badges.length > 0 && (
        <section className="badges-section">
          <h2 className="badges-title">My Badges</h2>
          <div className="badges-carousel">
            <button onClick={prevSlide} className="carousel-btn prev-btn">
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <div className="badges-container">
              {displayedBadges.map((badge, index) => (
                <div key={index} className="badge-card">
                  {badge.badgeImageUrl && (
                    <img
                      src={badge.badgeImageUrl}
                      alt={badge.title}
                      className="badge-image"
                    />
                  )}
                  <p className="badge-title">{badge.title}</p>
                  {badge.verificationLink && (
                    <a
                      href={badge.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="verification-link"
                    >
                      Verify Badge
                    </a>
                  )}
                </div>
              ))}
            </div>
            <button onClick={nextSlide} className="carousel-btn next-btn">
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
