"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Clock, IndianRupee , Play, FileText, Download } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"
import { VideoPlayer } from "@/components/video-player"
import { loadRazorpay } from "@/lib/utils/razorpay"; // Ensure this path is correct
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  isFree: boolean
  price: number
  duration: string
  image: string
  milestones: Milestone[]
  isPurchased?: boolean
  progress?: number
}

interface Milestone {
  id: string
  title: string
  isCompleted: boolean
  content: ContentItem[]
}

interface ContentItem {
  type: "text" | "video" | "pdf"
  data: string | { title: string; url: string }
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMilestone, setCurrentMilestone] = useState(0)
  const [isEnrolling, setIsEnrolling] = useState(false)

  const getYouTubeVideoId = (url: string): string => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[1].length === 11 ? match[1] : ""
}



  useEffect(() => {
    if (loading) return // Wait for auth to load

    if (!user) {
      router.push("/login")
      return
    }

    fetchCourse()
  }, [user, loading, params.id, router])

  const fetchCourse = async () => {
    try {
      console.log("Fetching course:", params.id)

      const url = `/api/courses/${params.id}`
      const headers: any = {}

      // If user is authenticated, get course with progress
    

        // Try to get course with progress first
        const progressResponse = await fetch(`${url}/progress`, { 
          headers,
          credentials: "include",
         })
        console.log("Progress response status:", progressResponse.status)

        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          console.log("Progress data:", progressData)

          if (progressData.success) {
            setCourse(progressData.course)
            setIsLoading(false)
            return
          }
        }
      

      // Fallback to regular course fetch
      const response = await fetch(url, { credentials: "include" })
      console.log("Course response status:", response.status)

      const data = await response.json()
      console.log("Course data:", data)

      if (data.success) {
        setCourse(data.course)
      } else {
        console.error("Failed to fetch course:", data.message)
      }
    } catch (error) {
      console.error("Error fetching course:", error)
    } finally {
      setIsLoading(false)
    }
  }


