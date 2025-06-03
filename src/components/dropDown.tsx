import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { theme } from '~/components/theme'; // Replace with your theme import
import { Player } from '~/types/types';
import ProfileComponent from './MenuScreens/Profile';
import PlayerStatsScreen from './MenuScreens/Stats';
import TrophyRoomComponent from './MenuScreens/trophyRoom';
import CharacterUnlockScreen from './MenuScreens/unlockScreen';

type DropdownMenuProps = {
  isVisible: boolean;
  onClose: () => void;
  player: Player

};

const iconMapping: Record<string, string> = {
    profile: 'account',
    stats: 'chart-bar',
    trophy: 'trophy',
    characters: 'emoticon',
  };

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isVisible, onClose, player}) => {
  const [selectedOption, setSelectedOption] = useState<'profile' | 'stats' | 'trophy' | 'characters'>('profile');

  const handleSelectedOption = (option: 'profile' | 'stats' | 'trophy' | 'characters') => {
    setSelectedOption(option)
  }

  

  const renderContent = () => {
    switch (selectedOption) {
      case 'profile':
        return <ProfileComponent switchTab={handleSelectedOption}/>
      case 'stats':
        return <PlayerStatsScreen/>
      case 'trophy':
        return <TrophyRoomComponent/>;
      case 'characters':
        return <CharacterUnlockScreen/>;
      default:
        return null;
    }
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade" >
      <TouchableWithoutFeedback onPress={(event) => {
    // Check if the user tapped outside the dropdown menu
    if (event.target === event.currentTarget) {
      onClose();
    }
  }}>
        <View style={styles.overlay}>
          <View style={[styles.dropdownMenu, { backgroundColor: theme.colors.background }]}>
            {/* Close Button */}
            <IconButton
              icon="close"
              onPress={onClose}
              style={styles.closeButton}
              size={24}
            />

            {/* Toggle Bar */}
            <View style={[styles.toggleBar, {backgroundColor: theme.colors.surface, borderRadius: theme.roundness}]}>
            {Object.entries(iconMapping).map(([option, icon]) => (
                <IconButton
                  key={option}
                  icon={icon}
                  size={30}
                  //color={selectedOption === option ? theme.colors.primary : theme.colors.text}
                  onPress={() => setSelectedOption(option as typeof selectedOption)}
                  disabled={selectedOption === option}
                  style={styles.iconButton}
                />
              ))}
            </View>

            {/* Dynamic Content */}
            {renderContent()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 130, // Adjust for header height
  },
  dropdownMenu: {
    width: '90%',
    height: '90%',
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  iconButton: {
    marginHorizontal: 10,
  },
  toggleBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '80%'
    
  },
  toggleButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 5,
    color: 'white'
  },
});

export default DropdownMenu;
