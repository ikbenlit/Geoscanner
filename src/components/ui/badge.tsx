import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        'v0-blue': 'bg-v0-blue/10 text-v0-blue border-v0-blue/20',
        'v0-orange': 'bg-v0-orange/10 text-v0-orange border-v0-orange/20',
        'v0-red': 'bg-v0-red/10 text-v0-red border-v0-red/20',
        'v0-success': 'bg-green-100 text-green-700 border-green-200',
        'v0-warning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'v0-error': 'bg-red-100 text-red-700 border-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
