import React from 'react';

import Log from './log.jsx';

const T = React.PropTypes;


export default React.createClass({
    displayName: 'copyCardSettingsUpdateProgress',

    propTypes: {
        startOperation: T.func.isRequired,
        log: T.object.isRequired
    },

    getInitialState() {
        return {
            isCompleted: false,
            error: null
        }
    },

    componentDidMount() {
        const {startOperation, log} = this.props;

        startOperation()
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
        const {log} = this.props;

        const continueButton = this.state.isCompleted ?
            <button className="btn btn-primary">Continue</button> :
            null;

        return (
            <div>
                <Log
                    className="form-control"
                    rows="20"
                    onLogAppend={log.onLogAppend} />
                {continueButton}
            </div>
        );
    }
})