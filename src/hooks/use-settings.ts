import {
  SettingsState,
  updateSettings as dispatchUpdateSettings
} from "@redux/settings-slice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";

function useSettings() {
  const settings = useSelector<RootState, SettingsState>(state => state.settings);
  const dispatch = useDispatch();

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    dispatch(dispatchUpdateSettings(newSettings));
  };

  return { ...settings, updateSettings };
}

export { useSettings };
