import {
  ArrowLeftIcon,
  EyeClosedIcon,
  FileIcon,
  FolderIcon,
  StarFilledIcon
} from "@components/icons";
import { formatBytes } from "@lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { DirEntry } from "@typings/dir-entry";
import { Command } from "@typings/enums";
import { Component, JSX } from "solid-js";

const Entry: Component<DirEntry & { style: JSX.CSSProperties }> = props => {
  const isVisible = (flag: boolean) => (flag ? "visible" : "hidden");
  const onClick = () => invoke(Command.ListDir, { dir: props.path });

  return (
    <div class="entry" onClick={onClick} style={props.style}>
      <span class="entry-name-wrapper">
        <span class="entry-name-icon">
          {props.isDir ? <FolderIcon /> : <FileIcon />}
        </span>
        <p class="entry-name-text">{props.name}</p>
      </span>

      <span class="entry-flags-wrapper">
        <span class={`entry-flag ${isVisible(props.isHidden)}`}>
          <EyeClosedIcon />
        </span>

        <span class={`entry-flag ${isVisible(props.isSymlink)}`}>
          <ArrowLeftIcon />
        </span>

        <span class={`entry-flag ${isVisible(props.isStarred)}`}>
          <StarFilledIcon />
        </span>
      </span>

      <span class="entry-last-modified">{props.lastModified}</span>

      <span class="entry-size">{!props.isDir && formatBytes(props.size)}</span>
    </div>
  );
};

export { Entry };
