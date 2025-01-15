import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Theme {
    icon: 'moon' | 'sunny';
    dark: boolean;
  }

  export interface Colors {
    danger: string;
    info: string;
    topBarText: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  }

  export interface TextProps {
    noPaddingTop?: boolean;
    bold?: boolean;
    centered?: boolean;
    underline?: boolean;
    xxlarge?: boolean;
    large?: boolean;
    success?: boolean;
    warning?: boolean;
    danger?: boolean;
    primary?: boolean;
    modal?: boolean;
  }

  export interface ButtonProps {
    noPaddingTop?: boolean;
    halfWidth?: boolean;
    info?: boolean;
  }

  export interface InputProps {
    focused?: boolean;
  }

  export interface IconProps {
    topBar?: boolean;
    primary?: boolean;
    info?: boolean;
    small?: boolean;
  }

  export interface DividerProps {
    footer?: boolean;
  }

  export interface ComponentTheme {
    Text: Partial<TextProps>;
    Button: Partial<ButtonProps>;
    Input: Partial<InputProps>;
    Icon: Partial<IconProps>;
    CardDivider: Partial<DividerProps>;
  }
}

export { };