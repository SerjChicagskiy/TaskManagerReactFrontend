import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../CSS/TaskManager.css';
import '../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import powerStandby from '@iconify-icons/oi/power-standby';
import peopleIcon from '@iconify-icons/oi/people';
import history from '../creators/creatorsHisrory';


class TaskManagerStore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            priorityType: [1, 2, 3]
        }
    }

    onCellEdit = (row, fieldName, value) => {

        const obj = {
            title: row.title,
            description: row.description,
            priorityId: row.priorityId,
            dateTime: row.dateTime,
            isArhive: row.isArhive,
            isDone: row.isDone
        }
        obj[fieldName] = value;

        fetch(`https://localhost:5001/api/task/${row.taskId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                title: obj.title,
                description: obj.description,
                priorityId: obj.priorityId,
                dateTime: obj.dateTime,
                isDone: obj.isDone,
                isArhive: obj.isArhive
            })
        }).then(resp => resp.json())
            .then(dataResp => {
                if (dataResp.message) {
                    console.log(dataResp.message)
                }
                else {
                    const { data } = this.state;
                    let rowIdx
                    const targetRow = data.find((task, i) => {
                        if (task.taskId === row.taskId) {
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
        fetch(`https://localhost:5001/api/task`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                title: row.title,
                description: row.description,
                priorityId: row.priorityId,
                dateTime: row.dateTime,
                isDone: row.isDone,
                isArhive: row.isArhive
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
            fetch(`https://localhost:5001/api/task/${row[count]}`, {

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
                        var res = thisState.state.data.filter((task) => {
                            return task.taskId !== row[count]
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
        fetch("https://localhost:5001/api/task", {
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
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <div style={{visibility:localStorage.role==="Admin"?"visible":"collapse "}}>
                            <Link id="btnNav" to="/users" className="btn btn-link text-danger rounded-circle" style={{border:"1px solid red"}}>
                            <Icon icon={peopleIcon} /><br/>Users</Link>
                        </div>
                        </div>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <ul style={{listStyleType:"none", margin:0 }}>
                            <li className="nav-item active">
                                <button id="btnNav" className="btn btn-link text-danger rounded-circle" onClick={this.logOut} style={{border:"1px solid red"}}><Icon icon={powerStandby} flip="horizontal" /><br/>LogOut</button>
                            </li>
                        </ul>
                    </nav>
                    <hr style={{backgroundColor:"white"}}/>
                    <TaskManager
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

class TaskManager extends React.Component {
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

    customPriorityField = (column, attr, editorClass, ignoreEditable) => {
        return (
            <select className={`${editorClass}`} {...attr}>
                <option key='1' value='1'>Не важное</option>
                <option key='2' value='2' selected>Важное</option>
                <option key='3' value='3'>Очень важное</option>
            </select>

        )
    }

    priorityFormatter(cell, row) {
        let pri
        switch (cell) {
            case 1:
                pri = 'Не важное'
                break;
            case 2:
                pri = 'Важное'
                break;
            case 3:
                pri = 'Очень важное'
                break;
            default:
                break;
        }
        return pri
    }
    getToday(){
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
        return `${yyyy}-${mm}-${dd}`
    }
    customDateField = (column, attr, editorClass, ignoreEditable) => {
        let today = this.getToday()
        return (
            <input className={`${editorClass}`} {...attr}
                name="birthday"
                type="date"
                min={today}></input>
        );
    }

    isDoneAndIsArhivFormatter(cell, row) {
        let el = cell === true ? 'Yes' : 'No'
        return el
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
                }}
            >
                <TableHeaderColumn dataField='taskId'  editable={ false } isKey={true}>Task ID</TableHeaderColumn>
                <TableHeaderColumn dataField='title' dataSort>Title</TableHeaderColumn>
                <TableHeaderColumn dataField='description' dataSort>Description</TableHeaderColumn>
                <TableHeaderColumn dataField='dateTime' editable={{ type: 'datetime'}} customInsertEditor={{ getElement: this.customDateField}} dataSort>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='priorityId' editable={{ type: 'select', options: { values: this.props.priorityType } }} dataFormat={this.priorityFormatter} dataSort>Priority</TableHeaderColumn>
                <TableHeaderColumn dataField='isDone' editable={{ type: 'checkbox' }} dataFormat={this.isDoneAndIsArhivFormatter} dataSort>Is done</TableHeaderColumn>
                <TableHeaderColumn dataField='isArhive' editable={{ type: 'checkbox' }} dataFormat={this.isDoneAndIsArhivFormatter} dataSort>Is arhiv</TableHeaderColumn>
            </BootstrapTable>
        )
    }
}
export default TaskManagerStore