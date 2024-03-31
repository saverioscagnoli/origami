use std::{ fs, io, path::Path };

pub struct FSManager {}

impl FSManager {
  pub fn new() -> Self {
    Self {}
  }

  pub fn create_entry<P: AsRef<Path>>(
    &self,
    dir: P,
    name: String,
    is_folder: bool
  ) -> io::Result<()> {
    let path = dir.as_ref().join(name);

    if is_folder {
      fs::create_dir_all(path)?;
    } else {
      fs::File::create(path)?;
    }

    Ok(())
  }

  pub fn delete_entry<P: AsRef<Path>>(
    &self,
    dir: P,
    name: String,
    is_folder: bool
  ) -> io::Result<()> {
    let path = dir.as_ref().join(name);

    if is_folder {
      fs::remove_dir_all(path)?;
    } else {
      fs::remove_file(path)?;
    }

    Ok(())
  }

  pub fn create_symlink<P: AsRef<Path>, Q: AsRef<Path>>(
    &self,
    target_dir: P,
    link_dir: Q,
    name: String,
    is_folder: bool
  ) -> io::Result<()> {
    let target_path = target_dir.as_ref().join(&name);
    let link_path = link_dir.as_ref().join(&name);

    #[cfg(windows)]
    {
      if is_folder {
        use std::os::windows::fs::symlink_dir;
        symlink_dir(target_path, link_path)?;
      } else {
        use std::os::windows::fs::symlink_file;
        symlink_file(target_path, link_path)?;
      }
    }

    #[cfg(unix)]
    {
      use std::os::unix::fs::symlink;
      symlink(target_path, link_path)?;
    }

    Ok(())
  }
}
