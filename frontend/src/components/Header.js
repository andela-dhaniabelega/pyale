import React from 'react'
import VisitorNavbar from "./VisitorNavbar";
import Aux from '../hoc/Aux_'


class Header extends React.Component{
    render() {
        return (
            <Aux>
                {/*Renders TenantNavBar if user is logged in else VisitorNavBar */}
                <VisitorNavbar/>
                <section className="section section-lg bg-web-desc">
                    <div className="bg-overlay"></div>
                    <div className="bg-pattern-effect">
                        <img src="images/bg-pattern.png" alt=""/>
                    </div>
                </section>
            </Aux>
        );
    }
}

export default Header;