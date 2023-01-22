import {createNativeStackNavigator} from '@react-navigation/native-stack';

const {Navigator, Screen} = createNativeStackNavigator(); 

import {Home} from '../screens/home';
import {Habit} from '../screens/habit';
import {New} from '../screens/new';

export function AppRoutes(){
    return(
        <Navigator screenOptions={{headerShown: false}}>
            <Screen
                name = "home"
                component={Home}
            />

            <Screen
                name = "new"
                component={New}
            />

            <Screen
                name = "habit"
                component={Habit}
            />
        </Navigator>
    )
    
}