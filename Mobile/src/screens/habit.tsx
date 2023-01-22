import { useRoute } from "@react-navigation/native";
import { ScrollView, View, Text, Alert } from "react-native";
import { BackButton } from "../components/backButton";
import  dayjs  from "dayjs";
import { ProgressBar } from "../components/progressBar";
import { CheckBox } from "../components/checkBox";
import { useEffect, useState } from "react";
import { Loading } from "../components/loading";
import { api } from "../lib/axios";
import { GenerateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpyt } from "../components/habitsEmpyt";
import clsx from "clsx";

interface Params{
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;


    }[];
}

export function Habit(){
    const [loading, setloading] = useState(true)
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute();
    const { date } = route.params as Params;

    const parsedDate = dayjs(date);

    const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const habitProgress = dayInfo?.possibleHabits.length ? GenerateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0

    async function Fetchhabits() {
        try {
            setloading(true);

            const response = await api.get('/day', { params: {date}})
            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits)

        } catch (error) {
            console.log(error);
            Alert.alert('ops', 'Não foi possível carregar as informações dos hábitos')
        }finally{
            setloading(false);
        }
    }

    async function HandleToggleHabit(habitId: string) {
        try{
            await api.patch(`/habits/${habitId}/toggle`);
                if(completedHabits.includes(habitId)){
                    setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
                }else{
                    setCompletedHabits(prevState => [...prevState, habitId])
                }
        }catch(error){
            console.log(error);
            Alert.alert("Ops", "Não foi possível atualizar os status do hábito.");
        }

        
    }

    useEffect(() => {
        Fetchhabits();
    }, []);

    if(loading){
        return(
            <Loading/>
        );
    }
    
    return(
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView showsVerticalScrollIndicator = {false} 
                contentContainerStyle={{paddingBottom: 100}}>
                

                <BackButton/>

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitProgress}/>
                
                <View className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
                         })}>
                   { 
                        dayInfo?.possibleHabits ?
                            dayInfo?.possibleHabits.map (habit => (
                                    <CheckBox
                                        key={habit.id}
                                        title={habit.title}
                                        checked = {completedHabits.includes(habit.id)}
                                        onPress = {() => HandleToggleHabit(habit.id)}
                                        disabled = {isDateInPast}
                                    />
                                 )) : <HabitsEmpyt/>
                        
                    }
                </View>

                {isDateInPast && (
                    <Text className="text-white mt-10 text-center">
                            Você não pode editar um hábito de uma data passada.
                    </Text>
                    )}
                

                </ScrollView>
        </View>
    )
}