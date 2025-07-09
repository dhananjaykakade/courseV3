"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"

interface EnrolledCourse {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  image: string
  progress: number
  enrolledAt: string
  completedAt?: string
  totalMilestones: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchEnrolledCourses()
  }, [user, router])

  const fetchEnrolledCourses = async () => {
    try {
      if (!user) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/user/enrollments", {
        method: "GET",
        credentials: "include",
      })

      if (response.status === 401) {
        localStorage.removeItem("authToken")
        router.push("/login")
        return
      }

      const data = await response.json()

      if (data.success) {
        setEnrolledCourses(data.enrollments)
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getProgressStatus = (progress: number) => {
    if (progress === 0) return { label: "Not Started", color: "bg-gray-500" }
    if (progress < 100) return { label: "In Progress", color: "bg-blue-500" }
    return { label: "Completed", color: "bg-green-500" }
  }

  const completedCourses = enrolledCourses.filter((course) => course.progress === 100)
  const inProgressCourses = enrolledCourses.filter((course) => course.progress > 0 && course.progress < 100)
  const notStartedCourses = enrolledCourses.filter((course) => course.progress === 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={ "/placeholder.svg"} />
              <AvatarFallback className="text-xl font-semibold">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">{user?.role}</Badge>
                <Badge variant={user?.isEmailVerified ? "default" : "destructive"}>
                  {user?.isEmailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCourses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressCourses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Started</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{notStartedCourses.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled Courses */}
        <div className="space-y-8">
          {/* In Progress Courses */}
          {inProgressCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((course) => {
                  const status = getProgressStatus(course.progress)
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={course.image || "/placeholder.svg?height=200&width=300"}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{Math.round(course.progress)}%</span>
                          </div>
                          <Progress value={course.progress} className="w-full" />
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Instructor: {course.instructor}</p>
                          <p>Duration: {course.duration}</p>
                          <p>Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</p>
                        </div>
                        <Button className="w-full" onClick={() => router.push(`/course/${course.id}`)}>
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => {
                  const status = getProgressStatus(course.progress)
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={course.image || "/placeholder.svg?height=200&width=300"}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="text-green-600 font-semibold">100% Complete</span>
                          </div>
                          <Progress value={100} className="w-full" />
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Instructor: {course.instructor}</p>
                          <p>Duration: {course.duration}</p>
                          <p>
                            Completed:{" "}
                            {course.completedAt ? new Date(course.completedAt).toLocaleDateString() : "Recently"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => router.push(`/course/${course.id}`)}
                        >
                          Review Course
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Not Started Courses */}
          {notStartedCourses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notStartedCourses.map((course) => {
                  const status = getProgressStatus(course.progress)
                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                          <Badge className={`${status.color} text-white`}>{status.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <img
                          src={course.image || "/placeholder.svg?height=200&width=300"}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>0%</span>
                          </div>
                          <Progress value={0} className="w-full" />
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Instructor: {course.instructor}</p>
                          <p>Duration: {course.duration}</p>
                          <p>Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}</p>
                        </div>
                        <Button className="w-full" onClick={() => router.push(`/course/${course.id}`)}>
                          Start Learning
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {enrolledCourses.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't enrolled in any courses yet. Start your learning journey today!
                </p>
                <Button onClick={() => router.push("/home")}>Browse Courses</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
