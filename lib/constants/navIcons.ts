import {
  Bookmark,
  CreditCard,
  GraduationCap,
  Landmark,
  MessageCircle,
  School,
  Store,
  type LucideIcon,
} from "lucide-react"

export const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Store,
  "/scholarships": GraduationCap,
  "/loans": Landmark,
  "/cards": CreditCard,
  "/schools": School,
  "/chat": MessageCircle,
  "/saved": Bookmark,
}
