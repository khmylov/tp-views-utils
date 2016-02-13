import Immutable from 'immutable';
const T = React.PropTypes;

const CopyOption = React.createClass({
    displayName: 'singleCopyOption',
    propTypes: {
        name: T.string.isRequired,
        optionId: T.string.isRequired,
        isEnabled: T.bool.isRequired,
        onEnabledChanged: T.func.isRequired
    },
    _onChange(e) {
        const newEnabled = e.target.checked;
        this.props.onEnabledChanged(this.props.optionId, newEnabled);
    },
    render() {
        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={this.props.isEnabled}
                        onChange={this._onChange}/>
                    {this.props.name}
                </label>
            </div>
        );
    }
});

export default React.createClass({
    displayName: 'copyCardSettingsOptions',

    propTypes: {
        options: T.instanceOf(Immutable.Map).isRequired,
        enabledOptionIds: T.instanceOf(Immutable.Set).isRequired,
        onEnabledChanged: T.func.isRequired
    },

    _onOptionEnabledChanged(optionId, newIsEnabled) {
        const {enabledOptionIds, onEnabledChanged} = this.props;
        const newEnabledIds = newIsEnabled ?
            enabledOptionIds.add(optionId) :
            enabledOptionIds.delete(optionId);
        onEnabledChanged(newEnabledIds);
    },

    render() {
        const {options, enabledOptionIds} = this.props;
        const optionViews = options
            .map((option, optionId) => {
                const isEnabled = enabledOptionIds.has(optionId);
                return <CopyOption
                    key={optionId}
                    optionId={optionId}
                    isEnabled={isEnabled}
                    name={option.name}
                    onEnabledChanged={this._onOptionEnabledChanged} />;
            })
            .toList();

        return (
            <div>
                {optionViews}
            </div>
        );
    }
});