import React from 'react';
const T = React.PropTypes;

export default React.createClass({
    displayName: 'copyCardSettingsLog',

    propTypes: {
        onLogAppend: T.object.isRequired
    },

    _onLogAppend({message}) {
        const output = this.refs.output;
        output.value += message;
        ouput.value += '\n';
    },

    componentDidMount() {
        this.props.onLogAppend.add(this._onLogAppend);
    },

    componentWillUnmount() {
        this.props.onLogAppend.remove(this._onLogAppend);
    },

    shouldComponentUpdate() {
        return false;
    },

    render() {
        return (
            <div>
                <textarea ref="output" />
            </div>
        )
    }
});