import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

const SERVICES_PER_PAGE = 6; // Define the number of services per page

function Services() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(true); // Add loading state
  const [selectedService, setSelectedService] = useState(null); // Add this state

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "service"] | order(_createdAt desc) {serviceName, "iconUrl": icon.image.asset->url}')
      .then((data) => {
        setServices(data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(console.error);
  }, []);

  // Calculate the current services to display based on the page
  const indexOfLastService = currentPage * SERVICES_PER_PAGE;
  const indexOfFirstService = indexOfLastService - SERVICES_PER_PAGE;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  // Calculate the total number of pages
  const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Add this handler
  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const handleClosePopup = () => {
    setSelectedService(null);
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
    <div className="services">
      <h1>Services</h1>
      <div className="service-list">
        {currentServices.map((service) => (
          <div 
            key={service.serviceName} 
            className="service-item"
            onClick={() => handleServiceClick(service)} // Add onClick handler
            style={{ cursor: 'pointer' }} // Optional: add pointer cursor
          >
            {service.iconUrl && (
              <img src={service.iconUrl} alt={`${service.serviceName} icon`} className="service-icon" />
            )}
            <h3>{service.serviceName}</h3>
          </div>
        ))}
      </div>

      {/* Add Popup */}
      {selectedService && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={handleClosePopup}>×</button>
            <h2>{selectedService.serviceName}</h2>
            <img 
              src={selectedService.iconUrl} 
              alt={`${selectedService.serviceName} icon`} 
              className="popup-image" 
            />
          </div>
        </div>
      )}

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

export default Services;
