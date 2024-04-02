import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { useWidgetWidth } from '@/widgets/widget-wrapper';

// type TypographyVariant = keyof typeof variants;

const typographyVariants = cva('', {
  variants: {
    size: {
      '4xs': 'text-4xs sm:text-3xs md:text-2xs',
      '3xs': 'text-3xs sm:text-2xs md:text-xs',
      '2xs': 'text-2xs sm:text-xs md:text-sm',
      'xs': 'text-xs sm:text-sm md:text-base',
      'sm': 'text-sm sm:text-base md:text-lg',
      'base': 'text-base sm:text-lg md:text-xl',
      'lg': 'text-lg sm:text-xl md:text-2xl',
      'xl': 'text-xl sm:text-2xl md:text-3xl',
      '2xl': 'text-2xl sm:text-3xl md:text-4xl',
      'h3': 'text-2xl sm:text-3xl md:text-4xl',
      '3xl': 'text-3xl sm:text-4xl md:text-5xl',
      'h2': 'text-3xl sm:text-4xl md:text-5xl',
      '4xl': 'text-4xl sm:text-5xl md:text-6xl',
      'h1': 'text-4xl sm:text-5xl md:text-6xl',
      '5xl': 'text-5xl sm:text-6xl md:text-7xl',
      '6xl': 'text-6xl sm:text-7xl md:text-8xl',
    },
  },
  defaultVariants: {
    size: 'base',
  }
});

interface ResponsiveTypographyProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof typographyVariants>{
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  asChild?: boolean;
  breakpoints?: Record<string, number> | {};
}

const defaultBreakpoints = {
  // '4xs': 0,
  // '3xs': 30,
  // '2xs': 60,
  // 'xs': 90,
  // 'sm': 120,
  // 'base': 150,
  // 'lg': 180,
  // 'xl': 210,
  // '2xl': 240,
  // '3xl': 270,
  // '4xl': 300,
  // '5xl': 330,
  // '6xl': 360,
};

const ResponsiveTypography = React.forwardRef<HTMLDivElement, ResponsiveTypographyProps>(
  ({ tag, size, className, asChild = false, children, breakpoints = defaultBreakpoints, ...props }, ref) => {
    const { width } = useWidgetWidth();
    const Comp = asChild ? Slot : (tag || "p");

    let adjustedSize = size;

    // Determine the appropriate size based on the widget's width and breakpoints
    for (const [breakpointSize, breakpointWidth] of Object.entries(breakpoints)) {
      if (width >= breakpointWidth) {
        adjustedSize = breakpointSize;
      } else {
        break; // Stop iterating once the width is less than the breakpoint width
      }
    }

    return (
      <Comp 
        className={cn(typographyVariants({ size: adjustedSize, className }))}
        ref={ref} 
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

export { ResponsiveTypography, typographyVariants }

export default ResponsiveTypography;