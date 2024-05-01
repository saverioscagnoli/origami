use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WatchPayload {
  pub old_path: String,
  pub new_path: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Payload<T> {
  pub op_id: String,
  pub data: Option<T>,
  pub error: Option<String>,
  pub is_finished: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct PastePayload {
  pub dir: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DeletePayload {
  pub dir: String,
}
