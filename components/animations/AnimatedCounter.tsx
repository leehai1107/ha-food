import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  startOnView?: boolean;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2.5,
  delay = 0,
  suffix = '',
  prefix = '',
  className = '',
  startOnView = true,
  decimals = 0
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const shouldStart = startOnView ? inView : true;



  return (
    <span ref={ref} className={className}>
      {shouldStart ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          delay={delay}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          preserveValue
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

export default AnimatedCounter;
