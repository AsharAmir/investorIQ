import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password, isAdmin = false) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        const userData: User = {
          id: firebaseUser.uid,
          email,
          name: email.split('@')[0],
          role: isAdmin ? 'admin' : 'user'
        };
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        set({ user: userData });
      } else {
        // Use existing user data
        const userData = userDoc.data() as User;
        // Update role if admin login
        if (isAdmin && userData.role !== 'admin') {
          await setDoc(doc(db, 'users', firebaseUser.uid), { ...userData, role: 'admin' }, { merge: true });
          set({ user: { ...userData, role: 'admin' } });
        } else {
          set({ user: userData });
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
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
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } else {
          set({ user: null, loading: false });
        }
        unsubscribe();
        resolve();
      });
    });
  },
}));