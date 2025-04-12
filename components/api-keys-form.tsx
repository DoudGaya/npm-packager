"use client"

import { useState } from "react"
import type { User } from "@prisma/client"
import { Loader2, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface ApiKeysFormProps {
  user: Pick<User, "id">
}

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed: Date | null
}

export function ApiKeysForm({ user }: ApiKeysFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Development",
      key: "npm_pk_•••••••••••••••••",
      createdAt: new Date("2023-01-01"),
      lastUsed: new Date("2023-04-01"),
    },
  ])
  const [newKeyName, setNewKeyName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const createApiKey = async () => {
    try {
      setIsLoading(true)

      // In a real implementation, this would call a server action to create an API key
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newKey: ApiKey = {
        id: Math.random().toString(36).substring(7),
        name: newKeyName,
        key: `npm_pk_${Math.random().toString(36).substring(2, 10)}`,
        createdAt: new Date(),
        lastUsed: null,
      }

      setApiKeys([...apiKeys, newKey])
      setNewKeyName("")
      setIsDialogOpen(false)

      toast({
        title: "Success",
        description: "API key created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    try {
      setIsLoading(true)

      // In a real implementation, this would call a server action to delete an API key
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setApiKeys(apiKeys.filter((key) => key.id !== id))

      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for programmatic access</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>Create a new API key for programmatic access to your account.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Development, Production"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={isLoading || !newKeyName}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {apiKeys.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>{key.key}</TableCell>
                  <TableCell>{formatDate(key.createdAt)}</TableCell>
                  <TableCell>{formatDate(key.lastUsed)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteApiKey(key.id)} disabled={isLoading}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">No API keys found</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
