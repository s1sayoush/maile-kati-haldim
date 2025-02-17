"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Phone, Trash } from "lucide-react";
import { useUser } from "@/providers/UserContext";
import { uploadImageToStorage } from "@/firebase/storage";
import { saveUserDetails } from "@/firebase/user";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { Camera } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/firebase/auth";
import { ProfileAvatar } from "./PersonalAvatar";
import { PersonalInfoForm } from "./PersonalInformation";
import { DeleteAccountDialog } from "./DeleteAccountDialog";

export default function Profile() {
  const router = useRouter();
  const { userDetails, refreshUserDetails } = useUser();
  const { uid } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [password, setPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullName: "",
    profileImage: "",
  });

  useEffect(() => {
    if (userDetails?.personalDetails) {
      setFormData((prev) => ({
        ...prev,
        ...userDetails.personalDetails,
      }));
    }
  }, [userDetails]);

  const handleCameraPermissions = async () => {
    if (!Capacitor.isNativePlatform()) return true;

    try {
      const permissionStatus = await Camera.checkPermissions();
      if (permissionStatus.photos === "granted") return true;

      const requestStatus = await Camera.requestPermissions({
        permissions: ["photos"],
      });
      return requestStatus.photos === "granted";
    } catch (error) {
      console.error("Error with camera permissions:", error);
      return false;
    }
  };

  const handleAvatarClick = async () => {
    const hasPermission = await handleCameraPermissions();
    if (!hasPermission) {
      toast({
        title: "Permission Required",
        description:
          "Photo library access is required to change your profile picture",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !uid) return;

    try {
      setIsLoading(true);
      const file = e.target.files[0];
      const imagePath = `profilePictures/${uid}/${file.name}`;
      const imageUrl = await uploadImageToStorage(file, imagePath);
      const updatedData = {
        ...formData,
        profileImage: imageUrl,
      };

      await saveUserDetails(uid, {
        personalDetails: updatedData,
      });

      setFormData(updatedData);
      await refreshUserDetails(); // Refresh user details after update

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!uid) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await saveUserDetails(uid, {
        personalDetails: formData,
      });
      await refreshUserDetails(); // Refresh user details after update
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error saving user details:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userDetails) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          {/* <Circles
            height="60"
            width="60"
            color="hsl(var(--primary))"
            visible={true}
          /> */}
          <Loader2 />
        </div>
      </div>
    );
  }

  const handleDeleteAccount = async () => {
    if (!uid || !formData.email) return;

    try {
      setIsLoading(true);

      const result = await deleteUser(uid, formData.email, password);
      console.log("Delete result:", result);

      if (result.success) {
        toast({
          title: "Account Deleted",
          variant: "default",
          description: "Your account has been successfully deleted",
        });
        router.push("/auth/login");
      } else {
        toast({
          title: "Failed",
          variant: "destructive",
          description:
            "Failed to delete account. Please check your password and try again",
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Failed",
        variant: "destructive",
        description: "An Error occured while deleting your account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDeleteDialog = () => {
    setShowDeleteDialog(false);
    setPassword("");
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ProfileAvatar
                profileImage={formData.profileImage}
                fullName={formData.fullName}
                isEditing={isEditing}
                onImageClick={handleAvatarClick}
              />
              <input
                title="upload image"
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">
                      {formData.fullName}
                    </CardTitle>
                    <CardDescription>{formData.email}</CardDescription>
                  </div>

                  <div className="flex gap-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={isLoading}
                      className="flex-1 text-sm px-3 py-1"
                    >
                      <Pencil className="h-3 w-3 mr-2" />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                      disabled={isLoading}
                      className="flex-1 text-sm px-3 py-1"
                    >
                      <Trash className="h-3 w-3 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline">
                    <Phone size={10} className="mr-2" />
                    {formData.phone}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <PersonalInfoForm
          formData={formData}
          isEditing={isEditing}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSave={handleSave}
        />

        <DeleteAccountDialog
          open={showDeleteDialog}
          onOpenChange={resetDeleteDialog}
          password={password}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onDelete={handleDeleteAccount}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
