export type RefreshSession = {
 id: string
 subject: string
 host: string
 auth: 'password' | 'pin'
 current_hash: string
 generation: number
 expires: number
 idle: number
 revoked: number | null
}
export type RefreshPolicy = {
 absolute: number
 inactivity: number
 maximum: number
 retention: number
}
