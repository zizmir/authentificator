import React from 'react';
import _ from 'lodash'
import { StyleSheet, Text, View  , TouchableOpacity , ScrollView,   AsyncStorage , Alert} from 'react-native';
import { connect } from 'react-redux'

class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: "Authentificator"
    };
  };

   async componentWillMount(){
     try {
       await AsyncStorage.getItem("listing").then(result => {
         if(result){
            let current_listing = JSON.parse(result)
            console.log("list async  ->", current_listing);
            this.props.dispatch({ type: "INIT_DATA", payload: { current_listing } });
         }
       })
     } catch (e) {
       console.log(e)
     }

   }

   render() {

       return (
          <View style={styles.container}>
              <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => this.props.navigation.navigate('Scan', { })}
                        underlayColor='#fff'>
                        <Text>Add </Text>
               </TouchableOpacity>
              <TouchableOpacity
                        style={styles.clearButton}
                        underlayColor='#fff'
                        onPress={this._clear}>
                        <Text>Clear</Text>
               </TouchableOpacity>

               {this._displayItems()}

          </View>
       );
    }
    _displayItems(){
        // console.log(' qjhhksdkj 1 ', this.props.listi)
        return this.props.listing.map((items, index ) => {
            return (
              <TouchableOpacity key={index}
                    style={styles.infosButton}
                    onLongPress={() => {this._removeSingleData(index)} }>

                        <Text> {items.label} {items.secret} {items.issuer} </Text>

                </TouchableOpacity>

            )
        })

    }
    _removeSingleData = ( index ) =>{

      Alert.alert(
                   "Remove",
                   `are you sure to remove item ${this.props.listing[index].label}?`,
                   [
                     {
                       'text':"no"
                     },
                     { text: "Sure", style: "destructive" ,
                    onPress :()=>{
                      let updated_qr_list = [...this.props.listing]
                      updated_qr_list.splice(index,1)
                      const str = JSON.stringify(updated_qr_list)
                      AsyncStorage.setItem('listing',str).then(()=>{
                        this.props.dispatch({
                        type : 'REMOVE_AT',
                        payload: {
                          listing : updated_qr_list
                        }
                       })
                      })
                    }
                   }
                 ],
                   { cancelable: false }
              );
    }
    componentWillUnmount(){

    }
    _clear = () => {
      this.props.dispatch({ type: 'QRCODE_CLEAR' })
      AsyncStorage.removeItem("listing")
    }
 }

 function mapStateToProps(state) {
   return {
     listing: state.listing
   }
 }

 export default connect(mapStateToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width : 350,
    //color : "white",
    padding: 25,
    marginVertical : 20,
    backgroundColor: "#7facf4"
 },clearButton: {
   marginTop : 5,
  width : 350,
  // textAlign : "center",
  //color : "white",
  padding: 25,
  backgroundColor: "#A44040"
}
,infosButton: {
  marginTop : 5,
 width : 350,
 // textAlign : "center",
 //color : "white",
 padding: 25,
 backgroundColor: "#f98100"
}
});
