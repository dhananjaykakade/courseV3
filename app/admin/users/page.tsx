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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Edit, Plus, Users, BookOpen, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface PaidCourse {
  id: string
  title: string
  price: number
  created_at: Date
}

interface UserDetailsForPaidCourse {
  email: string
  amount: number
  currency: string
  payment_id: string
  order_id: string
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogOpenForPaidCourses, setIsDialogOpenForPaidCourses] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<PaidCourse | null>(null)
  const [userDetailsForPaidCourse, setUserDetailsForPaidCourse] = useState<UserDetailsForPaidCourse>({
    email: "",
    amount: 0,
    currency: "INR",
    payment_id: "Adminaccessgiven",
    order_id: "Adminaccessgiven"
  })
  const [newRole, setNewRole] = useState("user")
  const [loading, setLoading] = useState(true)
  const [courseLoading, setCourseLoading] = useState(false)
  const [giveAccessLoading, setGiveAccessLoading] = useState(false)
  const [paidCourses, setPaidCourses] = useState<PaidCourse[]>([])
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaidCourses = async () => {
    try {
      setCourseLoading(true)
      const response = await fetch("/api/admin/courses/paid")
      if (response.ok) {
        const data = await response.json()
        setPaidCourses(data)         
      }
    } catch (error) {
      console.error("Error fetching paid courses:", error)
    } finally {
      setCourseLoading(false)
    }
  }

  useEffect(() => {
    fetchPaidCourses()
  }, [])

  useEffect(() => {
    if (authLoading) return 
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/home")
      return
    }

    fetchUsers()
  }, [user, router, authLoading])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleUserAction = async () => {
    if (!selectedUser) return
    setLoading(true)
    
    try {
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
        alert('role updated successfully')
        setIsDialogOpen(false)
        fetchUsers()
        setSelectedUser(null)
        setNewRole("user")
      }

    } catch (error:any) {
      console.error("Error updating user role:", error)
      if(process.env.NEXT_PUBLIC_NODE_ENV ==='development') alert(`error updating role :${error.message}`)
        alert("error updating role")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setIsDialogOpen(true)
  }

  const openPaidCourseDialog = (course: PaidCourse) => {
    setSelectedCourse(course)
    setUserDetailsForPaidCourse({
      email: "",
      amount: course.price,
      currency: "INR",
      payment_id: "",
      order_id: ""
    })
    setIsDialogOpenForPaidCourses(true)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleGiveAccess = async () => {
    if (!userDetailsForPaidCourse.email || !selectedCourse) return
    
    setGiveAccessLoading(true)
    
    try {
      const response = await fetch("/api/admin/courses/paid/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: userDetailsForPaidCourse.email,
          courseId: selectedCourse.id,
          amount: userDetailsForPaidCourse.amount,
          currency: userDetailsForPaidCourse.currency || 'INR',
          payment_id: userDetailsForPaidCourse.payment_id || 'adminaccessgiven',
          order_id: userDetailsForPaidCourse.order_id || 'adminaccessgiven'
        }),
      })

      if(!response.ok) {
        const data = await response.json()
        alert(`Error granting access: ${data.message}`)
      }

      if (response.ok) {
        setIsDialogOpenForPaidCourses(false)
        // Reset form
        setUserDetailsForPaidCourse({
          email: "",
          amount: 0,
          currency: "INR",
          payment_id: "",
          order_id: ""
        })
        setSelectedCourse(null)
        alert("access given successfully")
      } else {
        console.error("Error granting access:", response.statusText)
      }
    } catch (error:any) {
      console.error("Error granting access:", error)
      if(process.env.NEXT_PUBLIC_NODE_ENV === 'development') alert(`error granting access :${error.message}`)
      alert("error granting access")
    } finally {
      setGiveAccessLoading(false)
    }
  }

  const handleUserDetailsChange = (field: keyof UserDetailsForPaidCourse, value: string | number) => {
    setUserDetailsForPaidCourse(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold">
              User Management
            </CardTitle>
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
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <Card key={`skeleton-${i}`} className="p-4 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-5 w-1/3 mt-2" />
                          <Skeleton className="h-10 w-full mt-4" />
                        </Card>
                      ))
                    : filteredUsers.map(user => (
                        <Card
                          key={user.id}
                          className="flex flex-col justify-between p-4"
                        >
                          <div>
                            <h3 className="text-lg font-semibold">
                              {user.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <Badge className="mt-2 capitalize">
                              {user.role}
                            </Badge>
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
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {courseLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <Card key={`skeleton-${i}`} className="p-4 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-5 w-1/3 mt-2" />
                          <Skeleton className="h-10 w-full mt-4" />
                        </Card>
                      ))
                    : paidCourses.map(course => (
                        <Card
                          key={course.id}
                          className="flex flex-col justify-between p-4"
                        >
                          <div>
                            <h3 className="text-lg font-semibold">
                              {course.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Price: ${course.price}
                            </p>
                            <Button 
                              variant="outline"
                              onClick={() => openPaidCourseDialog(course)}
                              className="mt-2 w-full"
                            >
                              <Plus className="mr-2 h-4 w-4" /> Give Access
                            </Button>
                          </div>
                        </Card>
                      ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* User Role Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Edit User Role" : "Add User"}
            </DialogTitle>
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
              <Input
                id="name"
                disabled
                value={selectedUser?.name || ""}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                disabled
                value={selectedUser?.email || ""}
              />
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
            <Button 
              type="submit" 
              className={`w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Loading..." : selectedUser ? "Update Role" : "Create User"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Paid Course Access Dialog */}
      <Dialog open={isDialogOpenForPaidCourses} onOpenChange={setIsDialogOpenForPaidCourses}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Give Access to {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleGiveAccess()
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="user-email">User Email</Label>
              <Input
                id="user-email"
                type="email"
                placeholder="Enter user email"
                value={userDetailsForPaidCourse.email}
                onChange={e => handleUserDetailsChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="payment-id">Payment ID (Optional)</Label>
              <Input
                id="payment-id"
                placeholder="Enter payment ID"
                value={userDetailsForPaidCourse.payment_id}
                defaultValue={"adminaccessgiven"}
                onChange={e => handleUserDetailsChange("payment_id", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="order-id">Order ID (Optional)</Label>
              <Input
                id="order-id"
                placeholder="Enter order ID"
                                defaultValue={"adminaccessgiven"}
                value={userDetailsForPaidCourse.order_id}
                onChange={e => handleUserDetailsChange("order_id", e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full ${giveAccessLoading ? "opacity-50 cursor-not-allowed" : ""}`} 
              disabled={giveAccessLoading || !userDetailsForPaidCourse.email}
            >
              {giveAccessLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {giveAccessLoading ? "Granting Access..." : "Give Access"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}