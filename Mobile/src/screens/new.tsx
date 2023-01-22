import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { BackButton } from "../components/backButton";
import { CheckBox } from "../components/checkBox";
import {Feather} from '@expo/vector-icons'
import  Colors  from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];


export function New(){

    const[title, setTitle] = useState ('');


    const [weekDays, setWeekDays] = useState<number[]>([])

    function HandleToggleWeekDays(weekDaysIndex: number){
        if (weekDays.includes(weekDaysIndex)){
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDaysIndex));
        }else{
            setWeekDays(prevState => [...prevState, weekDaysIndex]);
        }
    }

    async function HandleCreateNewHabit(){
        try {
            if(!title.trim() || weekDays.length===0){
               return Alert.alert('Novo hábito', 'Informe o nome do hábito e escolha a periodicidade')
            }
                await api.post('/habits', {title, weekDays});
                setTitle('')
                setWeekDays([])
    
                Alert.alert('Novo hábito', 'Hábito criado com sucesso!');
            
        } catch (error) {
            console.log(error)
            Alert.alert('ops', 'Não foi possivel criar um novo hábito')
        }
    }

    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator={false} 
                contentContainerStyle = {{ paddingBottom: 100 }}>

                <BackButton/>

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2  border-zinc-800 focus:border-green-600"
                placeholder="Exercícios, dormir bem, etc..."
                placeholderTextColor={Colors.zinc[400]}
                onChangeText = {setTitle}
                value = {title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência? 
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <CheckBox 
                        key={weekDay}
                        title={weekDay}
                        checked = {weekDays.includes(index)}
                        onPress={() => HandleToggleWeekDays(index)}
                        />
                    ))
                }

                <TouchableOpacity activeOpacity={0.7}
                className=" w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6" 
                onPress={HandleCreateNewHabit}
                >
                    <Feather
                        name="check"
                        size={20}
                        color={Colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}