"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, Users, Clock, Award, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"


import { useEffect, useState } from "react"

// Latest 3 courses state
const useLatestCourses = () => {
  const [courses, setCourses] = useState<any[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        if (data.success) {
          const latest = (data.courses as any[])
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 3)
          setCourses(latest)
        }
      } catch (err) {
        console.error("Failed to load courses", err)
      }
    })()
  }, [])
  return courses
}

// Dummy data (fallback while fetch runs)
const initialCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build your first website.",
    isFree: true,
    price: 0,
    rating: 4.8,
    students: 1250,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Advanced React Development",
    description: "Deep dive into React hooks, context, and advanced patterns for professional development.",
    isFree: false,
    price: 2999,
    rating: 4.9,
    students: 450,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Full Stack JavaScript",
    description: "Complete course covering Node.js, Express, MongoDB, and React for full stack development.",
    isFree: false,
    price: 4999,
    rating: 4.7,
    students: 320,
    image: "/placeholder.svg?height=200&width=300",
  },
]

// hook will be invoked inside component

const benefits = [
  {
    icon: Clock,
    title: "Learn at Your Own Pace",
    description: "Access courses 24/7 and learn whenever it's convenient for you.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience.",
  },
  {
    icon: Award,
    title: "Lifetime Access",
    description: "Once you enroll, you have lifetime access to course materials and updates.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Frontend Developer",
    content: "The React course completely transformed my career. The instructor's teaching style is exceptional!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Full Stack Developer",
    content: "Best investment I've made in my career. The practical projects helped me land my dream job.",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Web Designer",
    content: "Clear explanations, great examples, and excellent support. Highly recommended!",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

function CourseCard({ course }: { course: any }) {
  return (
    <Card className="bg-white border-2 border-gray-200 hover:border-red-500 transition-all duration-300 hover:shadow-xl">
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
                <BookOpen className="w-4 h-4 mr-2" />
                Enroll Now
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default function LandingPage() {
  const featuredCourses = useLatestCourses()
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master New Skills with
            <span className="text-red-500"> Expert-Led Courses</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of learners advancing their careers with our comprehensive, hands-on courses taught by
            industry professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 text-lg">
                Browse Courses
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg bg-transparent"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Start your learning journey with our most popular courses</p>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredCourses && featuredCourses.length ? featuredCourses : initialCourses).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/home">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">View All Courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Why Choose Trinity Courses?</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed in your learning journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-2 border-gray-200 hover:border-red-500 transition-colors">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <benefit.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <CardTitle className="text-black">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-black text-white">
 
      </section>

      {/* Footer */}
 <Footer />
    </div>
  )
}
