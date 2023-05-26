import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import StyledButton from '../components/StyledButton';
import {useIsAuthed} from '../context/AuthContext';
import {
  queryLocation,
  queryLocations,
  queryTeamMemebers,
} from '../helpers/fetchRequests';

import BusinessInfo from '../components/BusinessInfo';
import Table from '../components/Table';
import LocationSelect from '../components/LocationSelect';

interface LocationData {
  name?: string;
  id?: string;
  address?: string;
  city?: string;
  phone?: string;
}

const Home = ({navigation}: {navigation: any}) => {
  const {hasToken} = useIsAuthed();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [locationList, setLocationList] = useState(['1']);
  const [locationData, setLocationData] = useState<LocationData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);

  const getLocation = async (id: string) => {
    const location = await queryLocation(id);
    setLocationData({
      id: location.id,
      name: location.business_name,
      address: location.address.address_line_1,
      city: location.address.locality,
      phone: location.phone_number,
    });
  };

  const getTeamMembers = async (id: string) => {
    const team_members = await queryTeamMemebers(id);
    setTeamMembers(team_members);
  };

  const handlePickerChange = async (id: string) => {
    setSelectedLocation(id);
    await getLocation(id);
    await getTeamMembers(id);
  };
  useEffect(() => {
    const listLocations = async () => {
      const locations = await queryLocations();
      setSelectedLocation(locations[0].id);
      setLocationList(locations);
      await getLocation(locations[0].id);
      await getTeamMembers(locations[0].id);
      setIsLoading(false);
    };
    if (hasToken) {
      setIsLoading(true);
      listLocations();
    }
  }, [hasToken]);

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <Text>Loading</Text>
        ) : hasToken ? (
          <View style={styles.body}>
            <LocationSelect
              selectedLocation={selectedLocation}
              changeHandler={handlePickerChange}
              locationList={locationList}
            />
            {locationData.name && (
              <View style={styles.businessInfo}>
                <BusinessInfo
                  name={locationData.name}
                  address={locationData.address}
                  city={locationData.city}
                  phone={locationData.phone}
                />
              </View>
            )}
            {teamMembers.length ? <Table data={teamMembers} /> : null}
            <StyledButton
              title="View Orders"
              onPress={() => {
                navigation.navigate('Orders');
              }}
            />
          </View>
        ) : (
          <View style={styles.center}>
            <Text style={styles.title}>Hold your Horses!</Text>
            <Text style={styles.subtitle}>
              This app depends on data from Square! Go authorize your seller
              account and then come back here!
            </Text>
            <StyledButton
              title="Go To Settings"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5DEB3',
    height: '100%',
  },
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
  businessInfo: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: '#666',
    fontSize: 16,
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5DEB3',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCount: {
    fontSize: 24,
    color: '#333',
  },
  center: {
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Home;
