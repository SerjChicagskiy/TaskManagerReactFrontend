import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import '../CSS/TaskManager.css';

class TaskManagerStore extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.task
        }
    }
  
    onCellEdit = (row, fieldName, value) => {
        const { data } = this.state;
        let rowIdx
        const targetRow = data.find((prod, i) => {
            if (prod.id === row.id) {
                rowIdx = i
                return true
            }
            return false
        });
        if (targetRow) {
            targetRow[fieldName] = value
            data[rowIdx] = targetRow
            this.setState({ data })
        }
    }
  
    onAddRow = (row) => {
        this.task.push(row)
        this.setState({
            data: []
        })
    }
  
    onDeleteRow = (row) => {
        var res = this.state.data.filter((task) => {
        return task.taskId !== row[0]
        });
  
        this.setState({
            data: res
        })
    }

    componentDidMount(){
        fetch("https://localhost:5001/api/task", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Authorization': `bearer ${localStorage.token}`
            }
        })
            .then(resp => resp.json())
                .then(res => this.setState({data:res}))
    }
  
    render() {
        if(this.state.data!=null ){
        return(
            <div className="container" id="tableTask">
                <TaskManager
                    onCellEdit={ this.onCellEdit }
                    onAddRow={ this.onAddRow }
                    onDeleteRow={ this.onDeleteRow }
                    { ...this.state } />
            </div>
        )}
        else{
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
  
    render() {
        const cellEditProp = {
            mode: 'click'
        };
        const selectRow = {
            mode: 'checkbox',
            cliclToSelct: true
        };
        return (
        <BootstrapTable data={this.props.data }
                        selectRow={ selectRow }
                        remote={ this.remote }
                        insertRow deleteRow search pagination
                        cellEdit={ cellEditProp }
                        options={{
                            onCellEdit: this.props.onCellEdit,
                            onDeleteRow: this.props.onDeleteRow,
                            onAddRow: this.props.onAddRow
                        }}
                        >
            <TableHeaderColumn dataField='taskId' isKey={ true }>Task ID</TableHeaderColumn>
            <TableHeaderColumn dataField='title'>Title</TableHeaderColumn>
            <TableHeaderColumn dataField='description' dataSort>Description</TableHeaderColumn>
        </BootstrapTable>
        )
    }
}
export default TaskManagerStore