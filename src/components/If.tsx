import { type FC } from "react";

type IfBase = { children: React.ReactNode };
type IfAnd = IfBase & { is: unknown; and: unknown; or?: never };
type IfOr  = IfBase & { is: unknown; or:  unknown; and?: never };
type IfIs  = IfBase & { is: unknown; and?: never; or?: never };

export type IfProps = IfAnd | IfOr | IfIs;

export const If: FC<IfProps> = ({ is, and, or, children }) => {
  const truthy = (v: unknown) => Boolean(v);
  let show = truthy(is);

  if (and !== undefined) show = truthy(is) && truthy(and);
  else if (or  !== undefined) show = truthy(is) || truthy(or);

  return show ? <>{children}</> : null;
};
