import React, { useEffect, useState } from 'react';  
import { View, Text, Button, FlatList, Modal, StyleSheet, ScrollView, TextInput } from 'react-native';  
import { useNavigation, useRoute } from '@react-navigation/native';  
import { Equipo } from '../equipo';

const SorteoFinalComponent = () => {  
    const route = useRoute();  
    const navigation = useNavigation();  

    const [equipos, setEquipos] = useState([]);  
    const [divisor, setDivisor] = useState(0);  
    const [seleccionarPartido, setSeleccionarPartido] = useState('');  
    const [idaVuelta, setIdaVuelta] = useState(false);   
    const [jornadas, setJornadas] = useState([]);  
    const [i, setI] = useState(0);  
    const [golesTemporales, setGolesTemporales] = useState({});  
    const [cantidadClasificados, setCantidadClasificados] = useState(0);  
    const [resultados, setResultados] = useState([]);
    const [gruposGenerados, setGruposGenerados] = useState<string[][]>([]);  
    const [cantidadJornada, setCantidadJornada] = useState<string[]>([])
    const [equiposPorGrupo, setEquiposPorGrupo] = useState<any[][]>([])
    const [grupos, setGrupos] = useState<number>(0)
    const [cantidad, setCantidad] = useState<number>(0)
    const [firstEffectDone, setFirstEffectDone] = useState(false); 

    useEffect(() => {  
        const params = route.params;  
        setEquipos(JSON.parse(params['equipos']));  
        setDivisor(params['divisor']);  
        setSeleccionarPartido(params['selected']);  
        setCantidadClasificados(params['cantidad']);  
    }, [route.params]);  

    useEffect(() => {  
        setCantidadJornada(equipos)
    }, [jornadas]); 

    useEffect(() => {  
        setGrupos(equipos.length / divisor);  
        setCantidad(equipos.length / grupos);  
        setIdaVuelta(seleccionarPartido === 'si'); 

        const gruposGenerados = dividirEquiposEnGrupos(equipos, cantidad);  
        setGruposGenerados(gruposGenerados);  
        
        const jornadas = generarJornadas(gruposGenerados);  
        setJornadas(jornadas);  

        inicializarEquipos()
        
        initializeResultados(jornadas); 
    }, [grupos, cantidad]);  

    useEffect(() => {  
        inicializarEquipos()
    }, [gruposGenerados]); 

    const dividirEquiposEnGrupos = (equiposMezclados, cantidad) => {  
        const gruposGenerados = [];  
        const equiposRandomizados = mezclarArray(equiposMezclados); 

        for (let i = 0; i < grupos; i++) {  
            gruposGenerados.push(equiposRandomizados.slice(i * cantidad, (i + 1) * cantidad));  
        }  

        return gruposGenerados;  
    };  

    const mezclarArray = (array) => {  
        const arrMezclado = array.slice();  
        for (let i = arrMezclado.length - 1; i > 0; i--) {  
            const j = Math.floor(Math.random() * (i + 1));  
            [arrMezclado[i], arrMezclado[j]] = [arrMezclado[j], arrMezclado[i]];  
        }  
        return arrMezclado;  
    };  

    const generarJornadas = (grupos) => {  
        return grupos.map(grupo => generarPartidos(grupo));  
    };  

    const generarPartidos = (grupo) => {  
        const partidos = [];  
        const numEquipos = grupo.length;  
        for (let i = 0; i < numEquipos; i++) {  
            for (let j = i + 1; j < numEquipos; j++) {  
                partidos.push(`${grupo[i]} vs ${grupo[j]}`);  
                if (idaVuelta) {  
                    partidos.push(`${grupo[j]} vs ${grupo[i]}`);  
                }  
            }  
        }  
        return partidos;  
    };  

    const inicializarEquipos = () => {  
        const nuevosEquiposPorGrupo = gruposGenerados.map(grupo =>   
            grupo.map(nombre => new Equipo(nombre))  
        );  
        setEquiposPorGrupo(nuevosEquiposPorGrupo);  
    }; 

    const initializeResultados = (jornadas) => {  
        const resultadosInit = jornadas.map(grupo => grupo.map(() => ({ golesEquipo1: 0, golesEquipo2: 0, estado: 'En Espera' })));  
        setResultados(resultadosInit);  
    };  

    const onResultadosChange = (grupoIndex, partidoIndex) => {  
        const resultado = resultados[grupoIndex][partidoIndex];  

        setGolesTemporales(prevGoles => {  
            const key = `${grupoIndex}-${partidoIndex}`;  
            if (!prevGoles[key]) {  
                prevGoles[key] = { equipo1: 0, equipo2: 0 };  
            }  

            prevGoles[key].equipo1 = resultado.golesEquipo1;  
            prevGoles[key].equipo2 = resultado.golesEquipo2;  

            return { ...prevGoles };  
        });  
    } 

    const completarPartido = (grupoIndex, partidoIndex) => {  
        if (golesTemporales[`${grupoIndex}-${partidoIndex}`] === undefined) {  
            const equipo1Nombre = jornadas[grupoIndex][partidoIndex].split(' vs ')[0].trim();  
            const equipo2Nombre = jornadas[grupoIndex][partidoIndex].split(' vs ')[1].trim();  
      
            const equipo1 = equiposPorGrupo[grupoIndex].find(e => e.nombre === equipo1Nombre);  
            const equipo2 = equiposPorGrupo[grupoIndex].find(e => e.nombre === equipo2Nombre);  
      
            if (equipo1 && equipo2) {  
                equipo1.golesAFavor += 0;   
                equipo1.golesEnContra += 0;   
                equipo2.golesAFavor += 0;   
                equipo2.golesEnContra += 0;   
                equipo1.puntos += 1;  
                equipo2.puntos += 1;  

                resultados[grupoIndex][partidoIndex].estado = 'Completado';  

                updateClasificacion(grupoIndex);  

                // Actualizar cantidadJornada  
                setCantidadJornada(jornadas.flat());  

                console.log('fg', cantidadJornada.length, i)
      
                if (i < cantidadJornada.length - 1) {  
                    setI(prevI => prevI + 1);  
                } else {  
                    const equiposSeleccionados = obtenerEquiposPorGrupo(cantidadClasificados, grupoIndex);  
                    const array = equiposSeleccionados.map(equipo => equipo.nombre);  
                    console.log('rrrrrr', equiposSeleccionados)
                    navigation.navigate('SorteoFinalEliminatoria', { equipos: JSON.stringify(array), seleccionarPartido: seleccionarPartido});  
                }  
            }  
        } else {  
            const golesTemp = golesTemporales[`${grupoIndex}-${partidoIndex}`];  

            const equipo1Nombre = jornadas[grupoIndex][partidoIndex].split(' vs ')[0].trim();  
            const equipo2Nombre = jornadas[grupoIndex][partidoIndex].split(' vs ')[1].trim();  
      
            const equipo1 = equiposPorGrupo[grupoIndex].find(e => e.nombre === equipo1Nombre);  
            const equipo2 = equiposPorGrupo[grupoIndex].find(e => e.nombre === equipo2Nombre);  
      
            if (equipo1 && equipo2) {  
                equipo1.golesAFavor += golesTemp.equipo1;   
                equipo1.golesEnContra += golesTemp.equipo2;   
                equipo2.golesAFavor += golesTemp.equipo2;   
                equipo2.golesEnContra += golesTemp.equipo1;   

                if (golesTemp.equipo1 > golesTemp.equipo2) {  
                    equipo1.puntos += 3;  
                } else if (golesTemp.equipo1 < golesTemp.equipo2) {  
                    equipo2.puntos += 3;  
                } else {  
                    equipo1.puntos += 1;  
                    equipo2.puntos += 1;  
                }  
      
                resultados[grupoIndex][partidoIndex].estado = 'Completado';  

                updateClasificacion(grupoIndex);  

                // Actualizar cantidadJornada  
                setCantidadJornada(jornadas.flat()); 
                
                console.log('fg', cantidadJornada.length, i)

                if (i < cantidadJornada.length - 1) {  
                    setI(prevI => prevI + 1);  
                } else {  
                    const equiposSeleccionados = obtenerEquiposPorGrupo(cantidadClasificados, grupoIndex);  
                    const array = equiposSeleccionados.map(equipo => equipo.nombre);  
                    console.log('rrrrrr', equiposSeleccionados)
                    navigation.navigate('SorteoFinalEliminatoria', { equipos: JSON.stringify(array), seleccionarPartido: seleccionarPartido});  
                }  
            }  
        }  

        // Eliminar los goles temporales  
        setGolesTemporales(prevGoles => {  
            const newGoles = { ...prevGoles };  
            delete newGoles[`${grupoIndex}-${partidoIndex}`];  
            return newGoles;  
        });  
    };  

    const updateClasificacion = (grupoIndex) => {  
        const equiposOrdenados = [...equiposPorGrupo[grupoIndex]].sort((a, b) => {  
            if (b.puntos === a.puntos) {  
                return b.golesAFavor - a.golesAFavor;  
            }  
            return b.puntos - a.puntos;  
        });  
        const nuevosEquiposPorGrupo = [...equiposPorGrupo];  
        nuevosEquiposPorGrupo[grupoIndex] = equiposOrdenados;  
        setEquiposPorGrupo(nuevosEquiposPorGrupo);  
    }; 

    const obtenerEquiposPorGrupo = (cantidad, grupoIndex) => {  
        let array = [];  

        const equiposOrdenados = [...equiposPorGrupo[grupoIndex]].sort((a, b) => {  
            if (b.puntos === a.puntos) {  
                return b.golesAFavor - a.golesAFavor;  
            }  
            return b.puntos - a.puntos;  
        }); 

        equiposPorGrupo.forEach(grupo => {  
            const equiposDelGrupo = grupo.slice(0, cantidad);  
            array = array.concat(equiposDelGrupo);  
        });  
        
        return array; // Retorna el arreglo con todos los equipos seleccionados  
    }; 

    const isCompletado = (partido) => {  
        return partido.estado === 'Completado';  
    }; 

    return (  
        <ScrollView style={styles.container}>  
            <View style={styles.section}>  
                <Text style={styles.title}>Grupos de Equipos</Text>  
                {gruposGenerados.map((grupo, index) => (  
                    <View key={index} style={styles.box}>  
                        <Text style={styles.subtitle}>Grupo {index + 1}</Text>  
                        <View style={styles.table}>  
                            <Text style={styles.tableHeader3}>Equipos</Text>  
                            {grupo.map((equipo, idx) => (  
                                <Text key={idx} style={styles.tableRow}>{equipo}</Text>  
                            ))}  
                        </View>  
                    </View>  
                ))}  
            </View>  

            <View style={styles.section}>  
                <Text style={styles.title}>Jornadas de Partidos</Text>  
                <ScrollView horizontal>  
                    {gruposGenerados.map((grupo, index) => (  
                        <View key={index} style={styles.column}>  
                            <View style={styles.box}>  
                                <Text style={styles.subtitle}>Grupo {index + 1}</Text>  
                                <View style={styles.table}>  
                                    <Text style={styles.tableHeader}>Partido</Text>  
                                    {jornadas[index].map((partido, jdx) => (  
                                        <Text key={jdx} style={styles.tableRow}>{partido}</Text>  
                                    ))}  
                                </View>  
                            </View>  
                        </View>  
                    ))}  
                </ScrollView>  
            </View>  

            <View style={styles.section}>  
                <Text style={styles.title}>Resultados</Text>  
                <ScrollView horizontal>  
                    {gruposGenerados.map((grupo, index) => (  
                        <View key={index} style={styles.column}>  
                            <View style={styles.box}>  
                                <Text style={styles.subtitle}>Grupo {index + 1}</Text>  
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                        <Text style={[styles.tableHeader2, styles.headerCell2]}>Partido</Text>
                                        <Text style={[styles.tableHeader2, styles.headerCell2]}>Completar</Text>
                                    </View>
                                    {jornadas[index].map((partido, jdx) => {
                                        const [equipo1, equipo2] = partido.split(' vs ');

                                        return (
                                            <View key={jdx} style={styles.tableRow}>
                                                <Text style={styles.cell}>{equipo1}</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    keyboardType="numeric"
                                                    placeholder="0"
                                                    value={resultados[index][jdx].golesEquipo1?.toString() || ''}
                                                    onChangeText={(text) => {
                                                        const golesEquipo1 = isNaN(parseInt(text, 10)) ? 0 : parseInt(text, 10);
                                                        resultados[index][jdx].golesEquipo1 = golesEquipo1;
                                                        onResultadosChange(index, jdx);
                                                    }}
                                                />
                                                <Text>vs</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    keyboardType="numeric"
                                                    placeholder="0"
                                                    value={resultados[index][jdx].golesEquipo2?.toString() || ''}
                                                    onChangeText={(text) => {
                                                        const golesEquipo2 = isNaN(parseInt(text, 10)) ? 0 : parseInt(text, 10);
                                                        resultados[index][jdx].golesEquipo2 = golesEquipo2;
                                                        onResultadosChange(index, jdx);
                                                    }}
                                                />
                                                <Text style={styles.cell}>{equipo2}</Text>
                                                <Button
                                                    title="Completar"
                                                    onPress={() => !isCompletado(resultados[index][jdx]) ? completarPartido(index, jdx) : null}
                                                    disabled={isCompletado(resultados[index][jdx])}
                                                />
                                            </View>
                                        );
                                    })}
                                </View> 
                            </View>  
                        </View>  
                    ))}  
                </ScrollView>  
                <Text style={styles.note}>  
                    Nota importante: Para actualizar la tabla de clasificación se debe dar click en el botón   
                </Text>  
                {/* Añadir icono aquí si es necesario */}  
            </View>  

            <View style={styles.section}>  
                <Text style={styles.title}>Clasificación</Text>  
                {equiposPorGrupo.map((grupo, index) => (  
                    <View key={index} style={styles.box}>
                        <Text style={styles.subtitle}>Grupo {index + 1}</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableHeader, styles.headerCell]}>Equipo</Text>
                                <Text style={[styles.tableHeader, styles.headerCell]}>Puntos</Text>
                                <Text style={[styles.tableHeader, styles.headerCell]}>Goles a Favor</Text>
                                <Text style={[styles.tableHeader, styles.headerCell]}>Goles en Contra</Text>
                            </View>
                            {grupo.map((equipo, jdx) => (
                                <View
                                    key={jdx}
                                    style={[styles.tableRow, jdx < cantidadClasificados && styles.classified]}
                                >
                                    <Text style={styles.cell}>{equipo.nombre}</Text>
                                    <Text style={styles.cell}>{equipo.puntos}</Text>
                                    <Text style={styles.cell}>{equipo.golesAFavor}</Text>
                                    <Text style={styles.cell}>{equipo.golesEnContra}</Text>
                                </View>
                            ))}
                        </View>
                    </View> 
                ))}  
            </View>  
        </ScrollView>  
    );   
}

