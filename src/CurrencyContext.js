import { createContext, useContext } from 'react'

// The family's chosen currency symbol (₹, $, £, €, …) — set at sign-up and
// changeable from the Parent tab. Read anywhere with useCurrency().
export const CurrencyContext = createContext('₹')

export function useCurrency() {
  return useContext(CurrencyContext)
}
