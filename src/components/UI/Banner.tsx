
import "@/styles/UI/banner.css";

interface Props {
  message: string
}

export function InfoBanner({ message }: Props) {
  return (
    <div className="default-banner info-banner rounded-xl p-4 mt-8 max-w-xl mx-auto">
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

// flex items-center justify-center bg-yellow-100 border border-yellow-300 text-yellow-800
export function WarnBanner({ message }: Props) {
  return (
    <div className="default-banner rounded-xl p-4 mt-8 shadow-sm max-w-xl mx-auto">
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}