import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Button,
  ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "firebase";
import "firebase/firestore";
import Modal from "react-native-modalbox";
import { connect } from "react-redux";
import { moderateScale } from "../components/ScaleElements";
import Icon from "react-native-vector-icons/FontAwesome";
import FlashMessage from "react-native-flash-message";
import { getTodaysTime } from "../components/getTodaysTime";
import { getTodaysDate } from "../components/getTodaysDate";

class EventDetails extends React.Component {
  static navigationOptions = { header: null };
  constructor() {
    super();
    this.state = {
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      spin: false,
      isOpen2: true,
      userJoined: false,
      buttonText: "Prisijungti",
      buttonIcon: "user-plus",
      buttonColor: "hsl(186, 62%, 40%)",
      connectedPlayersList: [],
      refresh: false,
      joinedPeopleCount: 0,
      numbOfPeopleNeeded: null,
      banned: false
    };
  }
  static navigationOption = {
    title: "Where to"
  };
  async componentDidMount() {
    await this.getConnectedPeople();
    await this.checkIfUserIsJoined();
    //this.amIbanned();
  }
  startSpinner = () => {
    this.setState({ spin: true });
  };
  checkIfUserIsJoined = async () => {
    console.log("error", this.state.connectedUsers);
    this.startSpinner();
    let connectedUsers = Array.from(this.state.connectedPlayersList);
    setTimeout(() => {
      let index = connectedUsers.findIndex(
        item => item.userId === this.props.userId
      );
      console.log(index, "ka gaunam  ?");
      if (index !== -1)
        return this.setState({
          buttonIcon: "times",
          buttonText: "Atšaukti",
          buttonColor: "red",
          userJoined: true,
          spin: false
        });
      else
        this.setState({
          buttonText: "Prisijungti",
          buttonIcon: "user-plus",
          buttonColor: "hsl(186, 62%, 40%)",
          userJoined: false,
          spin: false
        });
    }, 2000);
  };

  amIbanned = () => {
    let today = getTodaysDate();
    let nowTime = getTodaysTime();
    firebase
      .firestore()
      .collection("bannedUsers")
      .where("userId", "==", this.props.userId)
      .where("banDate", ">=", today)
      .orderBy("banDate")
      .get()
      .then(res => {
        if (res.docs.length > 0) {
          let banDate = res.docs[0]._document.proto.fields.banDate.stringValue;
          let banTime = res.docs[0]._document.proto.fields.banTime.stringValue;
          if (nowTime <= banTime) {
            this.setState({ banned: true, banTime, banDate });
          }
        }
      });
  };

  escapeEvent = async () => {
    this.setState({ spin: true });

    const propsDataEvent = this.props.navigation.state.params.item1;
    if (this.state.userJoined === true) {
      await firebase
        .firestore()
        .collection("events")
        .doc(propsDataEvent.id)
        .collection("playersList")
        .doc(this.props.userId)
        .delete();
      await firebase
        .firestore()
        .collection("users")
        .doc(this.props.userId)
        .collection("joinedEventsList")
        .doc(propsDataEvent.id)
        .delete();

      this.setState({
        buttonText: "Prisijungti",
        buttonIcon: "user-plus",
        buttonColor: "hsl(186, 62%, 40%)",
        userJoined: false
      });
      this.getConnectedPeople();
      // this.setState({ spin: false });
    }
  };

  getConnectedPeople = async () => {
    this.startSpinner();
    const propsDataEvent = this.props.navigation.state.params.item1;
    let peopleNeeded = propsDataEvent.peopleNeed;
    let joinedPeople = [];
    await firebase
      .firestore()
      .collection("events")
      .doc(propsDataEvent.id)
      .collection("playersList")
      .get()
      .then(res => {
        console.log("playeriai", res.docs.length, res, peopleNeeded);
        let howManyStillNeeded = peopleNeeded - res.docs.length;
        res.forEach(data => {
          joinedPeople.push({
            name: data._document.proto.fields.name.stringValue,
            userId: data._document.proto.fields.userId.stringValue
          });
        });
        this.setState({
          howManyStillNeeded: howManyStillNeeded,
          numbOfPeopleNeeded: peopleNeeded,
          connectedPlayersList: joinedPeople,
          spin: false
        });
      });
  };

