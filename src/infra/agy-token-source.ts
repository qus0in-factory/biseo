import { readAgyTokenFile, type AgyTokenFile } from './agy-token-file.js'
import { parseAgyKeychainValue } from './agy-keychain-parse.js'
import { readAgyKeychain } from './agy-keychain-read.js'

export interface AgyStored {
  keychain: AgyTokenFile | null
  file: AgyTokenFile | null
}

export async function loadStoredAgyToken(): Promise<AgyStored> {
  const keychain = parseAgyKeychainValue(await readAgyKeychain())
  const file = await readAgyTokenFile()
  return { keychain, file }
}
