import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LightColors, Radius, Spacing, Typography } from '@/constants';

interface ImagePickerInputProps {
  value?: string | null;
  onChange: (uri: string) => void;
  label?: string;
  errorMessage?: string;
}

export function ImagePickerInput({
  value,
  onChange,
  label = 'Medication Photo',
  errorMessage,
}: ImagePickerInputProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option to add a photo of your medication.',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need camera permission to take a photo.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to take photo.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'We need photo library permission to select a photo.');
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        onChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to pick image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={handlePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityHint="Choose an image for the medication"
        >
          {value ? (
            <Image source={{ uri: value }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="camera" size={32} color={LightColors.textSecondary} />
              <Text style={styles.placeholderText}>Add Photo</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.bodySM,
    fontWeight: '600',
    color: LightColors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  avatarButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: LightColors.surface,
    borderWidth: 1.5,
    borderColor: LightColors.border,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.caption,
    color: LightColors.textSecondary,
    marginTop: Spacing.xxs,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  errorText: {
    ...Typography.caption,
    color: LightColors.error,
    marginTop: Spacing.xxs,
  },
});
