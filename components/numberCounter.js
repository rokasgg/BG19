import React,{Component} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { moderateScale } from './ScaleElements';

export default class numberCounter extends React.Component{
    constructor(){
        super()
        this.state={
            counter:1,

        }
    };
    increaseCount = ()=>{
        if(this.state.counter < 22)
        this.setState({counter:this.state.counter+1}, ()=>this.props.finishCount(this.state.counter))
        
    }
    decreaseCount = ()=>{
        if(this.state.counter !== 1)
        this.setState({counter:this.state.counter-1},()=>this.props.finishCount(this.state.counter))
    }
    render(){
        return(
            <View style={{justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
                <TouchableOpacity onPress={this.increaseCount}>
                    <Icon color='hsl(186, 62%, 40%)' name='chevron-up' size={25}/>
                </TouchableOpacity>
                <Text style={{fontSize:moderateScale(15)}} >{this.state.counter}</Text>
                <TouchableOpacity onPress={this.decreaseCount}>
                    <Icon color='hsl(186, 62%, 40%)' name='chevron-down' size={25}/>
                </TouchableOpacity>
            </View>
        )
    }

}