# Genvoice – Local Invoice Generator

Genvoice is a privacy-first, client-side invoice management app for freelancers and small businesses. All your data stays on your device—no servers, no cloud, no sign-up required.

## ✨ Features

- **Client-side only:** All data is stored in your browser (IndexedDB/localStorage).
- **Client management:** Add, edit, search, and delete clients with full address and contact info.
- **Product management:** Manage your products/services.
- **Invoice management:** Create, edit, download, and track invoices. Change status (draft, sent, paid, overdue).
- **Dashboard:** Quick stats and charts for your business.
- **Modern UI:** Responsive, themeable, and accessible interface.
- **Offline support:** Works without internet.
- **No data leaves your device.**

## 🚀 Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/yourusername/invoice-generator.git
   cd invoice-generator
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the app:**
   ```sh
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide Icons
- Zod, react-hook-form
- Sonner (toasts)

## 📦 Project Structure

- `src/components/` – UI and feature components
- `src/lib/db/` – Local database logic (client, product, invoice)
- `src/hooks/` – Custom React hooks
- `src/index.css` – Tailwind and theme styles

## 🛡️ Privacy

Genvoice is 100% client-side. Your data never leaves your device.

## 📄 License

MIT

---

Made with ❤️ for privacy and productivity.