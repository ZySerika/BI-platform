import { genChartByAiUsingPOST, listChartByPageUsingPOST } from '@/services/zybi/chartController';
import {
  LockOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Tabs, message, Form, Upload, Button, Space, Input, Select, Row, Col, Card, Divider, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * add chart page
 */
const AddChart: React.FC = () => {

    const [chart, setChart] = useState<API.BiResponse>()
    const [option, setOption] = useState<any>()
    const [submitting, setSubmitting] = useState<boolean>(false)

    useEffect(() => {
    listChartByPageUsingPOST({}).then(res => {
        console.error('res', res)
    });
    });

    /**
     * submit
     * @param values 
     */
    const onFinish = async (values: any) => {

        // Prevent multiple submits
        if(submitting){
            return
        }
        setSubmitting(true)
        setChart(undefined)
        setOption(undefined)

        const params = {
            ...values,
            file: undefined
        }
        try {
            const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj) 
            if(!res){
                message.error('error: response fetch failed')
            }
            console.log(res)
            if(!res.data){
                message.error('error: data doesn\'t exist')
            } else {
                message.success('analysis success')
                const chartOption = JSON.parse(res.data.genChart ?? '')
                if(!chartOption){
                    throw new Error('failed to parse chart code')
                } else {
                    setChart(res.data)
                    setOption(chartOption)
                }
                setChart(res.data)
            }
        } catch (e: any){
            message.error('generation failed, ' + e.message)
        }
        setSubmitting(false)
    };

    return (
    <div className="add-chart">
        <Row gutter={24}>
            <Col span={12}>
                <Card title = "Smart analysis">
                    <Form
                        name="addChart"
                        labelAlign='left'
                        labelCol={{span:4}}
                        wrapperCol={{span:16}}
                        onFinish={onFinish}
                        initialValues={{}}
                    >

                        <Form.Item name="goal" label="analysis goal" rules={[{ required: true, message: 'Please enter a goal' }]}>
                        <TextArea placeholder='enter your data analyzing goal, e.g. "analyze the trend of change in user number"'/>
                        </Form.Item>

                        <Form.Item name="name" label="graph name">
                        <Input placeholder='enter the name of your graph'/>
                        </Form.Item>

                        <Form.Item
                        name="chartType"
                        label="chart type"
                        rules={[{ required: true, message: 'Please select a chart type!' }]}
                        >
                        <Select options={[
                            { value: 'Bar chart', label: 'Bar chart'},
                            { value: 'Pie chart', label: 'Pie chart'},
                            { value: 'Line chart', label: 'Line chart'},
                            { value: 'Radar chart', label: 'Radar chart'},
                            { value: 'Stacked bar chart', label: 'Stacked bar chart'}
                        ]}>
                        </Select>
                        </Form.Item>



                        <Form.Item
                        name="file"
                        label="raw data"
                        >
                        <Upload name="file">
                            <Button icon={<UploadOutlined />}>Click to upload CSV file</Button>
                        </Upload>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                            Generate
                            </Button>
                            <Button htmlType="reset">Reset</Button>
                        </Space>
                        </Form.Item>
                    </Form>
                </Card>
            
            </Col>
            <Col span={12}>
                <Card title = "Conclusion">
                    {chart?.genResult ?? <div>Please enter your prompt on the left.</div>}
                    <Spin spinning={submitting}/>
                </Card>
                <Divider/>
                <Card title = "Data visualization">
                    {
                        option ? <ReactECharts option={option} /> : <div>Please enter your prompt on the left.</div>
                    }
                    <Spin spinning={submitting}/>
                </Card>
                
            </Col>
        </Row>
    </div>
    );
};
export default AddChart;
