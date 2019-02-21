import React from 'react';
import HomeNavBar from './components/HomeNavBar';
import Rent from './components/Rent';
import Sale from './components/Sale';
import SocialMedia from './components/SocialMedia';
import Footer from './components/Footer';
import FooterLinks from './components/FooterLinks';
import Switcher from './components/Switcher';
import Aux from './hoc/Aux_';


class HomeThree extends React.Component {
  render() {

  	return (
        <Aux>
                {/* Navbar Component*/}
                <HomeNavBar />

                <section className="section bg-home height-100vh" id="home">
                    <div className="bg-overlay"></div>
                    <div className="display-table">
                        <div className="display-table-cell">
                            <div className="container">
                                <div className="row">
                                  <div className="col-lg-8 offset-lg-2 text-white text-center">
                                        <h1 className="home-title">We Build. We Lease. We Rent. </h1>
                                        <p className="padding-t-15 home-desc">
                                          Pyale Properties leases and rents commercial and residential properties at
                                          affordable rates across multiple locations in Nigeria including Lagos &
                                          PortHarcourt
                                        </p>
                                        <p className="play-shadow margin-t-30 margin-l-r-auto">
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-pattern-effect">
                        <img src="images/bg-pattern.png" alt="" />
                    </div>
               </section>

                {/* Blog Component*/}
                <Sale />

                {/* Blog Component*/}
                <Rent />

                {/* SocialMedia Component*/}
                <SocialMedia />
                
                {/* Footer Component*/}
                <Footer />

                {/* FooterLinks Component*/}
                <FooterLinks />

                {/* Switcher Component*/}
               <Switcher /> 
        </Aux>
  	);
  }
}

export default HomeThree;