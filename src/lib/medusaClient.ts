import Medusa from "@medusajs/medusa-js"

const BASE = import.meta.env.VITE_MEDUSA_BACKEND_URL;
const API_KEY  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;

export const medusa = new Medusa({
  baseUrl: BASE,
  maxRetries: 3,
  publishableApiKey: API_KEY,
})

export default medusa