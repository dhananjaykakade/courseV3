"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Download, CheckCircle, Lock, ArrowRight, Play, Star } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"

function MilestoneBlock({
  milestone,
  isAccessible,
  onMilestoneComplete,
  milestoneIndex,
  courseId,
}: {
  milestone: any
  isAccessible: boolean
  onMilestoneComplete: (index: number) => void
  milestoneIndex: number
  courseId: string
}) {
  const [isCompleted, setIsCompleted] = useState(milestone.isCompleted)
  const [videoProgress, setVideoProgress] = useState<{ [key: number]: number }>({})
  const [completedVideos, setCompletedVideos] = useState<Set<number>>(new Set())
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)

  const handleMarkComplete = async () => {
    if (isMarkingComplete) return

    setIsMarkingComplete(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Please log in again")
        return
      }

      const response = await fetch(`/api/courses/${courseId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ milestoneId: milestone.id }),
      })

      const data = await response.json()

      if (data.success) {
        setIsCompleted(true)
        onMilestoneComplete(milestoneIndex)
      } else {
        alert(data.message || "Failed to mark milestone as complete")
      }
    } catch (error) {
      console.error("Error marking milestone complete:", error)
      alert("Failed to mark milestone as complete")
    } finally {
      setIsMarkingComplete(false)
    }
  }

  const handleVideoComplete = (videoIndex: number) => {
    console.log(`Video ${videoIndex} completed in milestone ${milestoneIndex}`)
    setCompletedVideos((prev) => new Set([...prev, videoIndex]))

    // Check if all videos in this milestone are completed
    const videoBlocks = milestone.content.filter((block: any) => block.type === "video")
    const allVideosCompleted = videoBlocks.every(
      (_: any, index: number) => completedVideos.has(index) || index === videoIndex,
    )

    if (allVideosCompleted && !isCompleted) {
      console.log(`All videos completed in milestone ${milestoneIndex}, auto-completing milestone`)
      setTimeout(() => {
        handleMarkComplete()
      }, 1000) // Small delay for better UX
    }
  }

  const handleVideoProgress = (videoIndex: number, progress: number) => {
    setVideoProgress((prev) => ({
      ...prev,
      [videoIndex]: progress,
    }))
  }

  useEffect(() => {
    setIsCompleted(milestone.isCompleted)
  }, [milestone.isCompleted])

  return (
    <Card className={`border-2 ${isCompleted ? "border-green-500 bg-green-50" : "border-gray-200"}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-black">
          <span className="flex items-center">
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <div className="w-5 h-5 mr-2 border-2 border-gray-300 rounded-full" />
            )}
            {milestone.title}
          </span>
          {!isAccessible && <Lock className="w-5 h-5 text-gray-400" />}
        </CardTitle>
      </CardHeader>

      {isAccessible && (
        <CardContent className="space-y-4">
          {milestone.content.map((block: any, index: number) => (
            <div key={index}>
              {block.type === "text" && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.data}</p>
                </div>
              )}

              {block.type === "pdf" && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-red-500" />
                      <span className="font-medium text-black">{block.data.title}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => window.open(block.data.url, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {block.type === "video" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-black">{block.data.title}</h4>
                    {completedVideos.has(index) && (
                      <Badge className="bg-green-600 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <VideoPlayer
                    src={block.data.url}
                    onVideoComplete={() => handleVideoComplete(index)}
                    onProgress={(progress) => handleVideoProgress(index, progress)}
                  />
                  {videoProgress[index] && videoProgress[index] < 100 && (
                    <div className="text-sm text-gray-600">Progress: {Math.round(videoProgress[index])}%</div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            {!isCompleted && (
              <Button
                onClick={handleMarkComplete}
                className="bg-green-600 hover:bg-green-700"
                disabled={isMarkingComplete}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isMarkingComplete ? "Marking Complete..." : "Mark as Complete"}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [currentMilestone, setCurrentMilestone] = useState(0)
  const [courseData, setCourseData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchCourseWithProgress()
  }, [params.id, user, router])

  const fetchCourseWithProgress = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        console.log("No auth token found")
        router.push("/login")
        return
      }

      console.log("Fetching course with progress for:", params.id)

      const response = await fetch(`/api/courses/${params.id}/progress`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Response status:", response.status)

      if (response.status === 401) {
        console.log("Token expired, redirecting to login")
        localStorage.removeItem("authToken")
        router.push("/login")
        return
      }

      const data = await response.json()
      console.log("Course data received:", data)

      if (data.success) {
        setCourseData(data.course)

        // Set current milestone to first incomplete one
        const firstIncomplete = data.course.milestones.findIndex((m: any) => !m.isCompleted)
        if (firstIncomplete !== -1) {
          setCurrentMilestone(firstIncomplete)
        }
      } else {
        console.error("Failed to fetch course:", data.message)
        // If course not found, try fetching basic course info
        await fetchBasicCourse()
      }
    } catch (error) {
      console.error("Error fetching course:", error)
      await fetchBasicCourse()
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBasicCourse = async () => {
    try {
      console.log("Fetching basic course info for:", params.id)
      const response = await fetch(`/api/courses/${params.id}`)
      const data = await response.json()

      if (data.success) {
        setCourseData({ ...data.course, isPurchased: false })
      } else {
        console.error("Course not found")
      }
    } catch (error) {
      console.error("Error fetching basic course:", error)
    }
  }

  const handleMilestoneComplete = (milestoneIndex: number) => {
    console.log(`Milestone ${milestoneIndex} completed, updating course data`)
    setCourseData((prevData: any) => {
      const updatedMilestones = [...prevData.milestones]
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        isCompleted: true,
      }

      // Calculate new progress
      const completedCount = updatedMilestones.filter((m) => m.isCompleted).length
      const newProgress = (completedCount / updatedMilestones.length) * 100

      return {
        ...prevData,
        milestones: updatedMilestones,
        progress: newProgress,
      }
    })

    // Auto-advance to next milestone
    if (milestoneIndex < courseData.milestones.length - 1) {
      setTimeout(() => {
        setCurrentMilestone(milestoneIndex + 1)
      }, 1500)
    }
  }

  const handleEnrollment = async () => {
    if (isEnrolling) return

    setIsEnrolling(true)
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Please log in again")
        router.push("/login")
        return
      }

      console.log("Enrolling in course:", params.id)

      const response = await fetch(`/api/courses/${params.id}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("Enrollment response status:", response.status)

      if (response.status === 401) {
        alert("Session expired. Please log in again.")
        localStorage.removeItem("authToken")
        router.push("/login")
        return
      }

      const data = await response.json()
      console.log("Enrollment response:", data)

      if (data.success) {
        alert("Successfully enrolled in course!")
        // Refresh course data to show enrolled state
        await fetchCourseWithProgress()
      } else {
        alert(data.message || "Failed to enroll in course")
      }
    } catch (error) {
      console.error("Error enrolling in course:", error)
      alert("Failed to enroll in course")
    } finally {
      setIsEnrolling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-8">
            <div className="text-black">Loading course...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-8">
            <div className="text-red-600">Course not found</div>
            <Button onClick={() => router.push("/home")} className="mt-4">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const completedMilestones = courseData.milestones ? courseData.milestones.filter((m: any) => m.isCompleted).length : 0
  const totalMilestones = courseData.milestones ? courseData.milestones.length : 0

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Course Header */}
      <div className="bg-gray-50 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-black mb-4">{courseData.title}</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">{courseData.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge
                  variant={courseData.isFree ? "secondary" : "destructive"}
                  className={courseData.isFree ? "bg-gray-100 text-black" : "bg-red-600 text-white"}
                >
                  {courseData.isFree ? "Free" : `₹${courseData.price}`}
                </Badge>

                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {courseData.rating} ({courseData.students} students)
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Play className="w-4 h-4 mr-1" />
                  {courseData.duration}
                </div>
              </div>

              {courseData.isPurchased && totalMilestones > 0 && (
                <>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span>
                      Progress: {completedMilestones}/{totalMilestones} milestones completed (
                      {Math.round((completedMilestones / totalMilestones) * 100)}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Progress value={(completedMilestones / totalMilestones) * 100} className="h-2" />
                  </div>
                </>
              )}
            </div>

            {!courseData.isPurchased && (
              <div className="lg:w-80">
                <Card className={`border-2 ${courseData.isFree ? "border-green-500" : "border-red-500"}`}>
                  <CardHeader>
                    <CardTitle className="text-center text-black">
                      {courseData.isFree ? "Free Course" : "Enroll Now"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {!courseData.isFree && (
                      <div className="text-3xl font-bold text-red-600 mb-4">₹{courseData.price}</div>
                    )}
                    <Button
                      className={`w-full font-bold py-3 ${
                        courseData.isFree
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-red-600 hover:bg-red-700 text-white"
                      }`}
                      onClick={handleEnrollment}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? "Enrolling..." : courseData.isFree ? "Start Learning" : "Enroll in Course"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content with Sidebar */}
      {courseData.isPurchased && courseData.milestones && courseData.milestones.length > 0 && (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-6">
          {/* Sidebar - Milestone Navigation */}
          <div className="lg:w-80">
            <Card className="border-2 border-gray-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-black">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-2">
                    {courseData.milestones.map((milestone: any, index: number) => {
                      const isAccessible = index === 0 || courseData.milestones[index - 1].isCompleted

                      return (
                        <button
                          key={milestone.id}
                          onClick={() => setCurrentMilestone(index)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            currentMilestone === index
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          } ${!isAccessible ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isAccessible}
                        >
                          <div className="flex items-center">
                            {milestone.isCompleted ? (
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            ) : isAccessible ? (
                              <div className="w-4 h-4 mr-2 border-2 border-gray-300 rounded-full" />
                            ) : (
                              <Lock className="w-4 h-4 mr-2 text-gray-400" />
                            )}
                            <span className={`text-sm font-medium ${isAccessible ? "text-black" : "text-gray-400"}`}>
                              {milestone.title}
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">{courseData.milestones[currentMilestone]?.title}</h2>
                <p className="text-gray-600">Complete this milestone to progress through the course</p>
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-2">
                {currentMilestone > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentMilestone(currentMilestone - 1)}
                    className="border-2 border-gray-200 hover:border-red-500"
                  >
                    Previous
                  </Button>
                )}

                {currentMilestone < courseData.milestones.length - 1 &&
                  courseData.milestones[currentMilestone].isCompleted && (
                    <Button
                      onClick={() => setCurrentMilestone(currentMilestone + 1)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Next Milestone
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
              </div>
            </div>

            {courseData.milestones[currentMilestone] && (
              <MilestoneBlock
                milestone={courseData.milestones[currentMilestone]}
                isAccessible={currentMilestone === 0 || courseData.milestones[currentMilestone - 1].isCompleted}
                onMilestoneComplete={handleMilestoneComplete}
                milestoneIndex={currentMilestone}
                courseId={params.id}
              />
            )}
          </div>
        </div>
      )}

      {/* Show message if not enrolled */}
      {!courseData.isPurchased && (
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Enrollment Required</h3>
              <p className="text-gray-600 mb-6">You need to enroll in this course to access the content.</p>
              <Button onClick={handleEnrollment} disabled={isEnrolling}>
                {isEnrolling
                  ? "Enrolling..."
                  : courseData.isFree
                    ? "Enroll for Free"
                    : `Purchase for ₹${courseData.price}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
