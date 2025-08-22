'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';
import * as React from 'react';

type StarButtonProps = {
  onStarClick: () => void;
  initialCount?: number;
  initialStarred?: boolean;
  label?: string;
  onStarChange?: (isStarred: boolean) => void;
  className?: string;
};

export const StarButton = React.forwardRef<HTMLButtonElement, StarButtonProps>((props, ref) => {
  const { className, initialStarred = false, onStarChange, onStarClick, ...restProps } = props;

  const [starred, setStarred] = React.useState(initialStarred);

  const starVariants = {
    initial: { scale: 1, rotate: 0 },
    starred: {
      scale: [1, 1.3, 1],
      rotate: [0, 15, 0],
      transition: { duration: 0.4 },
    },
    tap: { scale: 0.9 },
  };

  const handleStar = React.useCallback(() => {
    onStarClick();
    const newStarred = !starred;

    setStarred(newStarred);

    if (onStarChange) {
      onStarChange(newStarred);
    }
  }, [starred, onStarChange, onStarClick]);

  return (
    <Button
      variant={'ghost'}
      ref={ref}
      onClick={handleStar}
      className={cn('size-8', className)}
      type="button"
      {...restProps}
    >
      <motion.div variants={starVariants} initial="initial" animate={starred ? 'starred' : 'initial'} whileTap="tap">
        <StarIcon
          className={cn(
            'size-5 transition-colors duration-300',
            starred ? 'fill-yellow-400 text-yellow-400' : 'opacity-60',
          )}
          size={16}
          aria-hidden="true"
        />
      </motion.div>
    </Button>
  );
});

StarButton.displayName = 'StarButton';
