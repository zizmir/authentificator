import React from 'react';
import { View, Text , StyleSheet, AsyncStorage } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo'
import { connect } from 'react-redux'


class Scan extends React.Component {
    state = {
        hasCameraPermission: null,
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
      const { params } = navigation.state;

      return {
        title: params ? params.otherParam : 'A Nested Details Screen',
        /* These values are used instead of the shared configuration! */
        headerStyle: {
          backgroundColor: navigationOptions.headerTintColor,
        },

      };
    };

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});
    }

    render() {
      const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
          return <Text>Requesting for camera permission</Text>;
        } else if (hasCameraPermission === false) {
          return <Text>No access to camera</Text>;
        } else {
          return (
            <View style={{ flex: 1 }}>
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={StyleSheet.absoluteFill}
              />
            </View>
          );
      }
    }
     _handleBarCodeRead = ({ type, data }) => {

        const regex = /^otpauth:\/\/totp\/(.+)\?secret=(.+)&issuer=(.*)?$/

        let result = data.match(regex)
        const [ label, secret , issuer ] = result.slice(1)
        alert(`${label} `)
        const qrcode_entry = { label , secret , issuer }

        let new_list = [...this.props.listing, qrcode_entry]
        try {
          const str = JSON.stringify(new_list)

          AsyncStorage.setItem("listing", str).then(() => {
           this.props.dispatch({
             type : 'QRCODE_NEW',
             payload : {'new_list': new_list }
           })
         })
        } catch (e) {
          console.log(e)
        }

    }
}
function mapStateToProps(state){
  return {
    listing : state.listing
  }
}
export default connect(mapStateToProps)(Scan)
