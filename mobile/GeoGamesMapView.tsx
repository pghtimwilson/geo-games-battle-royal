import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Platform, PermissionsAndroid} from 'react-native';
//import Styled from 'styled-components/native';
import Geolocation from 'react-native-geolocation-service';

import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';

interface ILocation {
  latitude: number;
  longitude: number;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const GeoGamesMapView = () => {
  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [currentError, setError] = useState('');

  async function requestPermissions() {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      if (auth === 'granted') {
        // do something if granted...
      }
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (PermissionsAndroid.RESULTS.GRANTED === 'granted') {
        // do something if granted...
      }
    }
  }

  useEffect(() => {
    requestPermissions(); //Provides the modal that allows current use or for the app etc.
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
        setError(error.code + ' ' + error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  Geolocation.getCurrentPosition(
    position => {
      console.log(position);
    },
    error => {
      // See error code charts below.
      console.log(error.code, error.message);
    },
    {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  );

  // var markers = [
  //   {
  //     latitude: 40.7976,
  //     longitude: -80.1324,
  //     title: 'Play House',
  //     subtitle: '1234 Foo Drive',
  //   },
  // ];

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          mapType="satellite"
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}>
          <Polygon
            coordinates={[
              {latitude: 40.79776629344035, longitude: -80.13308258485281},
              {latitude: 40.796964, longitude: -80.132849},
              {latitude: 40.797051310651106, longitude: -80.13181634975703},
              {latitude: 40.7978553874024, longitude: -80.13188072274106},
            ]}
            strokeColor="red"
            strokeWidth={3}
          />
          <Polygon
            coordinates={[
              {latitude: 40.79764827765799, longitude: -80.13260223693338},
              {latitude: 40.797026944547774, longitude: -80.13244935102647},
              {latitude: 40.797100042862596, longitude: -80.13197191784343},
              {latitude: 40.79773152773096, longitude: -80.13220258780827},
            ]}
            strokeColor="blue"
            strokeWidth={3}
          />
          <Marker
            coordinate={{latitude: 40.7976, longitude: -80.1324}}
            pinColor={'green'} // any color
            title={'Dad'}
            description={'Dad desc'}
          />
          <Marker
            coordinate={{latitude: 40.7973346, longitude: -80.132232}}
            pinColor={'green'} // any color
            title={'James'}
            description={'James desc'}
          />
          <Marker
            coordinate={{latitude: 40.7971, longitude: -80.1321}}
            pinColor={'red'} // any color
            title={'Mommy'}
            description={'Mommy desc'}
          />
          <Marker
            coordinate={{latitude: 40.79715, longitude: -80.1311}}
            pinColor={'red'} // any color
            title={'Haleigh'}
            description={'Haleigh desc'}
          />
        </MapView>
      ) : (
        <>
          <Text>Loading...</Text>
          <Text>{currentError}</Text>
        </>
      )}
    </View>
  );
};

export default GeoGamesMapView;
