export function refreshSecret() {
 return Array.from(crypto.getRandomValues(new Uint8Array(32)),
  b => b.toString(16).padStart(2, '0')).join('')
}
export async function refreshHash(token: string) {
 const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
 return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')
}
