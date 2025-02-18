import { useEffect } from "react";
import { useStore } from "@/app/store/useFormStore";

const ConfirmSummaryPage = ({ onBack }: { onBack: () => void }) => {
  const billSummary = useStore((state) => state.billSummary);
  const calculateBillSummary = useStore((state) => state.calculateBillSummary);
  const players = useStore((state) => state.players);

  useEffect(() => {
    calculateBillSummary();
  }, [calculateBillSummary]);

  if (!billSummary) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bill Summary</h1>
      <p>Total Amount: {billSummary.totalAmount}</p>
      <h2>Per Person Breakdown</h2>
      <ul>
        {billSummary.perPersonBreakdown.map((breakdown) => {
          const player = players.find((p) => p.uid === breakdown.personId);
          return (
            <li key={breakdown.personId}>
              <strong>{player?.personalDetails.fullName}</strong>
              <p>Paid: {breakdown.paid}</p>
              <p>Should Pay: {breakdown.shouldPay}</p>
              <p>Net Amount: {breakdown.netAmount}</p>
            </li>
          );
        })}
      </ul>
      <button onClick={onBack}>Back</button>
      <button onClick={() => alert("Bill confirmed!")}>Confirm</button>
    </div>
  );
};

export default ConfirmSummaryPage;
