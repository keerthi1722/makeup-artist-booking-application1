// Helper to provide API base URL (set VITE_API_URL in Vercel)
const API = import.meta.env.VITE_API_URL || ''
export default API
