import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AllSongs from '../AllSongs';
import Playlists from '../Playlists';
import PlayMusicFooter from '../PlayMusicFooter';

const HomePage = ({navigation}) => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <>
      <View style={styles.headerContainer}>
        <Icon name="navicon" size={20} />
        <Text style={styles.headerText}>Music Season</Text>
        <Icon style={styles.searchIcon} name="search" size={20} />
      </View>
      <View />
      <Tab.Navigator>
        <Tab.Screen name="All Songs" component={AllSongs} />
        <Tab.Screen name="Playlists" component={Playlists} />
      </Tab.Navigator>
      <PlayMusicFooter />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 12,
    gap: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
  },
  searchIcon: {
    marginLeft: 'auto',
  },
});

export default HomePage;
