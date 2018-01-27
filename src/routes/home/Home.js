

import React, { PropTypes } from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  MenuItem,
  DropdownButton,
  Panel, PageHeader, ListGroup, ListGroupItem, Button,
} from 'react-bootstrap';


import s from './Home.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

import {
  Tooltip,
  XAxis, YAxis, Area,
  CartesianGrid, AreaChart, Bar, BarChart,
  ResponsiveContainer } from '../../vendor/recharts';

const title = 'NightScout Dashboard';


const data = [
      { name: 'Page A', uv: 4000, pv: 2400, amt: 2400, value: 600 },
      { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, value: 300 },
      { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, value: 500 },
      { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, value: 400 },
      { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, value: 200 },
      { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, value: 700 },
      { name: 'Page G', uv: 3490, pv: 4300, amt: 2100, value: 100 },
];

const dataTest = [
  { name: 'Johnny', username: 'jscott', svg: 300, date: 1 },
  { name: 'Johnny', username: 'jscott', svg: 400, date: 2 },
  { name: 'Johnny', username: 'jscott', svg: 200, date: 3 },
  { name: 'Johnny', username: 'jscott', svg: 200, date: 4 },
  { name: 'Johnny', username: 'jscott', svg: 250, date: 5 },
];

class Home extends React.Component {

  constructor(props) {
    super(props);
    // console.log(this);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get('https://f37yrxnctl.execute-api.eu-west-1.amazonaws.com/prod/patientdata?patientId=mattsdaughter')
    // axios.get('https://f37yrxnctl.execute-api.eu-west-1.amazonaws.com/prod/patientdata')
      .then(res => {
        console.log(res);
        const ptData = res.data.Items.slice(0, 20);
        // console.log(ptData);
        this.setState({ data: dataTest });
        console.log(this.state.data);
      })
      .catch(e => {
        console.log(e);
        // alert(e);
      });
  }

  renderPatientPanel({ name }) {
    return (
      <Panel
        header={<span>
          <i className="fa fa-bar-chart-o fa-fw" /> {name}
          <div className="pull-right">
            <DropdownButton title="Dropdown" bsSize="xs" pullRight id="dropdownButton1" >
              <MenuItem eventKey="1">Send Patient Text</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="2">Send Patient Email</MenuItem>
            </DropdownButton>
          </div>
        </span>}
      >
        <div className="row">
          <div className="col-lg-6">
            <ResponsiveContainer width="100%" aspect={2}>
              <AreaChart
                data={this.state.data}
                margin={{
                  top: 10, right: 30, left: 0, bottom: 0,
                }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Tooltip />
                <Area type="monotone" dataKey="svg" stackId="1" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="col-lg-6">
            <Donut data={data} color="#8884d8" innerRadius="70%" outerRadius="90%" />
          </div>
        </div>
      </Panel>
    );
  }

  // context.setTitle(title);
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <PageHeader>Dashboard</PageHeader>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 col-md-6">
            <StatWidget
              style="panel-primary"
              icon="fa fa-exclamation-triangle fa-5x"
              count="26"
              headerText="New Comments!"
              footerText="View Details"
              linkTo="/"
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <StatWidget
              style="panel-green"
              icon="fa fa-check fa-5x"
              count="12"
              headerText="New Tasks!"
              footerText="View Details"
              linkTo="/"
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <StatWidget
              style="panel-red"
              icon="fa fa-exclamation-circle fa-5x"
              count="13"
              headerText="Support Tickets!"
              footerText="View Details"
              linkTo="/"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div>
              {this.renderPatientPanel({ name: 'Johnny' })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  // news: PropTypes.arrayOf(PropTypes.shape({
  //   title: PropTypes.string.isRequired,
  //   link: PropTypes.string.isRequired,
  //   contentSnippet: PropTypes.string,
  // })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
