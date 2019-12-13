import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  FlatList,
  TextInput,
  Picker
} from "react-native";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import Modal from "react-native-modalbox";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import Spinner from "react-native-loading-spinner-overlay";
import ModalCreateEvent from "../components/modalAddEvent";
import ModalEditEvent from "../components/modalEditEvent";
import { moderateScale } from "../components/ScaleElements";
import firebase from "firebase";
import "firebase/firestore";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTodaysDate } from "../components/getTodaysDate";
import FlashMessage from "react-native-flash-message";
import { Dimensions } from "react-native";
class Events extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      eventsDetails: null,
      isOpen2: false,
      activeEventsNumb: null,
      chosenTab:1,
      //Flatlist Data
      eventDetails: {
        stadiumName: "Name",
        eventDate: "TIME",
        stadiumRating: "10/50",
        stadiumImage: "dsa",
        peopleNeed: "10",
        id: "10",
        comment: "dsadad"
      },
      userEventsDetails: [],
      refresh: false,
      spinner: false,
      usersEvents: [],
      //Flatlist DATA
      eventsArray: [],
      allEvents: [],
      ok: [],
      modalEditEventVis: false,
      //Modal values
      modalCreateEventVisible: false,
      isDisabled: false,
      swipeToClose: true,

      //DataPICKER VALUES
      isDateTimePickerVisible: false,
      dateTime: ["Set time"],

      //BlankVALUES
      peopleNumber: "",
      text1: "",
      text2: ""
    };
  }
  static navigationOption = {
    title: "Here you can see your events?"
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5FCFF",
          flexDirection: "column"
        }}
      >
        {/*style={[styles.tabStyle,this.state.chosenTab===3?{backgroundColor:'lightblue'}:null]}*/}
        <View style={{justifyContent:'flex-start',alignItems:'center',backgroundColor:'white',flexDirection:'row', height:moderateScale(35), width:Dimensions.get("window").width}}>
          <View style={[styles.tabStyle]} ><TouchableOpacity onPress={()=>this.chooseTab(1)}><Text style={[(this.state.chosenTab===1?styles.chosenTabText:null)]}>Žaidėjų paieška</Text></TouchableOpacity></View>
          <View style={[styles.tabStyle,{ borderLeftWidth:1, borderRightWidth:1, borderColor:'grey',}]}><TouchableOpacity onPress={()=>this.chooseTab(2)}><Text style={[this.state.chosenTab===2?styles.chosenTabText:null]}>Mano paieška</Text></TouchableOpacity></View>
          <View style={[styles.tabStyle]}><TouchableOpacity onPress={()=>this.chooseTab(3)}><Text style={[this.state.chosenTab===3?styles.chosenTabText:null]}>Treniruotės</Text></TouchableOpacity></View>
        </View>
        {this.state.chosenTab===1?<View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5FCFF",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "stretch",
              marginLeft: 10,
              marginTop: 30,
              width: moderateScale(330)
            }}
          >
            <View
              style={{ justifyContent: "flex-start", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Žaidėjų paieška
              </Text>
            </View>
            <View style={{ justifyContent: 'space-around', alignItems: "center",alignSelf:'flex-end', flexDirection:'row',width:moderateScale(100) }}>
              <TouchableOpacity style={{justifyContent:'flex-start', alignSelf:'flex-start'}} onPress={this.openModalCreateEvent}>
                <FontAwesome5 name="filter" size={moderateScale(20)} color="#90c5df" />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.openModalCreateEvent}>
                <FontAwesome5 name="plus" size={moderateScale(21)} color="#90c5df" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            style={{ marginTop: 2, flex: 1 }}
            data={this.state.allEvents}
            renderItem={this.renderItems}
            keyExtractor={item => item.id}
            extraData={this.state.allEvents}
            onRefresh={() => this.onRefreshing()}
            refreshing={this.state.refresh}
            ListEmptyComponent={this.renderEmptyEventList}
          />
        </View>:null}
        {this.state.chosenTab===2?<View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5FCFF",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "stretch",
              marginLeft: 10,
              marginTop: 30,
              width: moderateScale(330)
            }}
          >
            <View
              style={{ justifyContent: "flex-start", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Mano paieškos
              </Text>
            </View>
            <View
              style={{ justifyContent: "flex-end", alignItems: "center" }}
            ></View>
          </View>

          <FlatList
            style={{ marginTop: 2, flex: 1 }}
            data={this.state.usersEvents}
            renderItem={this.renderUsersEvents}
            keyExtractor={item => item.id}
            extraData={this.state.usersEvents}
            onRefresh={() => this.onRefreshing()}
            refreshing={this.state.refresh}
            ListEmptyComponent={this.renderEmptyUserEventList}
          />
        </View>:null}
        {this.state.chosenTab===3?<View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F5FCFF",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "stretch",
              marginLeft: 10,
              marginTop: 30,
              width: moderateScale(330)
            }}
          >
            <View
              style={{ justifyContent: "flex-start", alignItems: "center" }}
            >
              <Text style={{ fontSize: 20, color: "black" }}>
                Treniruotės
              </Text>
            </View>
            <View
              style={{ justifyContent: "flex-end", alignItems: "center" }}
            ></View>
          </View>

          <FlatList
            style={{ marginTop: 2, flex: 1 }}
            data={this.state.usersEvents}
            renderItem={this.renderUsersEvents}
            keyExtractor={item => item.id}
            extraData={this.state.usersEvents}
            onRefresh={() => this.onRefreshing()}
            refreshing={this.state.refresh}
            ListEmptyComponent={this.renderEmptyTrainingList}
          />
        </View>:null}
        <ModalCreateEvent
          visible={this.state.modalCreateEventVisible}
          data={this.state.eventsDetails}
          closeModal={this.closeModalCreateEvent}
          createEvent={this.createNewSearch}
        />
        <ModalEditEvent
          visible={this.state.modalEditEventVis}
          data={this.state.userEventsDetails}
          closeModal={this.closeModalCreateEvent}
          editEvent={this.editEvent}
          deleteEvent={this.deleteUsersEvent}
        />
        <FlashMessage ref="warnning" position="top" />
        <Spinner
          visible={this.state.spinner}
          textContent={this.state.spinnerText}
          textStyle={{ color: "#fff" }}
          overlayColor="rgba(0,0,0,0.5)"
        />
      </View>
    );
  }
  chooseTab = (tab)=>{
    this.setState({chosenTab:tab})
  }

  //CREATING AN EVENT-------------------------------------
  openModalCreateEvent = data => {
    if (data !== undefined)
      this.setState({ modalCreateEventVisible: true, eventsDetails: data });
    else this.setState({ modalCreateEventVisible: false });
  };
  openModalEditEvent = data => {
    if (data !== undefined)
      this.setState({ modalEditEventVis: true, userEventsDetails: data });
    else this.setState({ modalEditEventVis: false });
  };
  closeModalCreateEvent = () => {
    this.setState({
      modalCreateEventVisible: false,
      modalEditEventVis: false
    });
  };
  getUsersEvents = async () => {
    let eventList = [];
    let today = getTodaysDate();
    await firebase
      .firestore()
      .collection("events")
      .where("userId", "==", this.props.userId)
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc")
      .get()
      .then(res =>
        res.forEach(data => {
          console.log("datapareina", data);
          let eventDetails = {
            stadiumName: data._document.proto.fields.stadiumName.stringValue,
            eventDate: data._document.proto.fields.eventDate.stringValue,
            eventStart: data._document.proto.fields.eventStart.stringValue,
            peopleNeed: data._document.proto.fields.peopleNeeded.integerValue,
            creatorsId:data._document.proto.fields.userId.stringValue,
            id: data.id
          };
          eventList.push(eventDetails);
          console.log(eventList);
        })
      );
    this.setState({
      usersEvents: eventList,
      activeEventsNumb: eventList.length
    });
  };

  //-------------------------------------CREATING AN EVENT

  settingState = async data => {
    console.log("SETINAMAS", data);
    this.setState({ allEvents: data });
  };
  newEvenet = async () => {
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    let eventList = [];
    await firebase
      .firestore()
      .collection("events")
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc")
      .orderBy("eventStart", "asc")
      .get()
      .then(res =>
        res.forEach(data => {
          let eventDetails = {
            stadiumName: data._document.proto.fields.stadiumName.stringValue,
            eventDate: data._document.proto.fields.eventDate.stringValue,
            eventStart: data._document.proto.fields.eventStart.stringValue,
            peopleNeed: data._document.proto.fields.peopleNeeded.integerValue,
            creatorsId:data._document.proto.fields.userId.stringValue,
            id: data.id
          };

          if (eventDetails.eventDate === today) {
            if (eventDetails.eventStart > nowTime) {
              eventList.push(eventDetails);
              console.log("Eventas", eventList, eventList.length);
            }
          } else {
            eventList.push(eventDetails);
          }
        })
      );

    await this.settingState(eventList);
  };

  onRefreshing = () => {
    this.setState(
      { refresh: true },
      () => this.newEvenet(),
      this.getUsersEvents()
    );
    setTimeout(() => {
      this.setState({ refresh: false });
    }, 2000);
  };
  componentDidUpdate(prevProps) {
    let dataFromProps = this.props.navigation.getParam("reservationData");
    let propsData = this.props.navigation.getParam("dateTime");
    let prevPropsData = prevProps.navigation.getParam("dateTime");
    let thisId = this.props.navigation.getParam("resId");
    let prevId = prevProps.navigation.getParam("resId");
    console.log("Prev,", prevPropsData, prevId, "this", propsData, thisId);
    if (prevPropsData !== propsData || thisId !== prevId) {
      console.log("(. )( .)", dataFromProps);
      this.openModalCreateEvent(dataFromProps);
    }
  }
  componentDidMount() {
    this.getUsersEvents();
    this.getActiveEventsNumb();
    let propsSuccess = this.props.navigation.getParam("success");
    let dataFromProps = this.props.navigation.getParam("reservationData");
    if (propsSuccess) {
      console.log("(. )( .)", propsSuccess);
      this.openModalCreateEvent(dataFromProps);
    }
    this.newEvenet();
  }

  //EVENT SETTER-------------------------------------

  renderItems = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flexDirection: "row",
          width: moderateScale(330),
          flex: 1,
          height: moderateScale(70),
          marginTop: 20,
          borderRadius: 5,
          borderColor: "#90c5df",
          borderBottomWidth: 2,
          justifyContent: "space-evenly"
        }}
      >
        <View
          style={{
            borderColor: "#90c5df",
            justifyContent: "center",
            alignItems: "center",
            flex: 2
          }}
        >
          <Image
            style={{ width: 100, height: 60, resizeMode: "contain" }}
            source={require("../pictures/new.jpg")}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 3
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: moderateScale(14),
              fontWeight: "600"
            }}
          >
            {item.eventDate}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            {item.eventStart}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            {item.stadiumName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'center',
            flex: 1
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => navigate("EventsDetails", { item1: item })}
          >
            <FontAwesome5
              name="user-plus"
              size={25}
              color="hsl(126, 62%, 40%)"
            />
            <Text style={{ fontSize: 17, color: "black", marginLeft: 5 }}>
              {item.peopleNeed}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderUsersEvents = ({ item }) => {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flexDirection: "row",
          width: moderateScale(330),
          flex: 1,
          height: moderateScale(70),
          marginTop: 20,
          borderRadius: 5,
          borderColor: "#90c5df",
          borderBottomWidth: 2,
          justifyContent: "space-evenly"
        }}
      >
        <View
          style={{
            borderColor: "#90c5df",
            justifyContent: "center",
            alignItems: "center",
            flex: 2
          }}
        >
          <Image
            style={{ width: 100, height: 60, resizeMode: "contain" }}
            source={require("../pictures/new.jpg")}
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flex: 3
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: moderateScale(14),
              fontWeight: "600"
            }}
          >
            {item.eventDate}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            {item.eventStart}
          </Text>
          <Text style={{ color: "black", fontSize: moderateScale(14) }}>
            {item.stadiumName}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            flex: 1
          }}
        >
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <FontAwesome5
              name="user-plus"
              size={25}
              color="hsl(126, 62%, 40%)"
            />
            <Text style={{ fontSize: 17, color: "black", marginLeft: 5 }}>
              {item.peopleNeed}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => this.openModalEditEvent(item)}
          >
            <Ionicons
              name="ios-options"
              size={moderateScale(23)}
              color="orange"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderEmptyEventList = () => {
    return (
      <View
        style={[
          styles.container,
          {
            width: moderateScale(330),
            flex: 1,
            height: moderateScale(70)
          }
        ]}
      >
        <View style={styles.all}>
          <Ionicons
            name="md-information-circle-outline"
            size={moderateScale(30)}
            color="#555"
          />
          <Text style={{ fontSize: moderateScale(17), color: "lightgrey" }}>
            Šiuo metu nėra aktyvių paieškų. . .
          </Text>
        </View>
      </View>
    );
  };
  renderEmptyUserEventList = () => {
    return (
      <View
        style={[
          styles.container,
          {
            width: moderateScale(330),
            flex: 1,
            height: moderateScale(70)
          }
        ]}
      >
        <View style={styles.all}>
          <Ionicons
            name="md-information-circle-outline"
            size={moderateScale(30)}
            color="#555"
          />
          <Text style={{ fontSize: moderateScale(17), color: "lightgrey" }}>
            Neturite aktyvių paieškų. . .
          </Text>
        </View>
      </View>
    );}
    renderEmptyTrainingList = () => {
      return (
        <View
          style={[
            styles.container,
            {
              width: moderateScale(330),
              flex: 1,
              height: moderateScale(70)
            }
          ]}
        >
          <View style={styles.all}>
            <Ionicons
              name="md-information-circle-outline"
              size={moderateScale(30)}
              color="#555"
            />
            <Text style={{ fontSize: moderateScale(17), color: "lightgrey" }}>
              Nesate prisijungęs prie treniruočių. . .
            </Text>
          </View>
        </View>
      );
  };
  //-------------------------------------EVENT SETTER

  deleteUsersEvent = async docId => {
    this.startSpinner("Trinama paieška...");
    console.log("ID?", docId);
    await firebase
      .firestore()
      .collection("events")
      .doc(docId)
      .delete();
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.getUsersEvents();
        this.refs.warnning.showMessage({
          message: "Jūsų paieška sėkmingai ištrinta!",
          type: "success",
          duration: 7000,
          autoHide: true,
          hideOnPress: true
        });
      });
    }, 5000);
  };

  editEvent = async data => {
    this.startSpinner("Redaguojama paieška...");
    let searchData = {
      eventStart: data.eventStart,
      eventDate: data.eventDate,
      peopleNeeded: data.peopleNeeded,
      stadiumName: data.stadiumName,
      userId: this.props.userId
    };
    console.log("PATAISYTA DATA. ", searchData);
    await firebase
      .firestore()
      .collection("events")
      .doc(data.id)
      .update(searchData);
    setTimeout(() => {
      this.setState({ spinner: false }, () => {
        this.getUsersEvents();
        this.refs.warnning.showMessage({
          message: "Jūsų paieška sėkmingai redaguota!",
          type: "success",
          duration: 7000,
          autoHide: true,
          hideOnPress: true
        });
      });
    }, 5000);
  };
  createNewSearch = async data => {
    this.startSpinner("Kuriama paieška...");
    console.log("KOKIE CIA DUOMENYS?", data);
    // -------------------------------_-----------------------------------------------------------------TIKRINAM DABAR KAS CIA PER DUOMENYS ATEINA NES IS PROPSU UNDEFINED DBR GI...

    let searchData = {
      eventStart: data.eventStart,
      eventDate: data.eventDate,
      peopleNeeded: data.peopleNeeded,
      stadiumName: data.stadiumName,
      userId: this.props.userId
    };
    console.log(
      "Ar parein tvarkinga data?",
      searchData,
      this.state.activeEventsNumb
    );
    if (this.state.activeEventsNumb < 3) {
      await firebase
        .firestore()
        .collection("events")
        .add(searchData)
        .then(res => {
          searchData.eventId = res.id;
        });
      setTimeout(() => {
        this.setState({ spinner: false }, () => {
          this.getUsersEvents();
          this.newEvenet();
          this.refs.warnning.showMessage({
            message: "Sėkmingai pridėta paieška!",
            type: "success",
            duration: 10000,
            autoHide: true,
            hideOnPress: true
          });
        });
      }, 5000);
    } else {
      this.setState({ spinner: false });
      this.refs.warnning.showMessage({
        message: "Viršijote leistiną aktyvių paieškų limitą",
        type: "danger",
        duration: 10000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };
  startSpinner = text => {
    this.setState({
      spinnerText: text,
      spinner: true,
      modalCreateEventVisible: false,
      modalEditEventVis: false
    });
  };
  async getActiveEventsNumb() {
    let today = getTodaysDate();
    let list = [];
    let qwery = firebase
      .firestore()
      .collection("events")
      .where("userId", "==", this.props.userId)
      .where("eventDate", ">=", today)
      .orderBy("eventDate", "asc");
    await qwery.get().then(res => {
      console.log("AR VYKST KAZKS", res);
      if (res.docs.length > 0) {
        var counteris = 0;
        res.forEach(data => {
          if (
            this.checkIfResActive({
              start: data._document.proto.fields.eventStart.stringValue,
              date: data._document.proto.fields.eventDate.stringValue
            })
          ) {
            list.push(data);
          }
        });
      }
    });
    this.setState({ activeEventsNumb: list.length }, () => {
      console.log("Aktyvios paieškos!:", this.state.activeEventsNumb, list);
    });
  }
  checkIfResActive = item => {
    let today = getTodaysDate();
    let timeNow = getTodaysTime();
    console.log("asdsa", timeNow, item.date);
    if (item.date > today) return true;
    else if (item.date === today) {
      if (timeNow < item.start) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  //DATA PICKER-------------------------------------
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ dateTime: moment(date).format("YYYY Do MMMM, HH:mm") });
    console.log(this.state.dateTime);
    this.hideDateTimePicker();
  };

  ////-------------------------------------DATA PICKER
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  modal4: {
    height: 400
  },
  tabStyle:{
    flex:1, justifyContent:'center', alignItems:'center',backgroundColor:'white'
  },
  chosenTabText:{
    fontWeight:'600',
    color:'black',
    fontSize:moderateScale(15)
  },
  all: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  modal: {
    justifyContent: "center",
    alignItems: "center"
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
    fontSize: 22
  },
  button: {
    width: 300,
    height: 50,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  }
});
const mapStateToProps = state => ({
  userId: state.auth.userUid
});
export default connect(mapStateToProps)(Events);
