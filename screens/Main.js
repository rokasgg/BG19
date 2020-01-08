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
  Picker,
  Dimensions
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation, { watchPosition } from "react-native-geolocation-service";
import { connect } from "react-redux";
import ModalStadiumDetails from "../components/modalStadiumDetails";
import ModalReservation from "../components/modalReservation";
import ModalFilter from "../components/modalFilter";
import ModalAddStadiums from "../components/modalAddStadiums";
import ModalRegisterAdmin from "../components/modalRegisterAdmin";
import gettingActiveRes from "../redux/actions/getActiveResAction";
import gettingStadiums from "../redux/actions/getStadiumsAction";
import { LocaleConfig } from "react-native-calendars";
import { moderateScale } from "../components/ScaleElements.js";
import Icon from "react-native-vector-icons/AntDesign";
import FontIcons from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getTodaysTime } from "../components/getTodaysTime";
import FlashMessage from "react-native-flash-message";
import ModalEditStadium from "../components/editStadium";
import firebase from "firebase";
import "firebase/firestore";


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
    mapLatitude: 54.6891594,
    mapLongitude: 25.2798004,
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
    modalRegisterAdmin: false,
    stadiumAdminData: null,

    //Markers of all stadiums.
    markers: require("../database/data.json"),
    selectedStadium: [],
    setModalVisible: false,
    //Reservation modal
    modalReservationVisible: false,
    modalAddStadiums: false,
    modalEditStadium: false,
    //Modal values
    modalStadiumDetailVisiable: false,
    isDisabled: false,
    swipeToClose: true,
    modalFilterState: false,
    lastMarkersData: [],
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
            latitude: this.state.mapLatitude,
            longitude: this.state.mapLongitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
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
                  style={{backgroundColor:'yellow'}}
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
                          phone: marker.phone,
                          paid:marker.isPaid,
                          price:marker.price
                        },
                        mapLongitude: marker.longitude,
                        mapLatitude: marker.latitude,
                        lastMarkersData: marker
                      },
                      () => {
                        console.log("pute", marker);
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
            flexDirection: "row",
            paddingTop: moderateScale(5)
          }}
        >
          <View
            style={{
              alignItems: "flex-start",
              marginLeft: moderateScale(10),
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={this.findCoords}
              style={{
                height: moderateScale(35),
                width: moderateScale(35),
                borderRadius: 90,
                backgroundColor: "hsla(240, 50%, 50%, 0.79)",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <FontIcons
                name="location-arrow"
                size={moderateScale(18)}
                color={this.state.filterColor}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignItems: "flex-end",
              marginRight: moderateScale(10),
              flex: 1
            }}
          >
            <TouchableOpacity
              onPress={this.openFilter}
              style={{
                height: moderateScale(45),
                width: moderateScale(45),
                borderRadius: 90,
                backgroundColor: "hsla(201, 50%, 50%,0.8)",
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
        </View>
        {this.props.isAdmin ? (
          <View
            style={{
              flexDirection: "row",
              paddingBottom: moderateScale(30),
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - moderateScale(100)
            }}
          >
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-start",
                marginLeft: moderateScale(10),
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={this.openAddStadium}
                style={{
                  height: moderateScale(37),
                  width: moderateScale(37),
                  borderRadius: 90,
                  backgroundColor: "hsla(240, 50%, 50%, 0.79)",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <MaterialIcons
                  name="note-add"
                  size={moderateScale(19)}
                  color={this.state.filterColor}
                />
              </TouchableOpacity>
            </View>
            {/* <View
              style={{
                alignItems: "flex-end",
                marginRight: moderateScale(10),
                flex: 1
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
            </View> */}
          </View>
        ) : null}
        {this.props.isAdministrator ? (
          <View
            style={{
              flexDirection: "row",
              paddingBottom: moderateScale(30),
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height - moderateScale(100)
            }}
          >
            <View
              style={{
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginRight: moderateScale(10),
                marginTop: moderateScale(10),
                flex: 1
              }}
            >
              <TouchableOpacity
                onPress={this.checkReservations}
                style={{
                  height: moderateScale(37),
                  width: moderateScale(37),
                  borderRadius: 90,
                  backgroundColor: "hsla(300, 45%, 35%, 0.75)",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <MaterialIcons
                  name="import-contacts"
                  size={moderateScale(19)}
                  color={this.state.filterColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <FlashMessage ref="stadiumAdd" position="top" />
        {/* ////////////////////////////////////////---STADIUM DETAILS MODAL---//////////////////////////////////////// */}

        <ModalStadiumDetails
          visible={this.state.modalStadiumDetailVisiable}
          data={this.state.markersData}
          closeModal={this.detailsModalClose}
          createEvent={this.createEvent}
          navigation={this.compareDates}
          editStadium={this.editStadium}
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
          searchByTime={this.searchByTime}
        />
        {/*________________________________________---ADMIN ADDING STADIUMS---__________________________________________*/}
        <ModalAddStadiums
          visible={this.state.modalAddStadiums}
          data={this.state.markersData}
          closeModal={this.closeAddStadium}
          finish={this.addedStadium}
        />
        <ModalRegisterAdmin
          visible={this.state.modalRegisterAdmin}
          data={this.state.stadiumAdminData}
          closeModal={this.closeAddStadium}
          finish={this.finishRegistration}
        />

        <ModalEditStadium
          data={this.state.lastMarkersData}
          closeModal={this.closeFilter}
          visible={this.state.modalEditStadium}
          finish={this.onEditOrDeleteStadium}
        />
      </View>
    );
  }
  addedStadium = data => {
    this.setState(
      {
        modalAddStadiums: false,
        modalRegisterAdmin: true,
        stadiumAdminData: data
      });
  };
  finishRegistration = () => {
    this.setState(
      { modalAddStadiums: false, modalRegisterAdmin: false },
      () => {
        this.getStadiumsData(),
          this.refs.stadiumAdd.showMessage({
            message: "Stadiono administratorius sėkmingai pridėtas!",
            type: "success",
            duration: 7000,
            autoHide: true,
            hideOnPress: true
          });
      }
    );
  };
  onEditOrDeleteStadium = type => {
    this.setState({ modalEditStadium: false }, () => {
      if (type === "delete") {
        this.getStadiumsData(),
          this.refs.stadiumAdd.showMessage({
            message: "Stadionas pašalintas iš sistemos sėkmingai!",
            type: "success",
            duration: 7000,
            autoHide: true,
            hideOnPress: true
          });
      } else if (type === "edit") {
        this.getStadiumsData(),
          this.refs.stadiumAdd.showMessage({
            message: "Stadiono informacija sėkmingai išsaugota!",
            type: "success",
            duration: 7000,
            autoHide: true,
            hideOnPress: true
          });
      } else {
        this.refs.stadiumAdd.showMessage({
          message: "Įvyko klaida!",
          type: "danger",
          duration: 7000,
          autoHide: true,
          hideOnPress: true
        });
      }
    });
  };
  findMyLocation = () => {
    this.setState({});
  };

  searchByTime = () => {
    this.setState({ modalFilterState: false },()=>this.props.navigation.navigate("FilterByTime"));
    
  };
  filterStadiumsByTime = selectedStadiums => {
    console.log("objetkas", typeof selectedStadiums);
    let filteredStadiums = Array.from(this.state.markersOfficial);
    selectedStadiums.filterBy.forEach(element => {
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
    let data = {
      filteredStadiums,
      date: selectedStadiums.chosenTime
    };
    this.props.navigation.navigate("FilterByTime", { data });
  };

  filterStadiums = selectedStadiums => {
    console.log("koks tipas", typeof selectedStadiums);
    let stadiums = Array.from(this.state.markersOfficial);
    let slength = selectedStadiums.length;
    const data33 = stadiums.filter(item => item.paid === true);
    console.log(data33, stadiums, selectedStadiums, "YO", slength);
    console.log("ka gaunam?", selectedStadiums);
    if (selectedStadiums.chosenTime !== undefined) {
      this.setState({
        modalFilterState: false
      },()=>this.filterStadiumsByTime(selectedStadiums));
      
    } else {
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
    }
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
    this.setState({ modalFilterState: false, modalEditStadium: false });
  };
  closeAddStadium = () => {
    this.setState({ modalAddStadiums: false, modalRegisterAdmin: false });
  };
  openAddStadium = () => {
    this.setState({ modalAddStadiums: true });
  };
  checkReservations = () => {
    this.props.navigation.push("WatchReservations");
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
      error =>
        this.setState({ location: error.message }, () =>
          console.log("negaunu lokacijos", error.message, pos)
        ),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
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
          price:data._document.proto.fields.price.stringValue,
          stadiumId: data.ref.id,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        };
        stadiumArray.push(stadium);
        console.log("STADIONAI IS FIREBASE", data.ref.id, stadium);
      })
    );
    console.log(stadiumArray);

    this.setState(
      { markers: stadiumArray, markersOfficial: stadiumArray },
      () => this.props.gettingStadiums(stadiumArray)
    );
  };

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
  };

  editStadium = () => {
    this.detailsModalClose();
    this.setState({ modalEditStadium: true });
  };

  componentDidMount() {
    //this.findCoords();
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
        "Sekmadienis",
        "Pirmadienis",
        "Antradienis",
        "Trečiadienis",
        "Ketvirtadienis",
        "Penktadienis",
        "Šeštadienis"
      ],
      dayNamesShort: [ "Sek","Pirm", "Antr", "Treč", "Ket", "Pen", "Šeš"]
    };

    LocaleConfig.defaultLocale = "lt";
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
const mapStateToProps = state => ({
  getActiveResNumber: state.active.activeReservationNumber,
  userId: state.auth.userId,
  isAdmin: state.auth.admin,
  isAdministrator: state.auth.administrator
});
export default connect(mapStateToProps, { gettingActiveRes, gettingStadiums })(
  Main
);
