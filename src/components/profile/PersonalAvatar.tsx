import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { getInitials } from "@/lib/utils";

interface ProfileAvatarProps {
  profileImage: string;
  fullName: string;
  isEditing: boolean;
  onImageClick: () => void;
}

export const ProfileAvatar = ({
  profileImage,
  fullName,
  isEditing,
  onImageClick,
}: ProfileAvatarProps) => {
  // const getInitials = (fullName: string) => {
  //   const [firstName, lastName] = fullName?.split(" ");
  //   return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  // };

  const initials = getInitials(fullName);

  const handleClick = () => {
    if (!isEditing) {
      toast({
        title: "Edit Mode Required",
        description: "Please enable edit mode to change your profile picture",
        variant: "destructive",
      });
      return;
    }
    onImageClick();
  };
  console.log("profileImage", profileImage);

  return (
    <Avatar
      className={`h-24 w-24 ${isEditing ? "cursor-pointer" : ""}`}
      onClick={handleClick}
    >
      <AvatarImage
        src={profileImage}
        alt={fullName}
        className="object-top object-cover "
      />
      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
    </Avatar>
  );
};
