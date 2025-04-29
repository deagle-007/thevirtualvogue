"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Camera,
  ArrowLeft,
  RefreshCcw,
  Users,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedNavbar from "@/components/global/protectednavbar";
import "../../styles/globals.css";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import Loader from "@/components/loader";
import { useAppStore } from "@/zustand/store";
import { useRouter, useSearchParams } from "next/navigation";

const UploadFit = () => {
  const { setHumanImage } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const gender = searchParams.get("slug")?.toLowerCase();
  const category = searchParams.get("category")?.toLowerCase();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [modelImages, setModelImages] = useState<string[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isMobile, setIsMobile] = useState(false);
  const lastTapRef = useRef<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (showCamera) startCamera();
    return () => stopCamera();
  }, [showCamera]);

  useEffect(() => {
    if (gender && category) {
      setModelImages(
        gender === "male"
          ? ["/models/image1.jpg", "/models/image2.jpg", "/models/image3.jpg"]
          : ["/models/image4.jpg", "/models/image5.jpg", "/models/image6.jpg"]
      );
    }
  }, [gender, category]);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent || navigator.vendor;
      setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));
    }
  }, []);

  useEffect(() => {
    if (showCamera) startCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        videoRef.current.onloadedmetadata = () => videoRef.current?.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const toggleCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    stopCamera();
    setFacingMode(newMode);
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const handleImageSelect = (imageData: string) => {
    if (!gender || !category) return alert("Missing gender or category.");
    fetch(imageData)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "human-image.jpg", { type: blob.type });
        setHumanImage(file);
        router.push(`/final-image?slug=${gender}&category=${category}`);
      })
      .catch(console.error);
  };

  const handleContinue = () => {
    if (selectedImage) handleImageSelect(selectedImage);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    if (facingMode === "user") {
      ctx.translate(width, 0);
      ctx.scale(-1, 1); // Mirror only front camera
    }
    ctx.drawImage(video, 0, 0, width, height);
    ctx.restore();

    const dataURL = canvas.toDataURL("image/jpeg", 1.0); // Highest quality
    setSelectedImage(dataURL);
    stopCamera();
    setShowCamera(false);
  };

  const takePhotoWithTimer = () => {
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          takePhoto();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const { isLoading } = useProtectedRoute();
  if (isLoading) return <Loader />;

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <ProtectedNavbar />
      <div className="container mx-auto px-4 mt-2 flex justify-center">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-800 hover:text-gray-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-lg font-bold tracking-wider bebas-font">
            Go Back
          </span>
        </button>
      </div>

      <div className="container mx-auto px-4 pt-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-[#D9D9D9] rounded-3xl p-6 shadow-lg">
          {showCamera ? (
            <div
              className="relative w-[260px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden"
              onTouchStart={() => {
                const now = Date.now();
                if (now - lastTapRef.current < 300) {
                  toggleCamera();
                }
                lastTapRef.current = now;
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${
                  facingMode === "user" ? "transform scale-x-[-1]" : ""
                }`}
              />
              {isMobile && (
                <div className="absolute bottom-16 w-full text-center text-xs text-white opacity-70">
                  Double Tap to Switch Camera
                </div>
              )}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="text-white text-5xl font-bold">
                    {countdown}
                  </div>
                </div>
              )}
              <Button
                onClick={takePhotoWithTimer}
                disabled={countdown !== null}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bebas-font"
              >
                {countdown !== null ? "Adjust yourself..." : "Take Photo"}
              </Button>
            </div>
          ) : selectedImage ? (
            <div className="flex flex-col items-center space-y-4">
              <Image
                src={selectedImage}
                alt="Preview"
                width={280}
                height={420}
                className="rounded-xl w-full max-w-[280px] object-contain"
              />
              <Button
                onClick={() => {
                  setSelectedImage(null);
                  setShowCamera(false);
                }}
                className="flex gap-2 items-center bg-black text-white w-full"
              >
                <RefreshCcw className="w-4 h-4" />
                Change Photo
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedImage}
                className="flex gap-2 items-center bg-black text-white w-full disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6 text-center bg-[#e6e6e6] p-6 rounded-xl">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition"
              >
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="font-medium bebas-font">Upload your picture</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="text-gray-500">OR</p>
              <Button
                variant="outline"
                onClick={() => setShowCamera(true)}
                className="w-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take a picture
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowModelPopup(true)}
                className="w-full mt-2"
              >
                <Users className="w-5 h-5 mr-2" />
                Choose Example Model
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Model Picker */}
      {showModelPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-xl relative">
            <button
              onClick={() => setShowModelPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X />
            </button>
            <h2 className="text-center font-bold text-lg mb-4">
              Choose a Model
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {modelImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Model ${idx + 1}`}
                  width={200}
                  height={300}
                  className="rounded-2xl cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110 shadow-md"
                  onClick={() => {
                    setSelectedImage(img);
                    setShowModelPopup(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SuspenseWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <UploadFit />
  </Suspense>
);

export default SuspenseWrapper;
