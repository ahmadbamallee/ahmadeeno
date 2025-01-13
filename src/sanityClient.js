// src/sanityClient.js
import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2023-01-01',
  token: process.env.REACT_APP_SANITY_TOKEN
});
