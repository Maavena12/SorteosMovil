// src/Sidebar.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sidebar = ({ visible, toggleSidebar, animation }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigation = useNavigation()

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: animation }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
                <Text style={styles.closeIcon}>✖</Text>
            </TouchableOpacity>

            <Text style={styles.sidebarTitle}>Generador</Text>

            {/* Dropdown para Generar Sorteo */}
            <TouchableOpacity onPress={toggleDropdown} style={styles.menuItem}>
                <Text style={styles.menuText}>Generar Sorteo</Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.dropdown}>
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('Fase de Grupos')
                            toggleSidebar(); // Cierra el sidebar
                        }}>
                        <Text style={styles.dropdownItem}>Fase de Grupos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('Eliminatoria')
                            toggleSidebar(); // Cierra el sidebar
                        }}>
                        <Text style={styles.dropdownItem}>Elimación Directa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => {
                            navigation.navigate('Liguilla')
                            toggleSidebar(); // Cierra el sidebar
                        }}>
                        <Text style={styles.dropdownItem}>Liguilla</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Fondo semi-transparente
        padding: 20,
        alignItems: 'flex-start',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    closeIcon: {
        fontSize: 30,
        color: 'white',
    },
    sidebarTitle: {
        fontSize: 24,
        color: 'white',
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%', // Asegura el uso del ancho completo
    },
    menuText: {
        fontSize: 18,
        color: 'white',
    },
    arrow: {
        fontSize: 18,
        color: 'white',
    },
    dropdown: {
        paddingLeft: 20,
        paddingVertical: 5,
    },
    dropdownItem: {
        fontSize: 16,
        color: 'white',
    },
});

export default Sidebar;