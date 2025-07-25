# 🌾 Sabana Frontend - Modern Issue Management Interface

Frontend repository for the **Sabana** project - A responsive React-based client for our issue management system.

## 📋 Project Overview

This is the **frontend companion** to the Sabana backend, providing a modern, responsive user interface built with **Next.js**. The application consumes the REST API documented in our [backend repository](https://github.com/inkih04/SabanaBack) to deliver a seamless issue management experience.

### ✨ Key Features
- **🎯 Modern React Interface**: Built with Next.js for optimal performance and SEO
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices  
- **🔗 API Integration**: Seamless integration with Sabana REST API
- **⚡ Fast Loading**: Server-side rendering and optimized bundle sizes
- **🎨 Intuitive UX**: Clean, user-friendly interface inspired by modern project management tools

### 🔧 Core Functionality
- **Issue Management**: Create, view, edit, and organize issues
- **Advanced Filtering**: Filter and sort issues by multiple criteria
- **File Attachments**: Upload and manage issue attachments *(currently disabled - see limitations)*
- **Pre-defined User Login**: Login system with predetermined users *(academic requirement)*

## 👥 Team Members
- [David Mas](https://github.com/PatoPro121) - Full Stack Developer
- [Pol Sancho](https://github.com/PolSB968) - Backend Developer  
- [David Sanz](https://github.com/DavidSanzMartinez) - Full Stack Developer
- [Víctor Díez](https://github.com/inkih04) - Project Lead & Full Stack Developer

## 🛠️ Technologies Used

### Frontend Framework
- **Next.js 13+** - React framework with App Router
- **React 18** - Component-based UI library
- **JavaScript** - Dynamic programming language
- **CSS** - Pure CSS styling and layouts

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Vercel** - Deployment and hosting platform

### API Integration
- **Axios/Fetch** - HTTP client for API communication
- **REST API** - Integration with Sabana backend services

## 🚀 Live Demo

🔗 **[Live Application on Vercel](https://saba-front-end.vercel.app/)**

> 🌐 **Backend Integration**: This frontend connects to our Django REST API hosted on Render. Check out the [API documentation](https://it22d-backend.onrender.com/swagger/) for technical details.

## 📌 Project Management

We use **Taiga** for tracking tasks and project progress:  
🔗 [Taiga Board](https://tree.taiga.io/project/victordiez-it22dasw/taskboard/sprint-1-22919)

## 🏗️ Architecture

### Client-Side Rendering
- **Next.js App Router**: Modern routing and layout system
- **Component Architecture**: Reusable React components
- **State Management**: React hooks and context for state handling
- **API Layer**: Abstracted service layer for backend communication

### Performance Optimizations
- **Static Site Generation (SSG)**: Pre-rendered pages for better performance
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic bundle splitting for faster loading
- **Caching Strategy**: Efficient data fetching and caching

## 📸 Screenshots

### 🖥️ Desktop Interface
![Main Dashboard](https://github.com/inkih04/SabanaFront/blob/main/images/issues.png)
![Filters](https://github.com/inkih04/SabanaFront/blob/main/images/filter.png)
![Create Issue](https://github.com/inkih04/SabanaFront/blob/main/images/create.png)
![Issue Details](https://github.com/inkih04/SabanaFront/blob/main/images/issue.png) 




## ⚠️ Current Limitations

### 🔐 Authentication System
- **Pre-defined Users**: The login system uses predetermined users rather than full registration/OAuth integration
- **Academic Requirement**: This limitation was specifically requested by course instructors for project evaluation purposes

### 📎 File Upload Features
- **Attachments**: Issue file attachment functionality is currently **disabled**
- **Profile Pictures**: User profile photo upload is currently **disabled**
- **AWS S3 Integration**: Features are inactive due to expiration of AWS Student account
- **Code Preservation**: The upload functionality remains in the codebase for future reactivation

### 📚 Development History
- **Methodology**: Developed using **Scrum methodology** with sprint planning and agile practices
- **Version Control**: Originally used **GitFlow** branching strategy for organized development
- **Repository Migration**: This repository was migrated from an organization account, so original branches and detailed commit history are not preserved

## 🎓 Academic Context

This project was developed as part of the **ASW (Aplicaciones y Servicios Web)** course, demonstrating:
- Modern frontend development with React/Next.js
- RESTful API integration
- Responsive web design
- Component-based architecture
- Performance optimization techniques
- Professional deployment practices
- **Scrum methodology** implementation
- **GitFlow** version control strategy

### 🏆 Academic Achievement
**Final Grade: 8.5/10** - Excellent implementation of modern frontend practices and seamless API integration.

## 📊 Features Showcase

- ✅ Modern React/Next.js architecture
- ✅ Responsive design (mobile-first)
- ✅ RESTful API integration
- ✅ Advanced filtering and sorting
- ✅ Pre-defined user authentication system
- ✅ Server-side rendering (SSR)
- ✅ Optimized performance
- ✅ Professional deployment on Vercel
- ✅ Scrum methodology implementation
- ⚠️ File upload functionality (AWS S3 - currently disabled)

## 🔗 Related Repositories

- **🔧 Backend API**: [SabanaBack](https://github.com/inkih04/SabanaBack) - Django REST API with authentication and data management

## 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/inkih04/SabanaFront.git

# Navigate to project directory
cd SabanaFront

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser at
http://localhost:3000
```

## 📝 Environment Variables

```bash
# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# Add other environment variables as needed
```

## 📝 License

This project was developed for educational purposes as part of university coursework.

---

**Developed with ❤️ by the Sabana Team**