const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
        padding: 16,  
    },  
    section: {  
        marginBottom: 20,  
    },  
    title: {  
        fontSize: 24,  
        fontWeight: 'bold',  
        marginBottom: 16,  
    },  
    subtitle: {  
        fontSize: 20,  
        marginBottom: 8,  
    },  
    box: {  
        borderWidth: 1,  
        borderColor: '#ccc',  
        padding: 16,  
        borderRadius: 10,  
        marginBottom: 8,  
    },  
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 8,
        borderRadius: 5,
        overflow: 'hidden',
    },
    tableHeader: {
        fontWeight: 'bold',
        marginVertical: 4,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
    },
    tableHeader2: {
        fontWeight: 'bold',
        marginVertical: 4,
        textAlign: 'center',
    },
    tableHeader3: {
        fontWeight: 'bold',
        marginVertical: 4,
    },
    headerCell2: {
        flex: 1,
        textAlign: 'center',
        paddingLeft: 80
    },
    cell: {
        flex: 1,
        textAlign: 'center',
    },
    classified: {
        backgroundColor: '#d3f9d8', // Ajusta el color si lo necesitas
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
    note: {  
        color: 'red',  
        marginVertical: 8,  
    },  
    classified: {  
        backgroundColor: '#e0ffe0',  
    },  
    column: {  
        flex: 1,  
        marginHorizontal: 5,  
    },  
});  

export default SorteoFinalComponent;