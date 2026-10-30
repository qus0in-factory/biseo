import { readAgyTokenFile, type AgyTokenFile } from './agy-token-file.js'
import { parseAgyKeychainValue } from './agy-keychain-parse.js'
import { readAgyKeychain, type AgyKeychainRun } from './agy-keychain-read.js'

export interface AgyStored {
  keychain: AgyTokenFile | null
  file: AgyTokenFile | null
}

export async function loadStoredAgyToken(run?: AgyKeychainRun): Promise<AgyStored> {
  const keychain = parseAgyKeychainValue(await readAgyKeychain(run))
  const file = await readAgyTokenFile()
  return { keychain, file }
}
