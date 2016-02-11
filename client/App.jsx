import React from 'react';
import {Link} from 'react-router';
import Index from './components/index/page.jsx';

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

        return <Index />;
    }
})