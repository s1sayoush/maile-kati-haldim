import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const ConfirmationModal: React.FC<any | null> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  const [confirmations, setConfirmations] = React.useState({
    reviewedDetails: false,
    acceptedPrivacy: false,
    understoodTerms: false,
  });

  const allConfirmed = Object.values(confirmations).every((value) => value);

  const updateConfirmation = (key: any) => {
    setConfirmations((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-5xl h-[75vh]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">
            Final Review & Confirmation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Please review the following before creating the lease:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="h-[50vh] rounded-md border p-4">
          <div className="space-y-6">
            {/* Privacy Policy Section */}
            <div>
              <h3 className="font-semibold mb-2">Privacy Policy</h3>
              <div className="text-sm text-muted-foreground">
                <p className="mb-2">
                  By creating this lease, you agree that the information
                  provided will be processed in accordance with our Privacy
                  Policy. We collect and store personal information necessary
                  for lease management, including but not limited to contact
                  details, payment information, and rental history.
                </p>
                <p>
                  Nullam lacinia ex elit, vel cursus nisl tempor nec. Sed
                  vehicula massa id nunc tincidunt, in facilisis nunc hendrerit.
                  Maecenas varius dolor in ligula finibus, non facilisis neque
                  tincidunt.
                </p>
              </div>
            </div>

            {/* Terms and Agreement Section */}
            <div>
              <h3 className="font-semibold mb-2">Terms and Agreement</h3>
              <div className="text-sm text-muted-foreground space-y-4">
                <div>
                  <h4 className="font-medium mb-1">1. General Provisions</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas dictum, urna ut suscipit pharetra, nunc ligula
                    tincidunt justo, vel fringilla mi nisl eget odio. Proin non
                    magna at nisl varius aliquam. Vestibulum ante ipsum primis
                    in faucibus orci luctus et ultrices posuere cubilia curae.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">2. Lease Terms</h4>
                  <p>
                    Suspendisse potenti. Donec id velit vel felis pretium luctus
                    in sit amet ex. Sed ac libero nec felis consectetur
                    malesuada id nec erat. Phasellus vehicula, lorem non
                    malesuada varius, orci nulla tincidunt lectus, et fermentum
                    metus erat non ligula. Nullam euismod magna at risus
                    efficitur, eu varius nunc facilisis.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">3. Payment Terms</h4>
                  <p>
                    Curabitur pretium, odio in vestibulum suscipit, urna sapien
                    malesuada mi, in porta lorem justo nec est. Sed in dapibus
                    eros, nec accumsan sem. Praesent fermentum consequat velit,
                    nec scelerisque odio lobortis eget. Integer ultricies magna
                    vel augue ullamcorper, in tempor augue ultricies.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">
                    4. Maintenance and Repairs
                  </h4>
                  <p>
                    Fusce vehicula dolor arcu, sit amet blandit dolor mollis
                    nec. Donec viverra eleifend lacus, vitae ullamcorper metus.
                    Sed sollicitudin ipsum quis nunc sollicitudin ultrices.
                    Donec euismod scelerisque ligula. Maecenas eu varius risus,
                    eu aliquet arcu.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">5. Security Deposit</h4>
                  <p>
                    Etiam mollis sem sed bibendum blandit. Aenean quis luctus
                    ligula, vitae suscipit sem. Curabitur ornare porta elit at
                    ultricies. Nullam maximus erat sed lectus ultricies, vel
                    ultricies nunc ultricies. Sed euismod felis sit amet ipsum
                    blandit, at suscipit lorem efficitur.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">6. Termination</h4>
                  <p>
                    Vestibulum ante ipsum primis in faucibus orci luctus et
                    ultrices posuere cubilia Curae; Sed aliquam, nisi quis
                    porttitor congue, elit erat euismod orci, ac placerat dolor
                    lectus quis orci. Phasellus consectetuer vestibulum elit.
                    Aenean tellus metus, bibendum sed, posuere ac, mattis non.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-1">7. Governing Law</h4>
                  <p>
                    Integer tincidunt. Cras dapibus. Vivamus elementum semper
                    nisi. Aenean vulputate eleifend tellus. Aenean leo ligula,
                    porttitor eu, consequat vitae, eleifend ac, enim. Aliquam
                    lorem ante, dapibus in, viverra quis, feugiat a, tellus.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmations */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reviewedDetails"
                  checked={confirmations.reviewedDetails}
                  onCheckedChange={() => updateConfirmation("reviewedDetails")}
                />
                <label htmlFor="reviewedDetails" className="text-sm">
                  I have reviewed all lease details and confirm they are
                  accurate
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptedPrivacy"
                  checked={confirmations.acceptedPrivacy}
                  onCheckedChange={() => updateConfirmation("acceptedPrivacy")}
                />
                <label htmlFor="acceptedPrivacy" className="text-sm">
                  I have read and accept the Privacy Policy
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="understoodTerms"
                  checked={confirmations.understoodTerms}
                  onCheckedChange={() => updateConfirmation("understoodTerms")}
                />
                <label htmlFor="understoodTerms" className="text-sm">
                  I understand that this will create a legally binding lease
                  agreement
                </label>
              </div>
            </div>
          </div>
        </ScrollArea>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!allConfirmed}
            className={!allConfirmed ? "opacity-50 cursor-not-allowed" : ""}
          >
            Create Lease
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
