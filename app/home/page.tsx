"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Lock, Users, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"

const HomePage = () => {
  const [coursesData, setCoursesData] = useState({
    free: [],
    paid: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses")
        const data = await response.json()

        if (data.success) {
          const freeCourses = data.courses.filter((course: any) => course.isFree)
          const paidCourses = data.courses.filter((course: any) => !course.isFree)

          setCoursesData({
            free: freeCourses,
            paid: paidCourses,
          })
        }
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  function CourseCard({ course }: { course: any }) {
    return (
      <Card className="bg-white border-2 border-red-500 hover:border-red-600 transition-all duration-300 hover:shadow-2xl hover:scale-105">
        <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
          <Image
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            width={300}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant={course.isFree ? "secondary" : "destructive"}
              className={course.isFree ? "bg-gray-100 text-black" : "bg-red-600 text-white"}
            >
              {course.isFree ? "Free" : `₹${course.price}`}
            </Badge>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              {course.rating}
            </div>
          </div>
          <CardTitle className="text-black text-lg font-bold leading-tight">{course.title}</CardTitle>
          <CardDescription className="text-gray-600 text-sm line-clamp-2">{course.description}</CardDescription>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Users className="w-4 h-4 mr-1" />
            {course.students} students
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Link href={`/course/${course.id}`}>
            <Button
              className={`w-full font-semibold ${
                course.isFree ? "bg-black text-white hover:bg-gray-800" : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {course.isFree ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Buy Now
                </>
              )}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Discover Courses</h2>
          <p className="text-gray-300">Learn new skills with our comprehensive course library</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-white">Loading courses...</div>
          </div>
        ) : (
          <Tabs defaultValue="free" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800 border border-red-500">
              <TabsTrigger
                value="free"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white"
              >
                Free Courses
              </TabsTrigger>
              <TabsTrigger
                value="paid"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-white"
              >
                Premium Courses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="free" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.free.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="paid" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.paid.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default HomePage
