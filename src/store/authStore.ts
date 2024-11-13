import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data() as User;
    set({ user: userData });
  },
  signUp: async (email, password, name) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    const userData: User = {
      id: firebaseUser.uid,
      email,
      name,
      role: 'user'
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    set({ user: userData });
  },
  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
  },
  checkAuth: async () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data() as User;
          set({ user: userData, loading: false });
        } else {
          set({ user: null, loading: false });
        }
        unsubscribe();
        resolve();
      });
    });
  },
}));