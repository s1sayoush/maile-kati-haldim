import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonalDetails } from "@/types/hisab";

interface PersonalInfoFormProps {
  formData: PersonalDetails;
  isEditing: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

export const PersonalInfoForm = ({
  formData,
  isEditing,
  isLoading,
  onInputChange,
  onSave,
}: PersonalInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "fullName", label: "Full Name" },
            { id: "email", label: "Email", type: "email" },
            { id: "phone", label: "Phone" },
          ].map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type={field.type || "text"}
                value={formData[field.id as keyof typeof formData]}
                onChange={onInputChange}
                disabled={!isEditing || isLoading || field.id === "email"}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <Button
          className="w-full sm:w-auto sm:ml-auto"
          disabled={!isEditing || isLoading}
          onClick={onSave}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};
