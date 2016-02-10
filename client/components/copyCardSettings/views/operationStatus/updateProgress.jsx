import React from 'react';
import LogView from '../../../../views/log.jsx';
import Log from '../../models/log';

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
        }
    },

    componentWillMount() {
        this._log = new Log();
    },

    componentDidMount() {
        this.props.startOperation(this._log)
            .done(_ => {
                if (this.isMounted()) {
                    this.setState({isCompleted: true});
                }
            })
            .fail(e => {
                if (this.isMounted()) {
                    this.setState({error: e})
                }
            });
    },

    render() {
        const status = this.state.isCompleted ?
            <div className="alert alert-success">All done</div> :
            <div className="alert alert-info">Running, don't close the page...</div>;

        return (
            <div>
                {status}
                <LogView
                    className="form-control"
                    rows="20"
                    onLogAppend={this._log.onLogAppend} />
            </div>
        );
    }
});