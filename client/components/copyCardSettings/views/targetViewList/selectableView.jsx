import React from 'react';
const T = React.PropTypes;

export default React.createClass({
    displayName: 'selectableViewItem',
    propTypes: {
        name: T.string.isRequired,
        viewId: T.string.isRequired,
        validationState: T.shape({
            success: T.bool.isRequired,
            message: T.string
        }).isRequired,
        isSelected: T.bool.isRequired,
        onChange: T.func.isRequired
    },
    _onChange(e) {
        const isChecked = e.target.checked;
        this.props.onChange(this.props.viewId, isChecked);
    },
    render() {
        const {isSelected, validationState, name} = this.props;

        const isChecked = isSelected && validationState.success;
        const disabled = !Boolean(validationState.success);
        const displayName = disabled ?
            `${name} (${validationState.message})` :
            name;

        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={disabled}
                        onChange={this._onChange}/>
                    {displayName}
                </label>
            </div>
        );
    }
});