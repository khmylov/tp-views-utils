import React from 'react';
import Immutable from 'immutable';

import ViewList from './viewList.jsx';

const T = React.PropTypes;

export default React.createClass({
    displayName: 'viewSelectorGroupList',

    propTypes: {
        groups: T.instanceOf(Immutable.Iterable).isRequired,
        currentViewId: T.string,
        setViewAsCurrent: T.func.isRequired
    },

    render() {
        const {currentViewId, groups, setViewAsCurrent} = this.props;

        const groupElements = groups.map(g =>
            <ViewList
                key={g.key}
                groupId={g.key}
                name={g.name}
                currentViewId={currentViewId}
                setViewAsCurrent={setViewAsCurrent}
                views={g.children} />
        );

        return (
            <div>
                {groupElements}
            </div>
        );
    }
})