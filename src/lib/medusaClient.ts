import Medusa from "@medusajs/medusa-js"

const API_KEY  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_API_KEY;
const base_url = import.meta.env.VITE_MEDUSA_BACKEND_URL;

export const medusa = new Medusa({
  baseUrl: base_url,
  maxRetries: 3,
  publishableApiKey: API_KEY,
})

export default medusa