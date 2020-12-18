import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../CSS/TaskManager.css';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import powerStandby from '@iconify-icons/oi/power-standby';
import listIcon from '@iconify-icons/oi/list';
import $ from "jquery";
import history from '../creators/creatorsHisrory';


class UsersStore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    onCellEdit = (row, fieldName, value) => {
        console.log(row)
        const obj = {
            name: row.name,
            lastname: row.lastname,
            email: row.email,
            birthday: row.birthday,
            phone: row.phone,
            login: row.login,
            photopath: ""
        }
        obj[fieldName] = value;

        fetch(`https://localhost:5001/api/user/${row.id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                name: obj.name,
                lastname: obj.lastname,
                email: obj.email,
                birthday: obj.birthday,
                phone: obj.phone,
                photopath: "",
                login: obj.login
            })
        }).then(resp => resp.json())
            .then(dataResp => {
                if (dataResp.message) {
                    console.log(dataResp.message)
                }
                else {
                    const { data } = this.state;
                    let rowIdx
                    const targetRow = data.find((user, i) => {
                        if (user.id === row.id) {
                            rowIdx = i
                            return true
                        }
                        return false
                    });
                    if (targetRow) {
                        targetRow[fieldName] = value
                        data[rowIdx] = dataResp
                        this.setState({ data })
                    }

                }
            })

    }

    onAddRow = (row) => {
        console.log(row)
        fetch("https://localhost:5001/api/user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                name: row.name,
                lastname: row.lastname,
                email: row.email,
                birthday: row.birthday,
                phone: row.phone,
                photopath: "",
                login: row.login,
                password: row.password
            })
        }).then(resp => resp.json())
            .then(dataResp => {
                if (dataResp.message) {
                    console.log(dataResp.message)
                }
                else {
                    this.state.data.push(dataResp)
                    this.setState({
                        data: this.state.data
                    })

                }
            })


    }

    onDeleteRow = (row) => {
        var count = 0
        function fetchNow(row, count, thisState) {
            fetch(`https://localhost:5001/api/user/${row[count]}`, {

                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Authorization': `bearer ${localStorage.token}`
                }
            }).then(resp => resp.json())
                .then(dataResp => {
                    if (dataResp.message) {
                        console.log(dataResp.message)
                    }
                    else {
                        var res = thisState.state.data.filter((user) => {
                            return user.id !== row[count]
                        });

                        thisState.setState({
                            data: res
                        })
                        count++
                        if (count < row.length)
                            fetchNow(row, count, thisState)

                    }
                })
        }
        fetchNow(row, count, this)
    }

    componentDidMount() {
        fetch("https://localhost:5001/api/user", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `bearer ${localStorage.token}`
            }
        })
            .then(resp => resp.json())
            .then(res => this.setState({ data: res }))
    }

    logOut(){
        localStorage.setItem("token","")
        history.push('/login')
    }

    render() {
        if (this.state.data != null) {
            return (
                <div className="container" id="tableTask">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-none">
                        <Link id="btnNav" to="/task"  className="btn btn-link text-danger rounded-circle" style={{border:"1px solid red"}}>
                        <Icon icon={listIcon} /><br/>Tasks</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo02">
                                <ul style={{listStyleType:"none", margin:0 }}>
                                    <li className="nav-item active">
                                        <button id="btnNav" className="btn btn-link text-danger rounded-circle" onClick={this.logOut} style={{border:"1px solid red"}}><Icon icon={powerStandby} flip="horizontal" /><br/>LogOut</button>
                                    </li>
                                </ul>
                        </div>
                    </nav>
                    <hr style={{backgroundColor:"white"}}/>
                    <Users
                        onCellEdit={this.onCellEdit}
                        onAddRow={this.onAddRow}
                        onDeleteRow={this.onDeleteRow}
                        {...this.state} />
                </div>
            )
        }
        else {
            return <div>KUKUKU</div>
        }
    }
}

class Users extends React.Component {
    constructor(props) {
        super(props);
    }

    remote(remoteObj) {
        // Only cell editing, insert and delete row will be handled by remote store
        remoteObj.cellEdit = true
        remoteObj.insertRow = true
        remoteObj.dropRow = true
        return remoteObj
    }


    userRolesFormatter(cell, row) {
        $( "option:disabled" ).css({
            color:'white',
            backgroundColor: "rgb(85, 84, 84)"
        })
        return  (<select style={{width:"100%",backgroundColor: "rgba(124, 124, 124, 0.712)", color:"snow"}} className='btn'>
                     <option selected hidden>Roles:</option>
                     {cell.map((role,index) => (
                        <option disabled >{index+1}){role['role']['name']}</option>
                        ))}
               </select>)
         
    }
    customDateField = (column, attr, editorClass, ignoreEditable) => {
        var today = new Date()
        var dd = today.getDate()
        var mm = today.getMonth() + 1
        var yyyy = today.getFullYear()
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = `${yyyy}-${mm}-${dd}`
        return (
            <input className={`${editorClass}`} {...attr}
                name="birthday"
                type="date"
                max={today}></input>
        );
    }

    render() {
        const cellEditProp = {
            mode: 'click'
        };
        const selectRow = {
            mode: 'checkbox',
            cliclToSelct: true
        };
        return (
            <BootstrapTable data={this.props.data}
                            version='4'
                            selectRow={selectRow}
                            remote={this.remote}
                            insertRow deleteRow search pagination
                            cellEdit={cellEditProp}
                            options={{
                                onCellEdit: this.props.onCellEdit,
                                onDeleteRow: this.props.onDeleteRow,
                                onAddRow: this.props.onAddRow
                }}>
                <TableHeaderColumn dataField='id' editable={ false } isKey={true}>Id</TableHeaderColumn>
                <TableHeaderColumn dataField='name' dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn dataField='lastname' dataSort>Lastname</TableHeaderColumn>
                <TableHeaderColumn dataField='email' dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn dataField='birthday' editable={{ type: 'datetime' }} customInsertEditor={{ getElement: this.customDateField }} dataSort>Birthday</TableHeaderColumn>
                <TableHeaderColumn dataField='phone' dataSort>Phone</TableHeaderColumn>
                <TableHeaderColumn dataField='login' dataSort>Login</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='userRoles'editable={ false }  dataFormat={this.userRolesFormatter} dataSort>UserRoles</TableHeaderColumn> */}
                <TableHeaderColumn dataField='password' hidden>Password</TableHeaderColumn>
            
            </BootstrapTable>
        )
    }
}
export default UsersStore