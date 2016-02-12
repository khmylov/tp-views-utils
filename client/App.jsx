import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router';
import Index from './components/index/page.jsx';
import LoadingStateWrapper from './views/loadingStateWrapper.jsx';
import routes from './routes';
import Auth from './services/auth';

export default React.createClass({
    propTypes: {
        auth: React.PropTypes.instanceOf(Auth).isRequired
    },

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    _onSignOut() {
        const {auth} = this.props;
        auth
            .signOut()
            .always(() => {
                this.context.router.replace(routes.login);
            })
    },

    render() {
        return (
            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">TP Views</Link>
                        </div>
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav navbar-right">
                                {this._renderUserInfo()}
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
        const {children, auth} = this.props;
        if (children) {
            return children;
        }

        return <Index isSignedIn={auth.isLoggedIn()}/>;
    },

    _renderUserInfo() {
        const {auth} = this.props;
        if (!auth.isLoggedIn()) {
            return null;
        }

        const {accountName, firstName, lastName} = auth.getSessionInfo();

        return (
            <p className="navbar-text navbar-right">
                <span>Signed in as {firstName} {lastName} @ {accountName} | </span>
                <a
                    className="navbar-link"
                    role="button"
                    onClick={this._onSignOut}>
                    Sign out
                </a>
            </p>
        );
    }
})