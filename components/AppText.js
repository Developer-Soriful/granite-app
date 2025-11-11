import { StyleSheet, Text } from 'react-native';

const AppText = (props) => {
  return (
    <Text
      style={
        [
          styles.defaultText,
          props.style,
        ]}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {

    fontFamily: 'InstrumentSans',
  },
});

export default AppText;