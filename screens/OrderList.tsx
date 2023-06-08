import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View} from 'react-native';
import OrderListGroup from '../components/OrderListGroup';
import LocationSelect from '../components/LocationSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {graphqlListLocations} from '../helpers/fetchRequests';

const OrderList = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationList, setLocationList] = useState([]);

  const handlePickerChange = (location: string) => {
    setSelectedLocation(location);
  };

  useEffect(() => {
    const getLocations = async () => {
      const merchantId = await AsyncStorage.getItem('merchantId');
      if (merchantId) {
        const locations = await graphqlListLocations(merchantId);
        setLocationList(locations);
        setSelectedLocation(locations[0].id);
      }
    };
    if (!selectedLocation) {
      getLocations();
    }
  }, [selectedLocation]);

  return (
    <View style={styles.body}>
      <LocationSelect
        changeHandler={handlePickerChange}
        selectedLocation={selectedLocation}
        locationList={locationList}
      />
      <ScrollView style={styles.container}>
        <OrderListGroup selectedLocation={selectedLocation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5DEB3',
  },
});

export default OrderList;
