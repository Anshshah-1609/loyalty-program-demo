import { cn } from "@/utils/helper";

interface Props {
  heading: string;
  className?: string;
  isRequired?: boolean;
}

export const HeaderCell = ({ heading, className, isRequired }: Props) => {
  return (
    <span
      className={cn(
        "flex items-center justify-start whitespace-nowrap",
        className
      )}
    >
      <span>{heading}</span>&nbsp;
      {isRequired && <span className="text-ogDanger">*</span>}
    </span>
  );
};
