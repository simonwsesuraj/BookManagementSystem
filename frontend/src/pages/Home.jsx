import React from 'react'

import "./Home.css"
const imageModule = import.meta.glob(
  "../assets/quotes/*",
{
  eager:true,
  query:'?url',
  import:'default',
})

const images = Object.values(imageModule);

export default function Home() {
  return (
    <main className="home-page">
      <section className="home-header" aria-labelledby="home-title">
        <p className="home-eyebrow">இலக்கியக் களஞ்சியம்</p>
        <h1 id="home-title">எண்ணங்களைத் தூண்டும் சொற்கள்</h1>
        <p className="home-description">
          காலத்தை வென்ற கருத்துகளையும், மனதில் நிற்கும் வரிகளையும் ஒரே இடத்தில் வாசியுங்கள்.
        </p>
      </section>

      <div id="carouselExampleFade" className="quote-carousel carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          {images.map((image,index)=>(
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={image}>
              <div className="quote-frame">
                <img src={image} alt={`Quote ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev" aria-label="Previous quote">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next" aria-label="Next quote">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>

      <p className="home-footer">ஒரு நல்ல வரி, ஒரு புதிய பார்வை.</p>
    </main>
  )
}

