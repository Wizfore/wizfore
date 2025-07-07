'use client'

import { defaultSiteData } from '@/lib/data/defaultSiteData'
import CommonHeroSection from '@/components/layout/CommonHeroSection'
import TeachersOverviewSection from '@/components/team/teachers/TeachersOverviewSection'
import TeachersListSection from '@/components/team/teachers/TeachersListSection'

export default function TeachersPage() {
  const teacherCategory = defaultSiteData.team.find(category => category.id === 'teachers')
  const teachers = teacherCategory?.members || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <CommonHeroSection 
        title={teacherCategory?.heroMessage?.title || "주간·방과후 교사"}
        description={teacherCategory?.heroMessage?.description || "성인 주간활동과 방과후 프로그램을 전담하는 전문 교사진을 소개합니다"}
      />

      {/* 개요 섹션 */}
      <TeachersOverviewSection 
        teacherCount={teachers.length}
        aboutMessage={teacherCategory?.aboutMessage}
      />

      {/* 교사진 목록 섹션 */}
      <TeachersListSection teachers={teachers} />
    </div>
  )
}