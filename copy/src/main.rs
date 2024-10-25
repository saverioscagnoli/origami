use std::{
    env, fs,
    io::{self, Read, Write},
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
    thread,
    time::Duration,
};

fn main() -> io::Result<()> {
    let chunk_size = 1024 * 1024 * 16; // 16MB

    let args: Vec<String> = env::args().collect();

    let from = fs::File::open(&args[1])?;
    let to = fs::File::create(&args[2])?;

    let mut r = io::BufReader::with_capacity(chunk_size, from);
    let mut w = io::BufWriter::with_capacity(chunk_size, to);

    let size = fs::metadata(&args[1])?.len();

    let copied = Arc::new(AtomicU64::new(0));
    let copied_clone = copied.clone();

    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(100));
        eprintln!(
            "Progress: {} / {}",
            copied_clone.load(Ordering::Relaxed),
            size
        );
    });

    let mut data = vec![0; chunk_size];

    while let Ok(len) = r.read(&mut data) {
        if len == 0 {
            break;
        }

        copied.fetch_add(len as u64, Ordering::Relaxed);

        w.write_all(&data[..len])?;
    }

    Ok(())
}
