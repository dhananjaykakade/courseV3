"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, CheckCircle } from "lucide-react"
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
  isPurchased?: boolean
}

type CourseCategory = "all" | "free" | "paid"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>("all")

  useEffect(() => {
    if (loading) return // Wait for auth to load

    if (!user) {
      router.push("/login")
      return
    }

    fetchCourses()
  }, [user, loading, router])

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses")
      
      const data = await response.json()

      if (data.success) {
        // You'll need to modify your API to include enrollment status
        // For now, I'm assuming the API returns courses with isPurchased field
        setCourses(data.courses)
      }
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`)
  }

  const handleEnrollClick = async (courseId: string, isFree: boolean) => {
    if (isFree) {
      // For free courses, directly enroll
      try {
        const response = await fetch("/api/enroll", {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
        })
        
        if (response.ok) {
          // Update the course enrollment status locally
          setCourses(prev => 
            prev.map(course => 
              course.id === courseId 
                ? { ...course, isPurchased: true }
                : course
            )
          )
          // Navigate to course
          router.push(`/course/${courseId}`)
        }
      } catch (error) {
        console.error("Error enrolling in course:", error)
      }
    } else {
      // For paid courses, redirect to payment
      router.push(`/checkout/${courseId}`)
    }
  }

  // Filter courses based on selected category
  const filteredCourses = courses.filter(course => {
    switch (selectedCategory) {
      case "free":
        return course.isFree
      case "paid":
        return !course.isFree
      default:
        return true
    }
  })

  // Get counts for each category
  const freeCourseCount = courses.filter(course => course.isFree).length
  const paidCourseCount = courses.filter(course => !course.isFree).length

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Discover and enroll in amazing courses</p>
        </div>

        {/* Category Toggle */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-2"
            >
              All Courses
              <Badge variant="secondary">{courses.length}</Badge>
            </Button>
            <Button
              variant={selectedCategory === "free" ? "default" : "outline"}
              onClick={() => setSelectedCategory("free")}
              className="flex items-center gap-2"
            >
              Free Courses
              <Badge variant="secondary">{freeCourseCount}</Badge>
            </Button>
            <Button
              variant={selectedCategory === "paid" ? "default" : "outline"}
              onClick={() => setSelectedCategory("paid")}
              className="flex items-center gap-2"
            >
              Paid Courses
              <Badge variant="secondary">{paidCourseCount}</Badge>
            </Button>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {selectedCategory === "all" ? "" : selectedCategory} courses available
            </h3>
            <p className="text-gray-600">Check back later for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div onClick={() => handleCourseClick(course.id)}>
                  {course.image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <div className="flex flex-col gap-1">
                        <Badge variant={course.isFree ? "secondary" : "destructive"}>
                          {course.isFree ? "Free" : `$${course.price}`}
                        </Badge>
                        {course.isPurchased && (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      {!course.isFree && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>${course.price}</span>
                        </div>
                      )}
                    </div>

                    {course.isPurchased ? (
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCourseClick(course.id)
                        }}
                      >
                        View Course
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={course.isFree ? "default" : "destructive"}
                        onClick={(e) => {
                          e.stopPropagation()
                           handleCourseClick(course.id)
                        }}
                      >
                        {course.isFree ? "Enroll Now" : "Buy Now"}
                      </Button>
                    )}
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}