use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CopyProgress {
  pub total_bytes: u64,
  pub copied_bytes: u64,
  pub read_rate: f64,
}
