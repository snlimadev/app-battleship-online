import { Appearance } from 'react-native';
import { createTheme } from '@rneui/themed';
import { DEFAULT_COLORS, DEFAULT_PADDING, DEFAULT_RADIUS } from '../config/appConfig';

const customTheme = createTheme({
  lightColors: DEFAULT_COLORS,

  darkColors: { ...DEFAULT_COLORS, primary: 'rgb(4, 55, 242)' },

  components: {
    Text: (props, theme) => ({
      style: {
        paddingTop: (props.noPaddingTop) ? 0 : DEFAULT_PADDING,
        fontWeight: (props.bold) ? 'bold' : 'normal',
        textAlign: (props.centered) ? 'center' : 'auto',
        textDecorationLine: (props.underline) ? 'underline' : 'none',
        fontSize: (props.xxlarge) ? 30 : (props.large) ? 18 : 14,
        color:
          (props.success)
            ? theme.colors.success
            : (props.warning)
              ? theme.colors.warning
              : (props.danger)
                ? theme.colors.danger
                : (props.primary)
                  ? theme.colors.primary
                  : theme.colors.black,
      },
    }),

    Button: (props, theme) => ({
      radius: DEFAULT_RADIUS,
      containerStyle: {
        paddingTop: (props.noPaddingTop) ? 0 : DEFAULT_PADDING,
        paddingHorizontal: (props.halfWidth) ? DEFAULT_PADDING / 2 : DEFAULT_PADDING,
        width: (props.halfWidth) ? '50%' : '100%',
      },
      buttonStyle: {
        borderWidth: (props.type === 'outline') ? 1 : 0,
        borderColor: (props.info) ? theme.colors.info : theme.colors.primary,
      },
      titleStyle: {
        color:
          (props.info)
            ? theme.colors.info
            : (props.type === 'outline')
              ? theme.colors.primary
              : theme.colors.topBarText,
      },
      disabledStyle: {
        borderColor: theme.colors.grey4,
      },
      disabledTitleStyle: {
        color: theme.colors.grey4,
      },
      uppercase: true,
    }),

    CheckBox: {
      textStyle: {
        fontWeight: 'normal',
      },
    },

    Input: (props, theme) => ({
      inputContainerStyle: {
        borderColor: (props.focused) ? theme.colors.primary : theme.colors.grey3,
        borderWidth: 1,
        borderRadius: DEFAULT_RADIUS,
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
    }),

    Card: {
      containerStyle: {
        borderRadius: DEFAULT_RADIUS,
        marginVertical: 0,
        marginHorizontal: DEFAULT_PADDING,
      },
    },

    CardTitle: (props) => ({
      style: (props.modal) && {
        fontSize: 20,
      },
    }),

    CardDivider: (props, theme) => ({
      style: (props.footer) && {
        paddingTop: 14,
      },
      color: theme.colors.grey4,
    }),

    Icon: (props, theme) => ({
      style: (props.topBar) ? {
        padding: 4,
      } : undefined,
      containerStyle: (props.topBar) && {
        borderRadius: 20,
      },
      color:
        (props.disabled)
          ? theme.colors.grey4
          : (props.primary)
            ? theme.colors.primary
            : (props.info)
              ? theme.colors.info
              : theme.colors.topBarText,
      disabledStyle: {
        backgroundColor: 'transparent',
      },
      size: (props.small) ? 15 : 24,
    }),
  },

  mode: (Appearance.getColorScheme() === 'dark') ? 'dark' : 'light',

  icon: (Appearance.getColorScheme() === 'dark') ? 'sunny' : 'moon',
});

export default customTheme;