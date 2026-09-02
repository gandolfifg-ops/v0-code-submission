import {
  Bookmark,
  GraduationCap,
  Landmark,
  MessageCircle,
  Store,
  type LucideIcon,
} from "lucide-react"

export const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Store,
  "/scholarships": GraduationCap,
  "/loans": Landmark,
  "/chat": MessageCircle,
  "/saved": Bookmark,
}
