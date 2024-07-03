import { User2 } from "lucide-react";
import Image from "next/image";
import { FaUser } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa6";


export default function ChatAvatar({ role }: { role: string }) {
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        <User2 className="h-4 w-4" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md shadow">
      <FaRobot className="h-5 w-5" />
    </div>
  );
}
