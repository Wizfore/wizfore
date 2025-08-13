import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { 
  getFirestore,
  Firestore
} from 'firebase/firestore';
import { enableIndexedDbPersistence } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// 환경 변수 검증
const isValidConfig = () => {
  return firebaseConfig.apiKey && 
         firebaseConfig.projectId && 
         firebaseConfig.authDomain;
};

// Firebase 인스턴스를 안전하게 가져오는 함수들
export const getFirebaseApp = (): FirebaseApp | null => {
  if (!isValidConfig()) {
    console.warn('Firebase configuration is missing or invalid');
    return null;
  }
  
  try {
    return !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  } catch (error) {
    console.error('Firebase app initialization error:', error);
    return null;
  }
};

export const getFirebaseAuth = (): Auth | null => {
  const app = getFirebaseApp();
  if (!app) return null;
  
  try {
    return getAuth(app);
  } catch (error) {
    console.error('Firebase auth initialization error:', error);
    return null;
  }
};

export const getFirebaseDb = (): Firestore | null => {
  const app = getFirebaseApp();
  if (!app) return null;
  
  try {
    return getFirestore(app);
  } catch (error) {
    console.error('Firebase firestore initialization error:', error);
    return null;
  }
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  const app = getFirebaseApp();
  if (!app) return null;
  
  try {
    return getStorage(app);
  } catch (error) {
    console.error('Firebase storage initialization error:', error);
    return null;
  }
};

// 클라이언트에서만 오프라인 지속성 활성화
export const enableOfflinePersistence = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  const db = getFirebaseDb();
  if (!db) return;
  
  try {
    await enableIndexedDbPersistence(db);
    console.log('Firestore 오프라인 지속성 활성화됨');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('다중 탭이 열려있어 오프라인 지속성을 활성화할 수 없습니다');
    } else if (err.code === 'unimplemented') {
      console.warn('현재 브라우저는 오프라인 지속성을 지원하지 않습니다');
    } else {
      console.error('Firestore 지속성 활성화 오류:', err);
    }
  }
};

// 기존 export와의 호환성을 위한 인스턴스들
export const app = getFirebaseApp();
export const auth = getFirebaseAuth();
export const db = getFirebaseDb();
export const storage = getFirebaseStorage();