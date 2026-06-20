# Security Strategy

## Authentication
- Migrated to **Firebase Authentication** handling complete login/registration flows.
- Client-side routes are protected; unauthorized users are forced into Guest Mode (Local Storage only) or prompted to authenticate.

## Database Rules
- **Firestore Security Rules**: Set up to ensure users can only read/write documents associated with their own `uid`.
- No sensitive keys are exposed on the client side aside from standard public Firebase identifiers.

## Dependency Management
- Packages are scanned using standard Node security protocols.
- Deprecated or vulnerable packages are strictly monitored and patched.

## Code Quality
- Complete removal of `any` type casting.
- Strict Typescript boundaries enforced.
- Form inputs are sanitized to prevent injection attacks.
