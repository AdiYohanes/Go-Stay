/**
 * Location data and helper functions
 * Note: Property data now comes from Supabase database
 */

// Location data for search dropdown
export const LOCATION_OPTIONS = [
  {
    id: "seminyak",
    name: "Seminyak",
    region: "Bali Selatan",
    description: "Pantai, Restoran, Nightlife",
    icon: "🏖️",
  },
  {
    id: "ubud",
    name: "Ubud",
    region: "Bali Tengah",
    description: "Sawah, Seni, Budaya",
    icon: "🌾",
  },
  {
    id: "canggu",
    name: "Canggu",
    region: "Bali Selatan",
    description: "Surfing, Cafe, Beach Club",
    icon: "🏄",
  },
  {
    id: "nusa-dua",
    name: "Nusa Dua",
    region: "Bali Selatan",
    description: "Resort Mewah, Pantai Privat",
    icon: "🌴",
  },
  {
    id: "uluwatu",
    name: "Uluwatu",
    region: "Bali Selatan",
    description: "Cliff View, Temple, Surfing",
    icon: "🏛️",
  },
  {
    id: "jimbaran",
    name: "Jimbaran",
    region: "Bali Selatan",
    description: "Seafood, Sunset, Pantai",
    icon: "🦐",
  },
  {
    id: "sanur",
    name: "Sanur",
    region: "Bali Timur",
    description: "Sunrise Beach, Tenang",
    icon: "🌅",
  },
  {
    id: "legian",
    name: "Legian",
    region: "Bali Selatan",
    description: "Pantai, Bar, Entertainment",
    icon: "🎉",
  },
];

// Helper function to format Indonesian Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
