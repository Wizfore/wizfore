'use client'

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { 
  getFirestore,
  Firestore
} from 'firebase/firestore';
import { enableIndexedDbPersistence } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy-domain.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy-bucket.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:dummy',
};


// Initialize Firebase
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// 환경 변수 검증
const isValidConfig = firebaseConfig.apiKey !== 'dummy-key' && 
                     firebaseConfig.projectId !== 'dummy-project';

try {
  if (isValidConfig) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // 오프라인 지속성 활성화 (클라이언트에서만)
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db)
        .then(() => {
          console.log('Firestore 오프라인 지속성 활성화됨');
        })
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('다중 탭이 열려있어 오프라인 지속성을 활성화할 수 없습니다');
          } else if (err.code === 'unimplemented') {
            console.warn('현재 브라우저는 오프라인 지속성을 지원하지 않습니다');
          } else {
            console.error('Firestore 지속성 활성화 오류:', err);
          }
        });
    }
  } else {
    console.warn('Firebase config is not properly set. Using dummy values for build.');
    // 빌드 타임용 더미 초기화
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} catch (error) {
  console.error('Firebase 초기화 오류:', error);
  app = null;
  auth = null;
  db = null;
  storage = null;
}

export { app, auth, db, storage };