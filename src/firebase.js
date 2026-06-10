import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvJVhu-f8zUJY0ndxyGtp94czQgp94P7s",
  authDomain: "erax-authentication.firebaseapp.com",
  projectId: "erax-authentication",
  storageBucket: "erax-authentication.firebasestorage.app",
  messagingSenderId: "713388982955",
  appId: "1:713388982955:web:69437a2c4a59b6e5d92dee",
  measurementId: "G-Q97N82RK4T"
};

// Initialize Frontend Instance
const app = initializeApp(firebaseConfig);

// Export Auth Module Instance
export const auth = getAuth(app);

// Unified Authentication Provider Engine
export const executePlatformAuth = async (providerName) => {
  let provider;
  
  if (providerName === 'google') {
    provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
  } else if (providerName === 'apple') {
    provider = new OAuthProvider('apple.com');
  } else {
    throw new Error(`Unsupported identity provider: ${providerName}`);
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw error;
  }
};