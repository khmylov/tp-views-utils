import React from 'react';
import Auth from '../../services/auth';
import errorPrinter from '../../utils/errorPrinter';
import './signIn.css';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'signIn',

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    propTypes: {
        auth: T.instanceOf(Auth).isRequired
    },

    getInitialState() {
        return {
            isSigningIn: false,
            errorMessage: null
        };
    },

    _onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const {accountName, token} = this._getEnteredInfo();
        const {auth} = this.props;

        this.setState({isSigningIn: true, errorMessage: null});

        auth
            .tryAuthorize({accountName, token})
            .done(() => {
                if (this.isMounted()) {
                    const {location} = this.props;
                    const {router} = this.context;

                    if (location.state && location.state.nextPathname) {
                        router.replace(location.state.nextPathname)
                    } else {
                        router.replace('/')
                    }
                }
            })
            .fail(e => {
                if (this.isMounted()) {
                    this.setState({isSigningIn: false, errorMessage: errorPrinter.getErrorText(e)});
                }
            });
    },

    _getEnteredInfo() {
        const {inputAccountName, inputPasswordToken} = this.refs;
        return {
            accountName: inputAccountName.value,
            inputPasswordToken: inputPasswordToken.value
        }
    },

    render() {
        const isBusy = this.state.isSigningIn;

        return (
            <div>
                {this._renderErrorBox()}

                <form className="signInPage__form" onSubmit={this._onSubmit}>
                    <h2 className="form-signin-heading">Please sign in</h2>

                    <div className="form-group">
                        <input
                            type="text"
                            ref="inputAccountName"
                            className="form-control"
                            placeholder="Your OnDemand account name"
                            required autofocus
                            disabled={isBusy}/>
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            ref="inputPasswordToken"
                            className="form-control"
                            placeholder="API token"
                            required
                            disabled={isBusy}/>
                    </div>

                    <button
                        className="btn btn-lg btn-primary btn-block"
                        type="submit"
                        disabled={isBusy}>
                        {isBusy ? 'Signing in...' : 'Sign in'}
                    </button>

                </form>
            </div>
        );
    },

    _renderErrorBox() {
        const {errorMessage} = this.state;
        if (!errorMessage) {
            return null;
        }

        return (
            <div className="alert alert-danger">
                <span>Unable to sign in:</span>
                <br />
                <span>{errorMessage}</span>
            </div>
        );
    }
});