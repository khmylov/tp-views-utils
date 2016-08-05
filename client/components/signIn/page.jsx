import Auth from '../../services/auth';
import errorPrinter from '../../utils/errorPrinter';
import './signIn.css';

import defaultTestCredentials from './testCredentials.private.json';

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
            accountName: defaultTestCredentials.accountName,
            token: defaultTestCredentials.token,

            isSigningIn: false,
            errorMessage: null
        };
    },

    _onAccountNameChanged(e) {
        this.setState({accountName: e.target.value});
    },

    _onTokenChanged(e) {
        this.setState({token: e.target.value});
    },

    _onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        const {accountName, token} = this.state;
        const {auth} = this.props;

        this.setState({isSigningIn: true, errorMessage: null});

        auth
            .tryAuthorize({accountName, token})
            .done(() => {
                if (this.isMounted()) {
                    const {location} = this.props;
                    const {router} = this.context;

                    if (location.state && location.state.nextPathname) {
                        router.replace(location.state.nextPathname);
                    } else {
                        router.replace('/');
                    }
                }
            })
            .fail(e => {
                if (this.isMounted()) {
                    this.setState({isSigningIn: false, errorMessage: errorPrinter.getErrorText(e)});
                }
            });
    },

    render() {
        const isBusy = this.state.isSigningIn;
        const {accountName, token} = this.state;

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
                            required={true}
                            autoFocus={true}
                            value={accountName}
                            onChange={this._onAccountNameChanged}
                            disabled={isBusy}/>
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            ref="inputPasswordToken"
                            className="form-control"
                            placeholder="API token"
                            required={true}
                            value={token}
                            onChange={this._onTokenChanged}
                            disabled={isBusy}
                            aria-describedby="inputPasswordTokenHelp"/>
                        {this._renderTokenTip()}
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
    },

    _renderTokenTip() {
        const accountName = Auth.tryParseAccountName(this.state.accountName);
        const isAccountSpecified = Boolean(accountName && accountName.length);

        const authApiRelativeUrl = '/api/v1/Authentication';
        const tokenUrl = `https://${isAccountSpecified ? accountName : '<account_name>'}.tpondemand.com${authApiRelativeUrl}`;
        const tokenUrlElement = isAccountSpecified ?
            <a tabIndex="-1" href={tokenUrl}>{authApiRelativeUrl}</a> :
            <span>{authApiRelativeUrl}</span>;

        return (
            <span id="inputPasswordTokenHelp" className="help-block">
                You can get the token at {tokenUrlElement}
            </span>
        );
    }
});