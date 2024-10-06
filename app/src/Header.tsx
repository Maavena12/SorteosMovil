import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

interface HeaderProps {
    onMenuPress: () => void; // Define la propiedad onMenuPress
}

const Header: React.FC<HeaderProps> = ({ onMenuPress }) => {

    return (
        <TouchableWithoutFeedback>
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <TouchableOpacity onPress={onMenuPress} style={styles.hamburgerContainer}>
                        <Text style={styles.hamburgerIcon}>☰</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Generador Torneo</Text>
                    <View style={styles.hamburgerContainer} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff', // Fondo blanco para mejor contraste
    },
    navbar: {
        backgroundColor: 'rgb(21, 124, 21)', // Navbar oscuro
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

export default Header;