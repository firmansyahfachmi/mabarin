import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import {Icon} from 'native-base';
import geolocation from '@react-native-community/geolocation';
import MapView, {Marker} from 'react-native-maps';
import firebase from 'firebase';

const {width} = Dimensions.get('window');
import Mark from '../assets/image/MabarinMarker.png';

class Maps extends Component {
  constructor() {
    super();
    this.state = {
      region: null,
      longitude: 0,
      latitude: 0,
      users: [],
    };
  }

  componentDidMount = async () => {
    await this.usersLocation();
    let user = await firebase.auth().currentUser;
    await this.setState({userId: user.uid});

    await geolocation.getCurrentPosition(position => {
      let Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0071,
        longitudeDelta: 0.0071,
      };
      firebase
        .database()
        .ref('users/' + this.state.userId)
        .update({Location})
        .then(() => {
          this.setState({isLoading: false});
        });
      this.changeRegion(Location, Location.latitude, Location.longitude);
    });
  };

  usersLocation = () => {
    firebase
      .database()
      .ref('users/')
      .on('value', result => {
        let data = result.val();
        if (data !== null) {
          let users = Object.values(data);
          this.setState({
            users,
          });
        }
      });
  };

  changeRegion = (region, lat, long) => {
    this.setState({
      region: region,
      latitude: lat || this.state.latitude,
      longitude: long || this.state.longitude,
    });
  };

  render() {
    const {userId} = this.state;
    return (
      <Fragment>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}>
            <Icon
              type="AntDesign"
              name="left"
              style={{color: 'white', fontSize: 18}}
            />
          </TouchableOpacity>
          <Text style={styles.headTitle}>Maps</Text>
        </View>
        <View style={styles.container}>
          <MapView
            initialRegion={this.state.region}
            showsUserLocation={true}
            followUserLocation={true}
            zoomControlEnabled={false}
            showsCompass={true}
            minZoomLevel={0}
            maxZoomLevel={20}
            style={styles.map}>
            {this.state.users.map((item, index) => (
              <Marker
                key={index}
                onCalloutPress={() =>
                  this.props.navigation.navigate('Chat', item)
                }
                title={item.id == userId ? 'You' : item.username}
                coordinate={{
                  latitude: item.Location.latitude,
                  longitude: item.Location.longitude,
                }}>
                {item.id == userId ? (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                    }}>
                    <Image
                      source={Mark}
                      style={{
                        flex: 1,
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.avatar}>
                    {/* <Image source={{uri: item.photo}} style={styles.image} /> */}
                  </View>
                )}
              </Marker>
            ))}
          </MapView>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'silver',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'grey',
  },
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  headTitle: {
    marginLeft: 15,
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },
  header: {
    backgroundColor: '#373737',
    width: '100%',
    height: 60,
    alignItems: 'center',
    paddingHorizontal: width / 20,
    flexDirection: 'row',
  },
});

export default Maps;
