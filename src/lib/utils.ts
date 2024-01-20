
function trimPath(path: string): string {
  return path.split("\\").pop() || "";
}



export { trimPath,  };
