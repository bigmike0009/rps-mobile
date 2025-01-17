import React from 'react';
import { View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-paper';

interface CustomOverlayDialogProps {
  visible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
  children: React.ReactNode;
}

const CustomOverlayDialog: React.FC<CustomOverlayDialogProps> = ({
  visible,
  onClose,
  children,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        {children}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: .8,
    zIndex: 100,
  },
  dialog: {
    width: 120,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default CustomOverlayDialog;
