import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import BookList from './pages/BookList';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import EditBook from './pages/EditBook';
import AddBook from './pages/AddBook';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-layout d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* Public Routes - Anyone can search, filter, and view */}
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/:bookId" element={<BookDetail />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes - Only Authorized User can edit or add */}
                <Route
                  path="/books/:bookId/edit"
                  element={
                    <ProtectedRoute>
                      <EditBook />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books/add"
                  element={
                    <ProtectedRoute>
                      <AddBook />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
