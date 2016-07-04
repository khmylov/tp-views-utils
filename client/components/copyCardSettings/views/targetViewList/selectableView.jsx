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
            error: T.string,
            warning: T.string
        }).isRequired,
        isSelected: T.bool.isRequired,
        onChange: T.func.isRequired
    },
    _onChange(e) {
        const isChecked = e.target.checked;
        this.props.onChange(this.props.viewId, isChecked);
    },
    _getStatusText({success, error, warning}) {
        if (!success) {
            return error;
        }

        return warning || 'OK';
    },
    render() {
        const {isSelected, validationState, name, viewData} = this.props;

        const canSelect = Boolean(validationState.success);
        const hasWarnings = Boolean(validationState.warning);
        const disabled = !canSelect;

        const rowClassName = classNames({
            'success': canSelect && !hasWarnings && isSelected,
            'warning': canSelect && hasWarnings && isSelected,
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
                                checked={isSelected && !disabled}
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