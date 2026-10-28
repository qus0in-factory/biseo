# Shared auth primitives

## Library choice

`paseto` 4.0.1 by panva (published 2026-09-04) is used. It has zero runtime dependencies, ships ESM, uses Web Crypto, and its README explicitly lists Node.js and Cloudflare Workers. The root `paseto` module exposes `PublicProtocol`; `paseto/v4/public` supplies its factories.

`paseto-ts` was considered, but the selected package has an explicit Workers and Node target plus no dependencies. v4.public is Ed25519-signed, not encrypted; TLS remains responsible for transport confidentiality.

## Layout

- `domain/`: framework-free claim types, issuer/audience/expiry/purpose policy, and separate sign/verify ports. No library import.
- `infra/`: the only place that imports `paseto`; signer holds only the secret key, verifier only the public key.
- `tests/`: generated test keys only; no production secrets.
