import Immutable from 'immutable';
import _ from 'lodash';
import ViewList from './viewList.jsx';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewSelectorGroupList',

    propTypes: {
        groups: T.instanceOf(Immutable.Iterable).isRequired,
        currentViewId: T.string,
        setViewAsCurrent: T.func.isRequired
    },

    getInitialState() {
        return {
            filterText: ''
        };
    },

    _onFilterTextChanged(e) {
        this.setState({filterText: e.target.value.toLowerCase()});
    },

    render() {
        const {currentViewId, groups, setViewAsCurrent} = this.props;
        const {filterText} = this.state;

        const groupElements = groups.map(g => {
            const views = g.children;
            const viewsToRender = filterText && filterText.length ?
                views.filter(({name}) => name && _.includes(name.toLowerCase(), filterText)) :
                views;

            return (
                <ViewList
                    key={g.key}
                    groupId={g.key}
                    name={g.name}
                    currentViewId={currentViewId}
                    setViewAsCurrent={setViewAsCurrent}
                    views={viewsToRender} />
            );
        });

        return (
            <div className="copyCardSettings__source-tree">
                <p className="form-inline">
                    <input
                        className="copyCardSettings__source-tree__filter form-control input-sm"
                        type="text"
                        placeholder="Filter by name..."
                        value={filterText}
                        onChange={this._onFilterTextChanged}/>
                </p>
                {groupElements}
            </div>
        );
    }
})