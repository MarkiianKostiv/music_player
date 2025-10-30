import { Link } from 'expo-router';
import { View, Pressable, ViewProps, PressableProps } from 'react-native';
import { ReactElement } from 'react';

interface IconLinkProps {
  href: string;
  icon: ReactElement;
  containerClassName?: string;
  pressableClassName?: string;
  pressableProps?: PressableProps;
  containerProps?: ViewProps;
}

export const IconLink = ({
  href,
  icon,
  containerClassName = '',
  pressableClassName = '',
  pressableProps,
  containerProps,
}: IconLinkProps) => {
  return (
    <View className={`flex-row items-center ${containerClassName}`} {...containerProps}>
      <Link href={href} asChild>
        <Pressable
          className={`rounded-full bg-main-color p-2 ${pressableClassName}`}
          {...pressableProps}>
          {icon}
        </Pressable>
      </Link>
    </View>
  );
};
