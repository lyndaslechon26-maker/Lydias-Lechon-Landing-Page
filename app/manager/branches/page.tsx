import { getAllBranches } from "@/app/actions/manager-branches"
import { MapPin, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BranchesTable } from "./branches-table"

export const metadata = {
  title: "Manage Branches",
  description: "Manage branch locations",
}

export default async function BranchesPage() {
  const { branches, error } = await getAllBranches()

  const activeBranches = branches?.filter((b) => b.is_active) || []
  const inactiveBranches = branches?.filter((b) => !b.is_active) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branches</h1>
          <p className="text-muted-foreground mt-1">
            Manage branch locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/events/branches" target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="size-4 mr-2" />
              View Public Page
            </Button>
          </Link>
          <Link href="/manager/branches/new">
            <Button size="sm">
              <Plus className="size-4 mr-2" />
              Add Branch
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <MapPin className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{branches?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <MapPin className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeBranches.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/30">
              <MapPin className="size-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inactiveBranches.length}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      {branches && branches.length > 0 ? (
        <BranchesTable branches={branches} />
      ) : (
        <div className="rounded-lg border bg-card p-12 text-center">
          <MapPin className="size-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No branches yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first branch
          </p>
          <Link href="/manager/branches/new">
            <Button>
              <Plus className="size-4 mr-2" />
              Add First Branch
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
