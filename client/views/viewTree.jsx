import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'

const ViewItem = React.createClass({
    _setAsCurrent() {
        const {model, setViewAsCurrent} = this.props;
        setViewAsCurrent(model.key);
    },

    render() {
        const {model, isCurrent} = this.props;
        const itemClassName = classNames({
            'view-item': true,
            'view-item--selected': isCurrent
        });

        return (
            <div
                className={itemClassName}
                onClick={this._setAsCurrent}>
                <div>{model.name}</div>
            </div>
        );
    }
});

const ViewGroup = React.createClass({
    render() {
        const {model, currentViewId, setViewAsCurrent} = this.props;

        const viewItems = model.children.map(c =>
            <ViewItem
                key={c.key}
                model={c}
                isCurrent={currentViewId === c.key}
                setViewAsCurrent={setViewAsCurrent} />);

        return (
            <div>
                <div>{model.name}</div>
                <div>
                    {viewItems}
                </div>
            </div>
        )
    }
});

export default React.createClass({
    getInitialState() {
        return {
            currentViewId: null
        };
    },

    _setViewAsCurrent(viewId) {
        this.setState({currentViewId: viewId});
    },

    render() {
        const {currentViewId} = this.state;
        const {model} = this.props;
        const viewGroups = model.groupModels.map(m =>
            <ViewGroup
                key={m.key}
                model={m}
                currentViewId={currentViewId}
                setViewAsCurrent={this._setViewAsCurrent}/>
        );

        return (
            <div>
                {viewGroups}
            </div>
        );
    }
})