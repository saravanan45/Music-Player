import React, {useContext, memo} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';

import {MusicContext} from '../../App';

const PlayMusicFooter = () => {
  const navigation = useNavigation();
  const {
    currentSong,
    currPlayState,
    musicInstance,
    setCurrPlayState,
    setCurrTimer,
    pauseAndPlay,
  } = useContext(MusicContext);

  const handlePlayScreenTouch = () => {
    navigation.navigate('PlayScreen', {song: currentSong});
  };

  return (
    <View style={styles.footer}>
      {currentSong && Object.keys(currentSong).length ? (
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handlePlayScreenTouch}>
            <Image
              source={{uri: currentSong?.cover}}
              alt="current-song"
              style={styles.songImage}
            />
          </TouchableOpacity>
          <View style={styles.songTextContainer}>
            <TouchableOpacity onPress={handlePlayScreenTouch}>
              <Text
                style={styles.songTitle}
                ellipsizeMode="tail"
                numberOfLines={2}>
                {currentSong?.title}
              </Text>
              <Text
                style={styles.songArtist}
                ellipsizeMode="tail"
                numberOfLines={1}>
                {currentSong?.artist}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
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
                onPress={pauseAndPlay}
                backgroundColor="#00000000"
                color="grey"
              />
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default memo(PlayMusicFooter);

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'fixed',
    bottom: 0,
  },
  songImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  songTitle: {
    fontSize: 16,
    color: 'black',
  },
  songTextContainer: {
    flex: 1,
  },
  songArtist: {
    fontSize: 12,
  },
});
