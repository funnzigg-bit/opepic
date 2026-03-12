import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]", {
  variants: {
    variant: {
      default: "border-border bg-secondary text-secondary-foreground",
      success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
      warning: "border-amber-500/30 bg-amber-500/15 text-amber-200",
      danger: "border-rose-500/30 bg-rose-500/15 text-rose-200",
      info: "border-cyan-500/30 bg-cyan-500/15 text-cyan-200"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
