import { useState, useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, SafeAreaView, ScrollView, TextInput, View, Text, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot'; //capturando a screenshot
import * as Sharing from 'expo-sharing';

import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';
import React from 'react';

export function Home() {
  const [photo, setPhotoURI] = useState<null | string>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);
  
  //pegando a referência da câmera
  const cameraRef = useRef<Camera>(null);
  //para pegar a referência da área a ter screenshot
  const screenShotRef = useRef(null);
  
  //tirando a foto do usuário
  async function handleTakePicture() {
    const photo = await cameraRef.current.takePictureAsync();
    setPhotoURI(photo.uri); //guardando a foto do usuário
  }

  //screenshot da tela
  async function shareScreeenshot() {
  const screenshot = await captureRef(screenShotRef);
  await Sharing.shareAsync("file://" + screenshot);
  }
  
  useEffect(() => {
    Camera.requestCameraPermissionsAsync() //solicitando ao usuário permissão para usar a câmera
      .then(response => setHasCameraPermission(response.granted));    
  },[]);

 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View ref={screenShotRef} style={styles.sticker}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

          {  //validando se há autorização para usar a câmera
            hasCameraPermission && !photo ?
             <Camera 
              ref={cameraRef}
              style={styles.camera}
              type={CameraType.front} //selecionando a câmera frontal >> o tipo de câmera foi importado na linha 2 
            /> :
            //informando que, se houver a foto do usuário, usar ela (uri >> guardada localmente), se não, usar a foto do link
            <Image 
            source={{ uri: photo? photo : 'https://thumbs.dreamstime.com/b/modern-premium-minimalist-streamline-app-button-no-camera-line-icon-design-116925698.jpg' }} 
            style={styles.camera} 
            //garantindo que a imagem foi carregada e gerando a screenshot
            onLoad={shareScreeenshot} 
            />             
          }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <TouchableOpacity onPress={() => setPhotoURI(null)}>
          <Text style={styles.retry}>
            Nova Foto
          </Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}