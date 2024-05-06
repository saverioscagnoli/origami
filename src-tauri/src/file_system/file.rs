use std::{ io::{ self, Read, Write }, path::Path };

use super::{ api::get_read_rate_mbps, structs::CopyProgress };

pub fn copy_file_with_progress<P: AsRef<Path>, Q: AsRef<Path>, F>(
  from: P,
  to: Q,
  mut callback: F,
  stagger: Option<u64>
) -> io::Result<()>
  where F: FnMut(CopyProgress) + Sync + Send
{
  let from = from.as_ref().to_path_buf();
  let to = to.as_ref().to_path_buf();

  let total_bytes = from.metadata()?.len();
  let mut reader = std::fs::File::open(&from)?;
  let mut writer = std::fs::File::create(&to)?;

  let mut copied_bytes = 0;
  let mut buffer = [0; 4096];

  let mut i = 0;
  let mut start = std::time::Instant::now();

  loop {
    let bytes_read = reader.read(&mut buffer)?;
    if bytes_read == 0 {
      break;
    }

    writer.write_all(&buffer[..bytes_read])?;
    copied_bytes += bytes_read as u64;

    if i % stagger.unwrap_or(2500) == 0 {
      let elapsed = start.elapsed().as_secs_f64();

      let read_rate = get_read_rate_mbps(copied_bytes, elapsed);

      callback(CopyProgress {
        total_bytes,
        copied_bytes,
        read_rate,
      });
    }

    i += 1;
  }

  Ok(())
}
