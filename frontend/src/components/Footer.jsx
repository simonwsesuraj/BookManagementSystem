import React from 'react'
const date = new Date().getFullYear()
export default function Footer() {
  return (
    <footer className="bg-warning text-center text-lg-start">
        <div className="d-flex align-items-center justify-content-center p-4" >
            <small className="text-danger fw-bold">© {date} எனது புத்தகம். All Rights Reserved.</small>
        </div>
    </footer>
  )
}
