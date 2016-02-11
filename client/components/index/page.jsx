import React from 'react';
import {Link} from 'react-router';
import routes from '../../routes';

export default React.createClass({
    displayName: 'index',

    render() {
        return (
            <div className="jumbotron">
                <h1>Hi there!</h1>
                <p>
                    This web application provides access to some experimental things for your Targetprocess account
                    <br />
                    Beware, and proceed with caution
                </p>
                <p>
                    <Link
                        className="btn btn-primary btn-lg"
                        to={routes.copyCardSettings}
                        role="button">
                        Copy card settings between views
                    </Link>
                </p>
            </div>
        );
    }
})