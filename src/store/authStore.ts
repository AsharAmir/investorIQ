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
import toast from 'react-hot-toast';

// Admin credentials
const ADMIN_EMAIL = 'admin@investoriq.com';

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
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      // Get or create user document
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create new user document
        const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          name: email.split('@')[0],
          role: isAdmin ? 'admin' : 'user'
        };
        
        await setDoc(userDocRef, userData);
        set({ user: userData });
        toast.success(`Welcome ${isAdmin ? 'Admin' : userData.name}!`);
      } else {
        // Use existing user data
        const userData = userDoc.data() as User;
        
        // Update role if admin email
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && userData.role !== 'admin') {
          const updatedData = { ...userData, role: 'admin' };
          await setDoc(userDocRef, updatedData, { merge: true });
          set({ user: updatedData });
          toast.success('Welcome back, Admin!');
        } else {
          set({ user: userData });
          toast.success(`Welcome back, ${userData.name}!`);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please check your credentials.');
      throw error;
    }
  },
  signUp: async (email, password, name) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name,
        role: isAdmin ? 'admin' : 'user'
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      set({ user: userData });
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account.');
      throw error;
    }
  },
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  },
  checkAuth: async () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              // Ensure admin status is correct
              if (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() && userData.role !== 'admin') {
                const updatedData = { ...userData, role: 'admin' };
                await setDoc(doc(db, 'users', firebaseUser.uid), updatedData, { merge: true });
                set({ user: updatedData, loading: false });
              } else {
                set({ user: userData, loading: false });
              }
            } else {
              // Create user document if it doesn't exist
              const isAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
              const userData: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.email?.split('@')[0] || 'User',
                role: isAdmin ? 'admin' : 'user'
              };
              await setDoc(doc(db, 'users', firebaseUser.uid), userData);
              set({ user: userData, loading: false });
            }
          } catch (error) {
            console.error('Error checking auth:', error);
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