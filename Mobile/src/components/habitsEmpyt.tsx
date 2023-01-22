import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";

export function HabitsEmpyt(){
    const {navigate } = useNavigation()
    return(
        <Text
            className="text-zinc-400 text-base">
                Você ainda não está monitorando nenhum hábito 

                <Text className="text-violet-400 text-base underline"
                onPress={() => navigate('new')}
                >
                    Comece criando um!
                </Text>
        </Text>
    )
}