  joinEvent = () => {
    const propsData = this.props.navigation.state.params.item1;
    if (!this.state.banned)
      if (this.props.userId !== propsData.creatorsId) {
        if (
          this.state.connectedPlayersList.length < this.state.numbOfPeopleNeeded
        ) {
          if (this.state.userJoined === false) {
            this.startSpinner();
            setTimeout(() => {
              this.setState(
                {
                  buttonIcon: "times",
                  buttonText: "Atšaukti",
                  buttonColor: "red",
                  userJoined: true
                },
                () => this.join()
              );
            }, 2000);
          } else {
            this.refs.warnning.showMessage({
              message: "Nebėra vietos !",
              type: "warning",
              duration: 7000,
              autoHide: true,
              hideOnPress: true
            });
          }
        }
      } else {
        this.refs.warnning.showMessage({
          message: "Seni cia gi tavo sukurtas eventas :Dd !",
          type: "warning",
          duration: 7000,
          autoHide: true,
          hideOnPress: true
        });
      }
    else {
      this.refs.warnning.showMessage({
        message: `Jums uždrausta dalyvauti žaidime iki ${this.state.banDate} ${this.state.banTime}!`,
        type: "warning",
        duration: 7000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };
  join = async () => {
    const propsData = this.props.navigation.state.params.item1;
    await firebase
      .firestore()
      .collection("events")
      .doc(propsData.id)
      .collection("playersList")
      .doc(this.props.userId)
      .set({
        name: this.props.userName,
        userId: this.props.userId,
        approved: false
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(this.props.userId)
      .collection("joinedEventsList")
      .doc(propsData.id)
      .set({
        stadiumName: propsData.stadiumName,
        address: propsData.address,
        eventDate: propsData.eventDate,
        eventStart: propsData.eventStart,
        peopleNeeded: parseInt(propsData.peopleNeed),
        approved: false
      });
    this.getConnectedPeople();
  };

  render() {
    let propsData = this.props.navigation.state.params.item1;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignSelf: "flex-start",
            height: moderateScale(30),
            width: moderateScale(100),
            alignItems: "center",
            paddingRight: moderateScale(30)
          }}
          onPress={() => this.props.navigation.goBack()}
        >
          <Ionicons
            name="md-arrow-back"
            size={moderateScale(20)}
            color="gray"
          />
        </TouchableOpacity>
        <View style={styles.topHalf}>
          <Image
            style={{
              width: moderateScale(300),
              height: moderateScale(100),
              resizeMode: "contain"
            }}
            source={require("../pictures/pitch4.png")}
          />
        </View>
        <View style={[styles.bottomHalf]}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Stadiono pavadinimas:</Text>
              <Text style={styles.textRight}>
                {this.props.navigation.state.params.item1.stadiumName}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Adresas:</Text>
              <Text style={styles.textRight}>
                {this.props.navigation.state.params.item1.address}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Ieškomų žmonių skaičius:</Text>
              <Text style={styles.textRight}>
                {this.props.navigation.state.params.item1.peopleNeed}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Data:</Text>
              <Text style={styles.textRight}>
                {this.props.navigation.state.params.item1.eventDate}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: moderateScale(340),
                borderColor: "hsla(126, 62%, 40%, 0.44)",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.textLeft}>Laikas:</Text>
              <Text style={styles.textRight}>
                {this.props.navigation.state.params.item1.eventStart}
              </Text>
            </View>
          </View>

          {this.props.userId !== propsData.creatorsId ? (
            <View style={styles.half2}>
              {this.state.spin ? (
                <TouchableOpacity
                  style={[
                    styles.button1,
                    {
                      borderColor: this.state.buttonColor,
                      justifyContent: "center",
                      alignItems: "center"
                    }
                  ]}
                >
                  <ActivityIndicator size="small" color="lightgray" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.button1,
                    { borderColor: this.state.buttonColor }
                  ]}
                  onPress={
                    this.state.userJoined ? this.escapeEvent : this.joinEvent
                  }
                >
                  <Icon
                    name={this.state.buttonIcon}
                    size={20}
                    color={this.state.buttonColor}
                  />
                  <Text
                    style={{
                      fontSize: moderateScale(15),
                      color: this.state.buttonColor
                    }}
                  >
                    {this.state.buttonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
        <View
          style={[
            styles.container,
            {
              width: moderateScale(330),
              flex: 1,
              height: moderateScale(70),
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: moderateScale(15)
            }
          ]}
        >
          <View style={styles.all}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "stretch",
                width: moderateScale(330)
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  Prisijungę žaidėjai:
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: moderateScale(30)
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 90,
                    width: moderateScale(24),
                    height: moderateScale(24),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "lightgrey"
                  }}
                >
                  <Text
                    style={{
                      fontSize: moderateScale(18),
                      color: "black",
                      fontWeight: "700"
                    }}
                  >
                    {this.state.connectedPlayersList.length}
                  </Text>
                </View>
              </View>
            </View>
            {this.state.spin ? (
              <ActivityIndicator size="small" color="lightgray" />
            ) : (
              <FlatList
                style={{ margin: 2 }}
                numColumns={3}
                data={this.state.connectedPlayersList}
                renderItem={this.renderPlayers}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state.connectedPlayersList}
                refreshing={this.state.refresh}
                ListEmptyComponent={this.renderEmptyUserEventList}
              />
            )}
          </View>
        </View>
        <FlashMessage ref="warnning" position="top" />
      </View>
    );
  }
  renderPlayers = item => {
    return (
      <TouchableOpacity
        style={{
          height: moderateScale(25),
          width: moderateScale(90),
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          borderColor: "hsla(126, 62%, 40%, 0.44)",
          borderWidth: 2,
          margin: 3
        }}
      >
        <Text
          style={{
            color: "lightblue",
            fontWeight: "500",
            fontSize: moderateScale(13)
          }}
        >
          {item.item.name}
        </Text>
      </TouchableOpacity>
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
            height: moderateScale(70),
            paddingTop: moderateScale(20)
          }
        ]}
      >
        <Text style={{ fontSize: 25, color: "lightgrey" }}>
          Sarašas tuščias. . .
        </Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    flexDirection: "column"
  },
  topHalf: {
    justifyContent: "center",
    alignItems: "center"
  },
  all: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  bottomHalf: {
    height: moderateScale(200),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    borderBottomWidth: 2,
    borderColor: "#90c5df",
    width: moderateScale(350)
  },
  text: {
    color: "black",
    fontSize: moderateScale(13)
  },
  post1: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  post2: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end"
  },
  half1: {
    justifyContent: "space-between",
    alignItems: "baseline",
    flexDirection: "row",
    flex: 1,
    width: moderateScale(350)
  },
  half2: {
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    width: moderateScale(350),
    marginBottom: 10
  },
  button1: {
    width: moderateScale(110),
    height: moderateScale(30),
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 2,
    flexDirection: "row",
    borderRadius: 5
  },
  textLeft: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop: 5,
    textAlign: "left",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 5
  },
  textRight: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 5,
    marginTop: 5,
    textAlign: "right",
    justifyContent: "flex-end",
    paddingRight: 5
  }
});
const mapStateToProps = state => ({
  userId: state.auth.userUid,
  userName: state.auth.userName,
  redData: state.auth
});
export default connect(mapStateToProps)(EventDetails);
