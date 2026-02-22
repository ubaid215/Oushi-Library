"use client";

import { Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function ShareButton({ title, text, url, className = "btn btn--outline", style }: ShareButtonProps) {
    const handleShare = async () => {
        const shareData = {
            title,
            text,
            url: url || window.location.href, // Fallback to current URL if not provided explicitly
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("Error sharing:", err);
                    toast.error("Failed to share.");
                }
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                toast.success("Link copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
                toast.error("Sharing is not supported on this browser.");
            }
        }
    };

    return (
        <button type="button" onClick={handleShare} className={className} style={style}>
            <Share2 size={18} />
            Share
        </button>
    );
}
