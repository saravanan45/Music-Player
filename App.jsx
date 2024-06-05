import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer, useRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PermissionsAndroid, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Sound from 'react-native-sound';
import {cloneDeep} from 'lodash';

import {
  getNextSongAndIndex,
  getCurrentPlaylistSongs,
  getStoredData,
  getStoredStringData,
  storeData,
  storeStringData,
} from './src/common/utils';
import HomePage from './src/HomePage';
import PlayScreen from './src/PlayScreen';
import PlaylistsInfo from './src/PlaylistsInfo';

export const MusicContext = React.createContext();

const App = () => {
  // string for getting what is the current playlist name
  const [currentPlaylistName, setCurrentPlaylistName] = useState('');
  // list of all playlists [{name: 'AllSongs', list: [songsObj]}]
  const [playlists, setPlaylists] = useState([]);
  // list of songs currently playing(for eg: shuffledlist or unshuffled list)
  const [currentSongsList, setCurrentSongsList] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [currTimer, setCurrTimer] = useState(0);
  const [currSongDuration, setCurrSongDuration] = useState(0);
  const [currPlayState, setCurrPlayState] = useState('paused');
  const [grantMediaAccess, setGrantMediaaccess] = useState('');
  const [shufflePlaylist, setShufflePlaylist] = useState(false);
  const [currentSong, setCurrentSong] = useState({});
  const timerRef = useRef(null);
  const musicInstance = useRef(null);

  useEffect(() => {
    SplashScreen.hide();

    const getStoredSongIndexFromStorage = () => {
      return new Promise(async resolve => {
        const songInfo = await getStoredStringData('currentSongIndex');
        resolve(parseInt(songInfo));
      });
    };

    const getStoredSongsListFromStorage = () => {
      return new Promise(async resolve => {
        const songsList = await getStoredData('currentSongsList');
        resolve(songsList);
      });
    };

    const getStoredPlaylistNameFromStorage = () => {
      return new Promise(async resolve => {
        const playlistName = await getStoredStringData('currentPlaylistName');
        resolve(playlistName);
      });
    };

    const getStoredCurrentSongFromStorage = () => {
      return new Promise(async resolve => {
        const currentSongStoredInfo = await getStoredData('currentSong');
        resolve(currentSongStoredInfo);
      });
    };

    const getStoredPlaylistsFromStorage = () => {
      return new Promise(async resolve => {
        const playlistsInfo = await getStoredData('playlists');
        resolve(playlistsInfo);
      });
    };
    const getStoredInfoFromStorage = async () => {
      try {
        const [
          playlistName,
          currSongIndex,
          currentList,
          currentSongInfo,
          allPlaylists,
        ] = await Promise.all([
          getStoredPlaylistNameFromStorage(),
          getStoredSongIndexFromStorage(),
          getStoredSongsListFromStorage(),
          getStoredCurrentSongFromStorage(),
          getStoredPlaylistsFromStorage(),
        ]);
        if (currentSongInfo && Object.keys(currentSongInfo)?.length) {
          loadMusic(
            currentSongInfo?.currentSong,
            false,
            false,
            currentSongInfo?.currentTimer,
          );
          setCurrentSong(currentSongInfo?.currentSong);
          setCurrTimer(currentSongInfo?.currentTimer);
          setCurrSongDuration(currentSongInfo?.currentDuration);
        }
        if (currentList && currentList.length) {
          setCurrentSongsList(currentList);
        }
        if (currSongIndex !== undefined) {
          setCurrentSongIndex(currSongIndex);
        }
        if (playlistName?.length) {
          setCurrentPlaylistName(playlistName);
        }
        if (allPlaylists?.length) {
          setPlaylists(allPlaylists);
        }
      } catch (e) {
        console.error('Error while retrieving stored value', e);
      }
    };

    const requestMediaPermission = async () => {
      if (grantMediaAccess === 'granted') {
        return;
      }
      try {
        let mediaAccess = 'granted';
        if (Platform.Version >= 33) {
          mediaAccess = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
            {
              title: 'Provide media access to get local music files',
              message:
                'Cool Photo App needs access to your camera ' +
                'so you can take awesome pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
        }
        if (mediaAccess === 'granted') {
          console.log('Storage Permission granted');
        } else if (mediaAccess === PermissionsAndroid.RESULTS.DENIED) {
          console.log('Storage Permission Denied.');
        } else if (mediaAccess === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Storage Permission Denied with Never Ask Again.');
        }
        setGrantMediaaccess(mediaAccess);
      } catch (err) {
        console.warn(err);
      }
    };

    getStoredInfoFromStorage();
    requestMediaPermission();
  }, []);

  const loadMusic = (
    songSelected,
    override = false,
    startMusic = true,
    setTimer,
  ) => {
    if (musicInstance.current && !override) {
      return;
    }

    if (musicInstance.current && override) {
      musicInstance.current.release();
      musicInstance.current = null;
    }

    musicInstance.current = new Sound(
      songSelected.url,
      Sound.MAIN_BUNDLE,
      err => {
        if (err) {
          console.log('failed to load the sound', err);
          return;
        }
        if (startMusic) {
          setCurrentSong(songSelected);
          setCurrSongDuration(musicInstance.current.getDuration() || 0);
          setCurrPlayState('playing');
          setCurrTimer(0);
          musicInstance.current.setCurrentTime(0);
          playMusic();
        }
        if (setTimer) {
          musicInstance.current.setCurrentTime(setTimer);
        }
      },
    );
  };

  const successCallback = () => {
    setCurrPlayState('paused');
    setCurrTimer(0);
    musicInstance.current.setCurrentTime(0);
    let currIndex;
    // hacky way to get the current song Index(state value) in the callback
    setCurrentSongIndex(prev => {
      currIndex = prev;
      //  return prev + 1;
    });
    const currentPlaylistSongs = getCurrentPlaylistSongs(
      playlists,
      currentPlaylistName,
    );
    const {nextSong, nextIndex} = getNextSongAndIndex(
      shufflePlaylist,
      currentPlaylistSongs,
      currIndex,
    );
    setCurrentSongIndex(nextIndex);
    storeStringData('currentSongIndex', currIndex.toString());
    loadMusic(nextSong, true);
  };

  const playMusic = () => {
    musicInstance?.current?.play(success => {
      if (success) {
        successCallback();
      } else {
        console.log('playback failed');
      }
    });
  };

  const pauseAndPlay = () => {
    if (currPlayState === 'playing') {
      setCurrPlayState('paused');
      musicInstance.current.pause();
      storeData('currentSong', {
        currentSong,
        currentTimer: currTimer,
        currentDuration: currSongDuration,
      });
      return;
    }
    setCurrPlayState('playing');
    playMusic();
  };

  // currentsongIndex need to be repaired with shuffle and unshuffle

  const playPrevSong = () => {
    const nextIndex =
      currentSongIndex === 0
        ? currentSongsList.length - 1
        : currentSongIndex - 1;
    const nextSong = currentSongsList?.[nextIndex];
    setCurrPlayState('paused');
    setCurrentSongIndex(nextIndex);
    musicInstance.current.release();
    musicInstance.current = null;
    storeStringData('currentSongIndex', nextIndex.toString());
    loadMusic(nextSong, true);
  };

  const playNextSong = () => {
    const nextIndex =
      currentSongIndex === currentSongsList.length - 1
        ? 0
        : currentSongIndex + 1;
    const nextSong = currentSongsList[nextIndex];
    setCurrPlayState('paused');
    setCurrentSongIndex(nextIndex);
    musicInstance.current.release();
    musicInstance.current = null;
    storeStringData('currentSongIndex', nextIndex.toString());
    loadMusic(nextSong, true);
  };

  const shuffleSongs = songs => {
    const cloneSongs = [...songs];
    const current = cloneSongs[currentSongIndex];
    cloneSongs.splice(currentSongIndex, 1);
    for (let i = cloneSongs.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cloneSongs[i], cloneSongs[j]] = [cloneSongs[j], cloneSongs[i]];
    }
    return [current, ...cloneSongs];
  };

  const handleShuffle = () => {
    const updatedShuffle = !shufflePlaylist;
    setShufflePlaylist(updatedShuffle);
    const songs = getCurrentPlaylistSongs(playlists, currentPlaylistName);
    if (updatedShuffle) {
      const shuffledList = shuffleSongs(songs);
      setCurrentSongIndex(0);
      storeStringData('currentSongIndex', Number(0).toString());
      storeData('currentSongsList', shuffledList);
      return setCurrentSongsList(shuffledList);
    }
    const runningSongIndex = songs.indexOf(
      songs.filter(song => {
        return song.title == currentSong.title;
      })[0],
    );
    setCurrentSongIndex(runningSongIndex);
    storeStringData('currentSongIndex', runningSongIndex.toString());
    storeData('currentSongsList', songs);
    setCurrentSongsList(songs);
  };

  const handleSongsPlaylist = songs => {
    if (shufflePlaylist) {
      const shuffledList = shuffleSongs(songs);
      setCurrentSongIndex(0);
      storeStringData('currentSongIndex', Number(0).toString());
      storeData('currentSongsList', shuffledList);
      return setCurrentSongsList(shuffledList);
    }
    const runningSongIndex = songs.indexOf(
      songs.filter(song => {
        return song.title === currentSong.title;
      })[0],
    );
    setCurrentSongIndex(runningSongIndex);
    storeStringData('currentSongIndex', runningSongIndex.toString());
    storeData('currentSongsList', songs);
    setCurrentSongsList(songs);
  };

  const handleCreateNewPlaylist = (playlistName, songs) => {
    const newPlaylists = [...playlists, {name: playlistName, list: songs}];
    setPlaylists(newPlaylists);
    storeData('playlists', newPlaylists);
  };

  // add a song to playlist
  const handleAddToPlaylist = (playlistName, song) => {
    const clonedPlaylists = cloneDeep(playlists);
    const filteredPlaylist = clonedPlaylists.filter(
      pl => pl.name === playlistName,
    );
    const songExistsInPlaylist =
      filteredPlaylist[0].list.length &&
      filteredPlaylist[0].list.some(so => so.title === song.title);

    if (songExistsInPlaylist) {
      // should show modal saying song already exists
      return;
    }

    const modifiedPlaylists = clonedPlaylists.map(pl => {
      if (pl.name === playlistName) {
        if (pl.list?.length) {
          pl.list.push(song);
        } else {
          pl.list = [song];
        }
      }
      return pl;
    });
    storeData('playlists', modifiedPlaylists);
    setPlaylists(modifiedPlaylists);
  };

  // remove a song from playlist
  const handleRemoveFromPlaylist = (playlistName, playlistIndex) => {
    const clonedPlaylists = cloneDeep(playlists);
    const modifiedPlaylists = clonedPlaylists.map(pl => {
      if (pl.name === playlistName) {
        pl.list.splice(playlistIndex, 1);
      }
      return pl;
    });
    storeData('playlists', modifiedPlaylists);
    setPlaylists(modifiedPlaylists);
  };

  const deletePlaylist = playlistName => {
    const filteredPlaylists = playlists.filter(pl => pl.name !== playlistName);
    setPlaylists(filteredPlaylists);
    storeData('playlists', filteredPlaylists);
  };

  const renamePlaylist = (newPLName, existingPLName) => {
    const updatedPlaylists = playlists.map(pl => {
      if (pl.name === existingPLName) {
        const clonedPL = {...pl};
        clonedPL.name = newPLName;
        return clonedPL;
      }
      return pl;
    });
    const plNames = playlists.map(pl => pl.name);
    const uPLNames = updatedPlaylists.map(pl => pl.name);
    console.log('playlists renamed', plNames, 'updated playlists', uPLNames);
    setPlaylists(updatedPlaylists);
    storeData('playlists', updatedPlaylists);
  };

  const Stack = createNativeStackNavigator();

  return (
    <MusicContext.Provider
      value={{
        playlists,
        setPlaylists,
        currentPlaylistName,
        setCurrentPlaylistName,
        currentSongsList,
        setCurrentSongsList,
        currentSongIndex,
        setCurrentSongIndex,
        currSongDuration,
        setCurrSongDuration,
        currTimer,
        setCurrTimer,
        currPlayState,
        setCurrPlayState,
        timerRef,
        musicInstance,
        grantMediaAccess,
        setShufflePlaylist,
        shufflePlaylist,
        loadMusic,
        playMusic,
        pauseAndPlay,
        playPrevSong,
        playNextSong,
        currentSong,
        handleShuffle,
        handleSongsPlaylist,
        handleCreateNewPlaylist,
        handleAddToPlaylist,
        handleRemoveFromPlaylist,
        deletePlaylist,
        renamePlaylist,
      }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="PlayScreen" component={PlayScreen} />
          <Stack.Screen name="PlaylistsInfo" component={PlaylistsInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </MusicContext.Provider>
  );
};

export default App;
