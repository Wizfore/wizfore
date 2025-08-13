import { addInquiry } from '@/lib/services/inquiryService'
import { updateDoc, doc } from 'firebase/firestore'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// 샘플 치료 프로그램 데이터
const sampleTherapyPrograms = [
  {
    name: '언어치료',
    category: 'therapy' as const,
    targetAge: '만 3-12세',
    duration: '50분',
    description: '언어발달이 지연되거나 의사소통에 어려움이 있는 아동을 위한 1:1 맞춤 치료',
    fullDescription: '언어치료는 언어발달이 지연되거나 의사소통에 어려움이 있는 아동을 대상으로 언어능력, 조음능력, 의사소통능력 향상을 위한 전문적인 치료를 제공합니다. 개별 평가를 통해 아동의 언어 수준을 파악하고, 맞춤형 치료 계획을 수립하여 체계적인 언어치료를 진행합니다.',
    status: 'active' as const,
    featured: true,
    order: 1
  },
  {
    name: '인지치료',
    category: 'therapy' as const,
    targetAge: '만 5-15세',
    duration: '40분',
    description: '주의집중력, 기억력, 문제해결능력 등 인지적 기능 향상을 위한 치료',
    fullDescription: '인지치료는 주의력결핍, 학습장애 등 인지적 어려움이 있는 아동을 대상으로 주의집중력, 기억력, 문제해결능력 등 인지적 기능 향상을 위한 치료 프로그램을 제공합니다.',
    status: 'active' as const,
    featured: true,
    order: 2
  },
  {
    name: '놀이치료',
    category: 'therapy' as const,
    targetAge: '만 3-10세',
    duration: '50분',
    description: '놀이를 통해 아동의 정서적, 사회적 문제를 해결하는 치료',
    fullDescription: '놀이치료는 놀이를 매개로 하여 아동의 정서적, 행동적, 사회적 문제를 해결하고 건강한 성장과 발달을 돕는 심리치료 기법입니다.',
    status: 'active' as const,
    featured: false,
    order: 3
  },
  {
    name: '미술치료',
    category: 'therapy' as const,
    targetAge: '만 4-18세',
    duration: '50분',
    description: '미술 활동을 통한 정서 표현 및 심리 치료',
    fullDescription: '미술치료는 미술 활동을 통해 감정이나 내면세계를 표현하고 기분의 이완과 스트레스를 완화시키는 심리치료 기법입니다.',
    status: 'active' as const,
    featured: false,
    order: 4
  }
]

// 샘플 상담 프로그램 데이터
const sampleCounselingPrograms = [
  {
    name: '개별 심리상담',
    category: 'counseling' as const,
    targetAge: '모든 연령',
    duration: '50분',
    description: '개인의 심리적 어려움과 고민을 해결하는 1:1 상담',
    status: 'active' as const,
    featured: true,
    order: 1
  },
  {
    name: '가족상담',
    category: 'counseling' as const,
    targetAge: '가족',
    duration: '60분',
    description: '가족 간의 갈등 해결과 소통 개선을 위한 상담',
    status: 'active' as const,
    featured: true,
    order: 2
  }
]

// 샘플 문의 데이터
const sampleInquiries = [
  {
    name: '김민수',
    phone: '010-1234-5678',
    email: 'kim@example.com',
    category: '치료 프로그램 문의',
    message: '5세 아이의 언어발달이 늦어서 언어치료를 받고 싶습니다. 상담 가능한 시간과 비용이 궁금합니다.'
  },
  {
    name: '이영희',
    phone: '010-9876-5432',
    email: 'lee@example.com',
    category: '상담 예약',
    message: '초등학교 3학년 아이가 학교 적응에 어려움을 겪고 있어서 심리상담을 받고 싶습니다.'
  },
  {
    name: '박철수',
    phone: '010-5555-1234',
    email: 'park@example.com',
    category: '시설 문의',
    message: '센터 방문 전에 시설을 둘러볼 수 있는지 궁금합니다. 주차 공간도 있는지 알고 싶습니다.'
  }
]

// 샘플 뉴스 데이터
const sampleNews = [
  {
    title: '2024년 하반기 프로그램 안내',
    content: '위즈포레에서는 2024년 하반기부터 새로운 프로그램들을 추가로 운영합니다...',
    publishDate: serverTimestamp(),
    status: 'published',
    featured: true
  },
  {
    title: '여름방학 특별 프로그램 모집',
    content: '여름방학을 맞아 아동·청소년을 위한 특별 프로그램을 운영합니다...',
    publishDate: serverTimestamp(),
    status: 'draft',
    featured: false
  }
]

// 샘플 데이터 추가 함수들
export async function addSamplePrograms() {
  console.log('샘플 프로그램 데이터 추가 시작...')
  
  if (!db) {
    throw new Error('Firebase not initialized')
  }
  
  try {
    // 치료 프로그램 데이터를 programs/main 문서에 추가
    const therapyProgramsDoc = doc(db, 'programs', 'main')
    await updateDoc(therapyProgramsDoc, {
      'therapy.programs': sampleTherapyPrograms.map((program, index) => ({
        ...program,
        id: `therapy-${index + 1}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })),
      'therapy.updatedAt': serverTimestamp()
    })
    console.log('치료 프로그램 데이터 추가 완료')

    // 상담 프로그램 데이터를 programs/main 문서에 추가
    await updateDoc(therapyProgramsDoc, {
      'counseling.programs': sampleCounselingPrograms.map((program, index) => ({
        ...program,
        id: `counseling-${index + 1}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })),
      'counseling.updatedAt': serverTimestamp()
    })
    console.log('상담 프로그램 데이터 추가 완료')

    console.log('✅ 모든 샘플 프로그램이 추가되었습니다.')
    return true
  } catch (error) {
    console.error('❌ 샘플 프로그램 추가 오류:', error)
    throw error
  }
}

export async function addSampleInquiries() {
  console.log('샘플 문의 데이터 추가 시작...')
  
  try {
    for (const inquiry of sampleInquiries) {
      const id = await addInquiry(inquiry)
      console.log(`문의 추가됨: ${inquiry.name} (ID: ${id})`)
    }

    console.log('✅ 모든 샘플 문의가 추가되었습니다.')
    return true
  } catch (error) {
    console.error('❌ 샘플 문의 추가 오류:', error)
    throw error
  }
}

export async function addSampleNews() {
  console.log('샘플 뉴스 데이터 추가 시작...')
  
  if (!db) {
    throw new Error('Firebase not initialized')
  }
  
  try {
    for (const news of sampleNews) {
      const docRef = await addDoc(collection(db, 'news'), {
        ...news,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log(`뉴스 추가됨: ${news.title} (ID: ${docRef.id})`)
    }

    console.log('✅ 모든 샘플 뉴스가 추가되었습니다.')
    return true
  } catch (error) {
    console.error('❌ 샘플 뉴스 추가 오류:', error)
    throw error
  }
}

// 모든 샘플 데이터 추가
export async function addAllSampleData() {
  console.log('🚀 모든 샘플 데이터 추가 시작...')
  
  try {
    await addSamplePrograms()
    await addSampleInquiries()
    await addSampleNews()
    
    console.log('🎉 모든 샘플 데이터가 성공적으로 추가되었습니다!')
    return true
  } catch (error) {
    console.error('💥 샘플 데이터 추가 중 오류 발생:', error)
    throw error
  }
}