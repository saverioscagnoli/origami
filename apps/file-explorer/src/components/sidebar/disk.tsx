import React from "react";
import { TDisk } from "./sidebar";
import { Progress } from "@tredici/progress";

const Disk: React.FC<TDisk> = ({ available_space, total_space }) => {
  return (
    <div>
      <Progress max={total_space} value={total_space - available_space} />
    </div>
  );
};

export { Disk };
