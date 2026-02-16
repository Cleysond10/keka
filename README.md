# Keka 📸

A modern, responsive photo management dashboard built for photographers to streamline their workflow. Easily browse, select, and manage photos with intuitive tools for downloading and sharing.

## Overview

Keka provides photographers with a clean, user-friendly interface to manage their photo collections efficiently. Whether you need to organize photos by date, size, or name, download batches of images, or send photos directly via email, Keka has you covered with a dark mode option for comfortable use in various lighting conditions.

## ✨ Features

- **📁 Directory Browsing** - Browse your local file system and load photos from any directory
- **🎨 Smart Selection** - Select individual photos or all photos at once with a single click
- **👀 Review Mode** - Preview your selected photos before taking action
- **⬇️ Batch Download** - Download multiple selected photos to a folder of your choice
- **� PDF Export** - Convert selected photos to a PDF with customizable watermark and image quality
- **�📧 Email Integration** - Send selected photos via email with custom messages
- **🔄 Sorting Options** - Sort photos by name, date modified, or file size
- **🌓 Dark/Light Theme** - Toggle between dark and light themes for comfortable viewing
- **📱 Responsive Design** - Works seamlessly on desktop and tablet devices
- **⚡ Fast Loading** - Built with Vite for rapid development and optimized production builds

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icon library
- **React Hot Toast** - Elegant notifications
- **PDF-Lib** - PDF generation and manipulation
- **Smash SDK** - File sharing and email delivery

## 📦 Project Structure

```
keka/
├── src/
│   ├── components/          # React components
│   │   ├── Dashboard.tsx    # Main dashboard container
│   │   ├── PhotoGrid.tsx    # Photo grid display
│   │   ├── PhotoItem.tsx    # Individual photo item
│   │   ├── SelectionBar.tsx # Selection information bar
│   │   ├── DirectoryPicker.tsx   # Directory selection
│   │   ├── EmailModal.tsx   # Email form modal
│   │   ├── FolderNameModal.tsx   # Folder naming modal
│   │   ├── PDFModal.tsx     # PDF generation settings modal
│   │   └── ActionModal.tsx  # Action selection modal
│   ├── hooks/
│   │   └── usePhotos.ts     # Photo management hook
│   ├── services/
│   │   └── EmailService.ts  # Email delivery services
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── utils/
│   │   ├── fileSystem.ts    # File system utilities
│   │   └── pdfGenerator.ts  # PDF generation utilities
│   ├── assets/              # Images and logos
│   ├── App.tsx              # App entry point
│   ├── main.tsx             # React DOM render
│   └── index.css            # Global styles
├── public/                   # Static files
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)
- Modern web browser with File System Access API support (Chrome, Edge, etc.)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd keka
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables (if using email features):
```env
VITE_SMASH_API_KEY=<your-smash-api-key>
VITE_SMASH_API_REGION=<your-smash-region>
VITE_API_URL=<your-api-url>
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build

Create an optimized production build:
```bash
npm run build
```

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 📖 Usage

1. **Select a Directory** - Click the directory picker button to choose a folder containing your photos
2. **Browse Photos** - The grid will display all images found in the selected directory
3. **Select Photos** - Click individual photos to select them, or use "Select All" to select everything
4. **Review** - Click "Review" to preview all selected photos
5. **Take Action** - Choose one of the following options:
   - **Download** - Save photos to a new folder on your computer
   - **Send via Email** - Send photos with a custom message to recipients
   - **Download as PDF** - Generate a PDF with your selected photos, custom watermark text, and adjustable image quality (Original, High, Medium, Low, or Very Low)

### PDF Generation Features

When downloading photos as a PDF, you can customize:

- **Watermark Text** - Add a custom watermark to protect your photos (defaults to "Do Not Copy")
- **Image Quality** - Choose the quality level to optimize file size:
  - **Original (100%)** - Full quality, largest file size
  - **High (90%)** - Minimal compression, high quality
  - **Medium (80%)** - Balanced quality and file size
  - **Low (60%)** - Smaller file size, acceptable quality
  - **Very Low (40%)** - Smallest file size, lower quality

Each page in the PDF includes the image filename as a title. Your watermark preferences are automatically saved for future use.

## 🌐 Browser Compatibility

Keka requires a modern browser with File System Access API support:
- ✅ Google Chrome 86+
- ✅ Microsoft Edge 86+
- ✅ Opera 72+
- ❌ Firefox (limited support)
- ❌ Safari (no support yet)

## 🔧 Configuration

### Environment Variables

The app supports optional environment variables for email delivery:

- `VITE_SMASH_API_KEY` - API key for Smash file delivery service
- `VITE_SMASH_API_REGION` - Region for Smash API
- `VITE_API_URL` - Custom backend API URL (for TransferNow service)

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created for photography professionals who need efficient photo management tools.
