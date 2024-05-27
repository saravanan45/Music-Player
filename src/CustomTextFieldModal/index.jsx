import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

const CustomTextFieldModal = ({
  isModalVisible,
  handleModalClose,
  existingText,
  handleConfirm,
  confirmationText,
  placeholderText,
}) => {
  const [textValue, setTextFieldValue] = useState(existingText || '');
  const [error, setError] = useState(false);

  const onChangeInput = value => {
    setTextFieldValue(value);
  };

  const handleCreate = () => {
    if (!textValue?.length) {
      return setError(true);
    }
    handleConfirm(textValue, existingText);
    if (error) {
      setError(false);
    }
    setTextFieldValue('');
    handleModalClose();
  };

  const onClose = () => {
    setTextFieldValue('');
    handleModalClose();
  };

  return (
    <View>
      <Modal
        style={styles.modal}
        isVisible={isModalVisible}
        onBackdropPress={onClose}>
        <View style={styles.containerStyle}>
          <View style={styles.contentStyle}>
            <Text style={styles.textLabel}>
              {existingText ? 'Rename Playlist' : 'Create new playlist'}
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeInput}
              value={textValue}
              placeholder={placeholderText}
              autoFocus
            />
            {error ? (
              <Text style={styles.errorText}>
                *Text should not be less than 1 character.
              </Text>
            ) : null}
            <View style={styles.buttonFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.buttonText}>{confirmationText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomTextFieldModal;

CustomTextFieldModal.defaultProps = {
  options: [],
};

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
  },
  buttonFooter: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginVertical: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -16,
    marginBottom: 16,
    marginLeft: 8,
  },
});
