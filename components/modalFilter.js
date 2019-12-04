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
import IconFeather from "react-native-vector-icons/Feather";

import Ionicons from "react-native-vector-icons/Ionicons";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";

export default class modalFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterPayToPlay: {
        color: "black",
        value: false,
        text: "Mokami stadionai"
      },
      data: [],
      item: false,
      item2: false,
      floorType: [
        {
          id: 0,
          type: "grass",
          text: "Tikra žolė",
          selected: false
        },
        {
          id: 1,
          type: "synthetic",
          text: "Sintetinė žolė",
          selected: false
        },
        {
          id: 2,
          type: "futsal",
          text: "Salinė danga",
          selected: false
        }
      ],
      stadiumType: [
        {
          id: 0,
          type: "indoor",
          text: "Vidus",

          selected: false
        },
        {
          id: 1,
          type: "outdoor",
          text: "Laukas",
          selected: false
        }
      ],
      priceType: [
        {
          id: 0,
          type: "paid",
          text: "Mokamas",
          selected: false
        },
        {
          id: 1,
          type: "free",
          text: "Nemomkamas",
          selected: false
        }
      ],
      inventor: {
        id: 0,
        type: "inventor",
        selected: false
      }
    };
  }

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
    let floor = Array.from(this.state.floorType);
    let price = Array.from(this.state.priceType);
    let stadiumTypo = Array.from(this.state.stadiumType);
    let inventor = Object.assign(this.state.inventor);

    const selectedFloorType = floor.filter(item => item.selected === true);
    const selectedPriceType = price.filter(item => item.selected === true);
    const selectedStadiumType = stadiumTypo.filter(
      item => item.selected === true
    );
    let filterBy = selectedFloorType.concat(
      selectedPriceType,
      selectedStadiumType
    );
    if (inventor.selected === true) {
      filterBy.push(inventor);
      console.log("(.)( .)", filterBy);
    }
    console.log(filterBy, "AR GAVOS KAZKAS PONAS ROKAI ?");
    this.props.onConfirm(filterBy);
  };
  clearFilters = () => {
    const emptyArray = [];
    let floorTypeUpdate = Array.from(this.state.floorType);
    let stadiumTypeUpdate = Array.from(this.state.stadiumType);
    let stadiumPriceUpdate = Array.from(this.state.priceType);
    let inventorUpdate = Object.assign(this.state.inventor);

    let lengthFloor = floorTypeUpdate.length;
    let lengthStad = stadiumTypeUpdate.length;
    let lengthPrice = stadiumPriceUpdate.length;
    for (let i = 0; i < lengthFloor; i++) floorTypeUpdate[i].selected = false;
    for (let i = 0; i < lengthStad; i++) stadiumTypeUpdate[i].selected = false;
    for (let i = 0; i < lengthPrice; i++)
      stadiumPriceUpdate[i].selected = false;
    this.setState({}, () => {
      this.props.onConfirm(emptyArray);
    });
  };

  onFloorTypeClick = selectedItem => {
    let floorTypeUpdate = Array.from(this.state.floorType);
    let listLenght = floorTypeUpdate.length;
    let index = floorTypeUpdate.findIndex(item => item.id === selectedItem.id);
    for (let i = 0; i < listLenght; i++) {
      if (i === index) {
        floorTypeUpdate[i].selected = true;
      } else {
        floorTypeUpdate[i].selected = false;
      }
    }
    this.setState({ floorType: floorTypeUpdate });
  };
  onStadiumTypeClick = selectedItem => {
    let stadiumTypeUpdate = Array.from(this.state.stadiumType);
    let listLenght = stadiumTypeUpdate.length;
    let index = stadiumTypeUpdate.findIndex(
      item => item.id === selectedItem.id
    );
    for (let i = 0; i < listLenght; i++) {
      if (i === index) {
        stadiumTypeUpdate[i].selected = true;
      } else {
        stadiumTypeUpdate[i].selected = false;
      }
    }
    this.setState({ stadiumType: stadiumTypeUpdate });
  };
  onStadiumPriceClick = selectedItem => {
    let stadiumPriceUpdate = Array.from(this.state.priceType);
    let listLenght = stadiumPriceUpdate.length;
    let index = stadiumPriceUpdate.findIndex(
      item => item.id === selectedItem.id
    );
    for (let i = 0; i < listLenght; i++) {
      if (i === index) {
        stadiumPriceUpdate[i].selected = true;
      } else {
        stadiumPriceUpdate[i].selected = false;
      }
    }
    this.setState({ priceType: stadiumPriceUpdate });
  };
  onInventorClick = () => {
    let inventorUpdate = Object.assign(this.state.inventor);
    if (inventorUpdate.selected === true) inventorUpdate.selected = false;
    else inventorUpdate.selected = true;
    this.setState({ inventor: inventorUpdate });
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
          <Text style={{ color: "black", fontSize: moderateScale(15) }}>
            Filtracija
          </Text>
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(250),
              flexDirection: "column",
              backgroundColor: "red"
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(11),
                borderBottomWidth: 1,
                borderColor: "hsl(126, 62%, 40%)",
                marginLeft: moderateScale(15),
                backgroundColor: "green",
                flex: 1
              }}
            >
              Dangos tipas
            </Text>
            <View
              style={{
                backgroundColor: "yellow",
                flex: 2,
                justifyContent: "center",
                flexDirection: "column",
                width: moderateScale(250)
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "blue",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.onFloorTypeClick(this.state.floorType[0]);
                    }}
                    style={{ flexDirection: "row" }}
                  >
                    <IconFeather
                      name={
                        this.state.floorType[0].selected === true
                          ? "disc"
                          : "circle"
                      }
                      color="black"
                      size={moderateScale(12)}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: moderateScale(10),
                        color: "black"
                      }}
                    >
                      {this.state.floorType[0].text}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "lightblue",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.onFloorTypeClick(this.state.floorType[1]);
                    }}
                    style={{ flexDirection: "row" }}
                  >
                    <IconFeather
                      name={
                        this.state.floorType[1].selected === true
                          ? "disc"
                          : "circle"
                      }
                      color="black"
                      size={moderateScale(12)}
                    />
                    <Text
                      style={{
                        marginLeft: 5,
                        fontSize: moderateScale(10),
                        color: "black"
                      }}
                    >
                      {this.state.floorType[1].text}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "lightpink"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onFloorTypeClick(this.state.floorType[2]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.floorType[2].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.floorType[2].text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* --------------------------FLOORTYPE/\-------------------------------- */}
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(250),
              flexDirection: "column",
              backgroundColor: "red"
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(11),
                borderBottomWidth: 1,
                borderColor: "hsl(126, 62%, 40%)",
                marginLeft: moderateScale(15),
                backgroundColor: "green",
                flex: 1
              }}
            >
              Stadiono tipas
            </Text>
            <View
              style={{
                backgroundColor: "yellow",
                flex: 2,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(250)
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "blue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumTypeClick(this.state.stadiumType[0]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.stadiumType[0].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.stadiumType[0].text}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "lightblue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumTypeClick(this.state.stadiumType[1]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.stadiumType[1].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.stadiumType[1].text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(250),
              flexDirection: "column",
              backgroundColor: "red"
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(11),
                borderBottomWidth: 1,
                borderColor: "hsl(126, 62%, 40%)",
                marginLeft: moderateScale(15),
                backgroundColor: "green",
                flex: 1
              }}
            >
              Kaina
            </Text>
            <View
              style={{
                backgroundColor: "yellow",
                flex: 2,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(250)
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "blue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumPriceClick(this.state.priceType[0]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.priceType[0].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.priceType[0].text}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "lightblue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumPriceClick(this.state.priceType[1]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.priceType[1].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.priceType[1].text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* -----------------------------------------------------Inventoriu teikia \/ */}
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(250),
              flexDirection: "column",
              backgroundColor: "red"
            }}
          >
            <View
              style={{
                backgroundColor: "yellow",
                flex: 1,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(250)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: moderateScale(11),
                    borderBottomWidth: 1,
                    borderColor: "hsl(126, 62%, 40%)",
                    marginLeft: moderateScale(15),
                    backgroundColor: "green"
                  }}
                >
                  Suteikia invenorių
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "lightblue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.onInventorClick}>
                  <IconFontAwesome
                    name={
                      this.state.inventor.selected === true
                        ? "toggle-on"
                        : "toggle-off"
                    }
                    color="black"
                    size={moderateScale(17)}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* -----------------------------------------------------Pagal laika \/ */}
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: moderateScale(250),
              flexDirection: "column",
              backgroundColor: "red"
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: moderateScale(11),
                borderBottomWidth: 1,
                borderColor: "hsl(126, 62%, 40%)",
                marginLeft: moderateScale(15),
                backgroundColor: "green",
                flex: 1
              }}
            >
              Ieškoti pagal laiką
            </Text>
            <View
              style={{
                backgroundColor: "yellow",
                flex: 2,
                justifyContent: "center",
                flexDirection: "row",
                width: moderateScale(250)
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "blue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumTypeClick(this.state.stadiumType[0]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.stadiumType[0].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.stadiumType[0].text}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "lightblue",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.onStadiumTypeClick(this.state.stadiumType[1]);
                  }}
                  style={{ flexDirection: "row" }}
                >
                  <IconFeather
                    name={
                      this.state.stadiumType[1].selected === true
                        ? "disc"
                        : "circle"
                    }
                    color="black"
                    size={moderateScale(12)}
                  />
                  <Text
                    style={{
                      marginLeft: 5,
                      fontSize: moderateScale(10),
                      color: "black"
                    }}
                  >
                    {this.state.stadiumType[1].text}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ----------------------------------------------------------PRASIDEDA FILTRACIJOS MYGTUKAI  \/--- */}
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              backgroundColor: "red",
              width: moderateScale(250)
            }}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.clearFilters}
            >
              <Ionicons
                name="md-close"
                size={moderateScale(15)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(13),
                  fontWeight: "300"
                }}
              >
                Išvalyti
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { flexDirection: "row", justifyContent: "space-around" }
              ]}
              onPress={this.confirmFilters}
            >
              <Ionicons
                name="md-checkmark"
                size={moderateScale(15)}
                color="hsl(126, 62%, 40%)"
              />
              <Text
                style={{
                  color: "hsl(126, 62%, 40%)",
                  fontSize: moderateScale(13),
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
    width: moderateScale(250),
    flexDirection: "column",
    borderRadius: 15
  },
  text: {
    color: "black",
    fontSize: moderateScale(15),
    marginBottom: 10
  },
  button: {
    width: moderateScale(90),
    height: moderateScale(32),
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
