import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

const ConfirmationModal = ({
  isModalVisible,
  handleClose,
  handleConfirm,
  headerText,
}) => {
  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isModalVisible}
        onBackdropPress={handleClose}>
        <View style={styles.containerStyle}>
          <View style={styles.contentStyle}>
            <Text style={styles.textLabel}>{headerText}</Text>
            <View style={styles.buttonFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  contentStyle: {
    width: '100%',
    height: 'fit-content',
    backgroundColor: 'white',
    overflow: 'hidden',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  textLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonFooter: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    width: '45%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#808080',
    backgroundColor: '#808080',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  createBtn: {
    width: '45%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#50C878',
    backgroundColor: '#50C878',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
