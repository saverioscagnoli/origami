import { Menubar } from "@components/tredici";
import { replaceSelected } from "@redux/current-dir-slice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";

const SelectAllMenuItem = () => {
  const { entries, selected } = useSelector((state: RootState) => state.currentDir);
  const dispatch = useDispatch();

  const selectAll = () => {
    dispatch(
      replaceSelected({
        newSelected: entries
      })
    );
  };

  return <Menubar.Item onClick={selectAll}>Select All</Menubar.Item>;
};

export { SelectAllMenuItem };
