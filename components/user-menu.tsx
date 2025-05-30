import { Button } from "@/components/ui/button"
import { PlusCircle, List } from "lucide-react"
import Link from "next/link"

export default function NavigationMenu() {
  return (
    <div className="flex gap-2">
      <Link href="/invites">
        <Button
          variant="outline"
          className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/20 hover:bg-white/80 dark:hover:bg-slate-800/80 rounded-2xl px-6 py-2 font-semibold"
        >
          <List className="w-4 h-4 mr-2" />
          My Invites
        </Button>
      </Link>
      <Link href="/create">
        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-purple-600 dark:to-indigo-600 hover:from-green-700 hover:to-emerald-700 dark:hover:from-purple-700 dark:hover:to-indigo-700 text-white px-6 py-2 rounded-2xl font-semibold">
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </Link>
    </div>
  )
}
