import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

export const Button: FC<Props> = ({ title, onPress, disabled, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={disabled ? styles.disabled : {}}
    >
      <View style={[styles.main, style]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 20,
  },

  title: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },

  disabled: {
    opacity: 0.3,
  },
});
