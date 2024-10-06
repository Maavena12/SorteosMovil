import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const Home = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const animation = useState(new Animated.Value(-250))[0];
    const navigation = useNavigation();  

    const handleGenerate = () => { 
        navigation.navigate('Fase de Grupos');  
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

    return (
        <TouchableWithoutFeedback onPress={closeSidebar}>
            <ScrollView style={styles.container}>

                {/* Título centrado y descripción */}
                <View style={styles.titleContainer}>
                    <Text style={styles.subtitle}>Generador de Torneos</Text>
                    <Text style={styles.description}>
                        ¡Bienvenido al <Text style={styles.boldText}>Generador de Torneos de Fútbol</Text>! 
                        Esta herramienta está diseñada para ayudar a los amantes del fútbol a organizar 
                        y gestionar sus propios torneos de manera sencilla y eficiente. 
                        Ya sea que estés organizando un torneo entre amigos, en tu escuela o en tu 
                        comunidad, esta plataforma te proporcionará las herramientas necesarias 
                        para que el proceso sea más fluido.
                    </Text>
                </View>

                {/* Nueva Sección de Boxes */}
                <View style={styles.boxContainer}>
                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>🎉 Fase de Grupos</Text>
                        <Text style={styles.boxDescription}>
                            Con esta opción, podrás dividir a los equipos participantes en grupos de manera 
                            aleatoria. El generador asignará automáticamente a los equipos a diferentes 
                            grupos, asegurando una distribución equilibrada.
                        </Text>
                        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
                            <Text style={styles.generateButtonText}>Generar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>⚔️ Fase de Eliminación Directa</Text>
                        <Text style={styles.boxDescription}>
                        Si prefieres un enfoque más emocionante, esta opción es perfecta para ti. Aquí, los equipos se enfrentarán 
                                en un formato de eliminación directa. El equipo que gane avanzará a la siguiente ronda.
                        </Text>
                        <TouchableOpacity style={styles.generateButton} onPress={() => navigation.navigate('Eliminatoria')}>
                            <Text style={styles.generateButtonText}>Generar</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.box}>
                        <Text style={styles.boxTitle}>⚽ Sorteo de Liguilla</Text>
                        <Text style={styles.boxDescription}>
                        Con esta opción, los equipos se enfrentarán en emocionantes partidos, donde demostrarán su destreza 
                                y estrategia.
                        </Text>
                        <TouchableOpacity style={styles.generateButton} onPress={() => navigation.navigate('Liguilla')}>
                            <Text style={styles.generateButtonText}>Generar</Text>
                        </TouchableOpacity>
                    </View> 
                </View>
                <View style={styles.spacing}></View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff', // Fondo blanco para mejor contraste
    },
    navbar: {
        backgroundColor: 'rgb(21, 124, 21)', // Navbar oscuro
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hamburgerContainer: {
        padding: 10,
    },
    hamburgerIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    titleContainer: {
        alignItems: 'center', // Centra el contenido horizontalmente
        marginVertical: 20, // Espacio vertical
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000', // Título en color claro
    },
    description: {
        textAlign: 'center', // Centra el texto
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 15,
        marginTop: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
    boxContainer: {  
        flexDirection: 'column', // Cambia a 'column' para apilar las cajas verticalmente  
        justifyContent: 'flex-start', // Alinear desde la parte superior  
        alignItems: 'center', // Centrar las cajas horizontalmente  
        marginVertical: 20,  
        paddingHorizontal: 10,  
    },  
    box: {  
        backgroundColor: '#5A5A5A',  
        padding: 15,  
        borderRadius: 8,  
        width: '100%', // Ancho del 80% para que se vea bien centrado  
        height: '100%',
        marginBottom: 10, // Separación entre las cajas  
        minHeight: 150, // Altura mínima  
        maxHeight: 210, // Altura máxima  
        justifyContent: 'space-between',  
    },  
    boxContent: {  
        flexGrow: 1,  
        justifyContent: 'center',  
        alignItems: 'center',  
    },   
    boxTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    boxDescription: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    generateButton: {
        marginTop: 10, // Añade un margen superior para separación
        backgroundColor: 'rgb(0, 209, 178)', // Color de fondo del botón
        paddingVertical: 10, // Espaciado vertical
        paddingHorizontal: 20, // Espaciado lateral
        borderRadius: 5, // Esquinas redondeadas
        alignItems: 'center', // Centra el contenido horizontalmente
        justifyContent: 'center', // Centra el contenido verticalmente
    },
    generateButtonText: {
        color: '#FFFFFF', // Color del texto
        fontSize: 16, // Tamaño del texto
        fontWeight: 'bold', // Negrita
    },
    footer: {  
        backgroundColor: 'rgb(21, 124, 21)', // Color de fondo del footer  
        padding: 30,  
        alignItems: 'center', // Centra el contenido  
        justifyContent: 'center',   
        borderTopWidth: 1, // Línea superior  
        borderTopColor: '#dddddd', // Color de la línea  
        width: '140%',

    },  
    footerText: {  
        color: '#FFFFFF', // Texto blanco  
        fontSize: 14, // Tamaño del texto  
        textAlign: 'center',   
    },  
    spacing: {
        paddingBottom: 100
    }
});

export default Home;