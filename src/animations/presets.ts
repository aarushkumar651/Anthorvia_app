import {
  withTiming,
  withSpring,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import { Springs, Timing } from './springs';

export const Entering = {
  fadeIn: FadeIn.duration(Timing.NORMAL),
  fadeInSlow: FadeIn.duration(Timing.SLOW),
  slideUp: SlideInDown.springify()
    .damping(Springs.FLUID.damping)
    .stiffness(Springs.FLUID.stiffness),
  zoomIn: ZoomIn.springify()
    .damping(Springs.SNAPPY.damping)
    .stiffness(Springs.SNAPPY.stiffness),
  messageIn: FadeIn.duration(250).delay(50),
};

export const Exiting = {
  fadeOut: FadeOut.duration(Timing.FAST),
  slideDown: SlideOutDown.duration(Timing.NORMAL),
  zoomOut: ZoomOut.duration(Timing.FAST),
};

export const buttonPressIn = {
  transform: [{ scale: withSpring(0.96, Springs.SNAPPY) }],
};

export const buttonPressOut = {
  transform: [{ scale: withSpring(1.0, Springs.ELASTIC) }],
};
