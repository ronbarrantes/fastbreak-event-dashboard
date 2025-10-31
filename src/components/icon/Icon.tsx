import classNames from "classnames";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { iconFileNames, type IconsLisType } from "./icons-list-files";

type IconProps = {
  name: IconsLisType;
  tooltip?: boolean;
  className?: string;
  asChild?: boolean;
};

export const Icon = ({
  tooltip = false,
  asChild = false,
  name,
  className,
  ...props
}: IconProps) => {
  const ComponentToRender = iconFileNames[name].icon;
  const comp = (
    <ComponentToRender {...props} className={classNames(className)} />
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{comp}</TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return comp;
};

export const UpDownArrowIcon = ({
  direction,
  className,
  iconName = "arrow",
}: {
  direction?: "up" | "down";
  className?: string;
  iconName?: IconsLisType;
}) => {
  return (
    <Icon
      name={iconName}
      className={classNames(
        "transition-transform hover:!text-inherit",
        direction === "down" ? "rotate-90" : "-rotate-90",
        className
      )}
    />
  );
};
