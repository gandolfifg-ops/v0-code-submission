import {
  Bookmark,
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
  "/schools": School,
  "/chat": MessageCircle,
  "/saved": Bookmark,
}
