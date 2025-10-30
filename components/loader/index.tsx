import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

type LoaderProps = {
  containerClassName?: string;
  text?: string;
  loadingComponent?: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'small' | 'large' | number;
  textClassName?: string;
};

export const Loader: React.FC<LoaderProps> = ({
  containerClassName = 'flex-1 items-center justify-center bg-background-main-color',
  text,
  loadingComponent,
  icon,
  size = 'large',
  textClassName = 'text-main-color',
}) => {
  return (
    <View className={containerClassName}>
      {loadingComponent ? (
        <>{loadingComponent}</>
      ) : icon ? (
        <>{icon}</>
      ) : (
        <ActivityIndicator size={size as any} color="#4f46e5" />
      )}

      {text ? <Text className={`mt-3 ${textClassName}`}>{text}</Text> : null}
    </View>
  );
};

export default Loader;
