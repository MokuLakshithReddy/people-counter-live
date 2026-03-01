import { useRef, useEffect, useCallback, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface WebcamDetectorProps {
  onCountChange: (count: number) => void;
}

const WebcamDetector = ({ onCountChange }: WebcamDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const animFrameRef = useRef<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }, []);

  const detect = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const model = modelRef.current;

    if (!video || !canvas || !model || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(detect);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const predictions = await model.detect(video);
    const people = predictions.filter(
      (p: Detection) => p.class === "person" && p.score > 0.5
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    people.forEach((person: Detection) => {
      const [x, y, w, h] = person.bbox;
      ctx.strokeStyle = "hsl(185, 70%, 50%)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Confidence label
      ctx.fillStyle = "hsl(185, 70%, 50%)";
      const labelH = 20;
      ctx.fillRect(x, y - labelH, w, labelH);
      ctx.fillStyle = "#000";
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillText(
        `${Math.round(person.score * 100)}%`,
        x + 4,
        y - 5
      );
    });

    onCountChange(people.length);
    animFrameRef.current = requestAnimationFrame(detect);
  }, [onCountChange]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await tf.ready();
      const model = await cocoSsd.load();
      if (mounted) {
        modelRef.current = model;
        await startWebcam();
        setLoading(false);
        detect();
      }
    };

    init();

    return () => {
      mounted = false;
      cancelAnimationFrame(animFrameRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, [startWebcam, detect]);

  return (
    <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden glow-primary">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-card">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-mono">
            Loading COCO-SSD model…
          </p>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-card">
          <p className="text-sm text-destructive font-mono px-4 text-center">
            {error}
          </p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default WebcamDetector;
