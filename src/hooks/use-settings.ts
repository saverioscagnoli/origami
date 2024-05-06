import { invoke } from "@lib/mapped-invoke";
import {
  SettingsState,
  updateSettings as dispatchUpdateSettings
} from "@redux/settings-slice";
import { RootState } from "@redux/store";
import { Command } from "@typings/enums";
import { Settings } from "@typings/settings";
import { useDispatch, useSelector } from "react-redux";

function useSettings() {
  const settings = useSelector<RootState, SettingsState>(state => state.settings);
  const dispatch = useDispatch();

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    dispatch(dispatchUpdateSettings(newSettings));

    for (const [key, value] of Object.entries(newSettings)) {
      invoke(Command.UpdateSettings, {
        key: key as keyof Settings,
        value: String(value)
      });
    }
  };

  return { ...settings, updateSettings };
}

export { useSettings };
