import React from 'react';
import Table from './Table'
import {getUserLogsArray} from '../repository';
import { isAdmin } from '../repository';
import TextInput from "./TextInput";

// A screen using the Table component to display the user's activity. Only the admin user can access it.
export default class AdminScreen extends React.Component {
    _isMounted = false; // Class field that keeps track of whether this component is mounted or not

    constructor(props) {
        super(props);
        this.state = {
            initialUserLogs: [], // Full user activity list
            userLogs: [] // Filtered user activity list (after search)
        };
    }

    componentWillMount() {
        this._isMounted = true;
        getUserLogsArray().then((userLogs) => {
            // Preventing a state update when the component is unmounted (when redirecting to /login)
            const userLogsArray = userLogs;
            if (userLogsArray && this._isMounted) {
                // Initializing both states as the full user activity list received using a GET request
                this.setState({initialUserLogs: userLogsArray});
                this.setState({userLogs: userLogsArray});
            }})
            .catch(err => alert("Sorry, an error has occurred: " + err.message));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    // Filtering the list when using the search
    filterList = (event) => {
        let updatedList = this.state.initialUserLogs;
        updatedList = updatedList.filter((userLog) => {
            return userLog.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        });
        this.setState({userLogs: updatedList});
    };

    render() {
        const admin = isAdmin();
        return (
            <div>
            {admin ? (<React.Fragment>
                    <div className="container">
                        <h3>Admin Screen</h3>
                        <form>
                            <TextInput placeholder="Search" onChange={this.filterList} />
                        </form>
                        <Table data={this.state.userLogs}/>
                    </div>
                </React.Fragment>) :
                (<div className="container">
                        <h3 className="text-warning">You don't have permissions to view this page.</h3>
                </div>)}
            </div>
        );
    }
}
