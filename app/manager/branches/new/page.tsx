import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BranchForm } from "../branch-form"

export const metadata = {
  title: "Add New Branch",
  description: "Create a new branch location",
}

export default function NewBranchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/manager/branches">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Branch</h1>
          <p className="text-muted-foreground mt-1">
            Create a new branch location
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <BranchForm />
      </div>
    </div>
  )
}
