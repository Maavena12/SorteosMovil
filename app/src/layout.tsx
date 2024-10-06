import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false); // Inicializado como false
    const animation = useRef(new Animated.Value(-300)).current; // Usando useRef para la animación

    const toggleSidebar = () => {
        if (sidebarVisible) {
            // Si está visible, ocúltalo
            Animated.timing(animation, {
                toValue: -300, // Fuera de la vista
                duration: 300,
                useNativeDriver: true,
            }).start(() => setSidebarVisible(false)); // Actualiza el estado al final
        } else {
            // Si no está visible, muéstralo
            setSidebarVisible(true); // Cambia el estado aquí
            Animated.timing(animation, {
                toValue: 0, // Posición visible
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View style={styles.container}>
            <Header 
                onMenuPress={toggleSidebar} 
            />
            <View style={styles.content}>
                {children}
            </View>
            <Footer />
            <Animated.View 
                style={[
                    styles.sidebar, 
                    { transform: [{ translateX: animation }] }
                ]}
            >
                <Sidebar 
                    toggleSidebar={toggleSidebar} 
                    visible={sidebarVisible}  // Pasar visible si es necesario
                    animation={animation}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 9,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 300, // Ancho del sidebar
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    },
});

export default Layout;