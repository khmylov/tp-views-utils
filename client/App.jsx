import React from 'react'
import {Link} from 'react-router'
import routes from './routes'

export default React.createClass({
    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">TP Views</Link>
                        </div>
                        <div id="navbar" className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li>
                                    <Link
                                        to={'/' + routes.copyCardSettings}>
                                        Copy card settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container">
                    {this._renderContent()}
                </div>
            </div>
        );
    },

    _renderContent() {
        const {children} = this.props;
        if (children) {
            return children;
        }

        return (
            <p>
                Hi there!
                <br />
                Choose a usecase in the navigation bar
            </p>
        );
    }
})