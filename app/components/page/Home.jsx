import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Image, TextInput, Button, ScrollView, Modal, Text, TouchableOpacity } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

import MapView, { Marker } from "react-native-maps";
import randoIcon from "../../../assets/randoIcon.png";
import alter from "../../../assets/alter2.png";
import coordinateService from "../../temp/CoordinateService";

const Home = () => {
  const [informations, setInformations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    getInformations();
  }, []);

  async function getInformations() {
    const response = await fetch("http://192.168.1.10:3000/informations");
    const result = await response.json();
    setInformations(result.result);
  }

  const handleMarkerPress = (info) => {
    setSelectedMarker(info);
    mapRef.current.animateToRegion({
      latitude: info.latitude,
      longitude: info.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const closeModal = () => {
    setSelectedMarker(null);
  };

  const searchCity = async () => {
    const { latitude, longitude } = await coordinateService.getAdressCoordinate(searchText);
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={{
        latitude: 45.899247,
        longitude: 6.129384,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        {informations.map((info) => (
          <Marker key={info.id} coordinate={{ latitude: info.latitude, longitude: info.longitude }} /*title={info.name} description={"Voir l'itinéraire sur Google Maps"}*/ onPress={() => handleMarkerPress(info)}>
            <View>
              {info.type === 'musculation' ? <Image source={alter} style={{ width: 30, height: 30 }} /> : <Image source={randoIcon} style={{ width: 30, height: 30 }} />}
            </View>
          </Marker>
        ))}
      </MapView>
      <Modal animationType="slide" transparent={true} visible={selectedMarker !== null} onRequestClose={closeModal}>
        <View style={{ margin: 20, backgroundColor: "white", padding: 25, alignItems: "center", elevation: 5 }}>
          <Text>{selectedMarker?.name}</Text>
          <Text>{selectedMarker?.description}</Text>
          <TouchableOpacity onPress={closeModal}>
            <Text>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.searchBox}>
        <TextInput style={{ height: 40, width: 190, borderColor: 'red', borderWidth: 1 }} onChangeText={text => setSearchText(text)} value={searchText} />
        <Button title="Rechercher" onPress={searchCity} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchBox: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', padding: 10 },
});

export default Home;
