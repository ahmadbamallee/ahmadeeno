import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';

const CERTIFICATES_PER_PAGE = 5; // Define the number of certificates per page

const builder = imageUrlBuilder(sanityClient);
function urlFor(source) {
  return builder.image(source);
}

function Certificates() {
  const [allCertificates, setAllCertificates] = useState([]); // New state for all certificates
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null); // Add this new state
  const [sortMethod, setSortMethod] = useState('date'); // Changed from sortOrder
  const [filterLetter, setFilterLetter] = useState(''); // Changed from selectedLetter

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "certificate"] {
        title,
        "description": description[]{
          ...,
          "text": pt::text(description)
        },
        certificateImage,
        _createdAt
      }`)
      .then((data) => {
        console.log('Certificate data:', JSON.stringify(data, null, 2)); // Detailed logging
        setAllCertificates(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Simplified sorting function
  const getSortedCertificates = () => {
    let sorted = [...allCertificates];
    
    // Apply letter filter if selected
    if (filterLetter) {
      sorted = sorted.filter(cert => 
        cert.title.toLowerCase().startsWith(filterLetter.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortMethod) {
      case 'alpha':
        return sorted.sort((a, b) => 
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        );
      case 'alpha-reverse':
        return sorted.sort((a, b) => 
          b.title.toLowerCase().localeCompare(a.title.toLowerCase())
        );
      case 'date':
        return sorted.sort((a, b) => 
          new Date(b._createdAt) - new Date(a._createdAt)
        );
      case 'date-reverse':
        return sorted.sort((a, b) => 
          new Date(a._createdAt) - new Date(b._createdAt)
        );
      default:
        return sorted;
    }
  };

  // Update pagination calculations
  const sortedCertificates = getSortedCertificates();
  const currentCertificates = sortedCertificates.slice(
    (currentPage - 1) * CERTIFICATES_PER_PAGE, 
    currentPage * CERTIFICATES_PER_PAGE
  );
  const totalPages = Math.ceil(sortedCertificates.length / CERTIFICATES_PER_PAGE);

  // Generate alphabet array
  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  // Add this new function near other handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="certificates">
      <div className="certificates-header">
        <h1>Certificates</h1>
        
        {/* Keep only the sort select in the header */}
        <div className="certificates-controls">
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
      </div>

      <div className="certificate-list">
        {currentCertificates.map((certificate, index) => (
          <div 
            key={index} 
            className="certificate-card"
            onClick={() => setSelectedCertificate(certificate)} // Add onClick handler
            style={{ cursor: 'pointer' }} // Optional: add pointer cursor
          >
            {certificate.certificateImage && certificate.certificateImage.asset && (
              <img
                src={urlFor(certificate.certificateImage).url()}
                alt={certificate.title}
                className="certificate-image"
              />
            )}
            <h2 className="certificate-title">{certificate.title}</h2>
            <div className="certificate-description">
              {certificate.description ? (
                <PortableText 
                  value={certificate.description}
                  components={{
                    block: ({children}) => <p className="description-text">{children}</p>
                  }}
                />
              ) : (
                <p>No description available</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Move alphabet filter here, before pagination */}
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

      {/* Replace the existing pagination div with this simpler version */}
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

      {/* Existing modal code */}
      {selectedCertificate && (
        <div className="certificate-modal" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-button" onClick={() => setSelectedCertificate(null)}>&times;</span>
            <img
              src={urlFor(selectedCertificate.certificateImage).url()}
              alt={selectedCertificate.title}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificates;
