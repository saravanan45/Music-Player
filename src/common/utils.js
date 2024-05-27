import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback} from 'react';

const generateRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getNextSongAndIndex = (
  shufflePlaylist,
  currentPlaylistSongs,
  currentSongIndex,
) => {
  if (shufflePlaylist) {
    console.log('shuffle');
    const totalSongsList = currentPlaylistSongs.length;
    let randomNumber = generateRandomNumber(0, totalSongsList - 1);
    if (currentSongIndex === randomNumber) {
      randomNumber =
        randomNumber + 1 >= currentPlaylistSongs.length
          ? randomNumber - 1
          : randomNumber + 1;
    }
    console.log('shuffle', randomNumber);
    return {
      nextSong: currentPlaylistSongs[randomNumber],
      nextIndex: randomNumber,
    };
  }
  const nextIndex =
    currentSongIndex === currentPlaylistSongs.length - 1
      ? 0
      : currentSongIndex + 1;
  console.log(
    'nextIndex',
    nextIndex,
    currentSongIndex,
    currentPlaylistSongs.length,
  );
  return {nextSong: currentPlaylistSongs[nextIndex], nextIndex};
};

export const getCurrentPlaylistSongs = (playlist, currentPlaylist) => {
  if (!playlist?.length) {
    return [];
  }
  console.log('called', playlist, currentPlaylist);
  const currentPlaylistSongs =
    Array.isArray(playlist) &&
    playlist.filter(list => list.name === currentPlaylist);

  const songslist = currentPlaylistSongs[0].list.map(song => song.title);
  console.log('called list', songslist);
  return currentPlaylistSongs[0]?.list;
};

export const checkIfPlaylistExists = (playlist, newPlaylist) => {
  if (!playlist.length) {
    return false;
  }

  return (
    Array.isArray(playlist) && playlist.some(list => list.name === newPlaylist)
  );
};

export const storeStringData = async (key, value) => {
  try {
    console.log('store value', value, key);
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

export const getStoredStringData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value;
  } catch (e) {
    console.error(e);
  }
};

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getStoredData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(e);
  }
};

export const playlistsOptions = (playlists, handleAddToPlaylist, song) => {
  if (playlists.length > 2) {
    return [];
  }
  const options = playlists.map(pl => {
    if (pl.name === 'AllSongs') {
      return null;
    }
    const obj = {
      label: pl.name,
      onPress: () => handleAddToPlaylist(pl.name, song),
    };
    if (pl.list?.length) {
      obj.coverImg = pl.list[0].cover;
    }
    return obj;
  });
  const modifiedOptions = options.filter(Boolean);
  return modifiedOptions;
};

export const addToPlaylistOptionsHeader = handleCreatePlaylist => [
  {
    label: 'Create Playlist',
    icon: 'plus',
    onPress: handleCreatePlaylist,
  },
];
