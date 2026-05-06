import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-primary/35 bg-primary/15 text-white backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] hover:bg-primary/25",
        secondary:
          "border border-border/50 bg-secondary/50 text-secondary-foreground backdrop-blur-md hover:bg-secondary/70",
        destructive:
          "border border-destructive/40 bg-destructive/20 text-white backdrop-blur-md hover:bg-destructive/30",
        outline: "text-foreground border border-border/60 bg-card/30 backdrop-blur-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
