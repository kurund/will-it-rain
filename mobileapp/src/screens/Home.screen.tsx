import { FC, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { locations } from '../data/locations';
import { getWeather } from '../services/weather';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { Button } from '../components/Button';

import Logo from '../assets/images/logo.gif';

interface Prediction {
  Country: string;
  Date: string;
  Pred_Temp_C: number;
  Temp_likely_min_C: number;
  Temp_likely_max_C: number;
  Temp_possible_min_C: number;
  Temp_possible_max_C: number;
  Prob_Rain_pct: number;
  Pred_Rain_mm: number;
  Prob_Calm_pct: number;
  Prob_LightBreeze_pct: number;
  Prob_Windy_pct: number;
  Prob_Gale_pct: number;
  AQ_Low_pct: number;
  AQ_Moderate_pct: number;
  AQ_High_pct: number;
  AQ_VeryHigh_pct: number;
  Pred_AQ_Index: number;
  Pred_Wind_kph: number;
  Pred_FeelsLike_C: number;
  Pred_Cloud_pct: number;
  Pred_Condition: string;
  Pred_Temp_Class: string;
  Pred_Wind_Class: string;
  Pred_Wet_Class: string;
  Pred_AQ_Class: number;
  Pred_Headline: string;
}

const data = locations
  .map(item => ({
    label: item.location_name,
    value: item.country,
  }))
  .sort((a, b) => (a.label > b.label ? 1 : -1));

const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

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
      <Svg
        height={SCREEN_HEIGHT}
        width={SCREEN_WIDTH}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          <LinearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#3399ff" stopOpacity="1" />
            <Stop offset="1" stopColor="#003366" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          fill="url(#grad)"
        />
      </Svg>

      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Get My Weather</Text>

          <Image source={Logo} width={100} style={styles.logo} />
        </View>

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

        <Button title="Get prediction" onPress={getPrediction} />

        {prediction ? (
          <View>
            <Text>{JSON.stringify(prediction)}</Text>
            <Text style={styles.predictionText}>
              Temp: {prediction.Pred_Temp_C}C
            </Text>
            <Text style={styles.predictionText}>
              Rain: {prediction.Pred_Rain_mm}mm
            </Text>
          </View>
        ) : (
          <></>
        )}
      </ScrollView>
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
    backgroundColor: '#fff',
    marginTop: 20,
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

  button: {
    color: '#fff',
  },

  predictionText: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    margin: 20,
  },

  header: {
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },

  logo: {
    width: SCREEN_WIDTH - 80,
    height: 200,
  },
});
