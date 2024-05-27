import React, {useContext, useEffect, useState, memo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Banner} from 'react-native-paper';

import {MusicContext} from '../../App';
import {
  checkIfPlaylistExists,
  storeStringData,
  storeData,
} from '../common/utils';
import CustomDropdown from '../CustomDropdown';
import CustomTextFieldModal from '../CustomTextFieldModal';
import PlayMusicFooter from '../PlayMusicFooter';

const PlaylistsInfo = ({navigation, route}) => {
  const {
    playlists,
    setCurrentPlaylistName,
    setCurrentSongIndex,
    currentSongIndex,
    musicInstance,
    handleSongsPlaylist,
    handleCreateNewPlaylist,
    handleRemoveFromPlaylist,
  } = useContext(MusicContext);

  const selectedPlaylistName = route?.params?.playlistName || {};

  const getPlaylistsSongs = () => {
    const playlistsInfo = playlists.filter(
      pl => pl.name === selectedPlaylistName,
    );
    return playlistsInfo[0];
  };

  const [playlistSelectedInfo, setPlaylistSelectedInfo] = useState(
    getPlaylistsSongs() || {},
  );

  console.log('playlistSelecte', playlistSelectedInfo.name);

  const [showDropdown, setShowDropdown] = useState(false);
  //  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  // song for which the dropdown is opened
  const [songHighlighted, setSongHighlighted] = useState({});
  const [songHighlightedIndex, setSongHighlightedIndex] = useState(null);
  //  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const handleDropdownClose = () => {
    setShowDropdown(!showDropdown);
  };

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
      handleSongsPlaylist(playlistSelectedInfo.list);
      setCurrentPlaylistName(playlistSelectedInfo.name);
      setCurrentSongIndex(index);
      storeStringData('currentPlaylistName', playlistSelectedInfo.name);
      storeStringData('currentSongIndex', index.toString());
    }
    navigation.navigate('PlayScreen', {song: songInfo});
  };

  const handleShowMore = (song, index) => {
    setSongHighlighted(song);
    setSongHighlightedIndex(index);
    setShowDropdown(!showDropdown);
  };

  const handleNewPlaylistCreation = label => {
    handleCreateNewPlaylist(label, [songHighlighted]);
    setShowBanner(true);
  };

  const handleRemove = () => {
    console.log('remove');
    handleRemoveFromPlaylist(playlistSelectedInfo.name, songHighlightedIndex);
  };

  const handleDropdownConfirmCallback = () => {
    setShowDropdown(false);
  };

  const headerIcon = cover => {
    return (
      <Image
        style={styles.coverImg}
        source={{uri: cover}}
        alt={'cover-image'}
      />
    );
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
      {showDropdown ? (
        <CustomDropdown
          isModalVisible={showDropdown}
          handleModalClose={handleDropdownClose}
          title={songHighlighted.title}
          headerIcon={headerIcon(songHighlighted.cover)}
          options={[
            {
              label: 'Play Next',
              icon: 'forward',
              onPress: () => {},
            },
            {
              label: 'Remove from Playlist',
              icon: 'minus',
              onPress: handleRemove,
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
          handleConfirmCallback={handleDropdownConfirmCallback}
        />
      ) : null}
      <View>
        <Text style={styles.playlistHeader}>{playlistSelectedInfo?.name}</Text>
        {playlistSelectedInfo?.list &&
          Array.isArray(playlistSelectedInfo?.list) && (
            <FlatList
              data={playlistSelectedInfo?.list}
              renderItem={({item: song, index}) => (
                <View style={styles.songListView} key={song.title}>
                  <TouchableOpacity
                    onPress={() => playSong(song, index)}
                    style={styles.songClickContainer}>
                    <Image
                      style={styles.coverImg}
                      source={{uri: song.cover}}
                      alt={'cover-image'}
                    />
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
                    onPress={() => handleShowMore(song, index)}
                  />
                </View>
              )}
              keyExtractor={song => song.title}
            />
          )}
      </View>
      <PlayMusicFooter />
    </>
  );
};
export default memo(PlaylistsInfo);

const styles = StyleSheet.create({
  playlistHeader: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    paddingVertical: 16,
  },
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
});
