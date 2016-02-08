import React from 'react'
import {Link} from 'react-router'
import routes from './routes'

export default React.createClass({
    render() {
        return (
            <div>
                <h1>App</h1>
                <ul>
                    <li><Link to={'/' + routes.copyCardSettings}>Copy card settings</Link></li>
                </ul>

                {this.props.children}
            </div>
        );
    }
})