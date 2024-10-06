import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CantidadEquiposLiguilla = () => {
    const [cantidadEquipos, setCantidadEquipos] = useState<number>(3);
    const [equipos, setEquipos] = useState<string[]>([]);
    const navigation = useNavigation();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const animation = useState(new Animated.Value(-250))[0];

    const agregarEquipos = () => {
        setEquipos(Array(cantidadEquipos).fill('').map((_, i) => `Equipo ${i + 1}`));
    };

    const toggleSidebar = () => {
        const toValue = sidebarVisible ? -250 : 0;
        setSidebarVisible(!sidebarVisible);

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    };

    const closeSidebar = () => {
        if (sidebarVisible) {
            toggleSidebar();
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    const redirectToNextPage = () => {
        const equiposString = JSON.stringify(equipos);
        navigation.navigate('ConfiguracionSorteoLiguilla', { equipos: equiposString });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Fase Liguilla: Configuración de Equipos</Text>
                <Text style={styles.subtitle}>¡Bienvenido a la fase de liguilla de tu sorteo! En esta etapa, podrás definir la cantidad de equipos que participarán en el sorteo.</Text>

                <Text style={styles.sectionTitle}>Instrucciones:</Text>
                <Text style={styles.instructions}>
                    <Text style={styles.listItem}>1. Introduce el número total de equipos que deseas incluir en la fase de grupos. Este número debe ser mayor o igual a 2.</Text>
                    {'\n'}
                    <Text style={styles.listItem}>2. Haz clic en "Agregar Equipos" para crear los campos donde podrás ingresar el nombre de cada equipo.</Text>
                    {'\n'}
                    <Text style={styles.listItem}>3. Si deseas realizar cambios, puedes ajustar la cantidad de equipos y volver a crear los campos correspondientes.</Text>
                </Text>

                <Text style={styles.sectionTitle}>Ejemplo:</Text>
                <Text style={styles.exampleText}>Si ingresas "8", el sistema organizará un sorteo para 8 equipos.</Text>

                <View style={styles.inputContainer}>
                    <Text>Cantidad de Equipos:</Text>
                    <TextInput
                        style={styles.textInput}
                        keyboardType="numeric"
                        value={String(cantidadEquipos)}
                        onChangeText={(text) => setCantidadEquipos(Math.max(2, Number(text)))}
                    />
                    <View style={{marginTop:15}}></View>
                    <Button title="Agregar Equipos" onPress={agregarEquipos} />
                </View>

                {equipos.length > 0 && (
                    <View style={styles.teamsContainer}>
                        <Text style={styles.subtitle}>Nombres de los Equipos:</Text>
                        {equipos.map((equipo, index) => (
                            <View key={index} style={styles.teamInputContainer}>
                                <Text>Nombre del Equipo {index + 1}:</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder={`Equipo ${index + 1}`}
                                    value={equipo}
                                    onChangeText={(text) => {
                                        const newEquipos = [...equipos];
                                        newEquipos[index] = text;
                                        setEquipos(newEquipos);
                                    }}
                                />
                            </View>
                        ))}
                        <Button title="Continuar" onPress={redirectToNextPage} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    titleNavbar: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'left',
    },
    instructions: {
        fontSize: 16,
        marginVertical: 5,
        textAlign: 'left',
    },
    listItem: {
        marginBottom: 5,
    },
    exampleText: {
        fontSize: 16,
        textAlign: 'left',
        marginTop: 5,
        marginBottom: 15,
    },
    inputContainer: {
        width: '100%',
        marginTop: 20,
        paddingBottom: 20
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginTop: 5,
    },
    teamsContainer: {
        marginTop: 20,
        width: '100%',
        paddingBottom: 20
    },
    teamInputContainer: {
        marginVertical: 10,
    },
    footer: {  
        backgroundColor: 'rgb(21, 124, 21)', // Color de fondo del footer  
        padding: 30,
        alignItems: 'center', // Centra el contenido  
        justifyContent: 'center',   
        borderTopWidth: 1, // Línea superior  
        borderTopColor: '#dddddd', // Color de la línea  
        width: '130%',
    },  
    footerText: {  
        color: '#FFFFFF', // Texto blanco  
        fontSize: 14, // Tamaño del texto  
        textAlign: 'center',   
    },  
    navbar: {
        backgroundColor: 'rgb(21, 124, 21)', // Navbar oscuro
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    hamburgerContainer: {
        padding: 10,
    },
    hamburgerIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 250,
        height: '100%',
        backgroundColor: '#88D66C',
        paddingTop: 50,
        paddingLeft: 10,
        zIndex: 1000,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    sidebarTitle: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        fontSize: 18,
        color: '#FFFFFF',
    },
    menuText: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    arrow: {
        fontSize: 18,
        color: '#FFFFFF',
    },
    dropdown: {
        backgroundColor: '#88D66C',
        paddingLeft: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },
    dropdownItem: {
        padding: 10,
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export default CantidadEquiposLiguilla;