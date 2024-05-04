// use std::{ path::Path, sync::Arc };

// use notify::{
//   event::{ CreateKind, ModifyKind, RemoveKind, RenameMode },
//   Config,
//   EventKind,
//   RecommendedWatcher,
//   RecursiveMode,
//   Watcher,
// };
// use tauri::{ async_runtime::Receiver, AppHandle };
// use tokio::sync::{ Mutex, mpsc::channel };

// use crate::{ events::EventToFrontend, utils::emit };

// pub fn create_watcher() -> notify::Result<
//   (RecommendedWatcher, Receiver<notify::Result<notify::Event>>)
// > {
//   let (tx, rx) = channel(1);

//   let watcher = RecommendedWatcher::new(move |res| {
//     futures::executor::block_on(async {
//       tx.send(res).await.unwrap();
//     })
//   }, Config::default())?;

//   Ok((watcher, rx))
// }

// pub fn watch<P: AsRef<Path>>(
//   app: &AppHandle,
//   watcher: &mut RecommendedWatcher,
//   rx: Arc<Mutex<Receiver<notify::Result<notify::Event>>>>,
//   path: P
// ) -> notify::Result<()> {
//   watcher.watch(path.as_ref(), RecursiveMode::NonRecursive)?;

//   let rx_clone = Arc::clone(&rx);

//   let app = app.clone();

//   tokio::spawn(async move {
//     let mut rx = rx_clone.lock().await;

//     while let Some(res) = rx.recv().await {
//       println!("{:?}", res);

//       match res {
//         Ok(event) => {
//           match event.kind {
//             | EventKind::Create(CreateKind::Folder)
//             | EventKind::Create(CreateKind::File)
//             // Linux
//             | EventKind::Remove(RemoveKind::Folder)
//             | EventKind::Remove(RemoveKind::File)
//             // Windows
//             | EventKind::Remove(RemoveKind::Any)
//             // Linux
//             | EventKind::Modify(ModifyKind::Name(RenameMode::To))
//             | EventKind::Modify(ModifyKind::Name(RenameMode::From))
//             // Windows
//             | EventKind::Modify(ModifyKind::Any) => {
//               emit(&app, EventToFrontend::Watch, "");
//             }

//             _ => {}
//           }
//         }
//         Err(e) => {
//           log::error!("watch error: {:?}", e);
//         }
//       }
//     }
//   });

//   Ok(())
// }

// pub fn unwatch<P: AsRef<Path>>(
//   watcher: &mut RecommendedWatcher,
//   path: P
// ) -> notify::Result<()> {
//   let path = path.as_ref();
//   watcher.unwatch(path)
// }

use std::{
  path::Path,
  sync::{ atomic::{ AtomicBool, Ordering }, Arc, Mutex },
  thread,
};

use notify::{ Config, RecommendedWatcher, RecursiveMode, Watcher };
use tauri::AppHandle;

use crate::{ events::EventFromFrontend, payloads::WatchPayload, utils::listen };

#[tauri::command]
pub fn start_watching(app: AppHandle) {
  let (tx, rx) = std::sync::mpsc::channel();

  let watcher = match RecommendedWatcher::new(tx, Config::default()) {
    Ok(watcher) => watcher,
    Err(e) => {
      eprintln!("Error creating watcher: {:?}", e);
      return;
    }
  };

  let watcher = Mutex::new(watcher);

  let should_stop = Arc::new(AtomicBool::new(false));
  let should_stop_clone = Arc::clone(&should_stop);

  thread::spawn(move || {
    // When the directory changes, unwatch the old path and watch the new path.
    // This is to prevent access denied errors on Linux.

    listen::<WatchPayload>(&app, EventFromFrontend::DirChanged, move |p| {
      if let Ok(mut watcher) = watcher.lock() {

        println!("{:?}", p);

        if !p.old_path.is_empty() {
          match watcher.unwatch(Path::new(&p.old_path)) {
            Ok(_) => {
              log::warn!("unwatched: {:?}", p.old_path);
            }
            Err(e) => {
              eprintln!("failed to unwatch: {:?}", e);
            }
          }
        }

        match watcher.watch(Path::new(&p.new_path), RecursiveMode::NonRecursive) {
          Ok(_) => {
            log::warn!("watching: {:?}", p.new_path);
          }
          Err(e) => {
            eprintln!("failed to watch: {:?}", e);
          }
        }
      }
    });

    // Stop the watcher when the app is about to reload.

    listen::<()>(&app, EventFromFrontend::BeforeUnload, move |_| {
      should_stop.store(true, Ordering::SeqCst);
    });

    // Loop to process watcher events.

    for res in rx {
      if should_stop_clone.load(Ordering::SeqCst) {
        log::warn!("watcher thread stopping");
        break;
      }

      match res {
        Ok(event) => {
          println!("{:?}", event);
        }
        Err(e) => {
          eprintln!("watch error: {:?}", e);
        }
      }
    }
  });
}
