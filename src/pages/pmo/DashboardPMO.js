import React, {useState, useEffect} from 'react';
import { Table, Button } from 'antd';
import { Link } from "react-router-dom"

import { database } from '../../authConfig/firebase';

export default function DashboardPMO() {
  const [dataProject, setDataProject] = useState()
  //Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed) {
      database.projects.onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[])

    //Columns for table
    const columns = [
    {
      title: 'Code Project',
      dataIndex: 'codeProject',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
    },
    {
      title: 'Contract Number',
      dataIndex: 'contractNumber',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
    },
    {
      title: 'Project Status',
      dataIndex: 'projectStatus',
    },
    ]
    return(
    <>
      <Button type="primary"><Link to="/pmo/project"> Create Project </Link></Button>
      <Table columns={columns} dataSource={dataProject} size="middle"/>
    </>
    )
}