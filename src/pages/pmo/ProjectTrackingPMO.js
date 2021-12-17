import React, { useState, useEffect } from "react";
import { Space, Button, Table, Tag, Tooltip } from "antd";
import { EditOutlined } from '@ant-design/icons';

import { database } from '../../authConfig/firebase';

export default function ProjectTrackingPMO(){
  const [dataProject, setDataProject] = useState()

  //Data Project
  useEffect(() =>{
    let isSubscribed = true
    if (isSubscribed) {
      database.projects.where('projectPlanStatus', '==', 'Approved').onSnapshot(snapshot => {
          var data = snapshot.docs.map(database.formatDoc)
          setDataProject(data)
      })
    }
    return () => isSubscribed = false
  },[])

  const columns= [
    {
      title: 'Project Code',
      dataIndex: 'projectCode',
      width: '100px',
      fixed: 'left'
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      width: '100px',
      fixed: 'left'
    },
    {
      title: 'Contract Number',
      dataIndex: 'contractNumber',
      width: '100px'
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      width: '100px'
    },
    {
      title: 'Project Start',
      dataIndex: 'projectStart',
      width: '100px'
    },
    {
      title: 'Project End',
      dataIndex: 'projectEnd',
      width: '100px'
    },
    {
      title: 'Project Manager',
      dataIndex: 'projectManager',
      width: '100px'
    },
    {
      title: 'Project Plan Status',
      dataIndex: 'projectPlanStatus',
      width: '100px',
      render: tags => (
        <>
          {new Array(tags).map(tag => {
            let color
            if (tag === 'Waiting for Submit') {
              color = 'red';
            } else if (tag === 'Waiting for Review') {
              // color = ''
            } else if (tag === 'Approved') {
              color = 'blue'
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'Project Status',
      dataIndex: 'projectStatus',
      width: '100px',
      render: tags => (
        <>
          {new Array(tags).map(tag => {
            let color
            if (tag === 'In Progress') {
              color = '';
            } else if (tag === 'Not Started') {
              color = 'red'
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      width: '100px'
    },
    {
      title: 'PO Year',
      dataIndex: 'poYear',
      width: '100px'
    },
    {
      title: 'Methodology',
      dataIndex: 'methodology',
      width: '105px'
    },
    {
      title: 'Resource Plan',
      dataIndex: 'resourcePlan',
      width: '100px'
    },
    {
      title: 'Resource Actual',
      dataIndex: 'resourceActual',
      width: '100px'
    },
    {
      title: 'Resource Status',
      dataIndex: 'resourceStatus',
      width: '100px',
      render: tags => (
        <>
          {new Array(tags).map(tag => {
            let color
            if (tag === 'In Progress') {
              color = '';
            } else if (tag === 'Not Started') {
              color = 'red'
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: 'PMO Role',
      dataIndex: 'pmoRole',
      width: '100px',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      width: '100px',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: '100px',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      width: '100px',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      width: '100px',
    },
    {
      title: 'Risk',
      dataIndex: 'risk',
      width: '100px',
    },
    {
      title: 'Term 1 Deadline',
      dataIndex: 'term1Deadline',
      width: '100px',
    },
    {
      title: 'Term 1 Actual',
      dataIndex: 'term1Actual',
      width: '100px',
    },
    {
      title: 'Term 1 Status',
      dataIndex: 'term1Status',
      width: '100px',
    },
    {
      title: 'Term 2 Deadline',
      dataIndex: 'term2Deadline',
      width: '100px',
    },
    {
      title: 'Term 2 Actual',
      dataIndex: 'term2Actual',
      width: '100px',
    },
    {
      title: 'Term 2 Status',
      dataIndex: 'term2Status',
      width: '100px',
    },
    {
      title: 'Term 3 Deadline',
      dataIndex: 'term3Deadline',
      width: '100px',
    },
    {
      title: 'Term 3 Actual',
      dataIndex: 'term3Actual',
      width: '100px',
    },
    {
      title: 'Term 3 Status',
      dataIndex: 'term3Status',
      width: '100px',
    },
    {
      title: 'Term 4 Deadline',
      dataIndex: 'term4Deadline',
      width: '100px',
    },
    {
      title: 'Term 4 Actual',
      dataIndex: 'term4Actual',
      width: '100px',
    },
    {
      title: 'Term 4 Status',
      dataIndex: 'term4Status',
      width: '100px',
    },
    {
      title: 'Term 5 Deadline',
      dataIndex: 'term5Deadline',
      width: '100px',
    },
    {
      title: 'Term 5 Actual',
      dataIndex: 'term5Actual',
      width: '100px',
    },
    {
      title: 'Term 5 Status',
      dataIndex: 'term5Status',
      width: '100px',
    },
    {
      title: 'Project End Actual',
      dataIndex: 'projectEndActual',
      width: '100px',
    },
    {
      title: 'Project Progress',
      dataIndex: 'projectProgress',
      width: '100px',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      fixed: 'right',
      width: '70px',
      render: (record) => (
        <Space>
          <Tooltip title="Edit">
                <Button type="primary" shape="circle" icon={<EditOutlined />} />
              </Tooltip>
        </Space>
      ),
    },
  ]

    return(
      <>
        <Table
          columns={columns}
          dataSource={dataProject}
          size="small" 
          bordered 
          scroll={{y: 800 }}
        />
      </>
    )
}