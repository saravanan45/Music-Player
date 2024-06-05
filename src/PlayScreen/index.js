import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeIcon from 'react-native-vector-icons/Feather';

import {MusicContext} from '../../App';

const PlayScreen = ({navigation, route}) => {
  const [songSelected, setSongSelected] = useState(route?.params?.song);
  const {
    currSongDuration,
    currTimer,
    setCurrTimer,
    currPlayState,
    setCurrPlayState,
    timerRef,
    musicInstance,
    shufflePlaylist,
    loadMusic,
    pauseAndPlay,
    playPrevSong,
    playNextSong,
    currentSong,
    handleShuffle,
  } = useContext(MusicContext);

  Sound.setCategory('Playback');

  useEffect(() => {
    if (currentSong?.title && songSelected?.title !== currentSong?.title) {
      setSongSelected(currentSong);
    }
  }, [currentSong, songSelected?.title]);

  useEffect(() => {
    if (currentSong?.title !== route?.params?.song?.title) {
      setSongSelected(route?.params?.song);
    }
  }, [route?.params?.song]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerRef]);

  useEffect(() => {
    const initialMusicLoad = async () => {
      try {
        await loadMusic(
          songSelected,
          !(currentSong?.title === songSelected?.title),
        );
      } catch (err) {
        console.error('err', err);
      }
    };
    initialMusicLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRef, songSelected]);

  useEffect(() => {
    if (currPlayState === 'playing') {
      timerRef.current = setInterval(() => {
        if (
          musicInstance.current &&
          musicInstance.current.isLoaded() &&
          currPlayState === 'playing'
        ) {
          musicInstance.current.getCurrentTime(secs => {
            setCurrTimer(secs);
          });
        }
      }, 100);
    } else {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [currPlayState, setCurrTimer, timerRef, musicInstance]);

  const handleShufflePlaylist = () => {
    handleShuffle();
  };

  const handleSliding = time => {
    if (musicInstance.current) {
      musicInstance.current.setCurrentTime(time);
      setCurrTimer(time);
    }
  };

  const getAudioTimeString = seconds => {
    const h = parseInt(seconds / (60 * 60));
    const m = parseInt((seconds % (60 * 60)) / 60);
    const s = parseInt(seconds % 60);

    return (
      (h < 10 ? '0' + h : h) +
      ':' +
      (m < 10 ? '0' + m : m) +
      ':' +
      (s < 10 ? '0' + s : s)
    );
  };

  const currentTimeString = getAudioTimeString(currTimer);
  const durationString = getAudioTimeString(currSongDuration);

  return (
    <View style={styles.playScreenContainer}>
      <Image
        source={{uri: songSelected.cover}}
        alt="song-selected"
        style={styles.songImage}
      />
      <View style={styles.songTextContainer}>
        <Text style={styles.songTitle}>{songSelected.title}</Text>
        <Text style={styles.songArtist}>{songSelected.artist}</Text>
      </View>
      <View>
        <View style={styles.songTimer}>
          <Text>{currentTimeString}</Text>
          <Text>{durationString}</Text>
        </View>
        <Slider
          style={{width: '100%', height: 40}}
          minimumValue={0}
          maximumValue={currSongDuration}
          value={currTimer}
          minimumTrackTintColor="#c92e2e"
          maximumTrackTintColor="#7d6e6e"
          thumbTintColor="#db1616"
          onSlidingComplete={handleSliding}
        />
        <View style={styles.songActions}>
          <FeIcon.Button
            name="shuffle"
            size={24}
            backgroundColor="#00000000"
            color={shufflePlaylist ? 'grey' : 'lightgrey'}
            onPress={handleShufflePlaylist}
          />
          <Icon.Button
            name="step-backward"
            size={24}
            backgroundColor="#00000000"
            color="grey"
            onPress={playPrevSong}
          />
          {currPlayState === 'playing' ? (
            <Icon.Button
              name="pause-circle"
              size={24}
              onPress={() =>
                pauseAndPlay(
                  currPlayState,
                  musicInstance,
                  setCurrPlayState,
                  setCurrTimer,
                )
              }
              backgroundColor="#00000000"
              color="grey"
            />
          ) : (
            <Icon.Button
              name="play-circle"
              size={24}
              onPress={() =>
                pauseAndPlay(
                  currPlayState,
                  musicInstance,
                  setCurrPlayState,
                  setCurrTimer,
                )
              }
              backgroundColor="#00000000"
              color="grey"
            />
          )}
          <Icon.Button
            name="step-forward"
            size={24}
            backgroundColor="#00000000"
            color="grey"
            onPress={playNextSong}
          />
          <FeIcon.Button
            name="repeat"
            size={24}
            backgroundColor="#00000000"
            color="grey"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  songImage: {
    width: '80%',
    height: '60%',
    marginTop: '20%',
    marginHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 5,
    borderColor: 'grey',
  },
  playScreenContainer: {
    margin: 10,
  },
  songTextContainer: {
    marginTop: '10%',
    marginHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 16,
    color: 'black',
  },
  songArtist: {
    fontSize: 12,
    color: 'grey',
  },
  songTimer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  songActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
});

export default PlayScreen;
