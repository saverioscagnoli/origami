use crate::{enums::Command, utils::AppPaths};
use tauri::{AppHandle, State};

/**
 * This file is for all the external modules that need to be loaded into the app.
 * For example, if you have a css file in the app connection, you can load it here.
 */

#[tauri::command]
pub fn load_css_modules(
    app: AppHandle,
    app_paths: State<AppPaths>,
    label: String,
) -> Result<(), ()> {
    let config_dir = app_paths.starred_dir.parent().unwrap();

    let dir = std::fs::read_dir(&config_dir);

    if dir.is_err() {
        Command::LoadCSSModules(
            None,
            Some("Failed to read config directory".to_string()),
            true,
        )
        .emit(&app, label.clone());
    }

    let dir = dir.unwrap();
    let mut modules = vec![];

    for entry in dir {
        if entry.is_err() {
            continue;
        }

        let entry = entry.unwrap();

        if let Some(ext) = entry.path().extension() {
            if ext == "css" {
                let css = std::fs::read_to_string(entry.path());

                if css.is_err() {
                    Command::LoadCSSModules(
                        None,
                        Some("Failed to read CSS file".to_string()),
                        true,
                    )
                    .emit(&app, label.clone());
                }

                let css = css.unwrap();

                modules.push(css);
            }
        }
    }

    log::info!("Loaded {} CSS modules", modules.len());
    Command::LoadCSSModules(Some(modules), None, true).emit(&app, label);

    Ok(())
}
