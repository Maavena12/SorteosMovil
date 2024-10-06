import React from 'react';  
import { NavigationContainer } from '@react-navigation/native';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';    
import Info from '@/app/src/Info';
import ConfigurarSorteo from '@/app/src/ConfigurarSorteo'
import SorteoFinal from '@/app/src/SorteoFinal'
import Layout from './src/layout';
import Home from './src/home';
import SorteoFinalEliminatoria from '@/app/src/SorteoFinalEliminatoria'
import CantidadEquiposEliminatorias from './src/InfoEliminatoria';
import ConfiguracionSorteoEliminatoria from './src/ConfigurarSorteoEliminatoria';
import CantidadEquiposLiguilla from './src/InfoLIguilla';
import ConfiguracionSorteoLiguilla from './src/ConfigurarSorteoLiguilla';
import SorteoFinalLiguillaComponent from './src/SorteoFinalLiguilla';

const Stack = createNativeStackNavigator();  

const App = () => {  
    return (
        <NavigationContainer independent>
            <Stack.Navigator initialRouteName="Inicio">
                <Stack.Screen name='Inicio' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <Home />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='Fase de Grupos' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <Info />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='Eliminatoria' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <CantidadEquiposEliminatorias />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='Liguilla' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <CantidadEquiposLiguilla />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='ConfiguracionSorteo' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <ConfigurarSorteo />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='ConfiguracionSorteoEliminatoria' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <ConfiguracionSorteoEliminatoria />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='ConfiguracionSorteoLiguilla' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <ConfiguracionSorteoLiguilla />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='SorteoFinal' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <SorteoFinal />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='SorteoFinalEliminatoria' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <SorteoFinalEliminatoria />
                        </Layout>
                    )}
                </Stack.Screen>
                <Stack.Screen name='SorteoFinalLiguilla' options={{ headerShown: false }}>
                    {() => (
                        <Layout>
                            <SorteoFinalLiguillaComponent />
                        </Layout>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};  

export default App;