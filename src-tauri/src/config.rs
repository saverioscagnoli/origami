use crate::utils::AppPaths;
use jsonc_parser::{parse_to_serde_value, ParseOptions};
use serde_json::Value;
use std::{fs::File, io::Read};
use tauri::State;

#[tauri::command]
pub fn load_config(app_paths: State<AppPaths>) -> Value {
    let config_file = &app_paths.config_file;

    let file = File::open(config_file);

    if file.is_err() {
        return Value::Null;
    }

    let mut file = file.unwrap();
    let mut contents = String::new();

    file.read_to_string(&mut contents).unwrap();

    let conf = parse_to_serde_value(&contents, &ParseOptions::default());

    if conf.is_err() {
        log::error!("Failed to parse config file: {:?}", conf.err());
        return Value::Null;
    }

    let conf = conf.unwrap();

    if conf.is_none() {
        log::error!("Failed to parse config file.");
        return Value::Null;
    }

    conf.unwrap()
}
