export interface PasswordVerifier {
  verify(password: string, stored: string): Promise<boolean>
}

export interface AttemptStore {
  get(key: string): Promise<number>
  increment(key: string, ttlSeconds: number): Promise<number>
  clear(key: string): Promise<void>
}
