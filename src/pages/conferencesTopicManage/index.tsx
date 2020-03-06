import { Row, Col, List, Button, message, Card, Empty } from 'antd';
import { PlusOutlined, SettingOutlined, EditOutlined, EllipsisOutlined, LinkOutlined, CodeSandboxOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {CurrentUser} from '@/models/user'
import { connect } from 'dva';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ALL_CONFERENCE, GET_ALL_CONFERENCES_TOPIC, ADD_CONFERENCES_TOPIC, UPDATE_CONFERENCES_TOPIC,ITopic } from '@/gql/conference'
import CreateForm from '../ListTableList/components/CreateForm';
import { ConnectProps, ConnectState, UserModelState } from '@/models/connect';
import { TopicListItem } from './data.d'
import styles from './style.less';

export interface ITopicData {
  conferencesTopic?: {
    edges: any[]
  }
}


const { Meta } = Card;

const SectionPage: React.FC<{}> = () => {
  return <Card>
    <Row gutter={12} >
      <Col span={24}>
        <LeftPgaeConnect />
      </Col>
    </Row>
  </Card>
}



function LeftPgae({user}:{user:CurrentUser}) {
  const { loading, error, data = {}, refetch } = useQuery<ITopicData>(GET_ALL_CONFERENCES_TOPIC());
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [updateDate, handleUpdateDate] = useState<TopicListItem | undefined>(undefined);
  const [update] = useMutation(UPDATE_CONFERENCES_TOPIC, {
    onCompleted: refetch
  });
  const columns: ProColumns<TopicListItem>[] = [
    {
      title: '主题名',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '主题名为必填项',
        },
      ],
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
  ]
  const { conferencesTopic: { edges = [] } = {} }= data


  async function handle_update(value: TopicListItem) {
    if (!updateDate) {
      message.error('添加失败请重试！');
      return false
    }
    update({ variables: { ...value, id: updateDate.id }, })
    return true
  }

  return <div>
    <CreateForm title_v={'修改主题'} onCancel={() => handleUpdateModalVisible(false)} modalVisible={updateModalVisible}>
      {
        updateModalVisible ? <ProTable<TopicListItem, TopicListItem>
          onSubmit={async value => {
            const success = await handle_update(value);
            if (success) {
              handleUpdateModalVisible(false);
              // refetch()
            }
          }}
          form={{
            initialValues: updateDate
          }}
          rowKey="id"
          type="form"
          columns={columns}
          rowSelection={{}}
        /> : null
      }

    </CreateForm>

    {
      !edges.length ? <Empty> <AddItem {...{ refetch }} /></Empty> : <div style={{ overflow: 'hidden' }}>
        主题列表
      <div style={{ float: 'right' }}>
          <AddItem {...{ refetch }} />
        </div>
      </div>
    }
    {
      edges.map(item => item.node).sort((item1:ITopic,item2:ITopic)=>{
        return new Date(item2.createTime).getTime()-new Date(item1.createTime).getTime()

      }).map((item:ITopic) => {

        return <Card
          key={item.id}
          style={{ marginTop: 16, border: '1px solid #eee' }}
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" onClick={() => {
              handleUpdateDate(item)
              handleUpdateModalVisible(true);
            }} />,
            <EllipsisOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={
              <CodeSandboxOutlined style={{ fontSize: 36, marginTop: 12, color: '#45aed6' }} />
            }
            title={<span style={{ fontSize: 28 }}>{item.name}</span>}
            description={<span>
              <div className={styles.create_time}>--{`${item.creator?item.creator.username+', ':''}`}{new Date(item.createTime).toLocaleString() }</div>
              <div>{item.description}</div>

            </span>
            }
          />
        </Card>
      })
    }

    {/* <List<TopicListItem>
      loading={loading}
      header={<AddItem {...{ refetch }}></AddItem>}
      split
      bordered
      dataSource={edges.map(item => item.node)}
      renderItem={item => <List.Item actions={[
        <span onClick={() => {
          handleUpdateDate(item)
          handleUpdateModalVisible(true);
          // setStepFormValues(record);
        }}>
          修改
        </span>
      ]}>
        <List.Item.Meta title={item.name} description={item.description}>
        </List.Item.Meta>

      </List.Item>
      }
    /> */}
  </div>
}


const LeftPgaeConnect=connect(({ user }:ConnectState) => ({
  user:user.currentUser
}))(LeftPgae)

const AddItem: React.FC<{ refetch: (data: any) => any }> = ({ refetch }) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [addTodo, { data }] = useMutation(ADD_CONFERENCES_TOPIC, {
    onCompleted: refetch
  });
  const columns: ProColumns<TopicListItem>[] = [
    {
      title: '主题名',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '主题名为必填项',
        },
      ],
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
  ]

  async function handleAdd(value: TopicListItem) {
    addTodo({ variables: value })
    return true
  }

  return <>

    <Button type="primary" onClick={() => handleModalVisible(true)}>
      <PlusOutlined />新建
        </Button>
    <CreateForm title_v={'新建主题'} onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
      <ProTable<TopicListItem, TopicListItem>
        onSubmit={async value => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            // refetch()
          }
        }}
        rowKey="id"
        type="form"
        columns={columns}
        rowSelection={{}}
      />
    </CreateForm>
  </>
}




export default SectionPage;
