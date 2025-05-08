import { cn } from "@/lib/utils";

interface SkateDividerProps {
  className?: string;
}

export const SkateDivider = ({ className }: SkateDividerProps) => {
  return (
    <div className={cn("skate-divider w-full", className)} />
  );
};
