import React, { Component } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { moderateScale } from "./ScaleElements";

export default class numberCounter extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 1
    };
  }
  increaseCount = () => {
    if (this.state.counter < 22)
      this.setState({ counter: this.state.counter + 1 }, () =>
        this.props.finishCount(this.state.counter)
      );
  };
  decreaseCount = () => {
    if (this.state.counter !== 1)
      this.setState({ counter: this.state.counter - 1 }, () =>
        this.props.finishCount(this.state.counter)
      );
  };
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ counter: this.props.data });
    }
  }
  componentDidMount() {
    if (typeof this.props.data === "number")
      this.setState({ counter: this.props.data });
  }
  render() {
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row"
        }}
      >
        <TouchableOpacity onPress={this.increaseCount}>
          <Icon
            color="hsl(186, 62%, 40%)"
            name="chevron-up"
            size={moderateScale(22)}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: moderateScale(15) }}>
          {this.state.counter}
        </Text>
        <TouchableOpacity onPress={this.decreaseCount}>
          <Icon
            color="hsl(186, 62%, 40%)"
            name="chevron-down"
            size={moderateScale(22)}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
