import React, {useContext, useEffect, useState, memo, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  getAll,
  SortSongFields,
  SortSongOrder,
} from 'react-native-get-music-files';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Banner} from 'react-native-paper';

import {MusicContext} from '../../App';
import {
  checkIfPlaylistExists,
  storeStringData,
  storeData,
  playlistsOptions,
  addToPlaylistOptionsHeader,
} from '../common/utils';
import CustomDropdown from '../CustomDropdown';
import CustomTextFieldModal from '../CustomTextFieldModal';

const AllSongs = ({navigation}) => {
  const [songs, setSongs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  // song for which the dropdown is opened
  const [songHighlighted, setSongHighlighted] = useState({});
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleDropdownClose = () => {
    setShowDropdown(!showDropdown);
  };

  const {
    currentSong,
    setCurrentPlaylistName,
    setPlaylists,
    playlists,
    setCurrentSongIndex,
    currentSongIndex,
    musicInstance,
    grantMediaAccess,
    handleSongsPlaylist,
    handleCreateNewPlaylist,
    handleAddToPlaylist,
  } = useContext(MusicContext);

  useEffect(() => {
    const getAllSongs = async () => {
      const allSongs = await getAll({
        limit: 3000,
        minSongDuration: 1000,
        sortBy: SortSongFields.TITLE,
        sortOrder: SortSongOrder.DESC,
      });
      setSongs(allSongs);
      if (checkIfPlaylistExists(playlists, 'AllSongs')) {
        const newPlaylist = playlists.map(list => {
          if (list.name === 'AllSongs') {
            list.list = allSongs;
          }
          return list;
        });
        setPlaylists(newPlaylist);
        storeData('playlists', newPlaylist);
        return;
      }
      const newPlaylist = [...playlists, {name: 'AllSongs', list: songs}];
      setPlaylists(newPlaylist);
      storeData('playlists', newPlaylist);
    };
    getAllSongs();
  }, [grantMediaAccess]);

  // move to common utils
  // remove from playlist
  // adding to existing playlist show banner and delay closing the modal
  useEffect(() => {
    if (showBanner) {
      setTimeout(() => {
        setShowBanner(false);
      }, 3000);
    }
  }, [showBanner]);

  const playSong = (songInfo, index) => {
    if (currentSongIndex !== index) {
      if (musicInstance.current) {
        musicInstance.current.release();
        musicInstance.current = null;
      }
      handleSongsPlaylist(songs);
      setCurrentPlaylistName('AllSongs');
      setCurrentSongIndex(index);
      storeStringData('currentPlaylistName', 'AllSongs');
      storeStringData('currentSongIndex', index.toString());
    }
    navigation.navigate('PlayScreen', {song: songInfo});
  };

  const handleShowMore = song => {
    setSongHighlighted(song);
    setShowDropdown(!showDropdown);
  };

  // add to playlist button click inside More dropdown button click
  const addToPlaylistDropdownOptionClick = () => {
    setShowDropdown(!showDropdown);
  };

  const addToPlaylistConfirmCallback = () => {
    setShowAddToPlaylistModal(!showAddToPlaylistModal);
  };

  // close button click inside Add to playlist modal
  const handleAddToPlaylistModalClose = () => {
    setShowAddToPlaylistModal(!showAddToPlaylistModal);
  };

  // click on create new playlist button inside add to playlist modal
  const handleCreatePlaylist = () => {
    setShowCreatePlaylistModal(!showCreatePlaylistModal);
  };

  // close button click inside Create new playlist modal
  const handleCreatePlaylistModalClose = () => {
    setShowCreatePlaylistModal(!showCreatePlaylistModal);
  };

  const handleNewPlaylistCreation = label => {
    handleCreateNewPlaylist(label, [songHighlighted]);
    setShowBanner(true);
  };

  const getPlaylistOptions = () =>
    playlistsOptions(playlists, handleAddToPlaylist, songHighlighted);

  const addToPlaylistDropdownOptions = [
    ...addToPlaylistOptionsHeader(handleCreatePlaylist),
    ...getPlaylistOptions(),
  ];

  const headerIcon = cover => {
    return (
      <Image
        style={styles.coverImg}
        source={{uri: cover}}
        alt={'cover-image'}
      />
    );
  };

  const handleConfirmCallback = () => {
    setShowAddToPlaylistModal(false);
  };
  return (
    <>
      <Banner
        visible={showBanner}
        icon={({size}) => (
          <Icon name="check-square" size={20} style={styles.bannerIcon} />
        )}
        style={{backgroundColor: '#5cb85c', color: 'white'}}>
        <Text style={styles.bannerText}>1 Song added to playlist</Text>
      </Banner>
      <CustomTextFieldModal
        placeholderText={'Enter new Playlist Name'}
        isModalVisible={showCreatePlaylistModal}
        handleModalClose={handleCreatePlaylistModalClose}
        handleConfirm={handleNewPlaylistCreation}
        confirmationText="Create"
      />
      <CustomDropdown
        isModalVisible={showDropdown}
        handleModalClose={handleDropdownClose}
        headerIcon={headerIcon(songHighlighted.cover)}
        title={songHighlighted.title}
        options={[
          {
            label: 'Play Next',
            icon: 'forward',
            onPress: () => {},
          },
          {
            label: 'Add To Playlist',
            icon: 'plus',
            onPress: addToPlaylistDropdownOptionClick,
          },
          {
            label: 'Rename',
            icon: 'pencil',
            onPress: () => {},
          },
          {
            label: 'Delete',
            icon: 'trash',
            onPress: () => {},
          },
        ]}
        handleConfirmCallback={addToPlaylistConfirmCallback}
      />
      <CustomDropdown
        isModalVisible={showAddToPlaylistModal}
        handleModalClose={handleAddToPlaylistModalClose}
        headerIcon={headerIcon(songHighlighted.cover)}
        title={songHighlighted.title}
        options={addToPlaylistDropdownOptions}
        handleConfirmCallback={handleConfirmCallback}
      />
      {Array.isArray(songs) && (
        <FlatList
          {...(currentSong && {contentContainerStyle: {paddingBottom: 50}})}
          data={songs}
          renderItem={({item: song, index}) => (
            <View style={styles.songListView} key={song.title}>
              <TouchableOpacity
                onPress={() => playSong(song, index)}
                style={styles.songClickContainer}>
                {song.cover ? (
                  <Image
                    style={styles.coverImg}
                    source={{uri: song.cover}}
                    alt={'cover-image'}
                  />
                ) : (
                  <Icon
                    style={styles.iconPlaceholderImg}
                    name="music"
                    size={15}
                  />
                )}
                <View style={styles.songTextContainer} id="text-container">
                  <Text
                    style={styles.songTitle}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {song.title}
                  </Text>
                  <Text
                    style={styles.songArtist}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {song.artist}
                  </Text>
                </View>
              </TouchableOpacity>
              <Icon
                name="ellipsis-v"
                size={15}
                onPress={() => handleShowMore(song)}
              />
            </View>
          )}
          keyExtractor={song => song.title}
        />
      )}
    </>
  );
};
export default memo(AllSongs);

const styles = StyleSheet.create({
  coverImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  songListView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginEnd: 20,
  },
  songClickContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 12,
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
  bannerText: {
    fontSize: 16,
    color: 'white',
  },
  bannerIcon: {
    color: 'white',
  },
  iconPlaceholderImg: {
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 16,
    backgroundColor: 'lightgray',
    borderRadius: 8,
  },
});
