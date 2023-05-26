import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

const Table = ({data}: {data: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.header}>Name</Text>
        <Text style={styles.header}>Active?</Text>
        <Text style={styles.header}>Is Owner?</Text>
      </View>
      {data.map((item: any) => (
        <Pressable
          key={item.id}
          onPress={() => console.log('clicked')}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.onPressStyle,
          ]}>
          <View style={styles.row}>
            <Text style={styles.cell}>
              {item.given_name} {item.family_name}
            </Text>
            <Text style={styles.cell}>{item.status ? 'Yes' : 'No'}</Text>
            <Text style={styles.cell}>{item.is_owner ? 'Yes' : 'No'}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  onPressStyle: {},
});

export default Table;
