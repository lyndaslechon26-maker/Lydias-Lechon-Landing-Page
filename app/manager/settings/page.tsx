import { getSettings } from "@/app/actions/manager-settings"
import { SettingsTabs } from "@/components/manager/settings-tabs"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, RefreshCw, Save } from "lucide-react"

export default async function SettingsPage() {
  const { settings, error } = await getSettings()

  if (error || !settings) {
    return (
      <div className="space-y-6 bg-white dark:bg-zinc-950">
        <PageHeader
          title="Landing Page Settings"
          description="Configure your landing page content and settings"
          crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Settings" }]}
          actions={
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
          }
        />
        <Card className="p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_1px_0_rgba(255,255,255,0.3)_inset] shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)_inset,0_1px_0_rgba(255,255,255,0.5)_inset]">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-muted-foreground">
              <Settings className="size-8" />
            </div>
            <h3 className="text-base font-semibold mb-2">Error loading settings</h3>
            <p className="text-sm text-red-600 mb-2">{error || "Settings not found"}</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Please run the database migration to create the settings table.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 bg-white dark:bg-zinc-950">
      <PageHeader
        title="Landing Page Settings"
        description="Configure your landing page content, business information, and features"
        crumbs={[{ label: "Lydia's Lechon" }, { label: "Manager" }, { label: "Settings" }]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
            <Button size="sm">
              <Save className="mr-2 size-4" />
              Save Changes
            </Button>
          </>
        }
      />

      <SettingsTabs settings={settings} />
    </div>
  )
}
