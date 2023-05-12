import { Table } from 'antd';
import { getAllOrders} from '../../api/requests';
import { useEffect, useState } from "react";
import moment from 'moment';
const data = [];

const columns = [
    {
      title: 'Customer Id',
      dataIndex: 'customerId',
      sorter:(a,b)=>{
        if(a.customerId<b.customerId){
            return 1;
        }
        if(a.customerId>b.customerId){
            return -1;
        }
        return 0;
      }
    },
    {
      title: 'Freight',
      dataIndex: 'freight',
      sorter: (a, b) => a.freight - b.freight,
    },
    {
        title: 'Address',
        render: (text, record) => `${record.shipAddress.country}, ${record.shipAddress.city}`,
    },
    {
       title:"Order  Date",
       dataIndex:"orderDate",
       render: (text) => moment(text).format('MMMM Do YY'),
       sorter: (a, b) =>new Date(a.orderDate)-new Date(b.orderDate),
    },
    {
        title: 'Required Date',
        dataIndex: 'requiredDate',
        render: (text) => moment(text).format('MMMM Do YY'),
    },
    {
        title: 'Shipped Date',
        dataIndex: 'shippedDate',
        render: (text) => moment(text).format('MMMM Do YY'),
    },
];

const Orders = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(data);
  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };




  useEffect(() => {
    getAllOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [setOrders, setLoading]);
  const hasSelected = selectedRowKeys.length > 0;
  const rowClassName = (record)=>{
    const { requiredDate, shippedDate } = record;
    if(moment(requiredDate)<moment(shippedDate)){
      return 'late-order';//css-de bu klasi cagirmisam
    }
    else{
      return '';
    }
  }

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={orders} rowKey="id" rowClassName={rowClassName}/>
    </div>
  );
};
export default Orders;
