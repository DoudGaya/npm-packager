"use client"

import type { User } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/profile-form"
import { AccountForm } from "@/components/account-form"
import { ApiKeysForm } from "@/components/api-keys-form"

interface SettingsTabsProps {
  user: Pick<User, "id" | "name" | "email" | "image" | "npmToken" | "githubToken" | "twoFactorEnabled">
}

export function SettingsTabs({ user }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileForm user={user} />
      </TabsContent>
      <TabsContent value="account">
        <AccountForm user={user} />
      </TabsContent>
      <TabsContent value="api-keys">
        <ApiKeysForm user={user} />
      </TabsContent>
    </Tabs>
  )
}
