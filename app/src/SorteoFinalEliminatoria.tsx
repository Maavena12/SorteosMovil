import React, { useEffect, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'; // Asegúrate de tener React Navigation configurado
import { View, Text, Button, Modal, Alert, StyleSheet, ScrollView, TextInput } from 'react-native';

const SorteoFinalEliminatoria = () => {
  const [equipos, setEquipos] = useState<string[]>([]);
  const [rondas, setRondas] = useState<{ partidos: { equipo1: string; equipo2: string; goles1: number; goles2: number; ganador?: string; estado: string; penales?: { equipo1: number; equipo2: number }; }[] }[]>([]);
  const [isModalActive, setModalActive] = useState(false);
  const [equipoGanador, setEquipoGanador] = useState<string | undefined>(undefined);
  const [seleccionarPartido, setSeleccionarPartido] = useState<string>('');
  const [idaVuelta, setIdaVuelta] = useState<boolean>(false);
  const golVisitante = useRef<any>([])
  const [golesAcumulados, setGolesAcumulados] = useState<{ [key: string]: number }>({});
  const [final, setFinal] = useState<boolean>(false);
  const [juegos, setJuegos] = useState<number>(0);
  const [ActualizarFase, setActualizarFase] = useState<number>(0);
  const [i, setI] = useState(0); // Contador de partidos
  const [partidoCompleto, setPartidoCompleto] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const params = route.params;

  useEffect(() => {
    if (params) {
      setEquipos(JSON.parse(params['equipos']));
      setSeleccionarPartido(params['seleccionarPartido']);

      // Verificar si seleccionarPartido es 'si'
      if (seleccionarPartido === 'si') {
        setIdaVuelta(true);
      } else {
        setIdaVuelta(false);
      }

      setActualizarFase(equipos.length);

      iniciarTorneo(); // Iniciar el torneo

    }
  }, [route.params]);

  useEffect(() => {
    setSeleccionarPartido(params['seleccionarPartido']);
    if (seleccionarPartido === 'si') {
        setIdaVuelta(true);
      } else {
        setIdaVuelta(false);
      }
    iniciarTorneo()
  }, [equipos, seleccionarPartido, idaVuelta]);

  useEffect(() => {
    setJuegos(prev => prev + 1);
  }, [setJuegos]);

  useEffect(() => {  
    golVisitante.current = golesAcumulados
  }, [golesAcumulados]); 

  const iniciarTorneo = () => {
    setRondas([]); // Reiniciar rondas
    generarPartidos(equipos); // Este método debe ser implementado
  };

  const generarPartidos = (equipos: string[]) => {
    const partidos = [];
    for (let i = 0; i < equipos.length; i += 2) {
        if (equipos[i + 1]) {
            if (equipos.length !== 2) {
                partidos.push({ equipo1: equipos[i], equipo2: equipos[i + 1], goles1: 0, goles2: 0, estado: 'En Espera' });
                if (idaVuelta) {
                    partidos.push({ equipo1: equipos[i + 1], equipo2: equipos[i], goles1: 0, goles2: 0, estado: 'En Espera' });
                }
            } else {
                partidos.push({ equipo1: equipos[i], equipo2: equipos[i + 1], goles1: 0, goles2: 0, estado: 'En Espera' });
                setFinal(true);
            }
        }
    }
    setRondas(prevRondas => [...prevRondas, { partidos }]);
    };

    const completarPartido = async (rondaIndex, partidoIndex) => {
        const partido = rondas[rondaIndex].partidos[partidoIndex];

        // Validación de que los goles no son negativos
        if (partido.goles1 < 0 || partido.goles2 < 0) {
            Alert.alert("Los goles no pueden ser negativos.");
            return;
        }

        // Acumular goles
        await acumularGoles(partido.equipo1, partido.goles1);
        await acumularGoles(partido.equipo2, partido.goles2);

        if (idaVuelta) {
            if (final) {

                if (partido.goles1 === partido.goles2) {
                    await generarPenales(partido);
                } else if (partido.goles1 > partido.goles2) {
                    partido.ganador = partido.equipo1;
                    if (final) {
                        toggleModal();
                        setEquipoGanador(partido.ganador);
                    }
                    setI(0);
                    partido.estado = 'Completado';
                } else if (partido.goles2 > partido.goles1) {
                    partido.ganador = partido.equipo2;
                    if (final) {
                        toggleModal();
                        setEquipoGanador(partido.ganador);
                    }
                    setI(0);
                    partido.estado = 'Completado';
                }
            }

            if (i === 1) {
                const ganadorIdaVuelta = golVisitante.current;
                // Similar lógica para determinar el ganador
                if (ganadorIdaVuelta[partido.equipo1] === ganadorIdaVuelta[partido.equipo2]) {
                    await generarPenales(partido);
                    setI(0);
                    partido.estado = 'Completado';
                    console.log('uuuuuuuu', juegos)
                } else if (ganadorIdaVuelta[partido.equipo1] > ganadorIdaVuelta[partido.equipo2]) {
                    partido.ganador = partido.equipo1;
                    if (final) {
                        toggleModal();
                        setEquipoGanador(partido.ganador);
                    }
                    setI(0);
                    partido.estado = 'Completado';
                    console.log('uuuuuuuu', juegos)
                } else if (ganadorIdaVuelta[partido.equipo2] > ganadorIdaVuelta[partido.equipo1]) {
                    partido.ganador = partido.equipo2;
                    if (final) {
                        toggleModal();
                        setEquipoGanador(partido.ganador);
                    }
                    setI(0);
                    partido.estado = 'Completado';
                    console.log('uuuuuuuu', juegos)
                }

                setJuegos(prev => prev + 1);

                console.log('uuuuuuuu', juegos)

                if (getTitleForTeams(getNumEquiposRestantes(rondaIndex)) === 'Final') {
                    toggleModal();
                    setEquipoGanador(partido.ganador);
                }

                if (partido.penales){

                } else {
                  if (rondas[rondaIndex].partidos.every(p => p.goles1 !== undefined && p.goles2 !== undefined) && rondas[rondaIndex].partidos.length === juegos) {
                    setJuegos(0);
                    generarSiguienteRonda(rondaIndex);
                  }
                }
            } else {
                setI(prev => prev + 1);
                partido.estado = 'Completado';
                setJuegos(prev => prev + 1);
            }
        } else {
            // Determinar el ganador basado en los goles
            if (partido.goles1 > partido.goles2) {
                partido.ganador = partido.equipo1;
                partido.estado = 'Completado';
    
                setJuegos(prev => prev + 1);
    
                if (final) {
                    toggleModal();
                    setEquipoGanador(partido.ganador);
                }

                if (partido.penales){

                }

                if (rondas[rondaIndex].partidos.every(p => p.goles1 !== undefined && p.goles2 !== undefined) && rondas[rondaIndex].partidos.length === juegos) {
                    setJuegos(0);
                    generarSiguienteRonda(rondaIndex);
                }
            } else if (partido.goles2 > partido.goles1) {
                partido.ganador = partido.equipo2;
                console.log('pasa')
                partido.estado = 'Completado';
    
                setJuegos(prev => prev + 1);
    
                if (final) {
                    toggleModal();
                    setEquipoGanador(partido.ganador);
                }
    
                if (rondas[rondaIndex].partidos.every(p => p.goles1 !== undefined && p.goles2 !== undefined) && rondas[rondaIndex].partidos.length === juegos) {
                    setJuegos(0);
                    generarSiguienteRonda(rondaIndex);
                }
            } else {
                await generarPenales(partido);
            }
        }
    };

    const generarSiguienteRonda = (rondaIndex) => {
        // Obtener ganadores válidos
        let ganadores = rondas[rondaIndex].partidos  
            .map(p => p.ganador)  
            .filter((g) => g !== undefined && g !== 'Empate'); 

        // Verificar si hay un número impar de ganadores
        if (ganadores.length % 2 !== 0) {
            console.warn("Número impar de ganadores; se debe manejar adecuadamente.");
        }

        const partidos = []; 
        
        // Eliminar duplicados
        ganadores = eliminarDuplicados(ganadores);

        // Reiniciar la acumulación de goles
        reiniciarGoles();

        // Generación única de partidos, considerando ida y vuelta
        for (let i = 0; i < ganadores.length; i += 2) {  
            if (ganadores.length === 2) { 
                partidos.push({ equipo1: ganadores[i], equipo2: ganadores[i + 1], goles1: 0, goles2: 0, estado: 'En Espera' }); 
                setFinal(true); // Actualiza el estado de la final
            } else {
                if (ganadores[i + 1]) {
                    // Solo se agrega un partido por emparejamiento
                    partidos.push({ equipo1: ganadores[i], equipo2: ganadores[i + 1], goles1: 0, goles2: 0, estado: 'En Espera' });

                    // Si es ida y vuelta, podemos agregar una estructura diferente si se prefiere
                    if (idaVuelta) {
                        partidos.push({ equipo1: ganadores[i + 1], equipo2: ganadores[i], goles1: 0, goles2: 0, estado: 'En Espera' });
                    }
                }  
            }
        }

        // Almacenar partidos únicos en la nueva ronda
        setRondas(prevRondas => [...prevRondas, { partidos }]);
        setActualizarFase(ganadores.length);  // Actualiza el estado de la fase
    };

    const getTitleForTeams = (numEquipos) => {
        switch (numEquipos) {
            case 2:
                return 'Final';
            case 4:
                return 'Semifinal';
            case 8:
                return 'Cuartos de Final';
            case 16:
                return 'Octavos de Final';
            case 32:
                return '64avos de Final';
            default:
                return '';
        }
    };

    const getNumEquiposRestantes = (rondaIndex) => {
        return equipos.length / Math.pow(2, rondaIndex);
    };

    const toggleModal = () => {
        setModalActive(prev => !prev);
    };

    const eliminarDuplicados = (array) => {
        return [...new Set(array)];
    };

    const generarPenales = async (partido) => {
        partido.penales = { equipo1: 0, equipo2: 0 }; // Inicializa los penales
        alert(`Se generarán penales entre ${partido.equipo1} y ${partido.equipo2}.`);

        //await submitPenales(partido); 
    };

    const submitPenales = async (partido, rondaIndex, partidoIndex) => {  
        await determinarGanadorPenales(partido, rondaIndex, partidoIndex)
    }; 

    const determinarGanadorPenales = (partido, rondaIndex, partidoIndex) => {
        if (partido.penales) {
            if (partido.penales.equipo1 > partido.penales.equipo2) {
                partido.ganador = partido.equipo1;
                partido.estado = 'Completado';

                console.log('uuuuuuuu', rondas[rondaIndex].partidos.length, juegos)
    
                if (final) {
                    toggleModal();
                    setEquipoGanador(partido.ganador);
                }

                if (rondas[rondaIndex].partidos.every(p => p.goles1 !== undefined && p.goles2 !== undefined) && rondas[rondaIndex].partidos.length === juegos - 1) {
                  setJuegos(0);
                  generarSiguienteRonda(rondaIndex);
                }
            } else if (partido.penales.equipo2 > partido.penales.equipo1) {
                partido.ganador = partido.equipo2;
                partido.estado = 'Completado';

                console.log('uuuuuuuu', rondas[rondaIndex].partidos.length, juegos)
    
                if (final) {
                    toggleModal();
                    setEquipoGanador(partido.ganador);
                }

                if (rondas[rondaIndex].partidos.every(p => p.goles1 !== undefined && p.goles2 !== undefined) && rondas[rondaIndex].partidos.length === juegos - 1) {
                  setJuegos(0);
                  generarSiguienteRonda(rondaIndex);
                }
            } 
        }
    };

    const acumularGoles = (equipo, goles) => {
        setGolesAcumulados(prev => {
            const nuevosGoles = { ...prev };
            if (!nuevosGoles[equipo]) {
                nuevosGoles[equipo] = 0; // Inicializamos si no existe
            }
            nuevosGoles[equipo] += goles; // Acumulamos los goles
            return nuevosGoles;
        });
    };

    // Método para verificar los goles acumulados
    const obtenerGolesAcumulados = () => {
        return golesAcumulados;
    };

    // Método para reiniciar los goles
    const reiniciarGoles = () => {
        setGolesAcumulados({}); // Reiniciamos el objeto de goles acumulados
    };

    const isCompletado = (partido) => {
        return partido.estado === 'Completado';
    };

    return (  
        <ScrollView style={styles.container}>  
          {/* Vista de las rondas y partidos */}  
          {idaVuelta ? (  
            <ScrollView>  
              <Text style={styles.title}>Fase Eliminación Directa</Text>  
              <ScrollView>  
                {rondas.map((ronda, rondaIndex) => (  
                  <ScrollView key={rondaIndex}>  
                    <Text style={styles.subtitle}>  
                      {getTitleForTeams(getNumEquiposRestantes(rondaIndex))}  
                    </Text>  
                    <ScrollView style={styles.row}>  
                      {ronda.partidos.map((partido, partidoIndex) => (  
                        <View key={partidoIndex} style={styles.box}>  
                          <Text>{partidoIndex % 2 === 0 ? 'Ida' : 'Vuelta'}</Text>  
                          <View style={styles.table}>  
                            <Text style={styles.tableHeader}>Partido</Text>  
                            <View style={styles.tableRow}>  
                                <Text>{partido.equipo1}</Text>  
                                <TextInput  
                                  style={styles.input}  
                                  keyboardType="numeric"   
                                  onChangeText={(text) => (partido.goles1 = parseInt(text))}  
                                  placeholder="0" 
                                />  
                                <Text>vs</Text>
                                <TextInput  
                                  style={styles.input}  
                                  keyboardType="numeric"  
                                  onChangeText={(text) => (partido.goles2 = parseInt(text))} 
                                  placeholder="0"  
                                />  
                                <Text>{partido.equipo2}</Text>  
                              <View>  
                                <Button  
                                  title="✓"  
                                  onPress={() => !isCompletado(partido) ? completarPartido(rondaIndex, partidoIndex) : null}  
                                  disabled={isCompletado(partido)}  
                                />  
                              </View>  
                            </View>  
                          </View>  
      
                          {partido.penales && (  
                            <View>  
                              <Text>Penales</Text>  
                              <Text>{partido.equipo1}:</Text>  
                              <TextInput  
                                style={styles.input}  
                                keyboardType="numeric"  
                                onChangeText={(text) => (partido.penales.equipo1 = Number(text))} 
                                placeholder='0' 
                              />  
                              <Text>{partido.equipo2}:</Text>  
                              <TextInput  
                                style={styles.input}  
                                keyboardType="numeric"  
                                onChangeText={(text) => (partido.penales.equipo2 = Number(text))}
                                placeholder='0'   
                              />  
                              <Button title="Determinar Ganador" onPress={() => submitPenales(partido, rondaIndex, partidoIndex)} />  
                            </View>  
                          )}  
                          {partido.ganador && (
                                <Text>{partido.ganador === 'Empate' ? 'Resultado: Empate' : `Ganador: ${partido.ganador}`}</Text> 
                            )} 
                        </View>  
                      ))}  
                    </ScrollView>  
                  </ScrollView>  
                ))}  
              </ScrollView>  
            </ScrollView>  
          ) : (  
            <ScrollView>  
              <Text style={styles.title}>Fase Eliminación Directa (Ida)</Text>  
              <ScrollView>  
                {rondas.map((ronda, rondaIndex) => (  
                  <ScrollView key={rondaIndex}>  
                    <Text style={styles.subtitle}>{getTitleForTeams(getNumEquiposRestantes(rondaIndex))}</Text>  
                    <ScrollView style={styles.row}>  
                      {ronda.partidos.map((partido, partidoIndex) => (  
                        <ScrollView key={partidoIndex} style={styles.box}>  
                          <View style={styles.table}>  
                            <Text style={styles.tableHeader}>Partido</Text>  
                            <View style={styles.tableRow}> 
                                <Text>{partido.equipo1}</Text>  
                                <TextInput  
                                  style={styles.input}  
                                  keyboardType="numeric"  
                                  onChangeText={(text) => (partido.goles1 = Number(text))}  
                                  placeholder="0"  
                                />  
                                <Text>vs</Text>  
                                <TextInput  
                                  style={styles.input}  
                                  keyboardType="numeric"  
                                  onChangeText={(text) => (partido.goles2 = Number(text))}  
                                  placeholder="0"  
                                />  
                                <Text>{partido.equipo2}</Text>   
                              <View>  
                                <Button  
                                  title="✓"  
                                  onPress={() => !isCompletado(partido) ? completarPartido(rondaIndex, partidoIndex) : null}  
                                  disabled={isCompletado(partido)}  
                                />  
                              </View>  
                            </View>  
                          </View>  
      
                          {partido.penales && (  
                            <View>  
                              <Text>Penales</Text>  
                              <Text>{partido.equipo1}:</Text>  
                              <TextInput  
                                style={styles.input}  
                                keyboardType="numeric"  
                                onChangeText={(text) => (partido.penales.equipo1 = Number(text))}  
                              />  
                              <Text>{partido.equipo2}:</Text>  
                              <TextInput  
                                style={styles.input}  
                                keyboardType="numeric"  
                                onChangeText={(text) => (partido.penales.equipo2 = Number(text))}  
                              />  
                              <Button title="Determinar Ganador" onPress={() => submitPenales(partido, rondaIndex, partidoIndex)} />  
                            </View>  
                          )}  
                          {partido.ganador && (
                                <Text>{partido.ganador === 'Empate' ? 'Resultado: Empate' : `Ganador: ${partido.ganador}`}</Text> 
                            )} 
                        </ScrollView>  
                      ))}  
                    </ScrollView>  
                  </ScrollView>  
                ))}  
              </ScrollView>  
            </ScrollView>  
          )}  
      
          {/* Modal para el campeón */}  
          <Modal  
            animationType="slide"  
            transparent={true}  
            visible={isModalActive}  
            onRequestClose={toggleModal}  
          >  
            <View style={styles.modalOverlay}>  
              <View style={styles.modalContent}>  
                <Text style={styles.modalTitle}>¡Felicidades Campeón!</Text>  
                <Text>¡Felicidades {equipoGanador}, eres el campeón del torneo!</Text>  
                <View style={styles.modalActions}>  
                  <Button title="Aceptar" onPress={toggleModal} color="#4CAF50" />  
                  <Button title="Cancelar" onPress={toggleModal} />  
                </View>  
              </View>  
            </View>  
          </Modal>  
      
          {/* Nota importante */}  
          <Text style={styles.note}>  
            Nota importante: Para actualizar la tabla de clasificación se debe dar click en el icono   
            <Text style={styles.checkIcon}> ✓ </Text>  
            al colocar cada resultado.  
          </Text>  
        </ScrollView>  
      );
};

const styles = StyleSheet.create({  
    container: {  
      padding: 20,  
    },  
    title: {  
      fontSize: 20,  
      fontWeight: 'bold',  
    },  
    subtitle: {  
      fontSize: 18,  
      marginVertical: 10,  
    },  
    row: {  
      marginBottom: 20,  
    },  
    box: {  
      marginBottom: 15,  
      padding: 10,  
      borderWidth: 1,  
      borderColor: '#ccc',  
      borderRadius: 5,  
    },  
    table: {  
      marginBottom: 10,  
    },  
    tableHeader: {  
      fontSize: 16,  
      fontWeight: 'bold',  
    },  
    tableRow: {  
      flexDirection: 'row',  
      alignItems: 'center',  
      justifyContent: 'space-between',  
    },  
    input: {  
        width: 50,
        margin: 0,
        padding: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 5,
        textAlign: 'center',
    },  
    modalOverlay: {  
      flex: 1,  
      justifyContent: 'center',  
      alignItems: 'center',  
      backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },  
    modalContent: {  
      backgroundColor: 'white',  
      padding: 20,  
      borderRadius: 10,  
      width: '80%',  
    },  
    modalTitle: {  
      fontSize: 20,  
      fontWeight: 'bold',  
      marginBottom: 10,  
    },  
    modalActions: {  
      flexDirection: 'row',  
      justifyContent: 'space-between',  
    },  
    note: {  
      color: 'red',  
      marginTop: 10,  
    },  
    checkIcon: {  
      fontWeight: 'bold',  
    },  
});  

export default SorteoFinalEliminatoria;