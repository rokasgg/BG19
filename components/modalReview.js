import React, { Component } from "react";
import Modal from "react-native-modal";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Picker,
  FlatList,
  ActivityIndicator
} from "react-native";
import { moderateScale } from "./ScaleElements";
import IconFeather from "react-native-vector-icons/Feather";
import StarRating from "react-native-star-rating";
import Ionicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import FlashMessage from "react-native-flash-message";
import firebase from "firebase";
import "firebase/firestore";

export default class askPerm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      writeReview: false,
      readReview: false,
      approvePlayer: false,
      chosen: false,
      starCount: 0,
      reviewInput: "",
      playerReviews: [],
      spinner: false,
      approveText: "Patvirtinti"
    };
  }
  onPressApprovePlayer = () => {
    this.setState({ readReview: false, approvePlayer: true, chosen: true });
  };
  onPressReadReview = () => {
    this.startSpinner();
    this.getUsersReviews();
    this.setState({ approvePlayer: false, readReview: true, chosen: true });
  };

  confirmReView = async () => {
    if (this.state.reviewInput !== "") {
      let userId = this.props.data.userId;
      let review = {
        comment: this.state.reviewInput,
        rating: this.state.starCount
      };
      await firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .collection("playersReviews")
        .add(review)
        .then(
          this.setState(
            {
              writeReview: false,
              chosen: false,
              reviewInput: "",
              starCount: 0,
              approvePlayer: false,
              readReview: false
            },
            () => {
              this.refs.complete.showMessage({
                message: "Sėkmingai įvertinote žaidėją !",
                duration: 5000,
                autoHide: true,
                hideOnPress: true
              });
            }
          )
        );
    } else {
      this.refs.complete.showMessage({
        message: "Prašome pasirinkti įvertinima ir pakomentuoti!",
        duration: 5000,
        autoHide: true,
        hideOnPress: true
      });
    }
  };
  startSpinner = () => {
    this.setState({ spinner: true });
  };

  getUsersReviews = async () => {
    let userId = this.props.data.userId;
    let allReviews = [];
    await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("playersReviews")
      .get()
      .then(res => {
        res.forEach(snap => {
          console.log(snap, "check");
          let review = {
            comment: snap._document.proto.fields.comment.stringValue,
            rating: snap._document.proto.fields.rating.integerValue
          };
          console.log("reviu", review);
          allReviews.push(review);
        });
      });
    this.setState({ spinner: false, playerReviews: allReviews });
  };

  completelyClose = () => {
    this.setState(
      {
        writeReview: false,
        readReview: false,
        chosen: false,
        approvePlayer: false
      },
      () => this.props.closeModal()
    );
  };
  goback = () => {
    this.setState({
      writeReview: false,
      readReview: false,
      chosen: false,
      approvePlayer: false,
      approveSpinner: false
    });
  };
  goToReviews = () => {
    this.setState({
      writeReview: false,
      readReview: true,
      chosen: true,
      approvePlayer: false
    });
  };

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  navToApprove = () => {
    this.setState({
      approvePlayer: false,
      readReview: true,
      writeReview: true
    });
  };

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="slideInUp"
        onSwipeComplete={this.completelyClose}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.7}
        backdropTransitionInTiming={2000}
        backdropTransitionOutTiming={2000}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15
        }}
        onBackdropPress={this.completelyClose}
      >
        {!this.state.chosen ? (
          <View style={[styles.modal]}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                width: moderateScale(220)
              }}
            >
              <TouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRightWidth: 1,
                    borderColor: "lightgray",
                    height: moderateScale(40)
                  }
                ]}
                onPress={this.onPressReadReview}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: moderateScale(15),
                    fontWeight: "300"
                  }}
                >
                  {this.props.option1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderColor: "red",
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "white",
                    borderLeftWidth: 1,
                    borderColor: "lightgray",
                    height: moderateScale(40)
                  }
                ]}
                onPress={this.onPressApprovePlayer}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: moderateScale(15),
                    fontWeight: "300"
                  }}
                >
                  Patvirtinti
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        {this.state.approvePlayer ? (
          <View style={[styles.modal, { height: moderateScale(125) }]}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                width: moderateScale(220),
                borderColor: "hsl(186, 62%, 40%)",
                borderTopWidth: 1
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  flex: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(13)
                  }}
                >
                  {this.props.data.approved
                    ? `Žaidėjo dalyvavimas jau patvirtintas. Norite pašalinti ${this.props.data.name} ?`
                    : "Ar norite patvirtinti šio žaidėjo prašymą prisijungti prie treniruotės?"}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: moderateScale(200)
                }}
              >
                {this.props.data.approved ? (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        borderColor: "black"
                      }
                    ]}
                    onPress={this.goback}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: moderateScale(13),
                        fontWeight: "300"
                      }}
                    >
                      Grįžti
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        borderColor: "black"
                      }
                    ]}
                    onPress={this.cancelPermision}
                  >
                    {this.state.approveSpinner ? (
                      <ActivityIndicator color="grey" size="small" />
                    ) : (
                      <Text
                        style={{
                          color: "black",
                          fontSize: moderateScale(13),
                          fontWeight: "300"
                        }}
                      >
                        Pašalinti
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      flexDirection: "row",
                      justifyContent: "space-around",
                      borderColor: "black"
                    }
                  ]}
                  onPress={
                    this.props.data.approved
                      ? this.cancelPermision
                      : this.givePermmision
                  }
                >
                  {this.state.approveSpinner ? (
                    <ActivityIndicator color="grey" size="small" />
                  ) : (
                    <Text
                      style={{
                        color: "black",
                        fontSize: moderateScale(13),
                        fontWeight: "300"
                      }}
                    >
                      {this.props.data.approved ? "Pašalinti" : "Patvirtinti"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
        {this.state.readReview ? (
          !this.state.writeReview ? (
            <View style={[styles.modal, { height: moderateScale(200) }]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: moderateScale(220),
                  borderColor: "hsl(186, 62%, 40%)",
                  borderTopWidth: 1
                }}
              >
                <View
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    width: moderateScale(230),
                    flexDirection: "row"
                  }}
                >
                  <Text style={{ color: "black", fontSize: moderateScale(13) }}>
                    Įvertinimas
                  </Text>
                  <Text style={{ color: "black", fontSize: moderateScale(13) }}>
                    Komentaras
                  </Text>
                </View>
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "space-between"
                  }}
                >
                  {this.state.spinner ? (
                    <View
                      style={{
                        justifyContent: "center",
                        alignSelf: "center",
                        height: moderateScale(100)
                      }}
                    >
                      <ActivityIndicator
                        style={{
                          justifyContent: "center",
                          alignSelf: "center"
                        }}
                        color="lightgray"
                        size="small"
                      />
                    </View>
                  ) : (
                    <View>
                      <FlatList
                        renderItem={this.renderReviews}
                        data={this.state.playerReviews}
                        numColumns={1}
                        style={{ marginTop: 2, flex: 1 }}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={this.state.playerReviews}
                        // onRefresh={() => this.onRefreshing()}
                        // refreshing={this.state.refresh}
                        ListEmptyComponent={this.emptyReview}
                        style={{ margin: moderateScale(2) }}
                      />
                    </View>
                  )}
                </ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: moderateScale(220)
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        borderColor: "black",
                        marginBottom: moderateScale(10)
                      }
                    ]}
                    onPress={this.goback}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: moderateScale(13),
                        fontWeight: "300"
                      }}
                    >
                      Grįžti
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        borderColor: "black",
                        marginBottom: moderateScale(10)
                      }
                    ]}
                    onPress={this.navToApprove}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: moderateScale(13),
                        fontWeight: "300"
                      }}
                    >
                      Įvertinti
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.modal, { height: moderateScale(135) }]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: moderateScale(220),
                  borderColor: "hsl(186, 62%, 40%)",
                  borderTopWidth: 1
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={this.state.starCount}
                    selectedStar={rating => this.onStarRatingPress(rating)}
                  />

                  <TextInput
                    style={{
                      paddingRight: 15,
                      marginTop: moderateScale(5),
                      width: moderateScale(120),
                      height: moderateScale(30),
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "lightgray",
                      borderRadius: 15
                    }}
                    value={this.state.reviewInput}
                    placeholder={"Komentaras"}
                    onChangeText={text => this.setState({ reviewInput: text })}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    width: moderateScale(220)
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        borderColor: "black"
                      }
                    ]}
                    onPress={this.goToReviews}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: moderateScale(13),
                        fontWeight: "300"
                      }}
                    >
                      Grįžti
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        flexDirection: "row",
                        justifyContent: "space-around",
                        borderColor: "black"
                      }
                    ]}
                    onPress={this.confirmReView}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: moderateScale(13),
                        fontWeight: "300"
                      }}
                    >
                      {this.props.option2}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        ) : null}
        <FlashMessage
          ref="complete"
          position="top"
          style={{ backgroundColor: "lightgreen" }}
        />
      </Modal>
    );
  }

  cancelPermision = async () => {
    let propsData = this.props.eventsData;
    this.setState({ approveSpinner: true });
    await firebase
      .firestore()
      .collection("events")
      .doc(propsData.id)
      .collection("playersList")
      .doc(this.props.data.userId)
      .delete();

    await firebase
      .firestore()
      .collection("users")
      .doc(this.props.data.userId)
      .collection("joinedEventsList")
      .doc(propsData.id)
      .update({ approved: false });
    this.goback();
    this.props.cancelApproval(this.props.data.userId);
  };
  givePermmision = async () => {
    let propsData = this.props.eventsData;
    this.setState({ approveSpinner: true });
    await firebase
      .firestore()
      .collection("events")
      .doc(propsData.id)
      .collection("playersList")
      .doc(this.props.data.userId)
      .update({
        approved: true
      });
    await firebase
      .firestore()
      .collection("users")
      .doc(this.props.data.userId)
      .collection("joinedEventsList")
      .doc(propsData.id)
      .update({ approved: true });
    this.goback();
    this.props.approvedPlayer(this.props.data.userId);
  };

  renderReviews = item => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: moderateScale(200),
          height: moderateScale(35)
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: moderateScale(12) }}>
            {item.item.rating}/5
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Text style={{ fontSize: moderateScale(12) }}>
            {item.item.comment}
          </Text>
        </View>
      </View>
    );
  };
  emptyReview = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: moderateScale(200),
          height: moderateScale(35)
        }}
      >
        <Text>Žaidėjas atsiliepimų neturi</Text>
      </View>
    );
  };
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: moderateScale(80),
    width: moderateScale(235),
    flexDirection: "column",
    borderRadius: 15
  },
  text: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 10
  },
  button: {
    width: moderateScale(85),
    height: moderateScale(27),
    backgroundColor: "white",
    borderColor: "hsl(126, 62%, 40%)",
    borderWidth: 2,
    alignItems: "center",
    borderRadius: 5
  },
  buttonEdit: {
    backgroundColor: "orange",
    marginLeft: 10
  }
});
