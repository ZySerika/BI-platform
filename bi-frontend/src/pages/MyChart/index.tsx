import { genChartByAiUsingPOST, listChartByPageUsingPOST, listMyChartByPageUsingPOST } from '@/services/zybi/chartController';
import { Alert, Tabs, message, Form, Upload, Button, Space, Input, Select, Row, Col, Card, Divider, Spin, List, Avatar, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getInitialState } from '@/app';
import { useModel } from '@umijs/max';
import Search from 'antd/es/input/Search';
import { values } from 'lodash';

/**
 * my charts page
 */
const MyChartPage: React.FC = () => {

    const initSearchParams = {
        current: 1,
        pageSize: 12,
        sortField: 'createTime',
        sortOrder: 'desc',
    }
    const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})
    const [chartList, setChartList] = useState<API.Chart[]>()
    const [total, setTotal] = useState<number>(0)
    const {initialState} = useModel('@@initialState')
    const {currentUser} = initialState ?? {}
    const [loading, setLoading] = useState<boolean>(true)

    const loadData = async () => {
        setLoading(true)
        try{
            const res = await listMyChartByPageUsingPOST(searchParams) 
            if(res.data){
                setChartList(res.data.records ?? [])
                setTotal(res.data.total ?? 0)
                // Erase titles in chart
                if(res.data.records){
                    res.data.records?.forEach(data => {
                        if(data.status==='succeed'){
                            const chartOption = JSON.parse(data.genChart ?? '{}')
                            chartOption.title = undefined
                            data.genChart = JSON.stringify(chartOption)
                        }

                    })
                }

            } else {
                message.error('fetch my charts data failed')
            }
        } catch (e: any) {
            message.error('fetch my charts failed, ' + e.message)
        }
        setLoading(false)
     
    }

    useEffect( () => {
        loadData()
    }, [searchParams])


    return (
    <div className="my-chart-page">
        <div>
            <Search placeholder="please enter chart name" enterButton loading={loading} onSearch={(value) =>{
                setSearchParams( {
                    ...initSearchParams,
                    name: value,
                })
            }}/>
        </div>
        <div className='margin-16' />
        <List
            grid={{gutter:16, 
                xs: 1,
                sm: 1,
                md: 1,
                lg: 2,
                xl: 2,
                xxl: 2,
            }}
            pagination={{
                onChange: (page, pageSize) => {
                    setSearchParams({
                        ...searchParams,
                        current: page,
                        pageSize,
                    })
                },
                current: searchParams.current,
                pageSize: searchParams.pageSize,
                total: total
            }}
            loading = {loading}
            dataSource={chartList}
            renderItem={(item) => (
            <List.Item
                key={item.id}
            >
                <Card style={{width:'100%'}}>
                    <List.Item.Meta
                        avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                        title={item.name}
                        description={item.chartType ? ('chart type: ' + item.chartType) : undefined}
                    />
                    <>
                    {
                        item.status === 'wait' && <>
                            <Result 
                                status="warning"
                                title="queueing"
                                subTitle={item.execMessage ?? 'current generation queue is busy, please wait patiently'}
                            />
                        </>
                    }
                    {
                        item.status === 'succeed' && <>                        
                        <div style={{marginBottom: 16}}/>
                            <p>{'Objective: ' + item.goal}</p>
                        <div style={{marginBottom: 16}}/>
                        <ReactECharts option={item.genChart && JSON.parse(item.genChart)} /> 
                        </>
                    }
                    {
                        item.status === 'failed' && <>
                            <Result 
                                status="error"
                                title="Generation failed"
                                subTitle={item.execMessage ?? 'Something went wrong during generation.'}
                            />
                        </>
                    }
                    {
                        item.status === 'running' && <>
                            <Result 
                                status="info"
                                title="Chart generating"
                                subTitle={item.execMessage ?? 'Handling request, please wait...'}
                            />
                        </>
                    }

                    </>

                </Card>
               
            </List.Item>
            )}
        />
    </div>
    );
};
export default MyChartPage;
