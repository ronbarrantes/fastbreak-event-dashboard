"use server";
import classNames from "classnames";

export const Container = async ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames("container m-auto", className)}>{children}</div>
  );
};
