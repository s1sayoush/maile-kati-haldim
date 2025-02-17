import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full bg-zinc-100 p-0 dark:bg-zinc-700 transition-colors duration-200"
    >
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200
          ${theme === "dark" ? "rotate-0" : "rotate-0"}`}
      >
        <Sun
          className={`h-5 w-5 absolute transition-all duration-200
            ${
              theme === "dark"
                ? "opacity-0 scale-0"
                : "opacity-100 scale-100 text-yellow-500"
            }`}
        />
        <Moon
          className={`h-5 w-5 absolute transition-all duration-200
            ${
              theme === "dark"
                ? "opacity-100 scale-100 text-blue-500"
                : "opacity-0 scale-0"
            }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
