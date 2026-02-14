"use client";

export default function HeroVideo() {
    return (
        <video
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            autoPlay
            loop
            muted
            playsInline
        >
            <source src="/Dynamic_Sneaker_Video_Generation.mp4" type="video/mp4" />
        </video>
    );
}
