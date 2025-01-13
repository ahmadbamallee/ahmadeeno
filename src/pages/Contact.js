import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import emailjs from 'emailjs-com';
import PopupMessage from '../components/PopupMessage';

function Contact() {
  const [socialMediaLinks, setSocialMediaLinks] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [popup, setPopup] = useState({ message: '', type: '', show: false });

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "socialMedia"]{name, url, "iconUrl": icon.asset->url}')
      .then((data) => setSocialMediaLinks(data))
      .catch(console.error)
      .finally(() => setLoading(false)); // Set loading to false after fetching data
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(
        (result) => {
          setPopup({ message: 'Message sent successfully!', type: 'success', show: true });
        },
        (error) => {
          setPopup({ message: 'An error occurred. Please try again.', type: 'error', show: true });
        }
      );

    e.target.reset();
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
    <div className="contact-page">
      <div className="social-media-section">
        <h2>Connect with Me</h2>
        <div className="social-media">
          {socialMediaLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              {social.iconUrl && (
                <img
                  src={social.iconUrl}
                  alt={`${social.name} icon`}
                  className="social-icon"
                />
              )}
              {social.name}
            </a>
          ))}
        </div>
      </div>

      <div className="contact-form-section">
        <h2>Contact Me</h2>
        <form onSubmit={sendEmail} className="contact-form">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" required />

          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />

          <label htmlFor="subject">Subject</label>
          <input type="text" name="subject" id="subject" required />

          <label htmlFor="message">Message</label>
          <textarea name="message" id="message" rows="5" required></textarea>

          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </div>

      {popup.show && (
        <PopupMessage
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, show: false })}
        />
      )}
    </div>
  );
}

export default Contact;
