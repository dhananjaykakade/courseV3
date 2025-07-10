"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, Users, BookOpen } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"

interface Course {
  id: string
  title: string
  description: string
  isFree: boolean
  price: number
  duration: string
  image: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  isEmailVerified: boolean
  createdAt: string
}

interface Milestone {
  title: string
  textBlocks: string[]
  pdfUrls: string[]
  videoUrl: string
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [existingMilestones, setExistingMilestones] = useState<Milestone[]>([])
  const [paymentStats, setPaymentStats] = useState<{ total: number; currency: string }>({ total: 0, currency: "INR" })

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPaid: false,
    price: 0,
    duration: "",
    imageUrl: "",
  })

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      title: "",
      textBlocks: [""],
      pdfUrls: [""],
      videoUrl: "",
    },
  ])

  useEffect(() => {
    if (loading) return // Wait for auth to load

    if (!user) {
      router.push("/login")
      return
    }

    if (user.role !== "admin") {
      router.push("/home")
      return
    }

    fetchData()
  }, [user, loading, router])


  // Handle payment total money count
  useEffect(() => {
    const fetchPaymentStats = async () => {
      if (!user) return
      try {
        const response = await fetch("/api/admin/payments", {
          credentials: "include",
        })

        if (response.status === 401) {
          alert("Session expired. Please log in again.")
          router.push("/login")
          return
        }

        const data = await response.json()
        console.log("Payment stats:", data)

        if (data.success) {
          // Handle payment stats if needed
          setPaymentStats({
            total: data.payments.total || 0,
            currency: data.payments.currency || "INR",
          })
          console.log("Total payments:", data.payments)
        } else {
          console.error("Failed to fetch payment stats:", data.message)
        }
      } catch (error) {
        console.error("Error fetching payment stats:", error)
      }
    }
    fetchPaymentStats()
  }, [user, router])

  const handleAuthError = (response: Response) => {
    if (response.status === 401) {
      alert("Session expired. Please log in again.")
      router.push("/login")
      return true
    }
    return false
  }

  const fetchData = async () => {
    if (!user) {
      console.log("No token available")
      router.push("/login")
      return
    }

    try {
    


      const [coursesResponse, usersResponse] = await Promise.all([
        fetch("/api/courses",
          {
            credentials: "include",
          }
        ),
        fetch("/api/admin/users", { credentials: "include", }),
      ])

      console.log("Courses response status:", coursesResponse.status)
      console.log("Users response status:", usersResponse.status)

      if (handleAuthError(coursesResponse) || handleAuthError(usersResponse)) {
        return
      }

      const coursesData = await coursesResponse.json()
      const usersData = await usersResponse.json()

      console.log("Courses data:", coursesData)
      console.log("Users data:", usersData)

      if (coursesData.success) {
        setCourses(coursesData.courses)
      }

      if (usersData.success) {
        setUsers(usersData.users)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      if (error instanceof Error && error.message === "No auth token") {
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchExistingMilestones = async (courseId: string) => {
    if (!user) return

    try {
      console.log("Fetching existing milestones for course:", courseId)

    
      const response = await fetch(`/api/courses/${courseId}`, {  
        method: "GET",
        credentials: "include", // Important for session management
       })

      console.log("Fetch milestones response status:", response.status)

      if (handleAuthError(response)) {
        return
      }

      const data = await response.json()
      console.log("Existing milestones data:", data)

      if (data.success && data.course.milestones) {
        const formattedMilestones = data.course.milestones.map((milestone: any) => ({
          title: milestone.title,
          textBlocks: milestone.content.filter((c: any) => c.type === "text").map((c: any) => c.data),
          pdfUrls: milestone.content.filter((c: any) => c.type === "pdf").map((c: any) => c.data.url),
          videoUrl: milestone.content.find((c: any) => c.type === "video")?.data.url || "",
        }))

        console.log("Formatted milestones:", formattedMilestones)
        setExistingMilestones(formattedMilestones)
        setMilestones(
          formattedMilestones.length > 0
            ? formattedMilestones
            : [
                {
                  title: "",
                  textBlocks: [""],
                  pdfUrls: [""],
                  videoUrl: "",
                },
              ],
        )
      }
    } catch (error) {
      console.error("Error fetching existing milestones:", error)
    }
  }

  const handleCreateCourse = () => {
    setEditingCourse(null)
    setExistingMilestones([])
    setFormData({
      title: "",
      description: "",
      isPaid: false,
      price: 0,
      duration: "",
      imageUrl: "",
    })
    setMilestones([
      {
        title: "",
        textBlocks: [""],
        pdfUrls: [""],
        videoUrl: "",
      },
    ])
    setIsDialogOpen(true)
  }

  const handleEditCourse = async (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description,
      isPaid: !course.isFree,
      price: course.price,
      duration: course.duration,
      imageUrl: course.image,
    })

    // Fetch existing milestones
    await fetchExistingMilestones(course.id)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Session expired. Please log in again.")
      router.push("/login")
      return
    }

    try {
      console.log("Submitting course form")

     
      const courseData = {
        ...formData,
        milestones: milestones.filter((m) => m.title.trim() !== ""),
      }

      console.log("Course data:", courseData)

      const url = editingCourse ? `/api/courses/${editingCourse.id}` : "/api/courses"
      const method = editingCourse ? "PUT" : "POST"

      console.log("Making request to:", url, "with method:", method)

      const response = await fetch(url, {
        method,
        credentials: "include", // Important for session management
        body: JSON.stringify(courseData),
      })

      console.log("Submit response status:", response.status)

      if (handleAuthError(response)) {
        return
      }

      const data = await response.json()
      console.log("Submit response data:", data)

      if (data.success) {
        alert(editingCourse ? "Course updated successfully!" : "Course created successfully!")
        setIsDialogOpen(false)
        fetchData()
      } else {
        alert(data.message || "Failed to save course")
      }
    } catch (error) {
      console.error("Error saving course:", error)
      alert("Failed to save course")
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return

    if (!user) {
      alert("Session expired. Please log in again.")
      router.push("/login")
      return
    }

    try {
      console.log("Deleting course:", courseId)

      
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        credentials: "include", // Important for session management
      })

      console.log("Delete response status:", response.status)

      if (handleAuthError(response)) {
        return
      }

      const data = await response.json()
      console.log("Delete response data:", data)

      if (data.success) {
        alert("Course deleted successfully!")
        fetchData()
      } else {
        alert(data.message || "Failed to delete course")
      }
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Failed to delete course")
    }
  }

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        title: "",
        textBlocks: [""],
        pdfUrls: [""],
        videoUrl: "",
      },
    ])
  }

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index))
    }
  }

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const addTextBlock = (milestoneIndex: number) => {
    const updated = [...milestones]
    updated[milestoneIndex].textBlocks.push("")
    setMilestones(updated)
  }

  const removeTextBlock = (milestoneIndex: number, textIndex: number) => {
    const updated = [...milestones]
    if (updated[milestoneIndex].textBlocks.length > 1) {
      updated[milestoneIndex].textBlocks.splice(textIndex, 1)
      setMilestones(updated)
    }
  }

  const updateTextBlock = (milestoneIndex: number, textIndex: number, value: string) => {
    const updated = [...milestones]
    updated[milestoneIndex].textBlocks[textIndex] = value
    setMilestones(updated)
  }

  const addPdfUrl = (milestoneIndex: number) => {
    const updated = [...milestones]
    updated[milestoneIndex].pdfUrls.push("")
    setMilestones(updated)
  }

  const removePdfUrl = (milestoneIndex: number, pdfIndex: number) => {
    const updated = [...milestones]
    if (updated[milestoneIndex].pdfUrls.length > 1) {
      updated[milestoneIndex].pdfUrls.splice(pdfIndex, 1)
      setMilestones(updated)
    }
  }

  const updatePdfUrl = (milestoneIndex: number, pdfIndex: number, value: string) => {
    const updated = [...milestones]
    updated[milestoneIndex].pdfUrls[pdfIndex] = value
    setMilestones(updated)
  }



  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage courses and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <span className="text-muted-foreground">
                {paymentStats.total} {paymentStats.currency}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Courses</h2>
              <Button onClick={handleCreateCourse}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant={course.isFree ? "secondary" : "destructive"}>
                        {course.isFree ? "Free" : `$${course.price}`}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Duration: {course.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">Users</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>{user.role}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                              {user.isEmailVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Course Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? `Edit Course: ${editingCourse.title}` : "Create New Course"}
                {existingMilestones.length > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({existingMilestones.length} existing milestones loaded)
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Course Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 4 weeks"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                  />
                  <Label htmlFor="isPaid">Paid Course</Label>
                </div>

                {formData.isPaid && (
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              {/* Milestones */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-lg font-semibold">Course Milestones</Label>
                  <Button type="button" onClick={addMilestone} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Milestone
                  </Button>
                </div>

                {milestones.map((milestone, milestoneIndex) => (
                  <Card key={milestoneIndex} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Milestone {milestoneIndex + 1}</CardTitle>
                        {milestones.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeMilestone(milestoneIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Milestone Title</Label>
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestoneIndex, "title", e.target.value)}
                          placeholder="Enter milestone title"
                          required
                        />
                      </div>

                      {/* Text Blocks */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Text Content</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addTextBlock(milestoneIndex)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Text
                          </Button>
                        </div>
                        {milestone.textBlocks.map((text, textIndex) => (
                          <div key={textIndex} className="flex gap-2 mb-2">
                            <Textarea
                              value={text}
                              onChange={(e) => updateTextBlock(milestoneIndex, textIndex, e.target.value)}
                              placeholder="Enter text content"
                              rows={3}
                              className="flex-1"
                            />
                            {milestone.textBlocks.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeTextBlock(milestoneIndex, textIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* PDF URLs */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>PDF Documents</Label>
                          <Button type="button" variant="outline" size="sm" onClick={() => addPdfUrl(milestoneIndex)}>
                            <Plus className="h-3 w-3 mr-1" />
                            Add PDF
                          </Button>
                        </div>
                        {milestone.pdfUrls.map((url, pdfIndex) => (
                          <div key={pdfIndex} className="flex gap-2 mb-2">
                            <Input
                              value={url}
                              onChange={(e) => updatePdfUrl(milestoneIndex, pdfIndex, e.target.value)}
                              placeholder="Enter PDF URL"
                              className="flex-1"
                            />
                            {milestone.pdfUrls.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removePdfUrl(milestoneIndex, pdfIndex)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Video URL */}
                      <div>
                        <Label>Video URL</Label>
                        <Input
                          value={milestone.videoUrl}
                          onChange={(e) => updateMilestone(milestoneIndex, "videoUrl", e.target.value)}
                          placeholder="Enter video URL"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCourse ? "Update Course" : "Create Course"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}