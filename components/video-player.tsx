"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Maximize, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

interface VideoPlayerProps {
  src: string
  className?: string
  onVideoComplete?: () => void
  onProgress?: (progress: number) => void
}

export function VideoPlayer({ src, className = "", onVideoComplete, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [watchedPercentage, setWatchedPercentage] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      const current = video.currentTime
      const total = video.duration
      setCurrentTime(current)

      if (total > 0) {
        const percentage = (current / total) * 100
        setWatchedPercentage(percentage)
        onProgress?.(percentage)
      }
    }

    const updateDuration = () => {
      setDuration(video.duration)
      setIsLoading(false)
      setHasError(false)
    }

    const handleVideoEnd = () => {
      console.log("Video ended - triggering completion")
      setIsCompleted(true)
      setIsPlaying(false)
      onVideoComplete?.()
    }

    const handleVideoPlay = () => {
      setIsPlaying(true)
      setHasError(false)
    }

    const handleVideoPause = () => {
      setIsPlaying(false)
    }

    const handleVideoError = (e: Event) => {
      const target = e.target as HTMLVideoElement
      const error = target.error
      console.error("Video error:", error)

      setHasError(true)
      setIsLoading(false)
      setIsPlaying(false)

      if (error) {
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            setErrorMessage("Video playback was aborted")
            break
          case error.MEDIA_ERR_NETWORK:
            setErrorMessage("Network error occurred while loading video")
            break
          case error.MEDIA_ERR_DECODE:
            setErrorMessage("Video decoding error")
            break
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            setErrorMessage("Video format not supported or source not found")
            break
          default:
            setErrorMessage("Unknown video error occurred")
        }
      }
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    // Add event listeners
    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleVideoEnd)
    video.addEventListener("play", handleVideoPlay)
    video.addEventListener("pause", handleVideoPause)
    video.addEventListener("error", handleVideoError)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("loadstart", handleLoadStart)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleVideoEnd)
      video.removeEventListener("play", handleVideoPlay)
      video.removeEventListener("pause", handleVideoPause)
      video.removeEventListener("error", handleVideoError)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("loadstart", handleLoadStart)
    }
  }, [onVideoComplete, onProgress])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video || hasError) return

    try {
      if (isPlaying) {
        video.pause()
      } else {
        await video.play()
      }
    } catch (error) {
      console.error("Play error:", error)
      setHasError(true)
      setErrorMessage("Failed to play video")
    }
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video || hasError) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
  }

  const changePlaybackRate = () => {
    const video = videoRef.current
    if (!video || hasError) return

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]

    video.playbackRate = nextRate
    setPlaybackRate(nextRate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video || hasError) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const retryVideo = () => {
    const video = videoRef.current
    if (!video) return

    setHasError(false)
    setIsLoading(true)
    setErrorMessage("")
    video.load()
  }

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto"
        onClick={togglePlay}
        crossOrigin="anonymous"
        preload="metadata"
      />

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p>Loading video...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-center p-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Video Error</h3>
            <p className="text-sm text-gray-300 mb-4">{errorMessage}</p>
            <Button onClick={retryVideo} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Video Completion Indicator */}
      {isCompleted && !hasError && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full flex items-center text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-1" />
          Completed
        </div>
      )}

      {/* Progress Indicator */}
      {!hasError && !isLoading && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {Math.round(watchedPercentage)}% watched
        </div>
      )}

      {/* Controls Overlay */}
      {!hasError && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full [&_[role=slider]]:bg-red-600 [&_[role=slider]]:border-red-600"
              disabled={isLoading}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:text-red-500 p-2"
                disabled={isLoading}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white" />
                <Slider
                  value={[volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-20 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:border-red-600"
                  disabled={isLoading}
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={changePlaybackRate}
                className="text-white hover:text-red-500 text-xs px-2"
                disabled={isLoading}
              >
                {playbackRate}x
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:text-red-500 p-2"
                disabled={isLoading}
              >
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
