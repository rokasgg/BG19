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
import * as firebase from "firebase";
import { LocaleConfig } from "react-native-calendars";
import { moderateScale } from "../components/ScaleElements.js";
import Icon from "react-native-vector-icons/AntDesign";

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
    markers: [
      {
        id: 1,
        stadiumName: "Daugiabuciu kiemo stadionas",
        rating: "6/10",
        adress: "Minites gatve 42",

        latitude: 54.70315661,
        longitude: 25.29878855,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 1,
        stadiumName: "Fanu stadionas",
        rating: "7/10",
        adress: "Linkmenu g. 8",
        paid: false,

        latitude: 54.70298303,
        longitude: 25.26908684,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 2,
        stadiumName: "Saltoniskiu",
        rating: "7/10",
        paid: false,

        adress: "adresas",
        latitude: 54.7256165,
        longitude: 25.33971691,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 3,
        stadiumName: "Vilniaus futbolo mokykla",
        rating: "6/10",
        paid: true,

        adress: "P. Žadeikos g. 2",
        latitude: 54.73247345,
        longitude: 25.23948812,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 4,
        stadiumName: "Senvages stadionas",
        rating: "8/10",
        paid: true,

        adress: "Širvintų g. 80",
        latitude: 54.71181975,
        longitude: 25.28022765,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 5,
        stadiumName: "LEU stadionas",
        rating: "6/10",
        adress: "Vytauto g. 3",
        paid: true,

        latitude: 54.68641516,
        longitude: 25.25449562,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 6,
        stadiumName: "LFF stadium",
        rating: "10/10",
        adress: "Stadiono g. 2",
        paid: false,

        latitude: 54.6685367,
        longitude: 25.29470536,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 7,
        stadiumName: "Dilgyne",
        rating: "3/10",
        adress: "Užusienio g., Užusieniai",
        paid: true,

        latitude: 54.6341547,
        longitude: 25.24488293,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 8,
        stadiumName: "Dilgyne",
        rating: "3/10",
        adress: "Užusienio g., Užusieniai",
        paid: false,

        latitude: 54.70016598,
        longitude: 25.28913259,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 9,
        stadiumName: "Dilgyne",
        rating: "3/10",
        adress: "Užusienio g., Užusieniai",
        latitude: 55.730496,
        longitude: 24.369558,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    ],
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
    filterColor: "hsla(120, 85%, 30%, 0.79)"
  };
  createEvent = () => {
    this.setState({
      modalStadiumDetailVisiable: false

      // isOpenEvent: true,

      // stadiumSpaceValue: "",
      // paymentMethod: "",
      // dateTime: ["Set time"]
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
          {this.state.markers.map(marker => {
            return (
              <TouchableOpacity>
                <Marker
                  key={marker.id}
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
                        adress: marker.adress,
                        stadiumName: marker.stadiumName,
                        rating: marker.rating,
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
        <View style={{ justifyContent: "flex-start", alignItems: "flex-end" }}>
          <TouchableOpacity
            onPress={this.openFilter}
            style={{
              height: moderateScale(45),
              width: moderateScale(45),
              borderRadius: 90,
              backgroundColor: "#FFF",
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
    let stadiums = this.state.markers;
    const data = stadiums.filter(item => item.id === 1);
    console.log(data, stadiums);
    if(!this.state.clicked)
    this.setState({markers:data, clicked:!this.state.clicked})
    else
    this.setState({markers:[
      {
        id: 1,
        stadiumName: "Daugiabuciu kiemo stadionas",
        rating: "6/10",
        adress: "Minites gatve 42",

        latitude: 54.70315661,
        longitude: 25.29878855,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 1,
        stadiumName: "Fanu stadionas",
        rating: "7/10",
        adress: "Linkmenu g. 8",
        paid: false,

        latitude: 54.70298303,
        longitude: 25.26908684,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 2,
        stadiumName: "Saltoniskiu",
        rating: "7/10",
        paid: false,

        adress: "adresas",
        latitude: 54.7256165,
        longitude: 25.33971691,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 3,
        stadiumName: "Vilniaus futbolo mokykla",
        rating: "6/10",
        paid: true,

        adress: "P. Žadeikos g. 2",
        latitude: 54.73247345,
        longitude: 25.23948812,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 4,
        stadiumName: "Senvages stadionas",
        rating: "8/10",
        paid: true,

        adress: "Širvintų g. 80",
        latitude: 54.71181975,
        longitude: 25.28022765,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 5,
        stadiumName: "LEU stadionas",
        rating: "6/10",
        adress: "Vytauto g. 3",
        paid: true,

        latitude: 54.68641516,
        longitude: 25.25449562,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 6,
        stadiumName: "LFF stadium",
        rating: "10/10",
        adress: "Stadiono g. 2",
        paid: false,

        latitude: 54.6685367,
        longitude: 25.29470536,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 7,
        stadiumName: "Dilgyne",
        rating: "3/10",
        adress: "Užusienio g., Užusieniai",
        paid: true,

        latitude: 54.6341547,
        longitude: 25.24488293,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 8,
        stadiumName: "Dilgyne",
        rating: "3/10",
        adress: "Užusienio g., Užusieniai",
        paid: false,

        latitude: 54.70016598,
        longitude: 25.28913259,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      {
        id: 9,
        stadiumName: "Dilgyne",
        rating: "3/10",
        adress: "Užusienio g., Užusieniai",
        latitude: 55.730496,
        longitude: 24.369558,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    ],clicked:!this.state.clicked})
    // if (selectedStadiums !== undefined && selectedStadiums.length !== 0) {
    //   this.setState({
    //     modalFilterState: false,
    //     markers: data
    //   });
    // } else {
    //   this.setState(
    //     {
    //       modalFilterState: false
    //     },
    //     () =>
    //       console.log(
    //         this.state.markers,
    //         this.state.modalFilterState,
    //         selectedStadiums
    //       )
    //   );
    // }
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
  //--------------------------CONFIRMING RESERVATION

  triggerModal = () => {
    this.setState({
      modalStadiumDetailVisiable: true,
      markersData: {
        adress: marker.adress,
        stadiumName: marker.stadiumName,
        rating: marker.rating,
        longitude: marker.longitude,
        latitude: marker.latitude
      },
      longitude1: marker.longitude,
      latitude1: marker.latitude
    });
  };
  //DATA PICKER-------------------------------------
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ dateTime: moment(date).format("YYYY MM DD, HH:mm") });
    console.log(this.state.dateTime);
    this.hideDateTimePicker();
  };
  ////-------------------------------------DATA PICKER

  setModalItem = marker => {
    this.setState(
      {
        selectedStadium: marker
      },
      () => {
        this.setModalVisible(true);
      }
    );
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

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

  getLoc = async () => {
    return getCurrentLocation().then(position => {
      if (position) {
        this.setState({
          cord: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003
          }
        });
      }
    });
  };

  componentDidMount() {
    // const res = db.collection('stadiums')
    // console.log(res)
    this.findCoords();
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
