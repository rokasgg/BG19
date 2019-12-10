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
import { connect } from "react-redux";
import ModalStadiumDetails from "../components/modalStadiumDetails";
import ModalReservation from "../components/modalReservation";
import ModalFilter from "../components/modalFilter";

import { LocaleConfig } from "react-native-calendars";
import { moderateScale } from "../components/ScaleElements.js";
import Icon from "react-native-vector-icons/AntDesign";
import { getTodaysTime } from "../components/getTodaysTime";
import firebase from "firebase";
import "firebase/firestore";

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
    mapLatitude: 0,
    mapLongitude: 0,
    location: "Your location is set!",
    clicked: false,
    //Passing data to modal(markers)
    markersData: {
      stadiumName: "",
      adress: "",
      rating: "",
      longitude: "",
      latitude: ""
    },

    //Markers of all stadiums.
    markers: require("../database/data.json"),
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
        <MapView
          style={styles.map}
          region={{
            longitude: this.state.mapLongitude,
            latitude: this.state.mapLatitude,
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
                    this.setState(
                      {
                        modalStadiumDetailVisiable: true,
                        markersData: {
                          adress: marker.address,
                          stadiumName: marker.stadiumName,
                          rating: "10",
                          longitude: marker.longitude,
                          latitude: marker.latitude,
                          stadiumId: marker.stadiumId,
                          floorType: marker.floorType,
                          stadiumType: marker.stadiumType,
                          phone: marker.phone
                        },
                        mapLongitude: marker.longitude,
                        mapLatitude: marker.latitude
                      },
                      () => {
                        console.log(marker);
                      }
                    )
                  }
                />
              </TouchableOpacity>
            );
          })}
        </MapView>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginRight: moderateScale(10)
          }}
        >
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
          navigation={this.compareDates}
        />
        {/* ________________________________________---STADIUM DETAILS MODAL---________________________________________ */}

        {/* ////////////////////////////////////////---MAKING RESERVATION MODAL---//////////////////////////////////////// */}
        <ModalReservation
          visible={this.state.modalReservationVisible}
          data={this.state.markersData}
          closeModal={this.reservationModalClose}
          createEvent={this.createEvent}
        />
        {/* ________________________________________---FILTRAS---________________________________________ */}

        <ModalFilter
          visible={this.state.modalFilterState}
          data={this.state.markersData}
          closeModal={this.closeFilter}
          onConfirm={this.filterStadiums}
        />
      </View>
    );
  }

  filterStadiums = selectedStadiums => {
    let stadiums = Array.from(this.state.markersOfficial);
    let slength = selectedStadiums.length;
    const data33 = stadiums.filter(item => item.paid === true);
    console.log(data33, stadiums, selectedStadiums, "YO", slength);

    if (selectedStadiums.length > 0) {
      let filteredStadiums = Array.from(this.state.markersOfficial);
      selectedStadiums.forEach(element => {
        switch (element.type) {
          case "inventor":
            filteredStadiums = filteredStadiums.filter(
              item => item.inventor === true
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "paid":
            filteredStadiums = filteredStadiums.filter(
              item => item.isPaid === true
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "free":
            filteredStadiums = filteredStadiums.filter(
              item => item.isPaid === false
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "grass":
            filteredStadiums = filteredStadiums.filter(
              item => item.floorType === "grass"
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "futsal":
            filteredStadiums = filteredStadiums.filter(
              item => item.floorType === "futsal"
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "indoor":
            filteredStadiums = filteredStadiums.filter(
              item => item.stadiumType === "indoor"
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "outdoor":
            filteredStadiums = filteredStadiums.filter(
              item => item.stadiumType === "outdoor"
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          case "synthetic":
            filteredStadiums = filteredStadiums.filter(
              item => item.floorType === "synthetic"
            );
            this.setState({
              markers: filteredStadiums,
              modalFilterState: false
            });
            break;
          default:
            this.setState({
              markers: this.state.markersOfficial,
              modalFilterState: false
            });
        }
      });
    } else
      this.setState(
        { markers: this.state.markersOfficial, modalFilterState: false },
        () => console.log("Nieko nepasirinkote")
      );
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
          mapLongitude: pos.coords.longitude,
          mapLatitude: pos.coords.latitude,
          error: null
        });
      },
      error => this.setState({ location: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  filterStadiumsBy = async filter => {
    let stadiumArray = [];
    let qe = firebase.firestore().collection("stadiums");

    await qe.get().then(res =>
      res.forEach(data => {
        let stadium = {
          stadiumName: data._document.proto.fields.stadiumName.stringValue,
          address: data._document.proto.fields.address.stringValue,
          longitude:
            data._document.proto.fields.coordinates.geoPointValue.longitude,
          latitude:
            data._document.proto.fields.coordinates.geoPointValue.latitude,
          isPaid: data._document.proto.fields.paid.booleanValue,
          phone: data._document.proto.fields.phone.integerValue,
          floorType: data._document.proto.fields.floorType.stringValue,
          stadiumType: data._document.proto.fields.stadiumType.stringValue,
          inventor: data._document.proto.fields.providesInventor.booleanValue,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        };
        stadiumArray.push(stadium);
        console.log("STADIONAI IS FIREBASE", data, stadium);
      })
    );
    console.log(stadiumArray);
    this.setState({ markers: stadiumArray });
  };
  getStadiumsData = async () => {
    let stadiumArray = [];
    let qe = firebase.firestore().collection("stadiums");

    await qe.get().then(res =>
      res.forEach(data => {
        let stadium = {
          stadiumName: data._document.proto.fields.stadiumName.stringValue,
          address: data._document.proto.fields.address.stringValue,
          longitude:
            data._document.proto.fields.coordinates.geoPointValue.longitude,
          latitude:
            data._document.proto.fields.coordinates.geoPointValue.latitude,
          isPaid: data._document.proto.fields.paid.booleanValue,
          phone: data._document.proto.fields.phone.integerValue,
          floorType: data._document.proto.fields.floorType.stringValue,
          stadiumType: data._document.proto.fields.stadiumType.stringValue,
          inventor: data._document.proto.fields.providesInventor.booleanValue,
          stadiumId: data.ref.id,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        };
        stadiumArray.push(stadium);
        console.log("STADIONAI IS FIREBASE", data.ref.id, stadium);
      })
    );
    console.log(stadiumArray);
    this.setState({ markers: stadiumArray, markersOfficial: stadiumArray });
  };

  getTodaysDate() {
    let today = new Date();

    let day = today.getDate();
    let month = today.getMonth() + 1;
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let year = today.getFullYear();
    let todayIs = `${year}-${month}-${day}`;

    return todayIs;
  }

  getingResTime = () => {
    let nowtime = Date.now();
    let today = new Date();
    let time = {
      mil: today.getMilliseconds(),
      sec: today.getSeconds(),
      min: today.getMinutes(),
      hr: today.getHours()
    };
    let get = today.getTime();
    if (time.sec < 10) time.sec = "0" + time.sec;
    if (time.min < 10) time.min = "0" + time.min;
    if (time.hr < 10) time.hr = "0" + time.hr;

    let formmedtTime = `${time.hr}:${time.min}:${time.sec}:${
      time.mil
    }, Dar priedo ${Date.now()}`;
    return formmedtTime;
  };

  compareDates = () => {
    let timeNow = getTodaysTime();
    let mili = this.getingResTime();
    let mili2 = this.getingResTime();
    let mili3 = this.getingResTime();
    let mili4 = this.getingResTime();
    let mili5 = this.getingResTime();
    console.log(
      "KIEK VALANDU SENI ?",
      "-Dabar yra ",
      timeNow,
      "ir jei rezervuotume laikas yra:",
      mili,
      mili2
    );
    console.log("Time", mili);
    console.log("Time", mili2);
    console.log("Time", mili3);
    console.log("Time", mili4);
    console.log("Time", mili5);
  };

  componentDidMount() {
    // const res = db.collection('stadiums')
    // console.log(res)

    this.findCoords();
    this.getStadiumsData();
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
