import { hashPassword, WebCryptoPasswordVerifier } from './password.js'
import type { PinVerifier } from '../app/pin-ports.js'

export function hashPin(pin: string, pepper = ''): Promise<string> {
  return hashPassword(pepper + pin)
}

export class WebCryptoPinVerifier implements PinVerifier {
  constructor(private readonly pepper = '') {}

  verify(pin: string, stored: string): Promise<boolean> {
    return new WebCryptoPasswordVerifier().verify(this.pepper + pin, stored)
  }
}
