import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
function Main() {
  return (
    <div>
        <NavBar/>
        <div className='min-h-screen'><Outlet/></div>
        <Footer/>
    </div>
  )
}

export default Main