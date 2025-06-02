import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding system configuration...');

    const systemConfigs = [
      // Theme configurations
      {
        key: 'primary_color',
        value: '#4CAF50',
        type: 'color',
        category: 'theme',
        label: 'Primary Color',
        description: 'Main brand color used throughout the application',
      },
      {
        key: 'secondary_color',
        value: '#FFC107',
        type: 'color',
        category: 'theme',
        label: 'Secondary Color',
        description: 'Secondary brand color for accents and highlights',
      },
      {
        key: 'background_color',
        value: '#FFFFFF',
        type: 'color',
        category: 'theme',
        label: 'Background Color',
        description: 'Main background color of the application',
      },
      {
        key: 'text_color',
        value: '#333333',
        type: 'color',
        category: 'theme',
        label: 'Text Color',
        description: 'Main text color used throughout the application',
      },
      // Typography configurations
      {
        key: 'heading_font',
        value: 'Roboto',
        type: 'text',
        category: 'typography',
        label: 'Heading Font',
        description: 'Font family for headings',
      },
      {
        key: 'body_font',
        value: 'Open Sans',
        type: 'text',
        category: 'typography',
        label: 'Body Font',
        description: 'Font family for body text',
      },
      {
        key: 'base_font_size',
        value: '16',
        type: 'number',
        category: 'typography',
        label: 'Base Font Size',
        description: 'Base font size in pixels',
      },
      {
        key: 'heading_scale',
        value: '1.25',
        type: 'number',
        category: 'typography',
        label: 'Heading Scale',
        description: 'Scale factor for heading sizes',
      },
      // Layout configurations
      {
        key: 'container_width',
        value: '1200',
        type: 'number',
        category: 'layout',
        label: 'Container Width',
        description: 'Maximum width of the main container in pixels',
      },
      {
        key: 'sidebar_width',
        value: '250',
        type: 'number',
        category: 'layout',
        label: 'Sidebar Width',
        description: 'Width of the admin sidebar in pixels',
      },
      {
        key: 'header_height',
        value: '64',
        type: 'number',
        category: 'layout',
        label: 'Header Height',
        description: 'Height of the main header in pixels',
      },
      {
        key: 'footer_height',
        value: '200',
        type: 'number',
        category: 'layout',
        label: 'Footer Height',
        description: 'Height of the footer in pixels',
      },
      // General configurations
      {
        key: 'site_name',
        value: 'HA Food',
        type: 'text',
        category: 'general',
        label: 'Site Name',
        description: 'Name of the website',
      },
      {
        key: 'site_description',
        value: 'Premium Food Products',
        type: 'text',
        category: 'general',
        label: 'Site Description',
        description: 'Brief description of the website',
      },
      {
        key: 'contact_email',
        value: 'contact@hafood.vn',
        type: 'text',
        category: 'general',
        label: 'Contact Email',
        description: 'Main contact email address',
      },
      {
        key: 'contact_phone',
        value: '+84 123 456 789',
        type: 'text',
        category: 'general',
        label: 'Contact Phone',
        description: 'Main contact phone number',
      },
      // Email configurations
      {
        key: 'smtp_host',
        value: 'smtp.gmail.com',
        type: 'text',
        category: 'email',
        label: 'SMTP Host',
        description: 'SMTP server hostname',
      },
      {
        key: 'smtp_port',
        value: '587',
        type: 'number',
        category: 'email',
        label: 'SMTP Port',
        description: 'SMTP server port',
      },
      {
        key: 'smtp_username',
        value: 'noreply@hafood.vn',
        type: 'text',
        category: 'email',
        label: 'SMTP Username',
        description: 'SMTP server username',
      },
      {
        key: 'smtp_password',
        value: '',
        type: 'text',
        category: 'email',
        label: 'SMTP Password',
        description: 'SMTP server password',
      },
      {
        key: 'email_from_name',
        value: 'HA Food',
        type: 'text',
        category: 'email',
        label: 'From Name',
        description: 'Name shown in the From field of emails',
      },
      {
        key: 'email_from_address',
        value: 'noreply@hafood.vn',
        type: 'text',
        category: 'email',
        label: 'From Address',
        description: 'Email address shown in the From field',
      },
      // Animation configurations
      {
        key: 'enable_animations',
        value: 'true',
        type: 'boolean',
        category: 'animation',
        label: 'Enable Animations',
        description: 'Toggle for enabling/disabling UI animations',
      },
      {
        key: 'animation_speed',
        value: '300',
        type: 'number',
        category: 'animation',
        label: 'Animation Speed',
        description: 'Default animation duration in milliseconds',
      },
      {
        key: 'animation_style',
        value: 'ease-in-out',
        type: 'text',
        category: 'animation',
        label: 'Animation Style',
        description: 'Default animation timing function',
      },
      {
        key: 'enable_page_transitions',
        value: 'true',
        type: 'boolean',
        category: 'animation',
        label: 'Enable Page Transitions',
        description: 'Toggle for page transition animations',
      },
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config,
      });
    }

    console.log('System configuration seeded successfully');
  } catch (error) {
    console.error('Error seeding system configuration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 