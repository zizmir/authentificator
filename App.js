import React from 'react';
import {} from 'react-native';
import { StackNavigator } from 'react-navigation'
import HomeScreen from './screens/home'
import ScanScreen from './screens/scan'
import { Provider } from  'react-redux'
import { createStore } from  'redux'

console.disableYellowBox = true

const RootStack = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Scan: {
       screen: ScanScreen,
     }
});

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );

  }
}

const initial_state = {
  listing: []
}

function reducer(prev_state = initial_state, action) {
  switch (action.type) {
    case 'QRCODE_NEW':
      console.log('test ', action.payload.new_list)
      return Object.assign({},
                    prev_state , { listing : action.payload.new_list })
    case 'QRCODE_CLEAR':
      return Object.assign({},prev_state,{
          listing : []
        });
    case "INIT_DATA":
      console.log("list async  ->", action.payload.current_listing);
      return Object.assign({}, prev_state, {
          listing : action.payload.current_listing
        });
    case "REMOVE_AT":
     return Object.assign({},prev_state,{
       listing : action.payload.listing
   });
    default:
      return prev_state
  }
}

const store = createStore(reducer)
