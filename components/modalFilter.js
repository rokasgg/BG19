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
  TouchableOpacity,
  TextInput,
  Picker,
  FlatList
} from "react-native";
import { moderateScale } from "./ScaleElements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { CheckBox } from "react-native-elements";
import Ionicons from "react-native-vector-icons/Ionicons";

export default class modalFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterPayToPlay: {
        color: "black",
        value: false,
        text: "Mokami stadionai"
      },
      data: []
    };
  }

  onFilterClick = () => {
    if (this.state.filterPayToPlay.value === false)
      this.setState({
        filterPayToPlay: {
          color: "green",
          value: true,
          text: "Mokami stadionai"
        }
      });
    else
      this.setState({
        filterPayToPlay: {
          color: "black",
          value: false,
          text: "Mokami stadionai"
        }
      });
  };
  componentDidMount() {
    this.getFilterItems();
  }

  getFilterItems = () => {
    const filterItems = [
      {
        id: "byPaid",
        text: "Mokami stadionai"
      },
      {
        id: "byFree",
        text: "Nemokami stadionai"
      },
      {
        id: "byGrass",
        text: "Tikra žolė"
      },
      {
        id: "byInventor",
        text: "Teikia kamuolius"
      },
      {
        id: "futsal",
        text: "Salės futbolas"
      },
      {
        id: "byPlasticGrass",
        text: "Dirbtinė danga"
      }
    ];
    this.setState({ data: filterItems });
  };
  onFilterPress = item => {
    let availableTimeList = Array.from(this.state.data);
    const numb = availableTimeList.length;
    for (let i = 0; i < numb; i++) {
      if (i === item.index) {
        if (availableTimeList[i].chosenItem === true)
          availableTimeList[i].chosenItem = false;
        else availableTimeList[i].chosenItem = true;
      }
    }
    this.setState({ data: availableTimeList });
  };

  confirmFilters = () => {
    let data = Array.from(this.state.data);
    const selectedItems = data.filter(item => item.chosenItem === true);
    console.log(this.state.data, selectedItems);
    this.props.onConfirm(selectedItems);
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onSwipeComplete={this.props.closeModal}
        hasBackdrop={true}
        backdropColor="black"
        backdropOpacity={0.8}
        animationInTiming={10000}
        animationOutTiming={10000}
        backdropTransitionInTiming={2000}
        backdropTransitionOutTiming={2000}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 15
        }}
        onBackdropPress={this.props.closeModal}
      >
        <View style={styles.modal}>
          <View
            style={{
              flex: 3,
              justifyContent: "space-evenly",
              width: moderateScale(250),
              paddingTop: moderateScale(5),
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FlatList
              contentContainerStyle={{
                justifyContent: "flex-start"
              }}
              numColumns={1}
              horizontal={false}
              data={this.state.data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={item => {
                return this.state.data[item.index].chosenItem !== true ? (
                  <TouchableOpacity
                    onPress={() => this.onFilterPress(item)}
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      margin: 2,
                      width: moderateScale(200),
                      height: moderateScale(34)
                    }}
                  >
                    <Ionicons
                      style={{ flex: 1 }}
                      name="ios-football"
                      color="gray"
                      size={moderateScale(20)}
                    />
                    <Text
                      style={{
                        flex: 4,
                        marginLeft: 5,
                        fontSize: moderateScale(15),
                        fontFamily: "notoserif",
                        color: "gray"
                      }}
                    >
                      {item.item.text}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => this.onFilterPress(item)}
                    style={{
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexDirection: "row",
                      margin: 2,
                      width: moderateScale(200),
                      height: moderateScale(34)
                    }}
                  >
                    <Ionicons
                      style={{ flex: 1 }}
                      name="ios-football"
                      color="lightgreen"
                      size={moderateScale(20)}
                    />
                    <Text
                      style={{
                        flex: 4,
                        marginLeft: 5,
                        fontSize: moderateScale(15),
                        fontFamily: "notoserif",
                        color: "lightgreen"
                      }}
                    >
                      {item.item.text}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.confirmFilters}
            >
              <Ionicons
                name="md-checkmark"
                size={moderateScale(20)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(17),
                  fontWeight: "300"
                }}
              >
                Patvirtinti
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    height: moderateScale(300),
    flexDirection: "column",
    borderRadius: 15
  },
  text: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 10
  },
  button: {
    width: moderateScale(130),
    height: moderateScale(35),
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
