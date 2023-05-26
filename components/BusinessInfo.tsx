import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Info {
  name?: string;
  address?: string;
  city?: string;
  phone?: string;
}

const BusinessInfo = ({name, address, city, phone}: Info) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.address}>{address}</Text>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.phone}>{phone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
  },
  city: {
    fontSize: 16,
    marginBottom: 5,
  },
  phone: {
    fontSize: 16,
  },
});

export default BusinessInfo;
