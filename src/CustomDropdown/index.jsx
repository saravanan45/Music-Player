import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

const CustomDropdown = ({
  isModalVisible,
  handleModalClose,
  title,
  subHeader,
  headerIcon,
  options,
  playlistSelected,
  handleConfirmCallback,
}) => {
  const deviceWidth = Dimensions.get('window').width;

  const Options = (
    <>
      <View style={styles.headerOptions}>
        <TouchableOpacity style={[styles.option]}>
          {headerIcon}
          <Text style={styles.textLabel}>{title}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.otherOptions}>
        {options.length
          ? options.map(option => (
              <TouchableOpacity
                key={option.label}
                style={[styles.option]}
                onPress={() => {
                  option.onPress();
                  handleConfirmCallback();
                }}>
                {option.coverImg ? (
                  <Image
                    style={styles.coverImg}
                    source={{uri: option.coverImg}}
                    alt={'cover-image'}
                  />
                ) : (
                  <View style={styles.iconCover}>
                    <Icon name={option.icon || 'music'} size={16} />
                  </View>
                )}
                <Text style={styles.textLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))
          : null}
      </View>
    </>
  );

  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isModalVisible}
        onBackdropPress={handleModalClose}
        deviceWidth={deviceWidth}>
        <View style={styles.containerStyle}>
          <View style={styles.content}>{Options}</View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdown;

CustomDropdown.defaultProps = {
  options: [],
};

const styles = StyleSheet.create({
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
  modal: {
    margin: 0,
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  content: {
    width: '100%',
    height: 'fit-content',
    backgroundColor: 'white',
    overflow: 'hidden',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerOptions: {
    fontSize: 16,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  otherOptions: {
    fontSize: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingVertical: 8,
  },
  option: {
    display: 'flex',
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  textLabel: {
    fontSize: 16,
  },
});
