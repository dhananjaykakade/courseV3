"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Edit, Plus, Users, BookOpen } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("user")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      // handle silently
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleUserAction = async () => {
    if (!selectedUser) return

    const response = await fetch(`/api/admin/users/update/role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: selectedUser.id,
        newRole: newRole,
      }),
    })

    if (response.ok) {
      setIsDialogOpen(false)
      fetchUsers()
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold">User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full sm:max-w-xs"
              />
            </div>
            <Tabs defaultValue="users">
              <TabsList className="flex">
                <TabsTrigger value="users">
                  <Users className="mr-2 h-4 w-4" /> Users
                </TabsTrigger>
                <TabsTrigger value="courses">
                  <BookOpen className="mr-2 h-4 w-4" /> Courses
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {users
                    .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(user => (
                      <Card key={user.id} className="flex flex-col justify-between p-4">
                        <div>
                          <h3 className="text-lg font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <Badge className="mt-2 capitalize">{user.role}</Badge>
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            onClick={() => openEditDialog(user)}
                            className="w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Role
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="courses">
                {/* Placeholder for future content */}
                <p className="text-sm text-muted-foreground">Course management coming soon...</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User Role" : "Add User"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleUserAction()
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" disabled value={selectedUser?.name || ""} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" disabled value={selectedUser?.email || ""} />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              {selectedUser ? "Update Role" : "Create User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
