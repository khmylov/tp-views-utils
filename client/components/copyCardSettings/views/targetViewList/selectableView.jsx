import React from 'react';
const T = React.PropTypes;

export default React.createClass({
    displayName: 'selectableViewItem',
    propTypes: {
        viewId: T.string.isRequired,
        onChange: T.func.isRequired
    },
    _onChange(e) {
        const isChecked = e.target.checked;
        this.props.onChange(this.props.viewId, isChecked);
    },
    render() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={this.props.isSelected}
                        onChange={this._onChange}/>
                    {this.props.name}
                </label>
            </div>
        );
    }
});