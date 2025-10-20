// Helper to provide API base URL (set VITE_API_URL in Vercel).
// If VITE_API_URL is not set, default to the deployed Render backend URL below.
const API = import.meta.env.VITE_API_URL || 'https://makeup-artist-booking-application1.onrender.com'
export default API
