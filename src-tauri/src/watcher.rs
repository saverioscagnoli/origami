use std::{ path::Path, sync::Arc };

use notify::{
  event::{ CreateKind, ModifyKind, RemoveKind, RenameMode },
  Config,
  EventKind,
  RecommendedWatcher,
  RecursiveMode,
  Watcher,
};
use tauri::{ async_runtime::Receiver, AppHandle };
use tokio::sync::{ Mutex, mpsc::channel };

use crate::{ events::EventToFrontend, utils::emit };

pub fn create_watcher() -> notify::Result<
  (RecommendedWatcher, Receiver<notify::Result<notify::Event>>)
> {
  let (tx, rx) = channel(1);

  let watcher = RecommendedWatcher::new(move |res| {
    futures::executor::block_on(async {
      tx.send(res).await.unwrap();
    })
  }, Config::default())?;

  Ok((watcher, rx))
}

pub fn watch<P: AsRef<Path>>(
  app: &AppHandle,
  watcher: &mut RecommendedWatcher,
  rx: Arc<Mutex<Receiver<notify::Result<notify::Event>>>>,
  path: P
) -> notify::Result<()> {
  watcher.watch(path.as_ref(), RecursiveMode::NonRecursive)?;

  let rx_clone = Arc::clone(&rx);

  let app = app.clone();

  tokio::spawn(async move {
    let mut rx = rx_clone.lock().await;

    while let Some(res) = rx.recv().await {
      match res {
        Ok(event) => {
          match event.kind {
            | EventKind::Create(CreateKind::Folder)
            | EventKind::Create(CreateKind::File)
            // Linux
            | EventKind::Remove(RemoveKind::Folder)
            | EventKind::Remove(RemoveKind::File)
            // Windows
            | EventKind::Remove(RemoveKind::Any)
            | EventKind::Modify(ModifyKind::Name(RenameMode::To))
            | EventKind::Modify(ModifyKind::Name(RenameMode::From)) => {
              emit(&app, EventToFrontend::Watch, "");
            }

            _ => {}
          }
        }
        Err(e) => {
          log::error!("watch error: {:?}", e);
        }
      }
    }
  });

  Ok(())
}

pub fn unwatch<P: AsRef<Path>>(
  watcher: &mut RecommendedWatcher,
  path: P
) -> notify::Result<()> {
  let path = path.as_ref();
  watcher.unwatch(path)
}
