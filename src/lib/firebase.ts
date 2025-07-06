'use client'

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { 
  getFirestore
} from 'firebase/firestore';
import {   enableIndexedDbPersistence } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 오프라인 지속성 활성화 (선택 사항)
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

export { app, auth, db, storage };