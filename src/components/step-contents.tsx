import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Building, Bell, Palette, Users, Mail } from "lucide-react"

export function ProfileSetupContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {/* <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" />
          <AvatarFallback>
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar> */}
        <div>
          <Button variant="outline" className="bg-transparent">
            Upload Photo
          </Button>
          <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF (max. 2MB)</p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Enter your full name" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input id="jobTitle" placeholder="e.g. Product Manager" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio (Optional)</Label>
          <Textarea id="bio" placeholder="Tell us a bit about yourself..." className="min-h-[100px]" />
        </div>
      </div>
    </div>
  )
}

export function WorkspaceSetupContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="workspaceName">Workspace Name</Label>
          <Input id="workspaceName" placeholder="e.g. Acme Corp" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="workspaceType">What best describes your team?</Label>
          <div className="grid gap-2">
            {[
              { id: "startup", label: "Startup", icon: Building },
              { id: "agency", label: "Agency", icon: Users },
              { id: "enterprise", label: "Enterprise", icon: Building },
              { id: "personal", label: "Personal Project", icon: User },
            ].map((option) => (
              <Card key={option.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="flex items-center gap-3 p-4">
                  <option.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{option.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationSetupContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Email Notifications</h3>
        {[
          { id: "updates", label: "Product updates and announcements", defaultChecked: true },
          { id: "security", label: "Security alerts", defaultChecked: true },
          { id: "marketing", label: "Marketing emails", defaultChecked: false },
          { id: "tips", label: "Tips and tutorials", defaultChecked: true },
        ].map((notification) => (
          <Card key={notification.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{notification.label}</span>
              </div>
              <input type="checkbox" defaultChecked={notification.defaultChecked} className="rounded" />
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Push Notifications</h3>
        {[
          { id: "mentions", label: "When someone mentions you", defaultChecked: true },
          { id: "comments", label: "New comments on your posts", defaultChecked: true },
          { id: "reminders", label: "Task reminders", defaultChecked: false },
        ].map((notification) => (
          <Card key={notification.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{notification.label}</span>
              </div>
              <input type="checkbox" defaultChecked={notification.defaultChecked} className="rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function PreferencesSetupContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Appearance</h3>
        <div className="grid gap-2">
          {[
            { id: "light", label: "Light", description: "Clean and bright interface" },
            { id: "dark", label: "Dark", description: "Easy on the eyes" },
            { id: "system", label: "System", description: "Match your device settings" },
          ].map((theme) => (
            <Card key={theme.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardContent className="flex items-center gap-3 p-4">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{theme.label}</div>
                  <div className="text-sm text-muted-foreground">{theme.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Language & Region</h3>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
