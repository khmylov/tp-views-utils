import React from 'react';
import {Link} from 'react-router';
import LogView from 'client/views/log.jsx';
import Log from '../../models/log';
import errorPrinter from 'client/utils/errorPrinter';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'copyCardSettingsUpdateProgress',

    propTypes: {
        startOperation: T.func.isRequired
    },

    getInitialState() {
        return {
            isCompleted: false,
            error: null
        };
    },

    componentWillMount() {
        this._log = new Log();
    },

    componentDidMount() {
        this.props.startOperation(this._log)
            .done(() => {
                if (this.isMounted()) {
                    this.setState({isCompleted: true, error: null});
                }
            })
            .fail(e => {
                if (this.isMounted()) {
                    this.setState({isCompleted: true, error: errorPrinter.getErrorText(e)});
                }
            });
    },

    render() {
        return (
            <div>
                {this._renderStatus()}
                <LogView
                    className="form-control"
                    rows="20"
                    onLogAppend={this._log.onLogAppend} />
            </div>
        );
    },

    _renderStatus() {
        const {isCompleted, error} = this.state;
        if (!isCompleted) {
            return <div className="alert alert-info">Running, don't close the page...</div>;
        }

        if (error) {
            return (
                <div className="alert alert-danger">
                    <span>
                        Finished with some errors
                    </span>
                    <br />
                    <pre>
                        {error}
                    </pre>
                </div>
            );
        }

        return (
            <div className="alert alert-success">
                <span>All done! You can go back to the </span>
                <Link to="/">home page</Link>
                <span> or start a </span>
                <Link to="/">new session</Link>
            </div>
        );
    }
});