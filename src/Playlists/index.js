import React, {useContext, useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Banner} from 'react-native-paper';

import {MusicContext} from '../../App';
import CustomTextFieldModal from '../CustomTextFieldModal';
import CustomDropdown from '../CustomDropdown';
import ConfirmationModal from '../ConfirmationModal';

const Playlists = ({navigation}) => {
  const {
    currentSong,
    playlists,
    handleCreateNewPlaylist,
    deletePlaylist,
    renamePlaylist,
  } = useContext(MusicContext);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [playlistSelected, setPlaylistSelected] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [showRenamePlaylistModal, setShowRenamePlaylistModal] = useState(false);

  useEffect(() => {
    if (showBanner) {
      setTimeout(() => {
        setShowBanner(false);
        setBannerText('');
      }, 3000);
    }
  }, [showBanner]);

  const handleNewPlaylistCreation = label => {
    handleCreateNewPlaylist(label);
    setShowBanner(true);
    setBannerText(`Created New playlist - ${label}`);
    setShowCreatePlaylistModal(false);
  };

  const handleCreatePlaylistModalClose = () => {
    setShowCreatePlaylistModal(false);
  };

  const handlePlaylistsSelect = playlistName => {
    navigation.navigate('PlaylistsInfo', {playlistName});
  };

  const handleCreateNew = () => {
    setShowCreatePlaylistModal(true);
  };

  const handleShowMore = plName => {
    setShowMoreModal(true);
    const filteredPlaylist = playlists.filter(pl => pl.name === plName);
    setPlaylistSelected(filteredPlaylist[0]);
  };

  const handleShowMoreModalClose = () => {
    setShowMoreModal(false);
    setPlaylistSelected({});
  };

  const headerIcon = () =>
    playlistSelected?.list?.length ? (
      <Image
        style={styles.coverImg}
        source={{uri: playlistSelected.list[0]?.cover}}
        alt={'cover-image'}
      />
    ) : (
      <Icon name="music" size={16} style={styles.iconCover} />
    );

  const handleDeleteClick = () => {
    setShowDeleteConfirmationModal(true);
  };

  const handleShowMoreConfirm = () => {
    setShowMoreModal(false);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteConfirmationModal(false);
  };

  const handleDeleteConfirm = () => {
    deletePlaylist(playlistSelected.name);
    setShowDeleteConfirmationModal(false);
    setPlaylistSelected({});
  };

  const handleRenamePlaylist = () => {
    setShowRenamePlaylistModal(!showRenamePlaylistModal);
  };

  return (
    <>
      {showRenamePlaylistModal ? (
        <CustomTextFieldModal
          placeholderText={'Enter Playlist Name'}
          isModalVisible={showRenamePlaylistModal}
          handleModalClose={handleRenamePlaylist}
          handleConfirm={renamePlaylist}
          confirmationText="Rename"
          existingText={playlistSelected.name}
        />
      ) : null}
      {showDeleteConfirmationModal ? (
        <ConfirmationModal
          isModalVisible={showDeleteConfirmationModal}
          headerText={'Are you sure want to delete the playlist?'}
          handleConfirm={handleDeleteConfirm}
          handleClose={handleDeleteModalClose}
        />
      ) : null}
      {showMoreModal ? (
        <CustomDropdown
          isModalVisible={showMoreModal}
          handleModalClose={handleShowMoreModalClose}
          headerIcon={headerIcon()}
          title={playlistSelected.name}
          subHeader={`${playlistSelected?.list?.length || 0} songs`}
          options={[
            {
              label: 'Play Next',
              icon: 'forward',
              onPress: () => {},
            },
            {
              label: 'Rename',
              icon: 'pencil',
              onPress: handleRenamePlaylist,
            },
            {
              label: 'Delete',
              icon: 'trash',
              onPress: handleDeleteClick,
            },
          ]}
          handleConfirmCallback={handleShowMoreConfirm}
        />
      ) : null}
      <Banner
        visible={showBanner}
        icon={({size}) => (
          <Icon name="check-square" size={20} style={styles.bannerIcon} />
        )}
        style={{backgroundColor: '#5cb85c', color: 'white'}}>
        <Text style={styles.bannerText}>{bannerText}</Text>
      </Banner>
      <CustomTextFieldModal
        placeholderText={'Enter new Playlist Name'}
        isModalVisible={showCreatePlaylistModal}
        handleModalClose={handleCreatePlaylistModalClose}
        handleConfirm={handleNewPlaylistCreation}
        confirmationText="Create"
      />
      <View style={styles.playlistContainer}>
        <View style={styles.playlistHeader}>
          <Text style={styles.playlistHeaderText}>Playlists</Text>
          <Icon name="plus" size={15} onPress={handleCreateNew} />
        </View>
        {Array.isArray(playlists) && (
          <FlatList
            {...(currentSong && {contentContainerStyle: {paddingBottom: 50}})}
            data={playlists}
            renderItem={({item: playlist, index}) => {
              if (playlist.name === 'AllSongs') {
                return;
              }
              return (
                <TouchableOpacity
                  key={playlist.name}
                  style={styles.playlistFolder}
                  onPress={() => handlePlaylistsSelect(playlist.name)}>
                  {playlist.list?.length ? (
                    <Image
                      style={styles.coverImg}
                      source={{uri: playlist.list[0]?.cover}}
                      alt={'cover-image'}
                    />
                  ) : (
                    <Icon
                      style={styles.iconPlaceholderImg}
                      name="music"
                      size={15}
                    />
                  )}
                  <View style={styles.playlistTextContainer}>
                    <Text style={styles.playlistNameText}>{playlist.name}</Text>
                    <Text style={styles.playlistSongsCount}>
                      {playlist.list?.length || 0} Songs
                    </Text>
                  </View>
                  <Icon
                    style={styles.showMoreBtn}
                    name="ellipsis-v"
                    size={15}
                    onPress={() => handleShowMore(playlist.name)}
                  />
                </TouchableOpacity>
              );
            }}
            keyExtractor={playlist => playlist.name}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  playlistContainer: {
    padding: 16,
  },
  playlistHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playlistHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistFolder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 4,
    marginVertical: 8,
  },
  playlistNameText: {
    fontSize: 16,
  },
  iconPlaceholderImg: {
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 16,
    backgroundColor: 'lightgray',
    borderRadius: 8,
  },
  showMoreBtn: {
    marginLeft: 'auto',
  },
  playlistTextContainer: {
    display: 'flex',
  },
  playlistSongsCount: {
    fontSize: 12,
  },
  coverImg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  iconCover: {
    width: 40,
    height: 40,
    borderWidth: 1,
    padding: 12,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    borderColor: 'lightgrey',
  },
});

export default Playlists;
