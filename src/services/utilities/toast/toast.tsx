import Snackbar from 'react-native-snackbar';
import { colors } from '../colors';
 // make sure fonts is correct

const toastError = ({text, properties = {}, onPress = () => {}} : any) => {
  let { backgroundColor = colors?.red, textColor = colors.white } = properties;

  Snackbar.show({
    text,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor,
    textColor, // works only if using latest version
    marginBottom: 20,
    
  });
};

const toastSuccess = ({text, properties = {}, onPress = () => {} }: any) => {
  let { backgroundColor = colors.themeColor, textColor = colors.white } = properties;

  Snackbar.show({
    text,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor,
    textColor,
    action: {
      text: 'OK',
      onPress,
      textColor: colors.white,
    },
  });
};

export { toastError, toastSuccess };
