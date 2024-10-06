import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const CantidadEquiposEliminatorias = () => {
  const [cantidadEquipos, setCantidadEquipos] = useState(2);
  const [equipos, setEquipos] = useState([]);
  const numbers = [2, 4, 8, 16, 32, 64];
  const navigation = useNavigation();

  const agregarEquipos = () => {
    const equiposArray = Array(Number(cantidadEquipos)).fill('').map((_, i) => `Equipo ${i + 1}`);
    setEquipos(equiposArray);
  };

  const redirectToNextPage = () => {
    const equiposString = JSON.stringify(equipos);
    navigation.navigate('ConfiguracionSorteoEliminatoria', { equipos: equiposString });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fase de Eliminación Directa: Configuración de Equipos</Text>
      <Text style={styles.subtitle}>¡Bienvenido a la fase de eliminación directa de tu sorteo! En esta etapa, podrás definir la cantidad de equipos que participarán en el sorteo.</Text>
      
      <Text style={styles.instructionTitle}>Instrucciones:</Text>
      <View style={styles.instructionsList}>
        <Text>1. Introduce el número total de equipos que deseas incluir en la fase de eliminación directa. Este número debe ser mayor o igual a 2.</Text>
        <Text>2. Haz clic en "Agregar Equipos" para crear los campos donde podrás ingresar el nombre de cada equipo.</Text>
        <Text>3. Si deseas realizar cambios, puedes ajustar la cantidad de equipos y volver a crear los campos correspondientes.</Text>
      </View>
      
      <Text style={styles.instructionTitle}>Ejemplo:</Text>
      <Text>Si ingresas "8", el sistema organizará un sorteo para 8 equipos dividiéndolos en enfrentamientos directos.</Text>
      
      <View style={styles.field}>
        <Text style={styles.label}>Cantidad de Equipos:</Text>
        <Picker
          selectedValue={cantidadEquipos}
          onValueChange={(itemValue) => setCantidadEquipos(itemValue)}
          style={styles.picker}
        >
          {numbers.map((number) => (
            <Picker.Item key={number} label={String(number)} value={number} />
          ))}
        </Picker>
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  instructionsList: {
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  picker: {
    height: 30,
    width: '100%',
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
});

export default CantidadEquiposEliminatorias;