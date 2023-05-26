import React from 'react';
import {Picker} from '@react-native-picker/picker';
import {StyleSheet, View, Text} from 'react-native';

const LocationSelect = ({
  changeHandler,
  selectedLocation,
  locationList,
}: {
  changeHandler: any;
  selectedLocation: string;
  locationList: any;
}) => {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerHeader}>Choose a Location</Text>
      <Picker
        selectedValue={selectedLocation}
        onValueChange={itemValue => {
          changeHandler(itemValue);
        }}>
        {locationList.map((location: any, i: number) => {
          return (
            <Picker.Item key={i} label={location.name} value={location.id} />
          );
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  pickerHeader: {
    fontSize: 30,
    textAlign: 'center',
  },
});

export default LocationSelect;