const handleEnroll = async () => {
  if (!user || !course) return;

  setIsEnrolling(true);

  try {
    console.log("Enrolling in course:", course.id);

    if (course.price === 0) {
      // 🔓 Free course enrollment
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      console.log("Free course enroll response:", data);

      if (data.success) {
        alert("Successfully enrolled in course!");
        fetchCourse();
      } else {
        alert(data.message || "Failed to enroll in course");
      }
    } else {
      // 💰 Paid course - initiate Razorpay payment
      const response = await fetch(`/api/courses/${course.id}/enroll/paid`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      console.log("Paid course enroll response:", data);

      if (!data.success) {
        alert(data.message || "Payment initiation failed");
        return;
      }

      // 🧾 Load Razorpay SDK
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        alert("Failed to load Razorpay. Please try again.");
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: "Course Purchase",
        description: course.title,
        order_id: data.orderId,
        handler: async function (response: any) {
  try {
    // Send payment details to backend for verification
    const verifyRes = await fetch(`/api/courses/${course.id}/enroll/verify-payment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });
    const verifyData = await verifyRes.json();
    if (verifyData.success) {
      alert("Payment verified and enrollment successful!");
      fetchCourse(); // Refresh course data to reflect enrollment
    } else {
      alert(verifyData.message || "Payment verification failed");
    }
  } catch (err) {
    alert("Something went wrong during payment verification.");
  }
},
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
    alert("Something went wrong while enrolling");
  } finally {
    setIsEnrolling(false);
  }
};


  const handleMilestoneComplete = async (milestoneId: string) => {
    if (!user || !course) return

    try {
      console.log("Marking milestone complete:", milestoneId)

      const response = await fetch(`/api/courses/${course.id}/progress`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ milestoneId }),
      })

      console.log("Progress response status:", response.status)
      const data = await response.json()
      console.log("Progress response data:", data)

      if (data.success) {
        // Update local state
        setCourse((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            milestones: prev.milestones.map((milestone) =>
              milestone.id === milestoneId ? { ...milestone, isCompleted: true } : milestone,
            ),
            progress: data.progress,
          }
        })

        // Move to next milestone if available
        const currentIndex = course.milestones.findIndex((m) => m.id === milestoneId)
        if (currentIndex < course.milestones.length - 1) {
          setCurrentMilestone(currentIndex + 1)
        }
      } else {
        alert(data.message || "Failed to update progress")
      }
    } catch (error) {
      console.error("Error updating progress:", error)
      alert("Failed to update progress")
    }
  }

  const renderContent = (content: ContentItem) => {
    switch (content.type) {
      case "text":
        return (
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-700">{content.data as string}</div>
          </div>
        )
      case "video":
          const videoData = content.data as { title: string; url: string }
  const videoId = getYouTubeVideoId(videoData.url)

  return (
    <div className="mb-6">
      <h4 className="font-medium mb-2 flex items-center">
        <Play className="h-4 w-4 mr-2" />
        {videoData.title}
      </h4>
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&showinfo=0`}
          title={videoData.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
      case "pdf":
        const pdfData = content.data as { title: string; url: string }
        return (
          <div className="mb-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-red-600" />
                  <span className="font-medium">{pdfData.title}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={pdfData.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
            <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/home")}>Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  const completedMilestones = course.milestones.filter((m) => m.isCompleted).length
  const progressPercentage = course.milestones.length > 0 ? (completedMilestones / course.milestones.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                {!course.isFree && (
                  <div className="flex items-center text-sm text-gray-500">
                    <IndianRupee/>
                    <span className="text-green-500">{course.price}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={course.isFree ? "secondary" : "destructive"}>
                  {course.isFree ? "Free" : `₹${course.price}`}
                </Badge>
                {course.isPurchased && <Badge variant="default">Enrolled</Badge>}
              </div>
            </div>

            <div className="lg:col-span-1">
              {course.image && (
                <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
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

              {!course.isPurchased ? (
                <Button className="w-full" onClick={handleEnroll} disabled={isEnrolling}>
                  {isEnrolling ? "Enrolling..." : course.isFree ? "Enroll for Free" : `Enroll for ₹${course.price}`}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="w-full" />
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedMilestones} of {course.milestones.length} milestones completed
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Content */}
        {course.isPurchased && course.milestones.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Milestone Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Course Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.milestones.map((milestone, index) => (
                    <button
                      key={milestone.id}
                      onClick={() => setCurrentMilestone(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentMilestone === index ? "bg-blue-50 border-blue-200 border" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        {milestone.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${milestone.isCompleted ? "text-green-700" : "text-gray-700"}`}>
                          {milestone.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Milestone Content */}
            <div className="lg:col-span-3">
              {course.milestones[currentMilestone] && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{course.milestones[currentMilestone].title}</CardTitle>
                      {!course.milestones[currentMilestone].isCompleted && (
                        <Button
                          onClick={() => handleMilestoneComplete(course.milestones[currentMilestone].id)}
                          size="sm"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {course.milestones[currentMilestone].content.map((content, index) => (
                      <div key={index}>{renderContent(content)}</div>
                    ))}

                    {course.milestones[currentMilestone].content.length === 0 && (
                      <p className="text-gray-500 italic">No content available for this milestone.</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Not Enrolled Message */}
        {!course.isPurchased && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Enroll to Access Course Content</h3>
              <p className="text-gray-600 mb-4">
                {course.isFree
                  ? "This course is free! Enroll now to start learning."
                  : `Enroll for ₹${course.price} to access all course materials and milestones.`}
              </p>
              <Button onClick={handleEnroll} disabled={isEnrolling}>
                {isEnrolling ? "Enrolling..." : course.isFree ? "Enroll for Free" : `Enroll for ₹${course.price}`}
              </Button>
              {/* show secure by razorpay payments message */}
              <div className="mt-4">
                <Image
                  src="/razorpay-logo.png"
                  alt="Razorpay Secure"
                  width={100}
                  height={30}
                  className="object-contain mx-auto"
                />
                <span className="text-xs text-gray-500">100% Secure Payments powered by Razorpay</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer/>
    </div>
  )
}