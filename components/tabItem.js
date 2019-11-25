import React, {PureComponent} from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import tabBarIcons from '../components/images';

class tabItem extends PureComponent{
    
    render(){
        const {routeName, isActive } = this.props
        const icon = tabBarIcons[isActive ? 'active': 'inactive'][routeName]

        return(
            <View style={{backgroundColor:"green", height:50}}>
                <Image source={icon}/>
            </View>
        )
    }

}
export default tabItem;