import { genChartByAiAsyncUsingPOST, genChartByAiUsingPOST, listChartByPageUsingPOST } from '@/services/zybi/chartController';
import {
  LockOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Tabs, message, Form, Upload, Button, Space, Input, Select, Row, Col, Card, Divider, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useForm } from 'antd/lib/form/Form';

/**
 * add chart page (async)
 */
const AddChartAsync: React.FC = () => {
    const [form] = useForm()
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

        const params = {
            ...values,
            file: undefined
        }
        try {
            const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj) 
            if(!res){
                message.error('error: response fetch failed')
            }
            console.log(res)
            if(!res.data){
                message.error('error: data doesn\'t exist')
            } else {
                message.success('request successful, find it in "my chart" page later')
                form.resetFields()
            }
        } catch (e: any){
            message.error('generation failed, ' + e.message)
        }
        setSubmitting(false)
    };

    return (
    <div className="add-chart-async">
        <Card title = "Smart analysis">
        <Form
            form={form}
            name="addChart"
            labelAlign='left'
            labelCol={{span:4}}
            wrapperCol={{span:16}}
            onFinish={onFinish}
            initialValues={{}}
        >

            <Form.Item name="goal" label="objective" rules={[{ required: true, message: 'Please enter an objective' }]}>
            <TextArea placeholder='enter your data analyzing objective, e.g. "analyze the trend of change in user number"'/>
            </Form.Item>

            <Form.Item name="name" label="graph name">
            <Input placeholder='enter the name of your graph'/>
            </Form.Item>

            <Form.Item
            name="chartType"
            label="chart type"
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
    </div>
    );
};
export default AddChartAsync;
