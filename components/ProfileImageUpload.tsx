"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Button from "./ui/Button";
import { Loader2, Upload, X, ZoomIn, ZoomOut } from "lucide-react"; // Added Zoom icons
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/api";

const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

function getRadianAngle(degreeValue: number) {
    return (degreeValue * Math.PI) / 180;
}

/**
 * Encapsulate the canvas drawing logic
 */
async function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number; y: number; width: number; height: number },
    rotation = 0
): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("No 2d context");
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                resolve(file);
            } else {
                reject(new Error("Canvas is empty"));
            }
        }, "image/jpeg");
    });
}

export default function ProfileImageUpload({ currentImage, onImageUpdated }: { currentImage?: string | null, onImageUpdated: (url: string) => void }) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false); // New State
    const { user } = useAuth();

    // Reset error on image change
    useState(() => {
        setImageError(false);
    });

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
        }
    };

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels || !user) return;
        try {
            setLoading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Upload to backend
            const formData = new FormData();
            formData.append("image", croppedImageBlob, "profile.jpg");

            const response = await fetch(`${API_URL}/users/${user.uid}/profile-picture`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Upload failed");
            }


            const data = await response.json();
            console.log("Upload response:", data); // Debug log
            if (data.photoURL) {
                onImageUpdated(data.photoURL);
                setImageSrc(null); // Close modal
            }
        } catch (e) {
            console.error(e);
            alert("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 cursor-pointer">
                {currentImage ? (
                    <img src={currentImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                )}

                {/* Overlay on hover */}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="text-white w-6 h-6" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
            </div>

            {/* Cropper Modal - Custom Implementation */}
            {imageSrc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#0a0a0a] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                            <h3 className="text-lg font-bold text-white">Edit Profile Picture</h3>
                            <button onClick={() => setImageSrc(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative h-80 w-full bg-black">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round"
                                showGrid={false}
                            />
                        </div>

                        <div className="p-6 space-y-6 bg-[#0a0a0a]">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><ZoomOut className="w-3 h-3" /> Zoom Out</span>
                                    <span className="flex items-center gap-1">Zoom In <ZoomIn className="w-3 h-3" /></span>
                                </div>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setImageSrc(null)}
                                    disabled={loading}
                                    size="sm"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    isLoading={loading}
                                    size="sm"
                                >
                                    Save Picture
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
