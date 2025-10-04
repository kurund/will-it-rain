import { FC, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { locations } from '../data/locations';
import { getWeather } from '../services/weather';

interface Prediction {
  date: string;
  weather: string;
  probability: number;
}

const data = locations
  .map(item => ({
    label: item.location_name,
    value: item.location_name,
  }))
  .sort((a, b) => (a.label > b.label ? 1 : -1));

export const HomeScreen: FC = () => {
  // Date
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  // Location
  const [location, setLocation] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const [prediction, setPrediction] = useState<Prediction>();

  const getPrediction = async () => {
    const _prediction = await getWeather(
      location,
      date.toISOString().substring(0, 10),
    );
    setPrediction(_prediction);
  };

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Get My Weather</Text>

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={location}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setLocation(item.value);
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? 'blue' : 'black'}
        //     name="Safety"
        //     size={20}
        //   />
        // )}
      />

      <Button title="Choose date" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      {prediction ? (
        <View>
          <Text>{prediction.weather}</Text>
          <Text>{prediction.probability}</Text>
        </View>
      ) : (
        <></>
      )}

      <Button title="Get prediction" onPress={getPrediction} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 20,
    paddingTop: 80,
  },

  title: {
    fontSize: 24,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
