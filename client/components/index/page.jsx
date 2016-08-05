import {Link} from 'react-router';
import {routes} from 'client/configuration/routing.jsx';

export default React.createClass({
    displayName: 'index',

    render() {
        const {isSignedIn} = this.props;

        const label = isSignedIn ?
            <p><span>Welcome! Choose what to do next.</span></p> :
            null;

        return (
            <div className="jumbotron">
                <h1>Hi there!</h1>
                <p>
                    This web application provides access to some <abbr title="Beware and proceed with caution!">experimental</abbr> things for your Targetprocess account.
                    <br />
                </p>
                {label}
                {this._renderLinks()}
            </div>
        );
    },

    _renderLinks() {
        const {isSignedIn} = this.props;
        if (!isSignedIn) {
            return (
                <p>
                    <Link
                        className="btn btn-primary btn-lg"
                        to={routes.login}
                        role="button">
                        Sign in to begin
                    </Link>
                </p>
            );
        }

        return (
            <p>
                <Link
                    className="btn btn-primary"
                    to={routes.copyCardSettings}
                    role="button">
                    Copy card settings between views
                </Link>
            </p>
        );
    }
});