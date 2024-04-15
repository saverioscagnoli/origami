use tauri::State;

use super::SizeCalculator;

#[tauri::command]
pub async fn calc_size<'a>(
  size_calculator: State<'a, SizeCalculator>,
  path: String
) -> Result<u64, String> {
  size_calculator.reset();
  Ok(size_calculator.calc_size(path))
}
