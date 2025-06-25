import Medusa from "@medusajs/medusa-js"

const API_KEY  = import.meta.env.VITE_MEDUSA_PUBLISHABLE_API_KEY;

export const medusa = new Medusa({
  baseUrl: "",
  maxRetries: 3,
  publishableApiKey: API_KEY,
})

export default medusa