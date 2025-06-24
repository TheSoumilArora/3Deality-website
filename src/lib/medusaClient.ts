import Medusa from "@medusajs/medusa-js"

const API_KEY  = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

export const medusa = new Medusa({
  baseUrl: "",
  maxRetries: 3,
  publishableApiKey: API_KEY,
})

export default medusa