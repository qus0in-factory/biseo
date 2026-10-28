export interface PasswordVerifier {
  verify(password: string, stored: string): Promise<boolean>
}
