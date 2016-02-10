import React from 'react';
import classNames from 'classnames';

import ViewInfo from '../../models/viewInfo';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'selectableViewItem',
    propTypes: {
        name: T.string.isRequired,
        viewId: T.string.isRequired,
        viewData: T.object.isRequired,
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
    _getStatusText({success, error, warning}) {
        if (success) {
            return 'OK';
        }

        return error || warning;
    },
    render() {
        const {isSelected, validationState, name, viewData} = this.props;

        const isChecked = isSelected && validationState.success;
        const disabled = !Boolean(validationState.success);

        const rowClassName = classNames({
            'success': isChecked,
            'copyCardSettings__target-list__target--disabled': disabled
        });

        const statusClassName = classNames({
            'danger': disabled,
            'warning': validationState.warning
        });

        return (
            <tr className={rowClassName}>
                <td>
                    <div className="checkbox copyCardSettings__target-list__name-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={disabled}
                                onChange={this._onChange}/>
                            {name}
                        </label>
                    </div>
                </td>
                <td>{ViewInfo.formatViewType(viewData.itemType, viewData.viewMode)}</td>
                <td>{ViewInfo.formatTypes(viewData.cells)}</td>
                <td className={statusClassName}>
                    <small>{this._getStatusText(validationState)}</small>
                </td>
            </tr>

        );
    }
});