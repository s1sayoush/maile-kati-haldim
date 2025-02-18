import { useState } from "react";
import { useStore } from "@/app/store/useFormStore";

const AddPlayersPage = ({ onNext }: { onNext: () => void }) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const addPlayer = useStore((state) => state.addPlayer);

  const handleAddPlayer = () => {
    if (name && email) {
      addPlayer({
        personalDetails: { fullName: name, email },
        createdAt: new Date(),
        profileCompleted: true,
        uid: Math.random().toString(36).substring(7), // Generate a random ID
      });
      setName("");
      setEmail("");
    }
  };

  return (
    <div>
      <h1>Add Players</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddPlayer}>Add Player</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default AddPlayersPage;
