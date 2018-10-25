// src/Districts.js

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios';
import { Header } from './Header';


class DistrictTable extends Component {
  constructor(props) {
    super(props)

    this.state = { districts: []};
    this.getStats = this.getStats.bind(this);
  }

  getStats() {
    axios({
      method: 'GET',
      headers: {Authorization: 'Bearer '.concat(localStorage.getItem('access_token'))},
      url: `${process.env.REACT_APP_API_URL}/s/stats`
    })
    .then(res => {
      this.setState({districts: res.data});
    })
    .catch(err => {
      console.error(err);
    });
  }

  componentWillMount() {
    this.getStats();
  }

  render() {
    const districts = this.state.districts;

    const formatWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
    const sumDistrictStatistic = function (districts, property) {
      var sum = 0;
      for ( let district of districts ) {
        if ( district.hasOwnProperty(property) ) {
          sum += parseInt(district[property], 10);
        }
      }
      return sum;
    }

    const columns = [{
      Header: 'District',
      accessor: 'district_id'
    }, {
      Header: 'Available',
      accessor: 'available',
      Footer: (
        <span>
          <strong>Available:</strong>{" "}
          {formatWithCommas(sumDistrictStatistic(districts, 'available'))}
        </span>
      )
    }, {
      Header: 'Adopted',
      accessor: 'adopted',
      Footer: (
        <span>
          <strong>Adopted:</strong>{" "}
          {formatWithCommas(sumDistrictStatistic(districts, 'adopted'))}
        </span>
      )
    }, {
      Header: 'Prepped',
      accessor: 'prepped',
      Footer: (
        <span>
          <strong>Prepped:</strong>{" "}
          {formatWithCommas(sumDistrictStatistic(districts, 'prepped'))}
        </span>
      )
    }, {
      Header: 'Sent',
      accessor: 'sent',
      Footer: (
        <span>
          <strong>Sent:</strong>{" "}
          {formatWithCommas(sumDistrictStatistic(districts, 'sent'))}
        </span>
      )
    }]

    return(
      <ReactTable data={districts} columns={columns} className="-striped -highlight" />
    );
  }
}

class Districts extends Component {
  render() {
    return (
      <div className="position-relative">
        <Header auth={this.props.auth}/>
        <DistrictTable />
      </div>
    );
  }
}

export default Districts;
