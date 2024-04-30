import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { OperationType } from "@lib/operations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { push } from "@redux/callstack-slice";
import { RootState } from "@redux/store";
import { useDispatch, useSelector } from "react-redux";

const ReloadMenuItem = () => {
  const { reload } = useDispatchers();

  return (
    <Menubar.Item leftIcon={<ReloadIcon />} onClick={reload}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
