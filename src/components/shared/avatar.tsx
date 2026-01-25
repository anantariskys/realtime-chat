import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center rounded-full font-medium shrink-0',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const indicatorVariants = cva(
  'absolute bottom-0 right-0 rounded-full border-2 border-card',
  {
    variants: {
      size: {
        sm: 'w-2.5 h-2.5',
        md: 'w-3 h-3',
        lg: 'w-3 h-3',
      },
      status: {
        online: 'bg-chat-online',
        offline: 'bg-muted-foreground/50',
      },
    },
    defaultVariants: {
      size: 'md',
      status: 'offline',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  name: string;
  src?: string;
  isGroup?: boolean;
  isOnline?: boolean;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, isGroup, isOnline, size, className, ...props }, ref) => {
    const initials = React.useMemo(
      () =>
        (name ?? '')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      [name]
    );

    const bgColors = [
      'bg-primary/90',
      'bg-accent-foreground/80',
      'bg-secondary-foreground/70',
    ];
    const colorIndex = (name?.length || 0) % bgColors.length;

    const iconSizes: Record<string, number> = {
      sm: 14,
      md: 16,
      lg: 20,
    };

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(
            'rounded-full flex items-center justify-center w-full h-full',
            src ? '' : bgColors[colorIndex],
            'text-primary-foreground'
          )}
        >
          {src ? (
            <img
              src={src}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : isGroup ? (
            <Users size={iconSizes[size ?? 'md']} />
          ) : (
            initials || <User size={iconSizes[size ?? 'md']} />
          )}
        </div>
        {!isGroup && isOnline !== undefined && (
          <span
            className={cn(
              indicatorVariants({ size, status: isOnline ? 'online' : 'offline' })
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
