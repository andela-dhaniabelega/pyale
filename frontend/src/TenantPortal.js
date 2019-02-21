import React from 'react'
import TenantNavBar from './components/TenantNavBar';
import Aux from './hoc/Aux_';



class TenantPortal extends React.Component {
    render() {
        return (
            <Aux>
                <TenantNavBar />
            </Aux>
        );
    }
}

export default TenantPortal;