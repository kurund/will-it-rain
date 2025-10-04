import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  style?: any;
}

export const Button: FC<Props> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress}>
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
    marginBottom: 10,
    borderRadius: 20,
  },

  title: {
    color: '#ffffff',
    fontSize: 18,
  },
});
