import React, { PropTypes } from 'react';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  MenuItem,
  DropdownButton,
  Panel, PageHeader,
} from 'react-bootstrap';


import s from './Home.css';
import StatWidget from '../../components/Widget';
import Donut from '../../components/Donut';

import {
  Tooltip,
  XAxis, YAxis, Area,
  CartesianGrid, AreaChart,
  ResponsiveContainer } from '../../vendor/recharts';

// const title = 'NightScout Dashboard';

// const dataTest = [
//   {"patientId":"mattsdaughter",date:1, sgv:65/18.1,"device":"medtronic-600://6213-1032979","direction":"FortyFiveUp","_id":"5a6760f1314e23004915814f","dateString":"Tue Jan 23 16:20:02 GMT+00:00 2018","type":"sgv"},
//   // {"patientId":"mattsdaughter",date:2,sgv:135/18.1,"device":"medtronic-600://6213-1032979","direction":"FortyFiveUp","_id":"5a67622c314e230049160bc1","dateString":"Tue Jan 23 16:25:03 GMT+00:00 2018","type":"sgv"},
//   {"patientId":"mattsdaughter",date:3,sgv:137/18.1,"device":"medtronic-600://6213-1032979","direction":"FortyFiveUp","_id":"5a676345314e230049168557","dateString":"Tue Jan 23 16:30:03 GMT+00:00 2018","type":"sgv"},
//   {"patientId":"mattsdaughter",date:4,sgv:170/18.1,"device":"medtronic-600://6213-1032979","direction":"FortyFiveUp","_id":"5a67647b314e230049170c8a","dateString":"Tue Jan 23 16:35:02 GMT+00:00 2018","type":"sgv"}
// ]

const createMessage = (slope) => {
  if (slope > 0.005) {
    return {
      message: <span>Glucose trending <b>UP SEVERELY</b></span>,
      color: '#d9534f',
    };
  } else if (slope < -0.005) {
    return {
      message: <span>Glucose trending <b>DOWN SEVERELY</b></span>,
      color: '#d9534f',
    };
  } else if (slope > 0.001) {
    return {
      message: <span>Glucose trending <b>UP</b></span>,
      color: '#337ab7',
    };
  } else if (slope < -0.001) {
    return {
      message: <span>Glucose trending <b>DOWN</b></span>,
      color: '#337ab7',
    };
  }


  return {
    message: 'Doing great',
    backgroundColor: 'green',
    color: '#5cb85c',
  };
};

const createStats = (data) => {
  let total = 0;
  let above = 0;
  let below = 0;
  const min = 4;
  const max = 9;
  data.forEach((item) => {
    if (item.sgv > max) {
      above++;
    } else if (item.sgv < min) {
      below++;
    }
    total++;
  });

  // const result = {
  //   above,
  //   below,
  //   total,
  // };

  const result = [
    { name: 'Hyperglycemic', value: above, fill: 'orange' },
    { name: 'Normal', value: total - above - below, fill: 'green' },
    { name: 'Hypoglycemic', value: below, fill: 'red' },
  ];

  // console.log(result);
  // console.log(result.above / result.total);
  // console.log(result.below / result.total);

  return result;
};

const calcWarningHeaders = (slopesArray) => {
  let good = 0;
  let moderate = 0;
  let bad = 0;
  slopesArray.forEach((slope) => {
    const result = createMessage(slope);
    if (result.color === '#5cb85c') {
      good += 1;
    } else if (result.color === '#337ab7') {
      moderate += 1;
    } else if (result.color === '#d9534f') {
      bad += 1;
    }
  });

  console.log({ good, moderate, bad });

  return { good, moderate, bad };
};

class Home extends React.Component {

  constructor(props) {
    super(props);
    // console.log(this);

    const slopeMD = 0.002;
    const slopeJK = -0.005;
    const slopeTB = -0.0001;

    this.state = {
      summary: calcWarningHeaders([slopeMD, slopeJK, slopeTB]),

      dataMD: [],
      pieMD: [],
      slopeMD,

      dataJK: [],
      pieJK: [],
      slopeJK,

      dataTB: [],
      pieTB: [],
      slopeTB,
    };
  }

