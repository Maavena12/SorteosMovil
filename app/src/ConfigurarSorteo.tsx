import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, Animated, Easing } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const ConfiguracionSorteo = () => {
  const [equipos, setEquipos] = useState([]);
  const [divisores, setDivisores] = useState([]);
  const [selectedDivisor, setSelectedDivisor] = useState(null);
  const [cantidadGrupos, setCantidadGrupos] = useState('');
  const [seleccionarPartido, setSeleccionarPartido] = useState('');
  const [selectedClasificado, setselectedClasificado] = useState('');
  const [isModalActive, setModalActive] = useState(false);
  const [isDivisor, setIsDivisor] = useState(false);
  const [clasificados, setClasificados] = useState([]);
  const [cantidadClasificados, setCantidadClasificados] = useState(0);
  const [numeroGrupos, setNumeroGrupos] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const animation = useState(new Animated.Value(-250))[0];

  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    const params = route.params;
    const equiposArray = JSON.parse(params['equipos']);
    setEquipos(equiposArray);
    setDivisores(calcularDivisores(equiposArray.length));
  }, [route.params]);

  const calcularDivisores = (num) => {
    const divisoresArray = [];
    for (let i = 3; i <= num; i++) {
      if (num % i === 0) {
        divisoresArray.push(i);
      }
    }
    return divisoresArray;
  };

  const onDivisorSelected = (value) => {
    const divisor = Number(value);
    if (!isNaN(divisor) && divisor > 0) {
      setSelectedDivisor(divisor);
      const cantidadEquipos = equipos.length;
      const cantidadDeGrupos = cantidadEquipos / divisor;
      setCantidadGrupos(`(${cantidadDeGrupos}) grupo${cantidadDeGrupos > 1 ? 's' : ''} de ${divisor} equipos`);
      setNumeroGrupos(cantidadDeGrupos);
      setIsDivisor(true);
      setClasificados(potenciasDe2DentroDe(divisor));
    } else {
      setCantidadGrupos('');
      setIsDivisor(false);
    }
  };

  const pasarGrupo = (value) => {
    const divisor = Number(value);
    setCantidadClasificados(divisor);
  };

  const potenciasDe2DentroDe = (n) => {
    const potencias = [];
    let i = (numeroGrupos === 1) ? 2 : 1;
    while (i <= n - 1) {
      potencias.push(i);
      i *= 2;
    }
    return potencias;
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


  const sorteoFinal = () => {
    if (seleccionarPartido === '') {
      toggleModal();
    } else {
      const equiposString = JSON.stringify(equipos);
      navigation.navigate('SorteoFinal', {
        equipos: equiposString,
        divisor: selectedDivisor,
        selected: seleccionarPartido,
        cantidad: cantidadClasificados
      });
    }
  };

  const toggleModal = () => {
    setModalActive(!isModalActive);
  };

  return (
    <ScrollView style={styles.container}>
            <Text style={styles.title}>Configuración de Sorteo</Text>
            <Text style={styles.subtitle}>
                Bienvenido a la sección de configuración de tu torneo. Aquí podrás personalizar múltiples aspectos para que se adapte a tus necesidades y preferencias.
            </Text>
            <View style={styles.notification}>
                <Text style={styles.title}>Características del Torneo</Text>
                <Text style={styles.notificationText}>
                    Tienes la opción de elegir cómo deseas que se desarrollen los partidos: ¿prefieres que sean en un formato de ida y vuelta, o solo un partido?
                </Text>
                <Text style={styles.notificationText}>
                    Además, podrás decidir cómo quieres que queden los grupos. Te proporcionaremos diferentes opciones para que elijas la que mejor se ajuste a tu visión del torneo.
                </Text>
                <Text style={styles.notificationText}>¡Configura tu torneo a tu medida y disfruta de una experiencia única!</Text>
            </View>
      <Text style={styles.title}>Configuración de Sorteo</Text>
      
      <View style={styles.section}>
        <Text style={styles.subTitle}>División de Grupos</Text>
        <Text>Selecciona la cantidad de equipos por grupo:</Text>
        <Picker
                selectedValue={selectedDivisor}
                onValueChange={onDivisorSelected}
                mode="dropdown"
            >
                <Picker.Item label="Selecciona una opción" value={null} />
                {divisores.map(div => (
                    <Picker.Item key={div} label={div.toString()} value={div} />
                ))}
            </Picker>
        <Text style={styles.result}>{cantidadGrupos}</Text>
        
        {isDivisor && (
          <Picker
          selectedValue={cantidadClasificados}
          onValueChange={(itemValue) => setCantidadClasificados(itemValue)}
          mode="dropdown"
      >
          <Picker.Item label="Selecciona clasificados" value={null} />
          {clasificados.map(clas => (
              <Picker.Item key={clas} label={clas.toString()} value={clas} />
          ))}
      </Picker>
        )}
      </View>

      <View style={styles.partySelection}>
        <Text style={styles.subTitle}>Partido Ida y Vuelta</Text>
        <TouchableOpacity onPress={() => setSeleccionarPartido('si')}>
          <Text style={seleccionarPartido === 'si' ? styles.selected : styles.option}>si</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSeleccionarPartido('no')}>
          <Text style={seleccionarPartido === 'no' ? styles.selected : styles.option}>no</Text>
        </TouchableOpacity>
      </View>

      <View style={{paddingBottom:40}}>
      <Button  title="Confirmar Configuración" onPress={sorteoFinal} />
      </View>

      <Modal transparent={true} animationType="slide" visible={isModalActive}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Campo Requerido</Text>
            <Text>El campo de ida y vuelta es requerido</Text>
            <View style={styles.modalButtons}>
              <Button title="Aceptar" onPress={toggleModal} />
              <Button title="Cancelar" onPress={toggleModal} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  section: {
    padding: 20,
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
footer: {  
  backgroundColor: 'rgb(21, 124, 21)', // Color de fondo del footer  
  padding: 30,  
  alignItems: 'center', // Centra el contenido  
  justifyContent: 'center',   
  borderTopWidth: 1, // Línea superior  
  borderTopColor: '#dddddd', // Color de la línea  
  width: '100%',

},  
footerText: {  
  color: '#FFFFFF', // Texto blanco  
  fontSize: 14, // Tamaño del texto  
  textAlign: 'center',   
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
subtitle: {
    fontSize: 16,
    marginBottom: 15,
},
notification: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
},
title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},
notificationText: {
    marginBottom: 5,
    fontSize: 16,
},
subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
},
result: {
    marginTop: 10,
    fontSize: 16,
},
  partySelection: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  option: { padding: 10 },
  selected: { padding: 10, fontWeight: 'bold', color: 'blue' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});

export default ConfiguracionSorteo;