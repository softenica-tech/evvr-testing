import "./callToAction.scss"
import Image from "next/image"
import callToActionImage from "../../../public/assets/images/call-to-action.jpg"

export default function CallToAction() {
  return(
    <>
      <div className="call_to_action_wrapper">
        <Image src={callToActionImage} alt="callToActionImage" />
        <div className="container">
          <h3>Honour the legacy that shaped us by investing in the future we believe in. </h3>
        </div>
      </div>
    </>
  )
}