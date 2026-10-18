"use client"

import { Branch, updateBranch, deleteBranch } from "@/app/actions/manager-branches"
import { MapPin, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface BranchesTableProps {
  branches: Branch[]
}

export function BranchesTable({ branches: initialBranches }: BranchesTableProps) {
  const router = useRouter()
  const [branches, setBranches] = useState(initialBranches)
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(id)
    
    const { branch, error } = await updateBranch(id, {
      is_active: !currentStatus,
    })

    if (error) {
      toast.error(error)
    } else if (branch) {
      setBranches((prev) => prev.map((b) => (b.id === id ? branch : b)))
      toast.success(
        branch.is_active
          ? "Branch activated successfully"
          : "Branch deactivated successfully"
      )
    }

    setLoading(null)
    router.refresh()
  }

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      return
    }

    setLoading(id)

    const { success, error } = await deleteBranch(id)

    if (error) {
      toast.error(error)
    } else if (success) {
      setBranches((prev) => prev.filter((b) => b.id !== id))
      toast.success("Branch deleted successfully")
      router.refresh()
    }

    setLoading(null)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[250px]" />
            <col className="w-[300px]" />
            <col className="w-[150px]" />
            <col className="w-[280px]" />
            <col className="w-[140px]" />
            <col className="w-[120px]" />
          </colgroup>
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Branch
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Services
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr
                key={branch.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    {branch.image_url ? (
                      <img
                        src={branch.image_url}
                        alt={branch.name}
                        className="size-10 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                        <MapPin className="size-5 text-amber-600 dark:text-amber-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{branch.name}</p>
                      {branch.landmark && (
                        <p className="text-xs text-muted-foreground truncate">
                          {branch.landmark}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {branch.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {branch.hours}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-mono">{branch.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {branch.has_dine_in && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-xs text-green-700 dark:text-green-400">
                        Dine-in
                      </span>
                    )}
                    {branch.has_takeout && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-xs text-orange-700 dark:text-orange-400">
                        Takeout
                      </span>
                    )}
                    {branch.has_delivery && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-xs text-blue-700 dark:text-blue-400">
                        Delivery
                      </span>
                    )}
                    {branch.has_catering && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-xs text-purple-700 dark:text-purple-400">
                        Catering
                      </span>
                    )}
                    {branch.has_event_venue && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-xs text-pink-700 dark:text-pink-400">
                        Event Venue
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                        branch.is_active
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {branch.is_active ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={branch.is_active}
                      onCheckedChange={() =>
                        handleToggleActive(branch.id, branch.is_active)
                      }
                      disabled={loading === branch.id}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/manager/branches/${branch.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(branch.id, branch.name)}
                      disabled={loading === branch.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
