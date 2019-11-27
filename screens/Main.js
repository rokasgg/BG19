import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Picker
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation, { watchPosition } from "react-native-geolocation-service";
import stadiumMarkers from "../database/data.json";
import Modal from "react-native-modalbox";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { connect } from "react-redux";
import ModalStadiumDetails from "../components/modalStadiumDetails";
import ModalReservation from "../components/modalReservation";
import ModalFilter from "../components/modalFilter";
import { dummyAction } from "../redux/actions/dummyAction";
import { createBottomTabNavigator } from "react-navigation";

import { LocaleConfig } from "react-native-calendars";
import { moderateScale } from "../components/ScaleElements.js";
import Icon from "react-native-vector-icons/AntDesign";

import firebase from 'firebase';
import 'firebase/firestore';

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Example App",
        message: "Example App access to your location "
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the");
    } else {
      console.log("location permission denied");
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

class Main extends React.Component {
  static navigationOptions = { header: null };

  state = {
    region: {
      latitude: 54.6891594,
      longitude: 25.2798004,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    markerPosition: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    },
    latitude1: 0,
    longitude1: 0,
    location: "Your location is set!",
    clicked:false,
    //Passing data to modal(markers)
    markersData: {
      stadiumName: "",
      adress: "",
      rating: "",
      longitude: "",
      latitude: ""
    },

    //Markers of all stadiums.
    markers: require('../database/data.json'),
    selectedStadium: [],
    setModalVisible: false,
    //Reservation modal
    modalReservationVisible: false,

    //Modal values
    modalStadiumDetailVisiable: false,
    isDisabled: false,
    swipeToClose: true,

    modalFilterState: false,

    //EVENTS Modal Values
    isOpenEvent: false,
    isDisabled: false,
    swipeToClose: true,
    isOpenReserve: false,

    //DataPICKER VALUES
    isDateTimePickerVisible: false,
    dateTime: ["Set time"],

    //RESERVATION VALUES
    stadiumSpaceValue: "",
    paymentMethod: "",
    filterColor: "#fff"
  };
  createEvent = () => {
    this.setState({
      modalStadiumDetailVisiable: false

    });
    this.props.navigation.navigate("StadiumRes", {
      data: this.state.markersData
    });
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this.findCoords}>
          <Text>CLICKHERE</Text>
        </TouchableOpacity>
        <MapView
          style={styles.map}
          region={{
            longitude: this.state.longitude1,
            latitude: this.state.latitude1,
            longitudeDelta: 0.0421,
            latitudeDelta: 0.0922
          }}
          showsUserLocation={true}
        >
          {this.state.markers.map((marker, index) => {
            return (
              <TouchableOpacity>
                <Marker
                  key={index}
                  image={require("../pictures/kamuolys.png")}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,

                    longitudeDelta: 0.0421,
                    latitudeDelta: 0.0922
                  }}
                  onPress={() =>
                    this.setState({
                      modalStadiumDetailVisiable: true,
                      markersData: {
                        adress: marker.address,
                        stadiumName: marker.stadiumName,
                        rating: '10',
                        longitude: marker.longitude,
                        latitude: marker.latitude
                      },
                      longitude1: marker.longitude,
                      latitude1: marker.latitude
                    })
                  }
                />
              </TouchableOpacity>
            );
          })}
        </MapView>
        <View style={{ justifyContent: "flex-start", alignItems: "flex-end", marginRight:moderateScale(10) }}>
          <TouchableOpacity
            onPress={this.openFilter}
            style={{
              height: moderateScale(45),
              width: moderateScale(45),
              borderRadius: 90,
              backgroundColor: "hsla(120, 85%, 30%, 0.79)",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Icon
              name="filter"
              size={moderateScale(20)}
              color={this.state.filterColor}
            />
          </TouchableOpacity>
        </View>
        {/* ////////////////////////////////////////---STADIUM DETAILS MODAL---//////////////////////////////////////// */}

        <ModalStadiumDetails
          visible={this.state.modalStadiumDetailVisiable}
          data={this.state.markersData}
          closeModal={this.detailsModalClose}
          createEvent={this.createEvent}
        />
        {/* ________________________________________---STADIUM DETAILS MODAL---________________________________________ */}

        {/* ////////////////////////////////////////---MAKING RESERVATION MODAL---//////////////////////////////////////// */}
        <ModalReservation
          visible={this.state.modalReservationVisible}
          data={this.state.markersData}
          closeModal={this.reservationModalClose}
          createEvent={this.createEvent}
        />
        {/* ________________________________________---MAKING RESERVATION MODAL---________________________________________ */}

        <ModalFilter
          visible={this.state.modalFilterState}
          data={this.state.markersData}
          closeModal={this.closeFilter}
          onConfirm={this.filterStadiums}
        />
      </View>
    );
  }

  // passData() {
  //   this.setState({selectedStadium:
  //     {
  //       stadiumName:props.stadiumName,
  //       adress:props.adress,
  //       rating:props.rating
  //     }});
  //   () => this.refs.modal4.open();

  // }

  filterStadiums = selectedStadiums => {
    let stadiums = Array.from(this.state.markersOfficial);

    const data33 = stadiums.filter(item => item.paid === true);
    console.log(data33, stadiums, selectedStadiums, 'YO');
    // if(!this.state.clicked)
    // this.setState({markers:data, clicked:!this.state.clicked})
    // else
    // this.setState({markers:require('../database/data.json'),clicked:!this.state.clicked})
    let items= Array.from(this.state.markersOfficial);
    if(selectedStadiums.length > 0)
      switch(selectedStadiums[0].id)  {
        case 'byInventor':
          let data2 = items.filter(item => item.inventor === true);
          this.setState({markers:data2,modalFilterState :false})
          console.log('inventor',data2)
        break;
        case 'byPaid':
          let byPaid = items.filter(item => item.isPaid === true);
          this.setState({markers:byPaid,modalFilterState :false})
          console.log('paid', byPaid)
        break;
        case 'byFree':
          let byFree = items.filter(item => item.isPaid === false);
          this.setState({markers:byFree,modalFilterState :false})
          console.log('byFree', byFree)
        break;
        case 'byGrass':
          let byGrass = items.filter(item => item.floorType === "grass");
          this.setState({markers:byGrass,modalFilterState :false})
          console.log('byGrass', byGrass)
        break;
        case 'futsal':
          let futsal = items.filter(item => item.floorType === "futsal");
          this.setState({markers:futsal,modalFilterState :false})
          console.log('futsal', futsal)
        break;
        case 'byPlasticGrass':
          let byPlasticGrass = items.filter(item => item.floorType === "synthetic");
          this.setState({markers:byPlasticGrass,modalFilterState :false})
          console.log('byPlasticGrass', byPlasticGrass)
        break;

        default :
          this.setState({markers:this.state.markersOfficial,modalFilterState :false})
      }
    else
      this.setState({markers:this.state.markersOfficial,modalFilterState :false}, ()=>console.log('Nieko nepasirinkote'))
  };

  reservationModalClose = () => {
    this.setState({ modalReservationVisible: false });
  };

  detailsModalClose = () => {
    this.setState({ modalStadiumDetailVisiable: false });
  };

  //CONFIRMING RESERVATION--------------------------

  openFilter = () => {
    this.setState({ modalFilterState: true });
  };
  closeFilter = () => {
    this.setState({ modalFilterState: false });
  };





  findCoords = async () => {
    Geolocation.getCurrentPosition(
      pos => {
        this.setState({
          longitude1: pos.coords.longitude,
          latitude1: pos.coords.latitude,
          error: null
        });
      },
      error => this.setState({ location: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };


  filterStadiumsBy = async (filter)=>{
    let stadiumArray = []
    let qe= firebase.firestore().collection("stadiums")
    
    await qe.get()
    .then(res=> res.forEach(data=>{
      let stadium = {
        stadiumName:data._document.proto.fields.stadiumName.stringValue,
        address:data._document.proto.fields.address.stringValue,
        longitude:data._document.proto.fields.coordinates.geoPointValue.longitude,
        latitude:data._document.proto.fields.coordinates.geoPointValue.latitude,
        isPaid:data._document.proto.fields.paid.booleanValue,
        phone:data._document.proto.fields.phone.integerValue,
        floorType:data._document.proto.fields.floorType.stringValue,
        stadiumType:data._document.proto.fields.stadiumType.stringValue,
        inventor:data._document.proto.fields.providesInventor.booleanValue,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
      stadiumArray.push(stadium)
      console.log("STADIONAI IS FIREBASE", data, stadium)
  }))
  console.log(stadiumArray)
  this.setState({markers:stadiumArray})

  }
  getStadiumData = async ()=>{
    let stadiumArray = []
    let qe= firebase.firestore().collection("stadiums")
    
    await qe.get()
    .then(res=> res.forEach(data=>{
      let stadium = {
        stadiumName:data._document.proto.fields.stadiumName.stringValue,
        address:data._document.proto.fields.address.stringValue,
        longitude:data._document.proto.fields.coordinates.geoPointValue.longitude,
        latitude:data._document.proto.fields.coordinates.geoPointValue.latitude,
        isPaid:data._document.proto.fields.paid.booleanValue,
        phone:data._document.proto.fields.phone.integerValue,
        floorType:data._document.proto.fields.floorType.stringValue,
        stadiumType:data._document.proto.fields.stadiumType.stringValue,
        inventor:data._document.proto.fields.providesInventor.booleanValue,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
      stadiumArray.push(stadium)
      console.log("STADIONAI IS FIREBASE", data, stadium)
  }))
  console.log(stadiumArray)
  this.setState({markers:stadiumArray, markersOfficial:stadiumArray})

  }


  componentDidMount() {
    // const res = db.collection('stadiums')
    // console.log(res)
    this.findCoords();
    this.getStadiumData()
    LocaleConfig.locales["lt"] = {
      monthNames: [
        "Sausis",
        "Vasaris",
        "Kovas",
        "Balandis",
        "Gegužė",
        "Birželis",
        "Liepa",
        "Rugpjūtis",
        "Rugsėjis",
        "Spalis",
        "Lapkritis",
        "Gruodis"
      ],
      monthNamesShort: [
        "Sau.",
        "Vas.",
        "Kov.",
        "Bal",
        "Geg.",
        "Bir.",
        "Lie.",
        "Rugp.",
        "Rugs.",
        "Spal.",
        "Lap.",
        "Gruo."
      ],
      dayNames: [
        "Pirmadienis",
        "Antradienis",
        "Trečiadienis",
        "Ketvirtadienis",
        "Penktadienis",
        "Šeštadienis",
        "Sekmadienis"
      ],
      dayNamesShort: ["Pirm", "Antr", "Treč", "Ket", "Pen", "Šeš", "Sek"]
    };

    LocaleConfig.defaultLocale = "lt";
  }
  async componentWillMount() {
    await requestLocationPermission();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  modal4: {
    height: 400
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
  },
  modalReserve: {
    height: 650
  },
  modalEvent: {
    height: 600
  },

  modalView1: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 50
  },
  modalView2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 50
  },

  text: {
    color: "black",
    fontSize: 22,
    marginBottom: 10
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 5
  },
  buttonEdit: {
    backgroundColor: "orange",
    marginLeft: 10
  }
});
export default connect(({ dispatch }) => ({ dispatch }))(Main);
