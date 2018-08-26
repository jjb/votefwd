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

    const columns = [{
      Header: 'District',
      accessor: 'district_id'
    }, {
      Header: 'Available',
      accessor: 'available',
    }, {
      Header: 'Adopted',
      accessor: 'adopted'
    }, {
      Header: 'Prepped',
      accessor: 'prepped'
    }, {
      Header: 'Sent',
      accessor: 'sent'
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
