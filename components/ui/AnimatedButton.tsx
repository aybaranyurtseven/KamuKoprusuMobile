import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface AnimatedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  variant = 'primary',
  style,
  textStyle,
  onPressIn,
  onPressOut,
  loading = false,
  disabled,
  ...props
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const handlePressIn = (e: any) => {
    if (isDisabled) return;
    scale.value = withSpring(0.95);
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    if (isDisabled) return;
    scale.value = withSpring(1);
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: isDisabled ? 0.6 : 1,
    };
  });

  const getBackgroundColor = () => {
    if (variant === 'outline') return 'transparent';
    return Colors[colorScheme][variant] || Colors[colorScheme].primary;
  };

  const getTextColor = () => {
    if (variant === 'outline') return Colors[colorScheme].primary;
    return '#fff';
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={[
        styles.button,
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? Colors[colorScheme].primary : 'transparent',
          borderWidth: variant === 'outline' ? 2 : 0,
        },
        animatedStyle,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
