use std::{ path::Path, sync::{ atomic::{ AtomicBool, Ordering }, Arc }, thread };

use rayon::iter::{ ParallelBridge, ParallelIterator };
use tauri::AppHandle;
use walkdir::WalkDir;

use crate::{ enums::EventFromFrontend, utils };

pub mod commands;

pub struct SizeCalculator {
  app: AppHandle,
  should_stop: Arc<AtomicBool>,
}

impl SizeCalculator {
  pub fn new(app: AppHandle) -> Self {
    Self {
      app,
      should_stop: Arc::new(AtomicBool::new(false)),
    }
  }

  pub fn listen(&self) {
    let should_stop = Arc::clone(&self.should_stop);
    let app = self.app.clone();

    thread::spawn(move || {
      utils::listen(&app, EventFromFrontend::StopCalculatingSize, move |_| {
        should_stop.store(true, Ordering::SeqCst);
      });
    });
  }

  pub fn reset(&self) {
    self.should_stop.store(false, Ordering::SeqCst);
  }

  pub fn calc_size<P>(&self, path: P) -> u64 where P: AsRef<Path> {
    let path = path.as_ref();
    let should_stop = Arc::clone(&self.should_stop);

    let size: u64 = WalkDir::new(&path)
      .into_iter()
      .par_bridge()
      .filter_map(|entry| {
        if should_stop.load(Ordering::SeqCst) { None } else { entry.ok() }
      })
      .filter(|entry| entry.file_type().is_file())
      .map(|entry| entry.metadata().map(|m| m.len()))
      .filter_map(|size| size.ok())
      .sum();
    size
  }
}
