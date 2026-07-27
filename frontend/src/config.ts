// We prioritize the localStorage value (for local testing/admin deployments)
// If not found, we fallback to the Vercel injected environment variable.
// If neither exists, we fallback to the hardcoded Preprod address.
export const PREPROD_CONTRACT_ADDRESS = 
  localStorage.getItem('PREPROD_CONTRACT_ADDRESS') || 
  import.meta.env.VITE_CONTRACT_ADDRESS || 
  'd13aabcf0599f9453f42637207303fb22ea0ed1f1bc8d34b56fe0f338da3287e';

export const MIN_GPA_THRESHOLD = import.meta.env.VITE_MIN_GPA_THRESHOLD ? parseInt(import.meta.env.VITE_MIN_GPA_THRESHOLD, 10) : 800;
export const MAX_INCOME_THRESHOLD = import.meta.env.VITE_MAX_INCOME_THRESHOLD ? parseInt(import.meta.env.VITE_MAX_INCOME_THRESHOLD, 10) : 250000;
