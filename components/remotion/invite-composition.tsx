"use client"

// This would be your Remotion composition for video export
// Note: This is a simplified version - full Remotion integration would require additional setup

import { useEffect, useRef } from "react"

interface InviteCompositionProps {
  data: any
  onRender?: (canvas: HTMLCanvasElement) => void
}

export default function InviteComposition({ data, onRender }: InviteCompositionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 1920
    canvas.height = 1080

    // Clear canvas
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw background if available
    if (data.theme.preview) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawOverlay()
      }
      img.src = data.theme.preview
    } else {
      drawOverlay()
    }

    function drawOverlay() {
      // Draw gradient overlay
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.6, 0, canvas.height)
      gradient.addColorStop(0, "rgba(0,0,0,0)")
      gradient.addColorStop(1, "rgba(0,0,0,0.8)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw text content
      ctx.fillStyle = "white"
      ctx.font = "bold 72px Arial"
      ctx.fillText(data.eventName || "Event Name", 80, canvas.height - 200)

      ctx.font = "36px Arial"
      if (data.startDate) {
        const dateStr = new Date(data.startDate).toLocaleDateString()
        ctx.fillText(dateStr, 80, canvas.height - 140)
      }

      ctx.font = "28px Arial"
      ctx.fillText(`Capacity: ${data.capacity}`, 80, canvas.height - 80)

      if (onRender) {
        onRender(canvas)
      }
    }
  }, [data, onRender])

  return (
    <canvas ref={canvasRef} className="w-full h-auto border rounded-lg" style={{ maxWidth: "100%", height: "auto" }} />
  )
}
