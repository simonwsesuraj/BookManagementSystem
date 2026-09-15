import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "../src/style/Navbar.css"
import "../src/style/Footer.css"
import "../src/style/BookList.css"
import "../src/style/BookCarousel.css"
import "../src/style/BookCard.css"
import "../src/style/Spinner.css"
import "../src/style/BookDetail.css"
import "../src/style/EditBook.css"


createRoot(document.getElementById('root')).render(
  
    <App />

)
