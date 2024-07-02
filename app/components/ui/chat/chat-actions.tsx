import { PauseCircle, RefreshCw } from "lucide-react";

import { Button } from "../button";
import { ChatHandler } from "./chat.interface";

export default function ChatActions(
  props: Pick<ChatHandler, "stop" | "reload"> & {
    showReload?: boolean;
    showStop?: boolean;
  },
) {
  return (
    <div className="space-x-4">
      {props.showStop && (
        <Button variant="outline" size="sm" onClick={props.stop}>
          <PauseCircle className="lg:mr-2 h-4 w-4 text-blue-500 font-bold" />
          <div className="hidden lg:block md:block font-bold">Stop answering</div>
        </Button>
      )}
      {props.showReload && (
        <Button variant="outline" size="sm" onClick={props.reload}>
          <RefreshCw className="lg:mr-2 h-4 w-4 text-blue-500 font-bold" />
          <div className="hidden lg:block md:block font-bold"> Re-answer</div>
        </Button>
      )}
    </div>
  );
}
