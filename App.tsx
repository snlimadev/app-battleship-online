import { ThemeProvider } from '@rneui/themed';
import FlashMessage from 'react-native-flash-message';
import customTheme from './src/themes/customTheme';
import AppRoutes from './src/routes/AppRoutes';

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={customTheme}>
      <AppRoutes />

      <FlashMessage position='top' />
    </ThemeProvider>
  );
}