import './Footer.scss'
import ackoLogo from '../../assets/acko-logo.svg';
import iconInstagram from '../../assets/icons/instagram.svg'
import iconLinkedIn from '../../assets/icons/linkedin.svg'
import iconX from '../../assets/icons/x.svg'
import iconYouTube from '../../assets/icons/youtube.svg'
import iconFacebook from '../../assets/icons/facebook.svg'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <img src={ackoLogo} alt="ACKO" className="footer__logo" />
          <h3 className="footer__title">Acko Technology & Services Private Limited</h3>
          <p className="footer__address">#36/5, Hustlehub One East, Somasandrapalya, 27th Main Rd, Sector 2, HSR Layout, Bengaluru, Karnataka 560102</p>
        </div>
        <div className="footer__groups">
          <h4 className="footer__heading">Acko Group Companies:</h4>
          <ul className="footer__list">
            <li>Acko General Insurance Limited</li>
            <li>Acko Life Insurance Limited</li>
          </ul>
        </div>
        <div className="footer__social">
          <a aria-label="Instagram" title="Instagram" href="#" className="footer__icon" target="_blank" rel="noreferrer">
            <img src={iconInstagram} alt="" />
          </a>
          <a aria-label="LinkedIn" title="LinkedIn" href="#" className="footer__icon" target="_blank" rel="noreferrer">
            <img src={iconLinkedIn} alt="" />
          </a>
          <a aria-label="X" title="X" href="#" className="footer__icon" target="_blank" rel="noreferrer">
            <img src={iconX} alt="" />
          </a>
          <a aria-label="YouTube" title="YouTube" href="#" className="footer__icon" target="_blank" rel="noreferrer">
            <img src={iconYouTube} alt="" />
          </a>
          <a aria-label="Facebook" title="Facebook" href="#" className="footer__icon" target="_blank" rel="noreferrer">
            <img src={iconFacebook} alt="" />
          </a>
        </div>
      </div>
      <div className="footer__divider" />
    </footer>
  )
}

export default Footer


