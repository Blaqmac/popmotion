import { ForT } from '../types';

export interface SpringConfig {
  from?: number;
  to?: number;
  velocity?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export const spring = ({
  from = 0.0,
  to = 0.0,
  velocity = 0.0,
  stiffness = 100,
  damping = 10,
  mass = 1.0
}: SpringConfig): ForT => {
  const initialVelocity = velocity ? -(velocity / 1000) : 0.0;
  const initialDelta = to - from;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const angularFreq = Math.sqrt(stiffness / mass) / 1000;

  if (dampingRatio < 1) {
    // Underdamped spring
    return (t: number) => {
      const envelope = Math.exp(-dampingRatio * angularFreq * t);
      const expoDecay =
        angularFreq * Math.sqrt(1.0 - dampingRatio * dampingRatio);

      return (
        to -
        envelope *
          (((initialVelocity + dampingRatio * angularFreq * initialDelta) /
            expoDecay) *
            Math.sin(expoDecay * t) +
            initialDelta * Math.cos(expoDecay * t))
      );
    };
  } else if (dampingRatio === 1) {
    // Critically damped spring
    return (t: number) => {
      const envelope = Math.exp(-angularFreq * t);
      return to - envelope * (1 + angularFreq * t);
    };
  } else {
    // Overdamped spring
    const dampedAngularFreq =
      angularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);

    return (t: number) => {
      const envelope = Math.exp(-dampingRatio * angularFreq * t);

      return (
        to -
        (envelope *
          // TODO: Also test this (initialDelta + (initialVelocity + angularFreq * initialDelta) * t)
          ((initialVelocity + dampingRatio * angularFreq * initialDelta) *
            Math.sinh(dampedAngularFreq * t) +
            dampedAngularFreq *
              initialDelta *
              Math.cosh(dampedAngularFreq * t))) /
          dampedAngularFreq
      );
    };
  }
};
