import {
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';

import * as NavigationBar from 'expo-navigation-bar';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { secondsToMMSS } from '@/constants/time';
import { Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TabBarIcon } from './_layout';
import React from 'react';

NavigationBar.setBackgroundColorAsync('transparent');
NavigationBar.setVisibilityAsync('hidden');

interface savedTime {
  name: string;
  time: number;
}

export default function TabOneScreen() {
  const [time, setTime] = useState(0);
  const [swTime, setSwTime] = useState(0);
  const [timerValue, setTimerValue] = useState(5);

  const [paused, setPaused] = useState(true);
  const [started, setStarted] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [mode, setMode] = useState('SW');
  const [font, setFont] = useState('RajdhaniBold');

  const [savedTimes, setSavedTimes] = useState<savedTime[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (mode === 'CD' && !paused && !overlay && started) {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
      }
      if (mode === 'SW' && !paused && !overlay && started) {
        setTime((prevTime) => prevTime + 1);
        setSwTime((prevTime) => prevTime + 1);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [paused, overlay]);

  useEffect(() => {
    if (mode === 'CD') setTime(timerValue * 600);
    else setTime(swTime);
    if (started) {
      setStarted(false);
      setPaused(true);
    }
  }, [timerValue, mode]);

  const { width, height } = Dimensions.get('window');
  const fontSize = Math.min(width, height) / 1.35;

  const [orientation, setOrientation] = useState('LANDSCAPE');

  const determineAndSetOrientation = () => {
    let width = Dimensions.get('window').width;
    let height = Dimensions.get('window').height;

    if (width < height) {
      setOrientation('PORTRAIT');
    } else {
      setOrientation('LANDSCAPE');
    }
  };

  useEffect(() => {
    determineAndSetOrientation();
    Dimensions.addEventListener('change', determineAndSetOrientation);

    const updateSavedTimes = async () =>
      setSavedTimes(
        JSON.parse((await AsyncStorage.getItem('time')) ?? '') ?? []
      );
    updateSavedTimes();
  }, []);

  const saveTime = async (name?: string) => {
    try {
      const newTimes = [
        ...savedTimes,
        {
          name:
            name && name !== '' ? name : `Time ${savedTimes.length + 1}`,
          time: Math.round(time / 10),
        },
      ];
      setSavedTimes(newTimes);
      await storeTimes(newTimes);
    } catch (e) {
      console.log(e);
    }
  };

  const storeTimes = async (times: savedTime[]) => {
    try {
      await AsyncStorage.setItem('time', JSON.stringify(times));
    } catch (e) {
      console.log(e);
    }
  };

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const [nameText, setNameText] = useState<string | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<
    (savedTime & { index: number }) | null
  >(null);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Pressable
        style={styles.hiddenBtn}
        onPress={() => setOverlay((prevOverlay) => !prevOverlay)}
      >
        {overlay && <Text style={styles.borderText}>OK</Text>}
      </Pressable>

      {overlay && (
        <>
          <View style={styles.overlay}>
            <Pressable
              style={[styles.hiddenBtn, { left: 60, width: 210 }]}
              onPress={() =>
                setFont((prevFont) =>
                  prevFont === 'RajdhaniBold' ? 'Veteran' : 'RajdhaniBold'
                )
              }
            >
              <Text style={styles.borderText}>
                {font === 'RajdhaniBold' ? 'Clean' : 'Typewriter'} font
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.hiddenBtn,
                {
                  top: 0,
                  left: 0,
                  right: undefined,
                  width: 200,
                  flexDirection: 'row',
                  gap: 20,
                },
              ]}
              onPress={() =>
                setMode((prevMode) => (prevMode === 'CD' ? 'SW' : 'CD'))
              }
            >
              <Text
                style={{ color: 'red', fontSize: 20, fontWeight: 'bold' }}
              >
                {mode === 'CD' ? 'Countdown' : 'Stopwatch'} mode
              </Text>
              <TabBarIcon
                name="exchange"
                color={'red'}
              />
            </Pressable>
            {mode === 'CD' ? (
              <View style={[styles.overlayRow, { marginTop: 30 }]}>
                <Text style={{ color: 'red' }}>Minutes</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={timerValue}
                    onValueChange={(itemValue) => setTimerValue(itemValue)}
                    mode="dropdown"
                  >
                    {Array.from({ length: 101 }).map((_, i) => (
                      <Picker.Item
                        key={i}
                        label={`${i}`}
                        value={i}
                        style={{ backgroundColor: 'red' }}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.overlayRow,
                    {
                      justifyContent: 'center',
                      padding: 0,
                      paddingTop: 30,
                      backgroundColor: 'transparent',
                    },
                  ]}
                >
                  {savedTimes.length === 0 ? (
                    <Text style={{ color: 'red' }}>No times saved</Text>
                  ) : (
                    <FlatList
                      data={savedTimes}
                      renderItem={({ item, index }) => (
                        <Text
                          style={{
                            color: 'red',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.name}:{' '}
                          <Text
                            style={{
                              color: 'red',
                              fontSize: 30,
                              fontWeight: '500',
                            }}
                          >
                            {secondsToMMSS(item.time, true)}{' '}
                          </Text>
                          <Pressable
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 15,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              setItemToDelete({ ...item, index });
                              setDeleteModalVisible(true);
                            }}
                          >
                            <TabBarIcon
                              name="close"
                              color={'red'}
                            />
                          </Pressable>
                        </Text>
                      )}
                      keyExtractor={(item, index) => `${index}`}
                      contentContainerStyle={[
                        styles.overlayRow,
                        {
                          backgroundColor: 'transparent',
                          flexDirection: 'column',
                          gap: 10,
                        },
                      ]}
                    />
                  )}
                </View>
                <Modal
                  animationType="fade"
                  transparent={true}
                  statusBarTranslucent={orientation === 'LANDSCAPE'}
                  visible={deleteModalVisible}
                  onRequestClose={() => setDeleteModalVisible(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    <Pressable
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        if (!itemToDelete) return;

                        const newTimes = [
                          ...savedTimes.slice(0, itemToDelete.index),
                          ...savedTimes.slice(itemToDelete.index + 1),
                        ];

                        setSavedTimes(newTimes);
                        storeTimes(newTimes);
                        setDeleteModalVisible(!deleteModalVisible);
                      }}
                    >
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 30,
                          fontWeight: '500',
                        }}
                      >
                        Delete entry "{itemToDelete?.name}"
                      </Text>
                    </Pressable>
                    <Pressable
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => setDeleteModalVisible(false)}
                    >
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 30,
                          fontWeight: '500',
                        }}
                      >
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </Modal>
                <Pressable
                  style={[
                    styles.hiddenBtn,
                    { bottom: 0, right: 0, left: undefined, width: 100 },
                  ]}
                  onPress={() => {
                    setTime(0);
                    setSwTime(0);
                  }}
                >
                  <Text style={styles.borderText}>Reset</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.hiddenBtn,
                    {
                      top: 0,
                      right: 0,
                      left: undefined,
                      bottom: undefined,
                      width: 100,
                    },
                  ]}
                  onPress={() => setSaveModalVisible(true)}
                >
                  <Text style={styles.borderText}>Save</Text>
                </Pressable>
                <Modal
                  animationType="fade"
                  transparent={true}
                  statusBarTranslucent={orientation === 'LANDSCAPE'}
                  visible={saveModalVisible}
                  onRequestClose={() => setSaveModalVisible(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'transparent',
                      }}
                    >
                      <TextInput
                        style={{
                          backgroundColor: 'red',
                          color: 'black',
                          fontSize: 20,
                          fontWeight: 'bold',
                          width: '50%',
                          height: 50,
                          textAlign: 'center',
                        }}
                        placeholder="Enter a name (optional)"
                        placeholderTextColor="#670000"
                        onChangeText={(text) => setNameText(text)}
                      />
                      <Pressable
                        onPress={() => {
                          saveTime(nameText);
                          setSaveModalVisible(!saveModalVisible);
                        }}
                      >
                        <Text
                          style={{
                            color: 'red',
                            fontSize: 30,
                            fontWeight: '500',
                          }}
                        >
                          Save
                        </Text>
                      </Pressable>
                    </View>
                    <Pressable
                      style={{
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => setSaveModalVisible(false)}
                    >
                      <Text
                        style={{
                          color: 'red',
                          fontSize: 30,
                          fontWeight: '500',
                        }}
                      >
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </Modal>
              </>
            )}
          </View>
        </>
      )}
      <Pressable
        onPress={() => {
          setPaused((prevPaused) => !prevPaused);
          setStarted(true);
        }}
      >
        <View style={styles.timer}>
          <Text style={[styles.title, { fontSize, fontFamily: font }]}>
            {secondsToMMSS(
              Math.round(time / 10),
              orientation === 'LANDSCAPE'
            )}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: 'red',
    fontFamily: 'RajdhaniBold',
  },
  timer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  picker: {
    flex: 1,
    marginRight: 20,
    backgroundColor: 'red',
  },
  hiddenBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 70,
    height: 70,
    zIndex: 2,
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  overlayRow: {
    alignItems: 'center',
    gap: 20,
    padding: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    gap: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  borderText: {
    color: 'red',
    borderWidth: 2,
    borderColor: 'red',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    lineHeight: 42,
    borderRadius: 25,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
