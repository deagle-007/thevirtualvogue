import React, { useState, useRef } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const handleDownload = async (outputImage: string, zoomLevel: number, imageRef: React.RefObject<HTMLImageElement>) => {
  if (!outputImage || !imageRef.current) return;

  try {
    // Create a canvas to draw the zoomed image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    const img = imageRef.current;
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;

    // Set canvas size to the zoomed dimensions
    canvas.width = originalWidth * zoomLevel;
    canvas.height = originalHeight * zoomLevel;

    // Draw the image on the canvas with the zoom scale
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Failed to create blob");

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = "generated-outfit-zoomed.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading the zoomed image:", error);
    alert("Failed to download the zoomed image. Please try again.");
  }
};

const OutputImageDialog = ({ outputImage, setOutputImage }: { outputImage: string | null; setOutputImage: (value: string | null) => void }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageRef = useRef<any>(null);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // Max zoom 3x
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev + 0.1, 3));
    } else {
      setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
    }
  };

  return (
    <Dialog open={!!outputImage} onOpenChange={(isOpen) => !isOpen && setOutputImage(null)}>
      <DialogContent style={{ borderRadius: "20px" }} className="max-w-lg bg-white shadow-lg p-6">
        <DialogTitle>
          <p className="text-2xl font-bold tracking-wider bebas-font text-center text-gray-800">🎉 Voilà! Your Perfect Fit</p>
        </DialogTitle>

        {/* Image Preview with Zoom */}
        <div className="relative flex items-center justify-center mt-4 overflow-hidden" onWheel={handleWheel}>
          {outputImage && (
            <img
              ref={imageRef}
              className="w-[260px] h-[320px] object-contain rounded-lg shadow-md border border-gray-200 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
              src={outputImage}
              alt="Generated Outfit"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          {/* Zoom Controls */}
          <Button
            onClick={handleZoomOut}
            className="bg-gray-500 text-white hover:bg-gray-600 transition-all px-4 py-2 rounded-lg shadow-md"
            disabled={zoomLevel <= 0.5}
          >
            ➖ Zoom Out
          </Button>
          <Button
            onClick={handleZoomIn}
            className="bg-gray-500 text-white hover:bg-gray-600 transition-all px-4 py-2 rounded-lg shadow-md"
            disabled={zoomLevel >= 3}
          >
            ➕ Zoom In
          </Button>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          {outputImage && (
            <Button
              onClick={() => handleDownload(outputImage, zoomLevel, imageRef)}
              className="bg-green-600 text-white hover:bg-green-700 transition-all px-6 py-2 rounded-lg shadow-md"
            >
              ⬇️ Download Image
            </Button>
          )}
          <DialogClose asChild>
            <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-all px-6 py-2 rounded-lg shadow-md">❌ Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutputImageDialog;
