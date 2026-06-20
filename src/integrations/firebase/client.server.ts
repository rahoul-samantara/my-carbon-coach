import * as admin from "firebase-admin";

function createFirebaseAdminClient() {
  const FIREBASE_PROJECT_ID =
    process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "mock-project-id";
  const FIREBASE_CLIENT_EMAIL =
    process.env.FIREBASE_CLIENT_EMAIL || "mock@mock.iam.gserviceaccount.com";
  const FIREBASE_PRIVATE_KEY =
    process.env.FIREBASE_PRIVATE_KEY ||
    "-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----\n";

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  return admin;
}

let _firebaseAdmin: ReturnType<typeof createFirebaseAdminClient> | undefined;

export const firebaseAdmin = new Proxy({} as ReturnType<typeof createFirebaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_firebaseAdmin) _firebaseAdmin = createFirebaseAdminClient();
    return Reflect.get(_firebaseAdmin, prop, receiver);
  },
});
