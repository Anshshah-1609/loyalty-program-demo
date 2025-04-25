import copy from "clipboard-copy";
import { MdOutlineFileCopy } from "react-icons/md";
import { successToast } from "./sonner";

interface Props {
  copyText: string;
  successMessage: string;
}

export const CopyIcon = ({ copyText, successMessage }: Props) => {
  const handleCopyClick = (code: string) => {
    copy(code);
    successToast(successMessage);
  };

  return (
    <MdOutlineFileCopy
      className="text-primary cursor-pointer"
      size="18px"
      onClick={() => {
        handleCopyClick(copyText);
      }}
    />
  );
};
