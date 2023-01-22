import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useState, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native"
import { HanbitDay, DAY_SIZE } from "../components/habitDay"
import { Header } from "../components/header"
import { Loading } from "../components/loading";
import { api } from "../lib/axios";
import {generateRangeDatesFromYearStart} from "../utils/generate-range-between-dates";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const datesFromYearStart = generateRangeDatesFromYearStart();

const minimumSummaryDatesSize = 18 * 5;
const amoutOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

type SummaryProps = Array <{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home(){

    const [loading, setLoading] = useState(true);
    const[summary, setSummary] = useState<SummaryProps | null>(null);
    
    const { navigate } = useNavigation();

 async function FetchData(){
    try {
        setLoading(true);
        const response = await api.get('/summary');
        
        setSummary(response.data);
        
    } catch (error) {
        Alert.alert('ops', 'Não foi possivel criar um novo hábito')
        console.log(error);

    } finally { 
        setLoading(false);
    }
    }

    useFocusEffect(useCallback(() => {
        FetchData();
    }, []));

    if(loading){
        return(
            <Loading/>
        );
    }
    
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header/>
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i)  =>(
                        <Text 
                         key={`${weekDay}-${i}`} 
                         className="text-zinc-400 text-xl font-bold text-center mx-1"
                        style={{width: DAY_SIZE}}
                         >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>

                <ScrollView showsVerticalScrollIndicator = {false} 
                contentContainerStyle={{paddingBottom: 100}}>

                {
                    summary &&
                <View className="flex-row flex-wrap">
                    {
                        datesFromYearStart.map(date => {

                            const dayWithHabits = summary.find(day =>{
                                return dayjs(date).isSame(day.date, 'day')
                            })

                            return(
                                 <HanbitDay
                            key={date.toISOString()}
                            date={date}
                            amountOfHabits = {dayWithHabits?.amount}
                            amountCompleted = {dayWithHabits?.completed}
                            onPress={() => navigate('habit', { date: date.toISOString() })}
                            />
                            )
                            })
                    }
                    {
                        amoutOfDaysToFill > 0 && Array.from({length: amoutOfDaysToFill}).map((_, index) => (
                            <View key={index}
                            className="bg-zinc-900  rounded-lg border-2 m-1 border-zinc-900 opacity-40"
                            style={{width: DAY_SIZE,  height: DAY_SIZE}}
                            />
                        ) )
                    }
                </View>

                }


                    
                </ScrollView>

        </View>
    )
}