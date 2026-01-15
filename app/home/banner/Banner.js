import "./banner.scss"
// import bannerImage from "../../../public/assets/images/banner_img.jpg"
// import Image from "next/image"

export default function Banner() {
  return(
    <>
      <div className="banner_wrapper" id="banner">
        <div className="container">
          <h1>Preserving Legacy. <br/>Creating Growth.</h1>
        </div>
      </div>
      {/* <div className="banner_image">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="https://streamable.com/l/taw6kl/mp4.mp4" type="video/mp4" />
        </video>
      </div> */}
    </>
  )
}