  componentDidMount() {
    axios.get('https://f37yrxnctl.execute-api.eu-west-1.amazonaws.com/prod/patientdata?patientId=mattsdaughter')
      .then(res => {
        // console.log(res);
        const ptData = res.data.Items;
        // console.log(JSON.parse(ptData));
        this.setState({
          dataMD: ptData,
          pieMD: createStats(ptData),
        });
      })
      .catch(e => {
        // this.setState({
        //   dataMD: dataTest,
        //   pieMD: createStats(dataTest)
        // });
        console.log(e);
        // alert(e);
      });

    axios.get('https://f37yrxnctl.execute-api.eu-west-1.amazonaws.com/prod/patientdata?patientId=jk')
      .then(res => {
        // console.log(res);
        const ptData = res.data.Items;
        // console.log(JSON.parse(ptData));
        this.setState({
          dataJK: ptData,
          pieJK: createStats(ptData),
        });
      })
      .catch(e => {
        console.log(e);
        // alert(e);
      });

    axios.get('https://f37yrxnctl.execute-api.eu-west-1.amazonaws.com/prod/patientdata?patientId=tobias')
      .then(res => {
        // console.log(res);
        const ptData = res.data.Items;
        // console.log(JSON.parse(ptData));
        this.setState({
          dataTB: ptData,
          pieTB: createStats(ptData),
        });
      })
      .catch(e => {
        console.log(e);
        // alert(e);
      });
  }

  renderPatientPanel(dataPt, pieData, slope) {
    if (dataPt[0]) {
      const { message, color } = createMessage(slope);
      return (
        <Panel
          header={<div >
            <span style={{ color }}>
              <i className="fa fa-bar-chart-o fa-fw" /> <b>{dataPt[0].patientId}:</b> &nbsp;
              <span>{message}</span>
              <div className="pull-right">
                <DropdownButton title="Actions" bsSize="xs" pullRight id="dropdownButton1" >
                  <MenuItem eventKey="1">Send Patient Text</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="2">Send Patient Email</MenuItem>
                </DropdownButton>
              </div>
            </span>
          </div>}
        >
          <div className="row">
            <div className="col-lg-6">
              <ResponsiveContainer width="100%" aspect={2}>
                <AreaChart
                  data={dataPt}
                  margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                  }}
                >
                  <XAxis dataKey="dateF" />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" />
                  <Tooltip />
                  <Area type="monotone" dataKey="sgv" stackId="1" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="col-lg-6">
              <Donut data={pieData} color="#8884d8" innerRadius="70%" outerRadius="90%" />
            </div>
          </div>
        </Panel>
      );
    }

    return (
      <h1>Loading</h1>
    );
  }

  render() {
    console.log(this.state.summary);
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
              style="panel-red"
              icon="fa fa-exclamation-circle fa-5x"
              count={this.state.summary.bad}
              headerText="Flag for Attention!"
              footerText="View Details"
              linkTo="/"
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <StatWidget
              style="panel-primary"
              icon="fa fa-exclamation-triangle fa-5x"
              count={this.state.summary.moderate}
              headerText="Change in Management"
              footerText="View Details"
              linkTo="/"
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <StatWidget
              style="panel-green"
              icon="fa fa-check fa-5x"
              count={this.state.summary.good}
              headerText="Patients doing great!"
              footerText="View Details"
              linkTo="/"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div>
              {this.renderPatientPanel(this.state.dataJK, this.state.pieJK, this.state.slopeJK)}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div>
              {this.renderPatientPanel(this.state.dataMD, this.state.pieMD, this.state.slopeMD)}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div>
              {this.renderPatientPanel(this.state.dataTB, this.state.pieTB, this.state.slopeM)}
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
