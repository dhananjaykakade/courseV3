"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, IndianRupee, CheckCircle, AlertCircle, Search, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"
import { Footer } from "@/components/footer"


interface Course {
  id: string
  title: string
  description: string
  isFree: boolean
  price: number
  duration: string
  image: string
  isPurchased?: boolean
  category?: string
  level?: string
}

type CourseCategory = "all" | "free" | "paid"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCoursesWithEnrollments = useCallback(async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)

    try {
      // First, fetch courses
      const coursesResponse = await fetch("/api/courses")
      const coursesData = await coursesResponse.json()

      if (!coursesData.success) {
        throw new Error(coursesData.message || "Failed to fetch courses")
      }

      // Set courses initially without enrollment data
      setCourses(coursesData.courses)

      // Then fetch enrollments and update courses
      try {
        const enrollmentsResponse = await fetch("/api/user/enrollments")
        const enrollmentsData = await enrollmentsResponse.json()

        if (enrollmentsData.success && enrollmentsData.enrollments) {
          
          const coursesWithEnrollments = coursesData.courses.map((course: Course) => {
            const enrollment = enrollmentsData.enrollments.find(
              (enrollment: any) => enrollment.id === course.id
            )
            
            return {
              ...course,
              isPurchased: !!enrollment
            }
          })
                    setCourses(coursesWithEnrollments)
        } else {
        }
      } catch (enrollmentError) {
        console.error("Error fetching enrollments:", enrollmentError)
        // Continue without data - courses will show as not purchased
      }

    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "Failed to load courses")
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    fetchCoursesWithEnrollments()
  }, [user, loading, router, fetchCoursesWithEnrollments])

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`)
  }

  const handleRetry = () => {
    fetchCoursesWithEnrollments()
  }

  // Filter courses based on selected category and search term
  const filteredCourses = courses.filter(course => {
    const matchesCategory = (() => {
      switch (selectedCategory) {
        case "free":
          return course.isFree
        case "paid":
          return !course.isFree
        default:
          return true
      }
    })()

    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Get counts for each category
  const freeCourseCount = courses.filter(course => course.isFree).length
  const paidCourseCount = courses.filter(course => !course.isFree).length
  const enrolledCourseCount = courses.filter(course => course.isPurchased).length

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your courses...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Continue your learning journey with our amazing courses
              </p>
            </div>
            {enrolledCourseCount > 0 && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {enrolledCourseCount} course{enrolledCourseCount !== 1 ? 's' : ''} enrolled
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
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
              Premium Courses
              <Badge variant="secondary">{paidCourseCount}</Badge>
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {(searchTerm || selectedCategory !== "all") && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {selectedCategory !== "all" && ` in ${selectedCategory} category`}
            </p>
          </div>
        )}

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No courses match "${searchTerm}"`
                  : `No ${selectedCategory} courses available`
                }
              </p>
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id} 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0 shadow-md"
              >
                <div onClick={() => handleCourseClick(course.id)}>
                  {course.image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300"
                        }}
                      />
                      {course.isPurchased && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg line-clamp-2 text-gray-900">
                        {course.title}
                      </CardTitle>
                      <Badge 
                        variant={course.isFree ? "secondary" : "destructive"}
                        className={course.isFree ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                      >
                        {course.isFree ? "Free" : `Premium`}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      {!course.isFree && (
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span className="text-red-500">{course.price}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className={`w-full transition-all duration-200 ${
                        course.isPurchased 
                          ? "bg-green-600 hover:bg-green-700" 
                          : course.isFree 
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-purple-600 hover:bg-purple-700"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCourseClick(course.id)
                      }}
                    >
                      {course.isPurchased 
                        ? "Continue Learning" 
                        : course.isFree 
                          ? "Enroll Free" 
                          : "Get Premium"}
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
                    {/* add tip the courses are non refundable in case of failure contact trinityconsultancyofficial@gmail.com  in very small font and italic style*/}
      <div className="text-center text-xs text-gray-500 italic mt-8 mb-8">
        Note: All courses are non-refundable. In case of any issues, please contact us at{" "}
        <a href="mailto:trinityconsultancyofficial@gmail.com" className="text-red-600 underline">
          trinityconsultancyofficial@gmail.com
        </a>
      </div>
      <Footer />
    </div>
  )
}