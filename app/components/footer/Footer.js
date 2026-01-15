import "./footer.scss"
import Image from "next/image"
import footerImage from "../../../public/assets/images/footerlogo.svg"  
import Link from "next/link"

export default function Footer() {
  return(
    <>
      <div className="footer_wrapper" id="footer">
          <div className="container">
            <div className="footer_content">
              <section>
                <h2>Contact us</h2>
                <h4><Link href="mailto:contact@evvrcapital.com">contact@evvrcapital.com</Link></h4>
              </section>
            </div>
          </div>
          <div className="container mt-auto">
            <h3>© evvr capital</h3>
          </div>
          <Image src={footerImage} className="footer_logo" alt="footerImage" />
      </div>
    </>
  )
}