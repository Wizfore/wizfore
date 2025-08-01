import { AdminImageUploadFieldProps } from '@/types/admin-ui'
import { AdminFormField } from './AdminFormField'
import { ImageUpload } from '@/components/admin/common/ImageUpload'

/**
 * 관리자 페이지에서 사용하는 통일된 이미지 업로드 필드 컴포넌트
 * 기존 ImageUpload 컴포넌트를 Admin UI 스타일로 래핑합니다.
 * 
 * @example
 * <AdminImageUploadField
 *   label="프로필 이미지"
 *   value={imageUrl}
 *   onChange={setImageUrl}
 *   folder="team/members"
 *   defaultImageUrl="/images/default-profile.jpg"
 *   required
 * />
 * 
 * @example
 * <AdminImageUploadField
 *   label="배경 이미지"
 *   value={hero.backgroundImage}
 *   onChange={(url) => setHero({ ...hero, backgroundImage: url })}
 *   folder="pages/about/hero"
 *   helper="권장 크기: 1920x1080px"
 * />
 */
export function AdminImageUploadField({
  label,
  value,
  onChange,
  folder,
  defaultImageUrl,
  required = false,
  error,
  helper,
  className
}: AdminImageUploadFieldProps) {
  return (
    <AdminFormField
      label={label}
      required={required}
      error={error}
      helper={helper}
      className={className}
    >
      <ImageUpload
        value={value || ''}
        onChange={onChange}
        folder={folder}
        defaultImageUrl={defaultImageUrl}
      />
    </AdminFormField>
  )
}