import { StyleSheet } from 'react-native';
import { heightPixel, widthPixel , fontPixel } from "../../../services/constant";
import { colors } from "../../../services/utilities/colors";
import { fonts } from '../../../services/utilities/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    // marginBottom: heightPixel(30),
  },
  contentContainer: {
    padding: heightPixel(20),
    borderTopLeftRadius: widthPixel(20),
    borderTopRightRadius: widthPixel(20),
    marginBottom: heightPixel(30),
  },
  mainTitle: {
    color: colors.white,
    fontSize: fontPixel(28),
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: fonts.NunitoLight,
  },
  description: {
    color: colors.gray,
    fontSize: fontPixel(16),
    marginBottom: widthPixel(20),
    fontFamily: fonts.NunitoRegular,
    lineHeight: 22,
  },
});