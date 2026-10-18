import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BranchForm } from "../../branch-form"
import { getBranch } from "@/app/actions/manager-branches"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Edit Branch",
  description: "Edit branch location details",
}

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { branch, error } = await getBranch(id)

  if (error || !branch) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/manager/branches">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Branch</h1>
          <p className="text-muted-foreground mt-1">
            Update branch location details
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <BranchForm branch={branch} />
      </div>
    </div>
  )
}
