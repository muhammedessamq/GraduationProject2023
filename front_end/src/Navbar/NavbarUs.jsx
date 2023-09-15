
import logoImage from '../logo.jpeg';
import "./NavbarUs.css";
import { BrowserRouter as Router, Route, Redirect , useNavigate, Link } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';

export const Navbar = () => {

  return (
    <div>
      <nav className="navbarpage">
      
        <a href='/' className='navbarpage-site-title'>
          <img src={logoImage} alt="Logo" className="navbarpage-logo-imageUS" />
        </a>
    
          
          <form>
            <div className="contactusnavbar-Home-button">
            <Link to="../"><button className="aboutusnavbar-Home-button">
            <IoMdHome /> 
            </button></Link>
          </div>
           
          </form>    
           
      </nav>
    </div>
  );
};

export default Navbar;