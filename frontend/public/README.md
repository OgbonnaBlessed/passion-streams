# Logo Setup Instructions

## Adding the Logo Image

To complete the logo setup, please add your logo image file to this directory (`frontend/public/`).

### File Requirements:
- **Filename**: `logo.png`
- **Recommended size**: 
  - For favicon: 32x32px to 512x512px (square)
  - For website display: At least 200x200px for best quality
- **Format**: PNG (with transparency preferred)

### Where the Logo is Used:

1. **Favicon** (Browser tab icon) - Set in `index.html`
2. **Navbar** - Displayed in the navigation bar on all pages
3. **HomePage** - Large logo display on the homepage hero section
4. **Login Page** - Logo above the login form
5. **Signup Page** - Logo above the signup form

### Steps:

1. Save your logo image as `logo.png` in this directory (`frontend/public/`)
2. The logo will automatically be available at `/logo.png` throughout the application
3. Refresh your browser to see the changes

### Note:
If your logo file has a different name or format, you'll need to update the references in:
- `frontend/index.html` (favicon links)
- `frontend/src/components/common/Navbar.tsx`
- `frontend/src/pages/HomePage.tsx`
- `frontend/src/pages/auth/LoginPage.tsx`
- `frontend/src/pages/auth/SignupPage.tsx`

