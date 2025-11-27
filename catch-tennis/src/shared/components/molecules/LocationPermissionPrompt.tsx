import { MapPin, X } from 'lucide-react'
import {Button} from "@shared/components/ui/button.tsx"

export interface LocationPermissionPromptProps {
    onRequestPermission: () => void
    onDismiss: () => void
    loading?: boolean
}


export const LocationPermissionPrompt = ({
                                             onRequestPermission,
                                             onDismiss,
                                             loading = false,
                                         }: LocationPermissionPromptProps) => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
            <button
                onClick={onDismiss}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="닫기"
                type="button"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        내 위치 기반 매칭 찾기
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        근처의 테니스 매칭을 찾기 위해 위치 권한이 필요합니다.
                    </p>

                    <Button
                        onClick={onRequestPermission}
                        disabled={loading}
                        size="sm"
                        className="w-full sm:w-auto"
                    >
                        {loading ? '확인 중...' : '위치 권한 허용하기'}
                    </Button>
                </div>
            </div>
        </div>
    )
}