// theme.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-text:${({ theme }) => theme.color_text};
    --color-heading: ${({ theme }) => theme.color_heading};
    --color-bg: ${({ theme }) => theme.color_bg};

    --color-theme: ${({ theme }) => theme.color_theme};
    --color-gray: ${({ theme }) => theme.color_gray}; 
    --color-nav-bg: ${({ theme }) => theme.color_nav_bg};
    --color-hover-bg: ${({ theme }) => theme.color_hover_bg};
    --color-description: ${({ theme }) => theme.color_description};

    --color-info: ${({ theme }) => theme.color_info};
    --color-info-bg: ${({ theme }) => theme.color_info_bg};
    --color-danger: ${({ theme }) => theme.color_danger};
    --color-danger-bg: ${({ theme }) => theme.color_danger_bg};
    --color-table-bg:${({ theme }) => theme.color_table_bg};
    --color-table-bg-secondary:${({ theme }) => theme.color_table_bg_secondary};
    --color-link: ${({ theme }) => theme.color_link};

    --gradient-theme: ${({ theme }) => theme.gradient_theme};
    --gradient-glass: ${({ theme }) => theme.gradient_glass};
    
    --border-glass: ${({ theme }) => theme.border_glass};
    --border-footer: ${({ theme }) => theme.border_footer};
    --border-cate: ${({ theme }) => theme.border_cate};
    --border-tag: ${({ theme }) => theme.border_tag};
    --border-table: ${({ theme }) => theme.border_table};

    --bg ${({ theme }) => theme.bg};
    --box-shadow: ${({ theme }) => theme.box_shadow};
  }
`;
