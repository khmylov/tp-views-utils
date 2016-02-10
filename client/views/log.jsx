import React from 'react';
const T = React.PropTypes;

export default React.createClass({
    displayName: 'textLog',

    propTypes: {
        onLogAppend: T.object.isRequired,
        rows: T.string,
        className: T.string
    },

    _onLogAppend({message}) {
        const output = this.refs.output;
        output.value += message;
        output.value += '\n';
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
        const {className, rows} = this.props;
        return (
            <div>
                <textarea
                    className={className}
                    rows={rows}
                    ref="output" />
            </div>
        )
    }
});