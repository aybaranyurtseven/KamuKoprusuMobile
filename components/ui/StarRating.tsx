import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StarRatingProps {
  value: number;                 // 0-5
  onChange?: (value: number) => void; // verilmezse salt-okunur
  size?: number;
  color?: string;                // dolu yıldız rengi
  emptyColor?: string;
}

/**
 * 1-5 yıldız puanlama. onChange verilirse etkileşimli, verilmezse görüntüleme.
 */
export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 28,
  color = '#f1c40f',
  emptyColor = '#cbd5e1',
}) => {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        const star = (
          <Text style={{ fontSize: size, color: filled ? color : emptyColor }}>
            {filled ? '★' : '☆'}
          </Text>
        );
        if (onChange) {
          return (
            <TouchableOpacity key={i} onPress={() => onChange(i)} hitSlop={6}>
              {star}
            </TouchableOpacity>
          );
        }
        return <View key={i}>{star}</View>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
});
