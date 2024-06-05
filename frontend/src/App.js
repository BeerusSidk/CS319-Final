import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from './logo.png';
import { Popular } from './Popular.js';
import { Appetizer } from './Appetizer.js';
import { Beef } from './Beef.js';
import { Pork } from './Pork.js';
import { Rice } from './Rice.js';
import { Noodles } from './Noodles.js';
import { About } from './About.js';
import { Contribution } from './Contribution.js';

function App() {

  const HeaderForAll = () => {
    const navigate = useNavigate();

    return (
      <header>
        <nav id="header-nav">
          <div>
            <div className="row">
              <img src={logo} className="col-3 img-fluid rounded d-block" style={{ width: '150px' }}></img>
              <div className="col-10 navbar-brand d-flex justify-content-between align-items-start">
                <div className="d-flex align-items-start flex-column bd-highlight">
                  <h1 className='mb-auto bd-highlight'>Viet Foody</h1>
                  <div className="mt-5 bd-highlight">
                    <ul className="list">
                      <li onClick={() => navigate('/popular')} className="mr-3 menu">Popular</li>
                      <li onClick={() => navigate('/appetizer')} className="mx-3 menu">Appetizer</li>
                      <li onClick={() => navigate('/beef')} className="mx-3 menu">Beef</li>
                      <li onClick={() => navigate('/pork')} className="mx-3 menu">Pork</li>
                      <li onClick={() => navigate('/rice')} className="mx-3 menu">Rice</li>
                      <li onClick={() => navigate('/noodles')} className="mx-3 menu">Noodles</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <div className='d-flex justify-content-between align-items-start'>
                    <ul className="list">
                      <li onClick={() => navigate('/contribution')} className="mr-3 menu">Contribution</li>
                      <li onClick={() => navigate('/about')} className="mx-3 menu">About Us</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </nav>
      </header>
    );
  }


  return (
    <Router> {/* Move the Router component to wrap the entire App */}
      <>
        <HeaderForAll />
        <Routes>
          <Route path="/popular" element={<Popular />} />
          <Route path="/beef" element={<Beef />} />
          <Route path="/pork" element={<Pork />} />
          <Route path="/appetizer" element={<Appetizer />} />
          <Route path="/rice" element={<Rice />} />
          <Route path="/noodles" element={<Noodles />} />
          <Route path="/about" element={<About />} />
          <Route path="/contribution" element={<Contribution />} />
          <Route path="/" element={<Popular />} /> {/* Default view */}
        </Routes>
      </>
    </Router>
  );
}

export default App;
