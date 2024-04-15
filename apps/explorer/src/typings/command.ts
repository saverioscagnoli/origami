enum Command {
  InitEmitter = "init_emitter",
  RequestDirListing = "request_dir_listing",
  OpenFile = "open_file",
  StarEntry = "star_entry",
  UnstarEntry = "unstar_entry",
  CutEntry = "cut_entry",
  CopyEntry = "copy_entry",
  CreateEntry = "create_entry",
  RenameEntry = "rename_entry",
  DeleteEntry = "delete_entry",
  CalcSize = "calc_size",
  OpenInVscode = "open_in_vscode"
}

export { Command };
