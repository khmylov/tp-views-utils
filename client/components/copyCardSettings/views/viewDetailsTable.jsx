import React from 'react';
import ViewInfo from '../models/viewInfo';

const T = React.PropTypes;

const DetailsTable = React.createClass({
    displayName: 'viewDetailsTable',
    propTypes: {
        itemType: T.string.isRequired,
        viewMode: T.string,
        cells: T.object,
        x: T.object,
        y: T.object
    },
    render() {
        const {itemType, viewMode, cells, x, y} = this.props;

        return (
            <table className="table table-bordered table-condensed">
                <thead>
                    <tr>
                        <th>View type</th>
                        <th>Cell types</th>
                        <th>X</th>
                        <th>Y</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{ViewInfo.formatViewType(itemType, viewMode)}</td>
                        <td>{ViewInfo.formatTypes(cells)}</td>
                        <td>{ViewInfo.formatTypes(x)}</td>
                        <td>{ViewInfo.formatTypes(y)}</td>
                    </tr>
                </tbody>
            </table>
        )
    }
});

export default DetailsTable;