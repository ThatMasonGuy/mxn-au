// auth.js
import { auth, firestore } from './firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import router from './router';
import store from '@/stores';

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#%^&/.,><';":])[A-Za-z\d@$!%*?&#%^&/.,><';":]{8,}$/;

function formatDateToDDMMYYYY(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

onAuthStateChanged(auth, async (user) => {
    console.log('[onAuthStateChanged] Fired. user:', user);
    if (user) {
        try {
            console.log('[onAuthStateChanged] User is not null. Checking Firestore user doc...');
            const userDoc = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(userDoc);

            if (!docSnap.exists()) {
                console.log('[onAuthStateChanged] No user doc found, creating an empty doc...');
                await setDoc(userDoc, {
                    firstName: '',
                    lastName: '',
                    userName: '',
                    emailAddress: user.email,
                    phoneNumber: '',
                    avatarUrl: ''
                });
            }

            const currentRoute = router.currentRoute.value;
            console.log('[onAuthStateChanged] currentRoute:', currentRoute.fullPath);

            if (!currentRoute.meta.requiresAuth) {
                console.log('[onAuthStateChanged] Current route does NOT require auth, so no action needed.');
            } else if (currentRoute.meta.requiresAuth && !user) {
                console.warn('[onAuthStateChanged] Current route DOES require auth, but user is null -> redirecting...');
                router.push('/topheroes/admin/login');
            }
        } catch (error) {
            console.error('[onAuthStateChanged] Error fetching/creating user doc:', error);
        }
    } else {
        console.warn('[onAuthStateChanged] user is null (signed out or not signed in).');
        const currentRoute = router.currentRoute.value;
        if (currentRoute.meta.requiresAuth) {
            console.warn('[onAuthStateChanged] Current route requires auth, redirecting to /topheroes/admin/login');
            router.push('/topheroes/admin/login');
        }
    }
});

export const signUp = async (
    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    countryCode,
    rawDateOfBirth,
    password,
    confirmPassword
) => {
    // ...
};

export const signIn = async (email, password, rememberMe = false) => {
    console.log('[signIn] Called with:', { email, password, rememberMe });
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        console.log('[signIn] signInWithEmailAndPassword succeeded. user:', user);

        // Force refresh the token to ensure a fresh one
        const token = await user.getIdToken(true);
        console.log('[signIn] Fetched ID token:', token);

        store.commit('setUser', {
            user: { uid: user.uid, email: user.email },
            token,
            rememberMe
        });

        console.log('[signIn] Committed setUser to Vuex store. Storing in localStorage or sessionStorage...');

        if (rememberMe) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email }));
        } else {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify({ uid: user.uid, email: user.email }));
        }

        console.log('[signIn] All set. Returning user object.');
        return user;
    } catch (error) {
        console.error('[signIn] Error:', error);
        throw error;
    }
};

export const signOut = async () => {
    // ...
};
