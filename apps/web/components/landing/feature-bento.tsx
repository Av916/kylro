import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** ChaiUI's feature grid, with content slots for product-specific previews. */
export function FeatureBento({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-4", className)}>{children}</div>;
}
