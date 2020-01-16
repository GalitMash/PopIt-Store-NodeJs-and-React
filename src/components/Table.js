import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// Table for the admin screen
export default class Table extends React.Component {
    render() {
        return (
            <div>
                <BootstrapTable data={this.props.data} striped hover condensed>
                    <TableHeaderColumn isKey dataField='name'>User</TableHeaderColumn>
                    <TableHeaderColumn dataField='date'>Date and Time</TableHeaderColumn>
                    <TableHeaderColumn dataField='activity'>Activity</TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }
}
