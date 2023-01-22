import { TouchableOpacity } from "react-native";
import {Feather} from '@expo/vector-icons'
import  Colors  from "tailwindcss/colors";
import {useNavigation} from '@react-navigation/native';

export function BackButton(){
    const { goBack } = useNavigation();
    return(
        <TouchableOpacity activeOpacity={0.7}
            onPress={goBack}
        >
            <Feather
                name="arrow-left"
                size={32}
                color={Colors.zinc[400]}
            />
        </TouchableOpacity>
    )
}