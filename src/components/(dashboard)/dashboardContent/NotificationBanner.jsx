"use client";
import React, { useState } from "react";
import { Router, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NotificationBanner = ({
  message = "New features available!",
  link = "/",
  variant = "default",
  className = "",
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  const handleClose = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleClick = () => {
    router.push(link);
  };

  if (!isVisible) return null;

  const variantStyles = {
    default: "bg-background border-border",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 z-10 transform transition-all border-b ",
        variantStyles[variant],
        className
      )}
      style={{
        marginBottom: "96px",
      }}
    >
      <div
        onClick={handleClick}
        className="cursor-pointer px-4 py-3 flex items-center justify-between max-w-screen-xl mx-auto"
      >
        <span className="text-sm">{message}</span>
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NotificationBanner;
