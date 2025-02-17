"use client";

import React, { useState, useCallback, useEffect } from "react";
import { HelpCircle, Loader2, Mail, Phone, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/providers/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { LoadingState } from "@/components/(dashboard)/payment/PaymentSections";

export default function SupportPage() {
  const { userDetails, loading } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    issueType: "",
    message: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (userDetails?.personalDetails) {
      const { fullName: fullName, email: userEmail } =
        userDetails.personalDetails;
      setName(fullName);
      setEmail(userEmail);
    }
  }, [userDetails]);

  const handleIssueTypeChange = (value: string) => {
    setIssueType(value);
    setFormErrors((prev) => ({ ...prev, issueType: "" }));
  };

  const phoneNumber = "+977 9862785168";
  const contactEmail = "sayoushstark@gmail.com";

  const resetForm = useCallback(() => {
    if (userDetails?.personalDetails) {
      const { fullName: fullName, email: userEmail } =
        userDetails.personalDetails;
      setName(fullName);
      setEmail(userEmail);
    } else {
      setName("");
      setEmail("");
    }
    setIssueType("");
    setMessage("");
    setFormErrors({
      name: "",
      email: "",
      issueType: "",
      message: "",
    });
  }, [userDetails]);

  const validateForm = () => {
    const errors = {
      name: !name ? "Name is required" : "",
      email: !email ? "Email is required" : "",
      issueType: !issueType ? "Issue type is required" : "",
      message: !message ? "Message is required" : "",
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://us-central1-homeinsight-prod.cloudfunctions.net/handleSupportMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            topic: issueType,
            message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Message Sent Successfully",
          description:
            "Our team will prioritize your request and respond soon.",
          duration: 5000,
        });
        resetForm();
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Submission Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-10 grid md:grid-cols-[2fr_1fr] gap-6 sm:gap-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" /> Support
          Center
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
          Got a question or issue? Our team is here to help you quickly and
          effectively.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Your full name"
                required
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="Your contact email"
                required
              />
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueType">Issue Type</Label>
            <Select value={issueType} onValueChange={handleIssueTypeChange}>
              <SelectTrigger
                className={formErrors.issueType ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.issueType && (
              <p className="text-xs text-destructive">{formErrors.issueType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Message">Message</Label>
            <Textarea
              id="Message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setFormErrors((prev) => ({ ...prev, message: "" }));
              }}
              placeholder="Provide detailed information about your issue"
              className="min-h-32 sm:min-h-48"
              required
            />
            {formErrors.message && (
              <p className="text-xs text-destructive">{formErrors.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            variant={isSubmitting ? "outline" : "default"}
          >
            {isSubmitting ? "Sending..." : "Submit Support Request"}
          </Button>
        </form>
      </div>

      <div>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" /> Quick Support Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{phoneNumber}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  (window.location.href = `tel:${phoneNumber.replace(
                    /\D/g,
                    ""
                  )}`)
                }
              >
                Call
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contactEmail}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  (window.location.href = `mailto:${contactEmail}`)
                }
              >
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
