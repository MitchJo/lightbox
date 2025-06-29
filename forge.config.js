const path = require('path');

module.exports = {
  packagerConfig: {
    // General Electron Packager options
    // This is where you specify your app's icon, ASAR packaging, etc.
    // For Windows, ensure your icon is a .ico file.
    icon: path.join(__dirname, 'lightbox.ico'), // IMPORTANT: Change this to your .ico file path
    asar: true, // Recommended for packaging your app's code
    // ... other packager options
  },
  rebuildConfig: {},
  makers: [
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     // Squirrel.Windows specific configuration for your Windows installer
    //     name: 'lightbox', // Internal name for the Squirrel installer
    //     authors: 'Mitchell Mawniuh', // This is shown in the installer
    //     description: 'An app to control a Lightbox.',
    //     setupIcon: path.join(__dirname, 'lightbox.ico'), // Icon for the installer itself (often the same as app icon)
    //     // ... other Squirrel.Windows options

    //     // ======== Code Signing Configuration ========
    //     // This section tells Squirrel.Windows how to sign your installer and app
    //     // You have two primary ways: using a .pfx file directly, or advanced signtool.exe params.

    //     // Method 1: Using a .pfx file (recommended for simplicity)
    //     // Ensure your .pfx file is in your project root or provide a full path
    //     certificateFile: process.env.CSC_LINK || path.join(__dirname, 'certs/lightbox-cert.pfx'),
    //     certificatePassword: process.env.CERTIFICATE_PASSWORD,

    //     // Method 2: Advanced signing via signWithParams (if you need more control or specific timestamp servers)
    //     // This calls signtool.exe directly. Uncomment and configure if needed.
    //     // signWithParams: `/f "${path.join(__dirname, 'my-self-signed-code-cert.pfx')}" /p "${process.env.CSC_KEY_PASSWORD}" /fd sha256 /tr http://timestamp.digicert.com /td sha256`,

    //     // Optional: Remote releases for auto-updates (set to true if you are using auto-updater)
    //     // remoteReleases: '', // Example: "https://your-update-server.com/releases"
    //   },
    // },

    {
      name: '@electron-forge/maker-wix', // Use WiX MSI for Windows installers
      config: {
        name: 'Lightbox',
        authors: 'Mitchell Mawñiuh', 
        description: 'An app to control a Lightbox.',
        icon: path.join(__dirname, 'lightbox.ico'), 
        version: '1.0.0',
        runAfterFinish: true,
        language: 1033, 
        manufacturer: 'Mitchell Mawñiuh',
        ui: {
          chooseDirectory: true, 
          images: {
            background: path.join(__dirname, 'lightbox-background.bmp'),
            banner: path.join(__dirname, 'lightbox-banner.bmp'),
          }
        }

      },
      platforms: ['win32'] 
    },
    // You might have other makers here for macOS, Linux, etc.
    // {
    //   name: '@electron-forge/maker-zip',
    //   platforms: ['darwin'],
    // },
    // {
    //   name: '@electron-forge/maker-deb',
    //   config: {},
    // },
    // {
    //   name: '@electron-forge/maker-rpm',
    //   config: {},
    // },
  ],
  plugins: [
    // You might have other plugins here, e.g., for Webpack or Vite
    // {
    //   name: '@electron-forge/plugin-webpack',
    //   // ... webpack config
    // },
  ],
};