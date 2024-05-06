use std::time::Instant;
use std::{ any::Any, io, path::Path };

use rayon::iter::{ ParallelBridge, ParallelIterator };
use walkdir::WalkDir;

use super::api::get_read_rate_mbps;
use super::structs::CopyProgress;

use super::file::copy_file_with_progress;

pub fn get_size<P: AsRef<Path>>(path: P) -> u64 {
  let path = path.as_ref();

  WalkDir::new(&path)
    .into_iter()
    .par_bridge()
    .filter_map(Result::ok)
    .map(|entry|
      entry
        .metadata()
        .map(|metadata| metadata.len())
        .unwrap_or(0)
    )
    .sum()
}

pub fn copy_dir_with_progress<P: AsRef<Path>, Q: AsRef<Path>, F>(
  from: P,
  to: Q,
  mut callback: F,
  stagger: Option<u64>
) -> io::Result<()>
  where F: FnMut(CopyProgress) + Sync + Send
{
  let from = from.as_ref().to_path_buf();
  let to = to.as_ref().to_path_buf();

  let mut stack = vec![(from.clone(), to)];
  let total_size = get_size(from);
  let mut total_copied_bytes: u64 = 0;

  while let Some((from, to)) = stack.pop() {
    if from.is_dir() {
      std::fs::create_dir(&to)?;

      for entry in std::fs::read_dir(from)? {
        let entry = entry?;
        let entry_path = entry.path();
        let entry_name = entry.file_name();

        let new_to = to.join(entry_name);

        if entry_path.is_dir() {
          stack.push((entry_path, new_to));
        } else {
          let mut copied_bytes = 0;
          copy_file_with_progress(
            entry_path,
            new_to,
            &mut (|info: CopyProgress| {
              copied_bytes = info.copied_bytes;

              callback(CopyProgress {
                total_bytes: total_size,
                copied_bytes: total_copied_bytes + copied_bytes,
                read_rate: info.read_rate,
              });
            }),
            stagger
          )?;
          total_copied_bytes += copied_bytes;
        }
      }
    } else {
      let mut copied_bytes = 0;
      copy_file_with_progress(
        from,
        to,
        &mut (|info: CopyProgress| {
          copied_bytes = info.copied_bytes;

          callback(CopyProgress {
            total_bytes: total_size,
            copied_bytes: total_copied_bytes + copied_bytes,
            read_rate: info.read_rate,
          });
        }),
        stagger
      )?;
      total_copied_bytes += copied_bytes;
    }
  }

  Ok(())
}
