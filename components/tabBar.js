import React, {PureComponent} from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import TabItem from './tabItem';
class tabBar extends PureComponent{
    render(){
        const {navigation} = this.props;
        const {routes} = navigation.state;
        return(
            <View style={{backgroundColor:"green", height:50}}>
                {routes.map((route, i)=>(
                    <TabItem key ={route.routeName}{...route}/>
                ))}
            </View>
        )
    }

}
export default tabBar;