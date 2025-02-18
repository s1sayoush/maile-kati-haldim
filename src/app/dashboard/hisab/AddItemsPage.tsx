import { useState } from "react";
import { useStore } from "@/app/store/useFormStore";

const AddItemsPage = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [itemName, setItemName] = useState<string>("");
  const [totalCost, setTotalCost] = useState<number>(0);
  const players = useStore((state) => state.players);
  const addItem = useStore((state) => state.addItem);

  const handleAddItem = () => {
    if (itemName && totalCost > 0 && players.length > 0) {
      const contributions = players.map((player) => ({
        personId: player.uid,
        amount: totalCost / players.length, // Equal split for simplicity
      }));

      const splits = players.map((player) => ({
        personId: player.uid,
        shouldPay: true,
      }));

      addItem({
        id: Math.random().toString(36).substring(7), // Generate a random ID
        name: itemName,
        totalCost,
        contributions,
        splits,
      });

      setItemName("");
      setTotalCost(0);
    }
  };

  return (
    <div>
      <h1>Add Items</h1>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Total Cost"
        value={totalCost}
        onChange={(e) => setTotalCost(Number(e.target.value))}
      />
      <button onClick={handleAddItem}>Add Item</button>
      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default AddItemsPage;
