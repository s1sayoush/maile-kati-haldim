"use client";

import { useState } from "react";
import AddPlayersPage from "./AddPlayersPage";
import AddItemsPage from "./AddItemsPage";
import ConfirmSummaryPage from "./ConfirmSummaryPage";

const BillSplitterWrapper = () => {
  const [step, setStep] = useState<number>(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div>
      {step === 1 && <AddPlayersPage onNext={nextStep} />}
      {step === 2 && <AddItemsPage onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <ConfirmSummaryPage onBack={prevStep} />}
    </div>
  );
};

export default BillSplitterWrapper;
