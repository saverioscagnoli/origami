use std::path::Path;

use notify::{ Config, RecommendedWatcher, RecursiveMode, Watcher };
use tauri::async_runtime::Receiver;
use tokio::sync::mpsc::channel;

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

pub async fn watch<P: AsRef<Path>>(
  watcher: &mut RecommendedWatcher,
  rx: &mut Receiver<notify::Result<notify::Event>>,
  path: P
) -> notify::Result<()> {
  watcher.watch(path.as_ref(), RecursiveMode::Recursive)?;

  while let Some(res) = rx.recv().await {
    match res {
      Ok(event) => {
        log::info!("event: {:?}", event);
      }
      Err(e) => {
        log::error!("watch error: {:?}", e);
      }
    }
  }

  Ok(())
}

pub fn unwatch<P: AsRef<Path>>(watcher: &mut RecommendedWatcher, path: P) -> notify::Result<()> {
  let path = path.as_ref();
  watcher.unwatch(path)
}
