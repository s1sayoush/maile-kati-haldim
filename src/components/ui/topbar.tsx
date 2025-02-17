"use client";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onLogout: () => void;
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout, title }) => {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-4 shadow-md">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div>
        <Button onClick={onLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default TopBar;
