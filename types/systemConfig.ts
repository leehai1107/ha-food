export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  type: 'color' | 'font' | 'text' | 'number' | 'boolean' | 'json' | 'image' | 'password' | 'email';
  category: 'theme' | 'typography' | 'layout' | 'general' | 'animation' | 'email';
  label: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSystemConfigRequest {
  key: string;
  value: string;
  type: 'color' | 'font' | 'text' | 'number' | 'boolean' | 'json' | 'image' | 'password' | 'email';
  category: 'theme' | 'typography' | 'layout' | 'general' | 'animation' | 'email';
  label: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateSystemConfigRequest {
  value?: string;
  type?: 'color' | 'font' | 'text' | 'number' | 'boolean' | 'json' | 'image' | 'password' | 'email';
  category?: 'theme' | 'typography' | 'layout' | 'general' | 'animation' | 'email';
  label?: string;
  description?: string;
  isActive?: boolean;
}

export interface SystemConfigQueryParams {
  category?: string;
  type?: string;
  isActive?: boolean;
  search?: string;
}

export interface SystemTheme {
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  borderColor: string;

  // Typography
  primaryFont: string;
  secondaryFont: string;
  headingFont: string;
  fontSize: string;
  lineHeight: string;

  // Layout
  containerMaxWidth: string;
  borderRadius: string;
  spacing: string;
  headerHeight: string;

  // Branding
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface FontOption {
  name: string;
  value: string;
  category: 'serif' | 'sans-serif' | 'monospace' | 'display';
  preview: string;
}

export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

export const DEFAULT_FONTS: FontOption[] = [
  {
    name: 'Inter',
    value: 'Inter, system-ui, sans-serif',
    category: 'sans-serif',
    preview: 'Modern and clean'
  },
  {
    name: 'Roboto',
    value: 'Roboto, system-ui, sans-serif',
    category: 'sans-serif',
    preview: 'Google\'s signature font'
  },
  {
    name: 'Open Sans',
    value: 'Open Sans, system-ui, sans-serif',
    category: 'sans-serif',
    preview: 'Friendly and readable'
  },
  {
    name: 'Lato',
    value: 'Lato, system-ui, sans-serif',
    category: 'sans-serif',
    preview: 'Elegant and professional'
  },
  {
    name: 'Poppins',
    value: 'Poppins, system-ui, sans-serif',
    category: 'sans-serif',
    preview: 'Geometric and modern'
  },
  {
    name: 'Montserrat',
    value: 'Montserrat, system-ui, sans-serif',
    category: 'sans-serif',
    preview: 'Urban and contemporary'
  },
  {
    name: 'Playfair Display',
    value: 'Playfair Display, serif',
    category: 'serif',
    preview: 'Elegant and sophisticated'
  },
  {
    name: 'Merriweather',
    value: 'Merriweather, serif',
    category: 'serif',
    preview: 'Readable and classic'
  },
  {
    name: 'Source Code Pro',
    value: 'Source Code Pro, monospace',
    category: 'monospace',
    preview: 'Clean monospace font'
  }
];

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'HA Food Original',
    primary: '#8B4513',
    secondary: '#D4AF37',
    accent: '#F4A460',
    description: 'Warm brown and gold theme'
  },
  {
    name: 'Ocean Blue',
    primary: '#1E40AF',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    description: 'Professional blue theme'
  },
  {
    name: 'Forest Green',
    primary: '#059669',
    secondary: '#10B981',
    accent: '#34D399',
    description: 'Natural green theme'
  },
  {
    name: 'Sunset Orange',
    primary: '#EA580C',
    secondary: '#FB923C',
    accent: '#FDBA74',
    description: 'Vibrant orange theme'
  },
  {
    name: 'Royal Purple',
    primary: '#7C3AED',
    secondary: '#A855F7',
    accent: '#C084FC',
    description: 'Elegant purple theme'
  },
  {
    name: 'Cherry Red',
    primary: '#DC2626',
    secondary: '#EF4444',
    accent: '#F87171',
    description: 'Bold red theme'
  }
];

// Animation Types
export interface AnimationConfig {
  enabled: boolean;
  direction: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate';
  duration: number;
  delay: number;
  distance: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';
}

export interface ComponentAnimationSettings {
  hero: AnimationConfig;
  about: AnimationConfig;
  featuredClients: AnimationConfig;
  products: AnimationConfig;
  testimonials: AnimationConfig;
  footer: AnimationConfig;
  statistics: {
    enabled: boolean;
    duration: number;
    delay: number;
    startOnView: boolean;
  };
}

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  enabled: true,
  direction: 'up',
  duration: 0.8,
  delay: 0,
  distance: 50,
  easing: 'easeOut'
};

export const DEFAULT_COMPONENT_ANIMATIONS: ComponentAnimationSettings = {
  hero: { ...DEFAULT_ANIMATION_CONFIG, direction: 'fade', duration: 1.2 },
  about: { ...DEFAULT_ANIMATION_CONFIG, direction: 'up', delay: 0.2 },
  featuredClients: { ...DEFAULT_ANIMATION_CONFIG, direction: 'left', delay: 0.4 },
  products: { ...DEFAULT_ANIMATION_CONFIG, direction: 'up', delay: 0.6 },
  testimonials: { ...DEFAULT_ANIMATION_CONFIG, direction: 'right', delay: 0.8 },
  footer: { ...DEFAULT_ANIMATION_CONFIG, direction: 'up', delay: 1.0 },
  statistics: {
    enabled: true,
    duration: 2.5,
    delay: 0.5,
    startOnView: true
  }
};
