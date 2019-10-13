import React, {useState, Fragment} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';

const {width, height} = Dimensions.get('window');

const Register = props => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rePassword, setRePassword] = useState('');

  const onRegister = async () => {
    setLoading(true);
    if (email.length < 4) {
      Alert.alert('Email Invalid');
    } else if (password.length < 1) {
      Alert.alert('please input password more than 2');
    } else if (username.length < 3) {
      Alert.alert('please input Name more than 3');
    } else if (password !== rePassword) {
      Alert.alert('Password and RePassword does not match');
    } else {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(({user}) => {
          setLoading(false);

          firebase.auth().currentUser.updateProfile({
            displayName: username,
          });
          firebase
            .database()
            .ref(`users/${user.uid}`)
            .set({
              id: user.uid,
              username: username,
              email: email,
              photo:
                'http://pluspng.com/img-png/user-png-icon-male-user-icon-512.png',
              premium: false,
            });
        });
      props.navigation.navigate('Home');
    }
  };

  const goRegister = () => {
    props.navigation.navigate('Login');
  };
  return (
    <Fragment>
      <View style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={require('../assets/logo/logo.png')}
          />
        </View>

        <View style={styles.boxWelcom}>
          <Text style={styles.welcom}>Create an account</Text>
        </View>
        <TextInput
          placeholder="Username"
          placeholderTextColor="#9c9c9c"
          style={styles.box}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#9c9c9c"
          style={styles.box}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9c9c9c"
          style={styles.box}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />
        <TextInput
          placeholder="Re-type Password"
          placeholderTextColor="#9c9c9c"
          secureTextEntry
          style={styles.box}
          onChangeText={text => setRePassword(text)}
        />
        <TouchableOpacity onPress={onRegister}>
          <View style={styles.button}>
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text style={styles.textBtn}>Register</Text>
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.boxReg}>
          <Text style={styles.texReg1}>Don't have any account?</Text>
          <TouchableOpacity onPress={goRegister}>
            <Text style={styles.texReg2}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232323',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  logo: {
    width: width / 2,
    height: height / 21,
    resizeMode: 'stretch',
    marginBottom: 40,
  },
  boxWelcom: {
    marginBottom: height / 10,
  },
  welcom: {
    color: 'white',
    fontSize: 19,
  },
  box: {
    borderBottomColor: '#9c9c9c',
    borderBottomWidth: 1,
    width: width / 1.3,
    color: 'white',
  },
  button: {
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: height / 10,
    backgroundColor: '#004DAA',
    width: 150,
    paddingVertical: 10,
  },
  textBtn: {
    color: 'white',
    textAlign: 'center',
  },
  boxReg: {
    marginTop: height / 12,
    flexDirection: 'row',
  },
  texReg1: {
    color: 'white',
  },
  texReg2: {
    color: '#004DAA',
  },
});

export default Register;
